import { Resend } from "resend";
import { PrismaClient, User } from "@prisma/client";

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY || "");
const prisma = new PrismaClient();

interface EmailOptions {
  to: string | string[];
  subject: string;
  body: string;
  isHtml?: boolean;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}

/**
 * Send an email using Resend service
 * @param options Email sending options
 * @returns Promise with success status and message/id
 */
export async function sendEmail(
  options: EmailOptions,
): Promise<{ success: boolean; message: string; id?: string }> {
  try {
    const {
      to,
      subject,
      body,
      isHtml = true,
      from,
      cc,
      bcc,
      replyTo,
    } = options;

    // Validate required fields
    if (!to || !subject || !body) {
      return {
        success: false,
        message: "Missing required email fields (to, subject, or body)",
      };
    }

    // Prepare email data
    const emailData: any = {
      from:
        from ||
        process.env.EMAIL_FROM ||
        "Daily Stock News <notifications@yourdomain.com>",
      to: Array.isArray(to) ? to : [to],
      subject,
      ...(isHtml ? { html: body } : { text: body }),
    };

    // Add optional fields if provided
    if (cc) emailData.cc = Array.isArray(cc) ? cc : [cc];
    if (bcc) emailData.bcc = Array.isArray(bcc) ? bcc : [bcc];
    if (replyTo) emailData.reply_to = replyTo;

    // Send the email
    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      console.error("Error sending email via Resend:", error);
      return {
        success: false,
        message: `Failed to send email: ${error.message || "Unknown error"}`,
      };
    }

    return {
      success: true,
      message: "Email sent successfully",
      id: data?.id,
    };
  } catch (error: any) {
    console.error("Exception when sending email:", error);
    return {
      success: false,
      message: `Exception when sending email: ${error.message || "Unknown error"}`,
    };
  }
}

/**
 * Get users who have subscribed to receive daily news
 * @param limit Optional maximum number of users to retrieve
 * @returns Array of users with their email addresses
 */
export async function getSubscribedUsers(limit?: number): Promise<User[]> {
  try {
    // Query users who have opted in to receive daily news
    const users = await prisma.user.findMany({
      where: {
        emailVerified: { not: null }, // Only verified emails
        receiveDailyEmails: true, // Using the new boolean flag
      },
      select: {
        id: true,
        email: true,
        name: true,
        // Add any other fields you need
      },
      take: limit,
    });

    return users as User[];
  } catch (error) {
    console.error("Error fetching subscribed users:", error);
    return [];
  }
}

/**
 * Send an email to all subscribed users
 * @param subject Email subject
 * @param body Email body content (HTML by default)
 * @param isHtml Whether the body is HTML (default: true)
 * @returns Object with success count, failure count, and any errors
 */
export async function sendBulkEmailToSubscribers(
  subject: string,
  body: string,
  isHtml = true,
): Promise<{ successCount: number; failureCount: number; errors: string[] }> {
  const users = await getSubscribedUsers();
  const results = { successCount: 0, failureCount: 0, errors: [] as string[] };

  if (users.length === 0) {
    console.log("No subscribed users found to send emails to");
    return results;
  }

  console.log(`Sending emails to ${users.length} subscribed users`);

  // Process users in batches to avoid overwhelming Resend
  const batchSize = 20;
  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);
    const promises = batch.map(async (user) => {
      if (!user.email) return null;

      const result = await sendEmail({
        to: user.email,
        subject,
        body: body.replace(/{{name}}/g, user.name || "there"), // Basic personalization
        isHtml,
      });

      return { user, result };
    });

    const batchResults = await Promise.all(promises);

    // Count successes and failures
    batchResults.forEach((item) => {
      if (!item) return;

      if (item.result.success) {
        results.successCount++;
      } else {
        results.failureCount++;
        results.errors.push(
          `Failed to send to ${item.user.email}: ${item.result.message}`,
        );
      }
    });

    // Small delay between batches to avoid rate limits
    if (i + batchSize < users.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return results;
}
