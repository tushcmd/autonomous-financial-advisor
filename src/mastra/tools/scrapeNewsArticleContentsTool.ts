import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { scraper } from "../../lib/puppeteer-scraper";
import {
  fetchYahooFinanceNewsTool,
  getDemoStockSymbols,
} from "./fetchYahooFinanceNews";

export const scrapeNewsArticleContentsTool = createTool({
  id: "News Article Content Scraper",
  description: "Scrapes the main content (paragraphs) from news article URLs.",
  inputSchema: z.object({
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
  outputSchema: z.object({
    results: z.array(
      z.object({
        link: z.string().url(),
        paragraphs: z.array(z.string()),
      }),
    ),
  }),
  execute: async ({ context: { articles } }) => {
    const links = articles.map((a) => a.link);
    const rawResults = await scraper.scrapeMultipleUrls(links);
    // Map 'url' to 'link' to match outputSchema
    const results = rawResults.map(({ url, paragraphs }) => ({
      link: url,
      paragraphs,
    }));
    await scraper.close();
    return { results };
  },
});

async function runNewsScraper() {
  if (!fetchYahooFinanceNewsTool?.execute) {
    throw new Error("fetchYahooFinanceNewsTool.execute is not available.");
  }
  if (!scrapeNewsArticleContentsTool?.execute) {
    throw new Error("scrapeNewsArticleContentsTool.execute is not available.");
  }

  const { articles } = await fetchYahooFinanceNewsTool.execute({
    context: { symbols: getDemoStockSymbols(), maxNewsPerSymbol: 5 },
  });

  const { results } = await scrapeNewsArticleContentsTool.execute({
    context: { articles },
  });

  console.log(results);
}

runNewsScraper();
