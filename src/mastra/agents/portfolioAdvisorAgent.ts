import { Agent } from "@mastra/core";
import { portfolioAdviseTool } from "../tools/portfolioAdviseTool";
import { groq } from "@ai-sdk/groq";

export const portfolioAdvisorAgent = new Agent({
  name: "portfolio-advisor",
  instructions:
    "Provide portfolio advice based on user holdings, cash balance, and investment goals.",
  model: groq("llama3-groq-70b-8192-tool-use-preview"),
  tools: { portfolioAdviseTool },
});
