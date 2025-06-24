/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { mastra } from "@/mastra";
import { prisma } from "@/lib/db";

export async function chatWithPortfolioAgent(
  userId: string,
  userMessage: string,
  portfolioType: "DEMO" | "REAL",
  history?: { role: string; content: string }[],
) {
  // Simple intent detection (replace with NLP if needed)
  const adviceKeywords = [
    "analyze",
    "advice",
    "recommend",
    "rebalance",
    "what should I do",
    "review",
    "suggest",
  ];
  const needsAdvice = adviceKeywords.some((kw) =>
    userMessage.toLowerCase().includes(kw),
  );

  let prompt: string;

  if (needsAdvice) {
    // Fetch portfolio as before
    const portfolio = await prisma.portfolio.findFirst({
      where: { userId, type: portfolioType },
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

    // Format chat history for context
    const formattedHistory = history
      ? history
          .map(
            (msg) =>
              `${msg.role === "user" ? "User" : "Agent"}: ${msg.content}`,
          )
          .join("\n")
      : "";

    // Compose a prompt string for the agent
    prompt = `
You are an AI financial advisor. Here is the user's ${portfolioType.toLowerCase()} portfolio:
Portfolio name: ${portfolio.name}
Cash balance: $${portfolio.cashBalance}
Portfolio goal: ${portfolio.portfolioGoal || portfolio.longTermGoal || "Not specified"}
Holdings: ${JSON.stringify(holdings, null, 2)}

Conversation history:
${formattedHistory}

User message: ${userMessage}
Please provide a helpful, personalized response.
    `.trim();
  } else {
    // General chat prompt
    prompt = `
You are a helpful AI financial advisor. Engage in friendly, conversational chat. Only provide portfolio analysis if the user asks for it.
User message: ${userMessage}
    `.trim();
  }

  const agent = mastra.getAgent("portfolioAdvisorAgent");
  const result = await agent.generate(prompt);

  return typeof result === "string"
    ? result
    : result && typeof result.text === "string"
      ? result.text
      : "No response from agent.";
}
