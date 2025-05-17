import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { queryNewsEmbeddingsTool } from "./queryNewsEmbeddingsTool";
import { groq } from "@ai-sdk/groq";
import { investmentGoals } from "../investmentGoals";

interface NewsResult {
  text?: string;
  link?: string;
}

export const portfolioAdviseTool = createTool({
  id: "Portfolio Advise Tool",
  description:
    "Analyzes a user's portfolio, cash, and goal, uses embedded news, and suggests risk-adjusted returns and rebalancing.",
  inputSchema: z.object({
    holdings: z.array(
      z.object({
        symbol: z.string(),
        shares: z.number(),
        avgPrice: z.number(),
        currentPrice: z.number(),
      }),
    ),
    cashBalance: z.number(),
    goal: z.enum([...investmentGoals]),
  }),
  outputSchema: z.object({
    recommendations: z.string(),
    explanation: z.string(),
  }),
  async execute(args: {
    context: {
      holdings: {
        symbol: string;
        shares: number;
        avgPrice: number;
        currentPrice: number;
      }[];
      cashBalance: number;
      goal: string;
    };
    runtimeContext?: object;
  }) {
    const { context, runtimeContext } = args;
    // 1. Retrieve relevant news using queryNewsEmbeddingsTool
    if (typeof queryNewsEmbeddingsTool.execute !== "function") {
      throw new Error("queryNewsEmbeddingsTool.execute is not defined");
    }
    const newsResults = await queryNewsEmbeddingsTool.execute({
      context: {
        query: context.goal,
        topK: 5,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      runtimeContext: runtimeContext as any,
    });

    // 2. Compose prompt for Groq LLM
    const prompt = `
You are a financial advisor AI. The user's portfolio is:
${JSON.stringify(context.holdings, null, 2)}
Cash balance: $${context.cashBalance}
Goal: ${context.goal}

Recent financial news:
${newsResults.results?.map((n: NewsResult) => `- ${n.text || ""}\nLink: ${n.link || ""}`).join("\n\n")}

Based on the above, analyze the portfolio's risk, suggest a risk-adjusted return strategy, and recommend any rebalancing actions. Explain your reasoning.
`;

    // 3. Call Groq LLM
    const llm = groq("llama3-groq-70b-8192-tool-use-preview");
    // @ts-expect-error: .complete may not be typed but is available at runtime
    const llmResponse = await llm.complete({
      prompt,
      maxTokens: 600,
      temperature: 0.2,
    });

    return {
      recommendations: llmResponse.text,
      explanation:
        "Generated using Groq LLM with context from Pinecone vector search on recent news.",
    };
  },
});
