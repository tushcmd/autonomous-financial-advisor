import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import yahooFinance from "yahoo-finance2";

export const fetchYahooFinanceNewsTool = createTool({
  id: "Yahoo Finance News Fetcher",
  description:
    "Fetches news articles for given stock symbols from Yahoo Finance",
  inputSchema: z.object({
    symbols: z.array(z.string()).min(1, "At least one symbol is required"),
    maxNewsPerSymbol: z.number().optional().default(5),
  }),
  outputSchema: z.object({
    articles: z.array(
      z.object({
        symbol: z.string(),
        title: z.string(),
        link: z.string().url(),
        publisher: z.string().optional(),
        publishTime: z.string().optional(),
      }),
    ),
  }),
  execute: async ({ context: { symbols, maxNewsPerSymbol = 5 } }) => {
    console.log(`Fetching news for symbols: ${symbols.join(", ")}`);

    const allArticles = [];

    // Fetch news for each symbol
    for (const symbol of symbols) {
      try {
        console.log(`Searching for ${symbol}...`);
        const result = await yahooFinance.search(symbol);

        // Extract news data
        if (result.news && result.news.length > 0) {
          const symbolNews = result.news
            .slice(0, maxNewsPerSymbol)
            .map((newsItem) => ({
              symbol,
              title: newsItem.title,
              link: newsItem.link,
              publisher: newsItem.publisher || "Unknown",
              publishTime: newsItem.providerPublishTime
                ? new Date(newsItem.providerPublishTime).toISOString()
                : undefined,
            }));

          allArticles.push(...symbolNews);
        }

        // Add a small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1200));
      } catch (error) {
        console.error(`Error fetching news for ${symbol}:`, error);
      }
    }

    return { articles: allArticles };
  },
});

// Helper function to get demo stock symbols
export function getDemoStockSymbols() {
  return [
    "AAPL", // Apple
    "MSFT", // Microsoft
    "AMZN", // Amazon
    "GOOGL", // Alphabet (Google)
    "META", // Meta Platforms (Facebook)
    "TSLA", // Tesla
    "NVDA", // NVIDIA
    "JNJ", // Johnson & Johnson
  ];
}
