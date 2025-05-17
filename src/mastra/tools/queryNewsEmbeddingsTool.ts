// --- TOOL: QUERY NEWS EMBEDDINGS ---

import { createVectorQueryTool } from "@mastra/rag";
import { cohere } from "@ai-sdk/cohere";
import { groq } from "@ai-sdk/groq";

export const queryNewsEmbeddingsTool = createVectorQueryTool({
  vectorStoreName: "pineconeStore",
  indexName: "news-embeddings",
  model: cohere.embedding("embed-english-v3.0"),
  id: "Query News Embeddings",
  description: "Query Pinecone for similar news chunks using Cohere embedding.",
  reranker: {
    model: groq("rerank-english-v1"),
    options: {
      weights: {
        semantic: 0.5, // Semantic relevance weight
        vector: 0.3, // Vector similarity weight
        position: 0.2, // Original position weight
      },
      topK: 5,
    },
  },
});
