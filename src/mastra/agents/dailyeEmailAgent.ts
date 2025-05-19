import { groq } from "@ai-sdk/groq";
import { Agent } from "@mastra/core/agent";
import {
  fetchYahooFinanceNewsTool,
  scrapeNewsArticleContentsTool,
} from "../tools";

export const dailyEmailAgent = new Agent({
  name: "Daily Stock Advise Email Agent",
  instructions: `
    Each day, fetch the latest news articles from Yahoo Finance using fetchYahooFinanceNewsTool.
    Then, use scrapeNewsArticleContentsTool to extract the main content from those articles.
    Summarize the main stocks discussed and their projected directions (rising, falling, stable) in clear, concise language suitable for a daily stock advice email.
    Your output should be a single, well-structured summary ready to be sent as an email.
  `,
  model: groq("llama3-groq-70b-8192-tool-use-preview"),
  tools: { fetchYahooFinanceNewsTool, scrapeNewsArticleContentsTool },
});
