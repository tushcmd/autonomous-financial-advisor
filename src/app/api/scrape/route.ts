import { NextRequest, NextResponse } from "next/server";
import { scraper } from "@/lib/puppeteer-scraper";
import { auth } from "@/../auth";

export async function POST(req: NextRequest) {
  try {
    // Check authentication with NextAuth v5
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Initialize scraper and navigate to URL
    await scraper.initialize();
    await scraper.goTo(url);

    // Extract title, headings, and paragraphs
    const title = await scraper.extractTitle();
    const headings = await scraper.extractAllHeadings();
    const paragraphs = await scraper.extractAllParagraphs();

    await scraper.close();

    return NextResponse.json({
      success: true,
      data: {
        title,
        headings,
        paragraphs,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Scraping error:", error.message);
    } else {
      console.error("Scraping error:", error);
    }

    // Make sure to close the browser on error
    try {
      await scraper.close();
    } catch (closeError) {
      console.error("Error closing browser:", closeError);
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to scrape data",
      },
      { status: 500 },
    );
  }
}
