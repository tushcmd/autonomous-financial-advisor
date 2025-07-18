import { NextResponse } from "next/server";
import { executeDailyNewsWorkflow } from "@/lib/dailyWorkflow";

// This route is protected by Vercel Cron authentication
export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron (in production)
    const authHeader = request.headers.get("authorization");
    if (process.env.VERCEL && !authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Execute the daily workflow
    const result = await executeDailyNewsWorkflow({ sendToAll: true });

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error("Error in daily news cron:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
