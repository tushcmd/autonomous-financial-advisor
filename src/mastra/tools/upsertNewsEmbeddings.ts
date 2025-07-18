import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { PineconeVector } from "@mastra/pinecone";
import { MDocument } from "@mastra/rag";

// --- VECTOR STORE CONFIG ---
const pineconeApiKey = process.env.PINECONE_API_KEY!;
const pineconeIndexName = "stock-news-embeddings";
const pineconeDimension = 1536; // OpenAI ada-002 embedding dimension

const pineconeStore = new PineconeVector({ apiKey: pineconeApiKey });

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

    // Embed all chunks with OpenAI
    const { embeddings } = await embedMany({
      values: allChunks.map((chunk) => chunk.text),
      model: openai.embedding("text-embedding-ada-002"),
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
