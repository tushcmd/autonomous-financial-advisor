import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import WebScraper from "@/components/web-scraper";

export const metadata = {
    title: "Web Scraper",
    description: "Scrape data from websites",
};

export default async function ScraperPage() {
    const session = await auth();

    if (!session) {
        redirect("/sign-in");
    }

    return (
        <div className="flex flex-col flex-1 w-full">
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Web Scraper</h2>
                </div>
                <div className="grid gap-4">
                    <WebScraper />
                </div>
            </div>
        </div>
    );
}