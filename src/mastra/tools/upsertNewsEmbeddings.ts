import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { embedMany } from "ai";
import { cohere } from "@ai-sdk/cohere";
import { PineconeVector } from "@mastra/pinecone";
import { MDocument } from "@mastra/rag";

// --- VECTOR STORE CONFIG ---
const pineconeApiKey = process.env.PINECONE_API_KEY!;
const pineconeIndexName = "stock-news-embeddings";
const pineconeDimension = 1024; // Cohere v3.0 is 1024 dims

const pineconeStore = new PineconeVector(pineconeApiKey);

// --- TOOL: UPSERT SCRAPED NEWS EMBEDDINGS ---
export const upsertNewsEmbeddingsTool = createTool({
  id: "Upsert News Embeddings",
  description: "Chunks, embeds, and upserts scraped news into Pinecone.",
  inputSchema: z.object({
    results: z.array(
      z.object({
        link: z.string().url(),
        paragraphs: z.array(z.string()),
      }),
    ),
  }),
  outputSchema: z.object({
    upserted: z.number(),
  }),
  execute: async ({ context: { results } }) => {
    // Flatten all paragraphs into chunks with metadata
    const allChunks: { text: string; link: string; id: string }[] = [];
    for (const article of results) {
      const doc = MDocument.fromText(article.paragraphs.join("\n"));
      const chunks = await doc.chunk({
        strategy: "recursive",
        size: 512,
        overlap: 50,
      });
      allChunks.push(
        ...chunks.map((chunk, idx) => ({
          text: chunk.text,
          link: article.link,
          id: `${article.link}::${idx}`,
        })),
      );
    }

    // Embed all chunks with Cohere
    const { embeddings } = await embedMany({
      values: allChunks.map((chunk) => chunk.text),
      model: cohere.embedding("embed-english-v3.0"),
    });

    // Ensure index exists
    await pineconeStore.createIndex({
      indexName: pineconeIndexName,
      dimension: pineconeDimension,
    });

    // Upsert embeddings with metadata
    await pineconeStore.upsert({
      indexName: pineconeIndexName,
      vectors: embeddings,
      metadata: allChunks.map((chunk) => ({
        text: chunk.text,
        link: chunk.link,
        id: chunk.id,
        createdAt: new Date().toISOString(),
      })),
    });

    return { upserted: allChunks.length };
  },
});
