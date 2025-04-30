import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { portfolioGoal, longTermGoal } = await req.json();

    // Validate required fields
    if (!portfolioGoal) {
      return NextResponse.json(
        { error: "Portfolio goal is required" },
        { status: 400 },
      );
    }

    // Find user's portfolio (assuming they have one created during signup)
    const portfolios = await prisma.portfolio.findMany({
      where: { userId },
    });

    if (!portfolios.length) {
      return NextResponse.json(
        { error: "No portfolio found" },
        { status: 404 },
      );
    }

    // Update all user portfolios with the goal information
    await Promise.all(
      portfolios.map((portfolio) =>
        prisma.portfolio.update({
          where: { id: portfolio.id },
          data: {
            portfolioGoal,
            longTermGoal: longTermGoal || null,
            hasCompletedOnboarding: true,
          },
        }),
      ),
    );

    // Update user record to mark onboarding as complete
    await prisma.user.update({
      where: { id: userId },
      data: {
        hasCompletedOnboarding: true,
      },
    });

    return NextResponse.json(
      { success: true, message: "Portfolio goals saved successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error saving portfolio goals:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
