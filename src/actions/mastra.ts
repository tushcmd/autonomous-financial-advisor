"use server";
import { mastra } from "@/mastra";
import { prisma } from "@/lib/db";

export async function getPortfolioAdviceForUser(userId: string) {
  // Fetch user and their portfolios from Prisma
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      portfolios: {
        select: {
          id: true,
          name: true,
          cashBalance: true,
          portfolioGoal: true,
          longTermGoal: true,
          realHoldings: {
            select: {
              symbol: true,
              shares: true,
              avgPrice: true,
              currentPrice: true,
            },
          },
        },
      },
    },
  });

  if (!user || !user.portfolios.length)
    throw new Error("User or portfolio not found");

  // For simplicity, use the first portfolio (customize as needed)
  const portfolio = user.portfolios[0];

  // Prepare input for the agent
  const prompt = `
    User's name: ${user.name}
    Portfolio name: ${portfolio.name}
    Cash balance: $${portfolio.cashBalance}
    Portfolio goal: ${portfolio.portfolioGoal}
    Long-term goal: ${portfolio.longTermGoal}
    Holdings: ${JSON.stringify(portfolio.realHoldings)}
    Please provide personalized portfolio advice.
  `;

  // Get the agent and generate advice
  const agent = mastra.getAgent("portfolioAdvisorAgent");
  const result = await agent.generate(prompt);

  return result;
}
