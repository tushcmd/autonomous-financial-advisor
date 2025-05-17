import { Mastra } from "@mastra/core";
import { portfolioAdvisorAgent, dailyEmailAgent } from "./agents";

import { newsRagWorkflow } from "./workflows/newsRagWorkflow";

export const mastra = new Mastra({
  agents: {
    portfolioAdvisorAgent,
    dailyEmailAgent,
  },
  workflows: { newsRagWorkflow },
});
