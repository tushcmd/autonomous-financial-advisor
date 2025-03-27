import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "Fetch.ai agent will trigger alerts based on stock changes" },
    { status: 200 },
  );
}
