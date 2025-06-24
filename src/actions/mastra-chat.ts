/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { mastra } from "@/mastra";
import { prisma } from "@/lib/db";

export async function chatWithPortfolioAgent(
  userId: string,
  userMessage: string,
  portfolioType: "DEMO" | "REAL",
) {
  // Fetch user's portfolio based on type
  const portfolio = await prisma.portfolio.findFirst({
    where: {
      userId,
      type: portfolioType,
    },
    select: {
      id: true,
      name: true,
      type: true,
      cashBalance: true,
      portfolioGoal: true,
      longTermGoal: true,
      fakeTrades:
        portfolioType === "DEMO"
          ? {
              select: {
                symbol: true,
                shares: true,
                buyPrice: true,
                currentPrice: true,
                status: true,
              },
            }
          : undefined,
      realHoldings:
        portfolioType === "REAL"
          ? {
              select: {
                symbol: true,
                shares: true,
                avgPrice: true,
                currentPrice: true,
              },
            }
          : undefined,
    },
  });

  if (!portfolio) throw new Error(`${portfolioType} portfolio not found`);

  // Format holdings for the agent
  const holdings =
    (portfolioType === "DEMO"
      ? portfolio.fakeTrades
      : portfolio.realHoldings
    )?.map((h: any) => ({
      symbol: h.symbol,
      shares: h.shares,
      avgPrice: "buyPrice" in h ? h.buyPrice : h.avgPrice,
      currentPrice: h.currentPrice,
    })) || [];

  // Compose a prompt string for the agent
  const prompt = `
You are an AI financial advisor. Here is the user's ${portfolioType.toLowerCase()} portfolio:
Portfolio name: ${portfolio.name}
Cash balance: $${portfolio.cashBalance}
Portfolio goal: ${portfolio.portfolioGoal || portfolio.longTermGoal || "Not specified"}
Holdings: ${JSON.stringify(holdings, null, 2)}
User message: ${userMessage}
Please provide a helpful, personalized response.
  `.trim();

  const agent = mastra.getAgent("portfolioAdvisorAgent");
  const result = await agent.generate(prompt);

  // Return string result or fallback
  return typeof result === "string"
    ? result
    : result && typeof result.text === "string"
      ? result.text
      : "No response from agent.";
}
