import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Header } from "@/components/layout/header";

export default async function DashboardPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    // If user hasn't completed onboarding, redirect to onboarding
    if (!session.user.hasCompletedOnboarding) {
        redirect("/onboarding");
    }

    // Fetch the user's demo portfolio first, fallback to any portfolio
    const portfolio = await prisma.portfolio.findFirst({
        where: {
            userId: session.user.id,
            type: "DEMO"
        },
    }) || await prisma.portfolio.findFirst({
        where: { userId: session.user.id },
    });

    return (
        <>
            <Header />
            <main className="container mx-auto py-10 px-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">Your Investment Dashboard</h1>
                </div>

                {portfolio ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">Portfolio Overview</h2>
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                                    {portfolio.type === "DEMO" ? "Demo" : "Real"}
                                </span>
                            </div>
                            <div className="space-y-3">
                                <p>
                                    <span className="font-medium">Name:</span> {portfolio.name}
                                </p>
                                <p>
                                    <span className="font-medium">Type:</span>{" "}
                                    {portfolio.type === "DEMO" ? "Demo Portfolio" : "Real Portfolio"}
                                </p>
                                <p>
                                    <span className="font-medium">Goal:</span>{" "}
                                    {portfolio.portfolioGoal === "RETIREMENT"
                                        ? "Retirement Planning"
                                        : portfolio.portfolioGoal === "GROWTH"
                                            ? "Long-term Growth"
                                            : portfolio.portfolioGoal === "INCOME"
                                                ? "Generate Income"
                                                : portfolio.portfolioGoal === "PRESERVATION"
                                                    ? "Capital Preservation"
                                                    : portfolio.portfolioGoal === "SPECULATION"
                                                        ? "Speculation/High Risk"
                                                        : portfolio.portfolioGoal === "OTHER"
                                                            ? "Custom Goal"
                                                            : "Not specified"}
                                </p>
                                {portfolio.longTermGoal && (
                                    <p>
                                        <span className="font-medium">Custom Goal:</span> {portfolio.longTermGoal}
                                    </p>
                                )}
                                <p>
                                    <span className="font-medium">Cash Balance:</span> ${portfolio.cashBalance.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                                <div className="grid gap-3">
                                    <button className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors">
                                        Add Funds
                                    </button>
                                    <button className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors">
                                        Make a Trade
                                    </button>
                                    <button className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors">
                                        View Holdings
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-yellow-50 dark:bg-yellow-900 p-6 rounded-lg">
                        <p className="text-yellow-800 dark:text-yellow-200">
                            No portfolio found. Please try logging out and back in, or contact support.
                        </p>
                    </div>
                )}
            </main>
        </>
    );
}
