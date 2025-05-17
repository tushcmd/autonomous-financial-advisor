import { Workflow, Step } from "@mastra/core";
import { z } from "zod";
import {
  fetchYahooFinanceNewsTool,
  scrapeNewsArticleContentsTool,
  upsertNewsEmbeddingsTool,
} from "../tools";

// Step 1: Fetch news
const fetchNewsStep = new Step({
  id: "fetchNews",
  inputSchema: z.object({
    symbols: z.array(z.string()),
    maxNewsPerSymbol: z.number().default(5),
  }),
  outputSchema: fetchYahooFinanceNewsTool!.outputSchema,
  execute: async ({ context }) => {
    if (!fetchYahooFinanceNewsTool || !fetchYahooFinanceNewsTool.execute) {
      throw new Error(
        "fetchYahooFinanceNewsTool is not defined or missing execute method",
      );
    }
    return await fetchYahooFinanceNewsTool.execute({
      context: context.inputData,
    });
  },
});

// Step 2: Scrape articles
const scrapeStep = new Step({
  id: "scrapeArticles",
  inputSchema: fetchYahooFinanceNewsTool!.outputSchema,
  outputSchema: scrapeNewsArticleContentsTool!.outputSchema,
  execute: async ({ context }) => {
    if (
      !scrapeNewsArticleContentsTool ||
      !scrapeNewsArticleContentsTool.execute
    ) {
      throw new Error(
        "scrapeNewsArticleContentsTool is not defined or missing execute method",
      );
    }
    const fetchResult = context.getStepResult("fetchNews");
    return await scrapeNewsArticleContentsTool.execute({
      context: fetchResult,
    });
  },
});

// Step 3: Upsert embeddings
const upsertStep = new Step({
  id: "upsertEmbeddings",
  inputSchema: scrapeNewsArticleContentsTool!.outputSchema,
  outputSchema: upsertNewsEmbeddingsTool!.outputSchema,
  execute: async ({ context }) => {
    if (!upsertNewsEmbeddingsTool || !upsertNewsEmbeddingsTool.execute) {
      throw new Error(
        "upsertNewsEmbeddingsTool is not defined or missing execute method",
      );
    }
    const scrapeResult = context.getStepResult("scrapeArticles");
    return await upsertNewsEmbeddingsTool.execute({ context: scrapeResult });
  },
});

// // Step 4: Query vector store
// const queryStep = new Step({
//   id: "queryEmbeddings",
//   inputSchema: z.object({
//     query: z.string(),
//     topK: z.number().default(3),
//   }),
//   outputSchema: queryNewsEmbeddingsTool.outputSchema,
//   execute: async ({ context }) => {
//     // Pass the query directly from inputData
//     return await queryNewsEmbeddingsTool.execute({
//       context: context.inputData,
//     });
//   },
// });

// Define the workflow
export const newsRagWorkflow = new Workflow({
  name: "news-rag-workflow",
  triggerSchema: z.object({
    symbols: z.array(z.string()),
    maxNewsPerSymbol: z.number().default(5),
    query: z.string(),
    topK: z.number().default(3),
  }),
})
  .step(fetchNewsStep)
  .then(scrapeStep)
  .then(upsertStep)
  //   .then(queryStep)
  .commit();
