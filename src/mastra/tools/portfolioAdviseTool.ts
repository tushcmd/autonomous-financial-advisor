import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { queryNewsEmbeddingsTool } from "./queryNewsEmbeddingsTool";

export const portfolioAdviseTool = createTool({
  id: "Portfolio Advise Tool",
  description:
    "Fetches portfolio, cash, goal, and relevant news for the agent to analyze.",
  inputSchema: z.object({
    holdings: z.array(
      z.object({
        symbol: z.string(),
        shares: z.number(),
        avgPrice: z.number(),
        currentPrice: z.number(),
      })
    ),
    cashBalance: z.number(),
    goal: z.string(), // Now just a string, not an enum
  }),
  outputSchema: z.object({
    holdings: z.array(
      z.object({
        symbol: z.string(),
        shares: z.number(),
        avgPrice: z.number(),
        currentPrice: z.number(),
      })
    ),
    cashBalance: z.number(),
    goal: z.string(), // Also just a string in output
    news: z.array(
      z.object({
        text: z.string(),
        link: z.string().url().optional(),
      })
    ),
  }),
  async execute(args) {
    const { context, runtimeContext } = args;

    // Example: Use the first holding's symbol as the news query
    let newsResults = { results: [] as { text?: string; link?: string }[] };
    if (
      typeof queryNewsEmbeddingsTool.execute === "function" &&
      context.holdings.length > 0
    ) {
      newsResults = await queryNewsEmbeddingsTool.execute({
        context: {
          query: context.holdings[0].symbol,
          topK: 5,
        },
        runtimeContext,
      });
    }

    const news = (newsResults.results || []).map((n) => ({
      text: n.text || "",
      link: n.link,
    }));

    return {
      holdings: context.holdings,
      cashBalance: context.cashBalance,
      goal: context.goal, 
      news,
    };
  },
});