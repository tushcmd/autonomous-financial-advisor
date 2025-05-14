import { Mastra } from "@mastra/core";
import { portfolioAdvisorAgent } from "./agents";
import { scrapeNewsTool, embedNewsTool, upsertPineconeTool } from "./tools";
import { newsRagWorkflow } from "./workflows/newsRagWorkflow";

export const mastra = new Mastra({
  agents: { portfolioAdvisorAgent },
  tools: [scrapeNewsTool, embedNewsTool, upsertPineconeTool],
  workflows: [newsRagWorkflow],
});
