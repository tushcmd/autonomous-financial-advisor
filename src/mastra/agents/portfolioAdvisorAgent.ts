import { Agent } from "@mastra/core";
import { z } from "zod";

export const portfolioAdvisorAgent = new Agent({
  name: "portfolio-advisor",
  description:
    "Suggests risk-adjusted returns and rebalancing based on user portfolio, cash, goal, and latest news.",
  inputSchema: z.object({
    portfolio: z.array(
      z.object({
        symbol: z.string(),
        shares: z.number(),
        avgPrice: z.number(),
        currentPrice: z.number(),
      }),
    ),
    cashBalance: z.number(),
    goal: z.enum([
      "RETIREMENT",
      "GROWTH",
      "INCOME",
      "PRESERVATION",
      "SPECULATION",
      "OTHER",
    ]),
  }),
  async run({ input, tools }) {
    // 1. Retrieve relevant news using Pinecone vector search
    const newsResults = await tools.vectorSearch({
      query: input.goal,
      topK: 5,
      provider: "pinecone",
    });

    // 2. Compose prompt for OpenAI LLM
    const prompt = `
You are a financial advisor AI. The user portfolio is:
${JSON.stringify(input.portfolio, null, 2)}
Cash balance: $${input.cashBalance}
Goal: ${input.goal}

Recent financial news:
${newsResults.map((n) => `- ${n.title}\n${n.paragraphs?.join("\n") || ""}`).join("\n\n")}

Based on the above, suggest a risk-adjusted return strategy and portfolio rebalancing actions. Explain your reasoning.
`;

    // 3. Call OpenAI LLM
    const openaiResponse = await tools.llm({
      provider: "openai",
      prompt,
      maxTokens: 600,
      temperature: 0.2,
    });

    // 4. Return recommendations and explanation
    return {
      recommendations: openaiResponse.text,
      explanation:
        "Generated using OpenAI LLM with context from Pinecone vector search on recent news.",
    };
  },
});
