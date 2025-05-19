import { Agent } from "@mastra/core/agent";
import { portfolioAdviseTool } from "../tools/portfolioAdviseTool";
import { groq } from "@ai-sdk/groq";

export const portfolioAdvisorAgent = new Agent({
  name: "portfolio-advisor",
  instructions:
    "Provide portfolio advice based on user holdings, cash balance, and investment goals.",
  model: groq("llama-3.3-70b-versatile"),
  tools: { portfolioAdviseTool },
});
