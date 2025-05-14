// --- TOOL: QUERY NEWS EMBEDDINGS ---

import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { cohere } from "@ai-sdk/cohere";

export const queryNewsEmbeddingsTool = createTool({
  id: "Query News Embeddings",
  description: "Query Pinecone for similar news chunks using Cohere embedding.",
  inputSchema: z.object({
    query: z.string(),
    topK: z.number().default(3),
  }),
  outputSchema: z.object({
    results: z.array(
      z.object({
        text: z.string(),
        link: z.string().url(),
        score: z.number(),
      }),
    ),
  }),
  execute: async ({ context: { query, topK = 3 } }) => {
    // Embed the query
    const { embedding: queryVector } = await cohere
      .embedding("embed-english-v3.0")
      .embed({ value: query });

    // Query Pinecone
    const results = await pineconeStore.query({
      indexName: pineconeIndexName,
      queryVector,
      topK,
    });

    // Map results to output schema
    return {
      results: results.map((r: any) => ({
        text: r.metadata.text,
        link: r.metadata.link,
        score: r.score,
      })),
    };
  },
});
