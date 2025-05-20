// dailyNewsWorkflow.ts
import { newsRagWorkflow } from "../mastra/workflows/newsRagWorkflow";
import { dailyEmailAgent } from "../mastra/agents";
import { getDemoStockSymbols } from "../mastra/tools/fetchYahooFinanceNews";
import { sendEmail, sendBulkEmailToSubscribers } from "./email-service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface WorkflowOptions {
  sendToAll?: boolean;
  individualEmail?: string;
  maxNewsPerSymbol?: number;
  topK?: number;
}

/**
 * Run the daily RAG workflow and send emails with stock news summaries
 */
async function runDailyRagAndEmail(options: WorkflowOptions = {}) {
  try {
    const {
      sendToAll = false,
      individualEmail,
      maxNewsPerSymbol = 5,
      topK = 3,
    } = options;

    const symbols = getDemoStockSymbols();

    // 1. Run the RAG workflow
    console.log(`Starting RAG workflow for ${symbols.length} stock symbols...`);
    const workflowResult = await newsRagWorkflow.invoke({
      input: {
        symbols,
        maxNewsPerSymbol,
        query: "market summary",
        topK,
      },
    });

    // 2. Extract the scraped articles from the workflow result
    const scrapedArticles =
      workflowResult?.steps?.scrapeArticles?.results ||
      workflowResult?.scrapeArticles?.results ||
      workflowResult?.results; // fallback

    if (!scrapedArticles || scrapedArticles.length === 0) {
      console.error("No scraped articles found, skipping email generation.");
      return { success: false, message: "No articles found" };
    }

    console.log(
      `Found ${scrapedArticles.length} articles. Generating summary...`,
    );

    // 3. Generate the daily summary using the agent
    const summaryResult = await dailyEmailAgent.invoke({
      input: {
        articles: scrapedArticles,
      },
    });

    const emailBody = summaryResult?.output || summaryResult;
    const emailSubject = "Your Daily Stock Market Summary";

    // 4. Send email based on options
    if (sendToAll) {
      // Send to all subscribed users
      const bulkResults = await sendBulkEmailToSubscribers(
        emailSubject,
        emailBody,
        true, // isHtml
      );

      return {
        success: bulkResults.successCount > 0,
        message: `Sent to ${bulkResults.successCount} users with ${bulkResults.failureCount} failures`,
        details: bulkResults,
      };
    } else if (individualEmail) {
      // Send to a specific email address
      const result = await sendEmail({
        to: individualEmail,
        subject: emailSubject,
        body: emailBody,
        isHtml: true,
      });

      return {
        success: result.success,
        message: result.message,
        emailId: result.id,
      };
    } else {
      // Default behavior: Get user from session or send to admin
      // This could be modified based on your NextAuth implementation
      const adminUser = await prisma.user.findFirst({
        where: { role: "ADMIN" },
      });

      if (adminUser?.email) {
        const result = await sendEmail({
          to: adminUser.email,
          subject: emailSubject,
          body: emailBody,
          isHtml: true,
        });

        return {
          success: result.success,
          message: `Admin email sent to ${adminUser.email}: ${result.message}`,
          emailId: result.id,
        };
      } else {
        return {
          success: false,
          message: "No target recipient specified and no admin user found",
        };
      }
    }
  } catch (error: any) {
    console.error("Error in daily RAG and email process:", error);
    return {
      success: false,
      message: error.message || "Unknown error",
      error,
    };
  }
}

/**
 * Execute the daily news workflow with error handling
 * This can be called from API routes or server actions
 */
export async function executeDailyNewsWorkflow(options: WorkflowOptions = {}) {
  try {
    // Log the execution for auditing purposes
    await prisma.workflowExecution.create({
      data: {
        workflowType: "DAILY_NEWS",
        status: "STARTED",
        metadata: JSON.stringify(options),
      },
    });

    const result = await runDailyRagAndEmail(options);

    // Update the execution record
    await prisma.workflowExecution.updateMany({
      where: {
        workflowType: "DAILY_NEWS",
        status: "STARTED",
        // Get the most recent one
        createdAt: {
          gte: new Date(Date.now() - 60000), // Within the last minute
        },
      },
      data: {
        status: result.success ? "COMPLETED" : "FAILED",
        result: JSON.stringify(result),
      },
    });

    return result;
  } catch (error: any) {
    console.error("Error executing daily news workflow:", error);

    // Log the failure
    try {
      await prisma.workflowExecution.updateMany({
        where: {
          workflowType: "DAILY_NEWS",
          status: "STARTED",
          createdAt: {
            gte: new Date(Date.now() - 60000), // Within the last minute
          },
        },
        data: {
          status: "FAILED",
          result: JSON.stringify({ error: error.message }),
        },
      });
    } catch (logError) {
      console.error("Failed to log workflow failure:", logError);
    }

    return {
      success: false,
      message: error.message || "Unknown error occurred",
      error: error.toString(),
    };
  } finally {
    // Disconnect Prisma to prevent hanging connections
    await prisma.$disconnect();
  }
}

// Example NextJS API route handler (you can put this in pages/api/daily-news.ts)
export async function apiHandler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const options = req.body || {};
    const result = await executeDailyNewsWorkflow(options);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Unknown error occurred",
    });
  }
}

// For direct execution (e.g. from a cron job)
if (require.main === module) {
  executeDailyNewsWorkflow({ sendToAll: true })
    .then((result) => {
      console.log("Workflow execution completed:", result);
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error("Unhandled error in workflow execution:", error);
      process.exit(1);
    });
}
