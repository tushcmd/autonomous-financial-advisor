import { groq } from "@ai-sdk/groq";
import { Agent } from "@mastra/core/agent";
import { scrapeNewsArticleContentsTool } from "../tools";

export const dailyEmailAgent = new Agent({
  name: "Daily Stock Advise Email Agent",
  instructions: `
      You are a daily email agent that fetches the latest news articles from Yahoo Finance and scrapes their contents.

      Use the scrapeNewsArticleContentsTool to get the fetched daily news.

      After fetching and scraping the news articles, generate a single summary that highlights the main stocks discussed and their projected directions (e.g., rising, falling, stable) based on the news. Present this summary in clear, concise language suitable for a daily stock advice email.
`,
  model: groq("llama3-groq-70b-8192-tool-use-preview"),
  tools: { scrapeNewsArticleContentsTool },
});
