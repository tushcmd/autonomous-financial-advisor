import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const portfolios = await prisma.portfolio.findMany({
      include: {
        fakeTrades: true,
        realHoldings: true,
      },
    });

    return NextResponse.json(portfolios, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching portfolios", details: (error as Error).message },
      { status: 500 },
    );
  }
}
