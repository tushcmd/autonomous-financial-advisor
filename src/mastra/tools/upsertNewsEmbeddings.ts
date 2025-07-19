import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { embedMany } from "ai";
import { PineconeVector } from "@mastra/pinecone";
import { MDocument } from "@mastra/rag";
import { openai } from "@ai-sdk/openai";

// --- VECTOR STORE CONFIG ---
const pineconeApiKey = process.env.PINECONE_API_KEY!;
const pineconeIndexName = "stock-news-embeddings";
const pineconeDimension = 1024; // OpenAI text-embedding-3-small dimension

const pineconeStore = new PineconeVector({
  apiKey: pineconeApiKey,
  environment: "aped-4627-b74a",
});

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

    // Embed all chunks with OpenAI's text-embedding-3-small (1024D)
    const { embeddings } = await embedMany({
      values: allChunks.map((chunk) => chunk.text),
      model: openai.embedding("text-embedding-3-small"),
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
