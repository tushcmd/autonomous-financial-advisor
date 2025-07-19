import { Mastra } from "@mastra/core";
import { portfolioAdvisorAgent, dailyEmailAgent } from "./agents";
import { newsRagWorkflow } from "./workflows/newsRagWorkflow";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";

import path from "path";

// Initialize storage with absolute path
const storage = new LibSQLStore({
  url: `file:${path.join(process.cwd(), "mastra.db")}`,
});

// Initialize logger
const logger = new PinoLogger({
  name: "FinancialAdvisor",
  level: "info",
});

export const mastra = new Mastra({
  agents: {
    portfolioAdvisorAgent,
    dailyEmailAgent,
  },
  workflows: { newsRagWorkflow },
  logger,
  storage,
  telemetry: {
    serviceName: "autonomous-financial-advisor",
    enabled: false,
  },
  server: {
    middleware: [],
  },
});
