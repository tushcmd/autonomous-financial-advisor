"use client"

import { useState } from "react"
// import { useRouter } from "next/navigation"
import {
    ArrowRightIcon,
    ArrowUpIcon,
    BarChart3Icon,
    DollarSignIcon,
    LineChartIcon,
    LinkIcon,
    RefreshCwIcon,
    SwitchCameraIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { PortfolioSwitcher } from "../../components/dashboard/portfolio-switcher"
import { HoldingsTable } from "../../../components/dashboard/holdings-table"
import { PerformanceChart } from "../../../components/dashboard/performance-chart"
import { AssetAllocation } from "../../../components/dashboard/asset-allocation"
import { RecentActivity } from "../../../components/dashboard/recent-activity"


export default function DashboardPage() {
    const [portfolioType, setPortfolioType] = useState<"DEMO" | "REAL">("DEMO")

    return (
        <div className="flex flex-col gap-6">
            {/* Header with Portfolio Switcher */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage and track your investment portfolio
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant={portfolioType === "DEMO" ? "default" : "outline"}
                        onClick={() => setPortfolioType("DEMO")}
                        className="gap-2"
                    >
                        <LineChartIcon className="h-4 w-4" />
                        Demo Portfolio
                    </Button>
                    <Button
                        variant={portfolioType === "REAL" ? "default" : "outline"}
                        onClick={() => setPortfolioType("REAL")}
                        className="gap-2"
                    >
                        <DollarSignIcon className="h-4 w-4" />
                        Real Portfolio
                    </Button>
                </div>
            </div>

            {/* Connect Account Card for Real Portfolio */}
            {portfolioType === "REAL" && (
                <Card className="border-dashed bg-muted/50">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                        <div className="mb-4 rounded-full bg-primary/10 p-3">
                            <LinkIcon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">Connect Your Brokerage Account</h3>
                        <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                            Link your real brokerage account to start tracking your investments and enable automated trading.
                        </p>
                        <Button size="lg" className="gap-2">
                            <LinkIcon className="h-4 w-4" />
                            Connect Account
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Portfolio Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
                        <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{portfolioType === "DEMO" ? "$24,685.50" : "$5,240.00"}</div>
                        <p className="text-xs text-muted-foreground">
                            {portfolioType === "DEMO" ? "+$1,245.50" : "+$120.25"} from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
                        <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{portfolioType === "DEMO" ? "$10,000.00" : "$0.00"}</div>
                        <p className="text-xs text-muted-foreground">Available for investment</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Return</CardTitle>
                        <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-500">{portfolioType === "DEMO" ? "+5.3%" : "+2.4%"}</div>
                        <p className="text-xs text-muted-foreground">Since inception</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
                        <SwitchCameraIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{portfolioType === "DEMO" ? "8" : "0"}</div>
                        <p className="text-xs text-muted-foreground">
                            {portfolioType === "DEMO" ? "Across 8 companies" : "No active positions"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Portfolio Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <PerformanceChart portfolioType={portfolioType} />
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Asset Allocation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AssetAllocation portfolioType={portfolioType} />
                    </CardContent>
                </Card>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="holdings" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="holdings">Holdings</TabsTrigger>
                    <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                    <TabsTrigger value="insights">AI Insights</TabsTrigger>
                </TabsList>
                <TabsContent value="holdings" className="space-y-4">
                    <HoldingsTable portfolioType={portfolioType} />
                </TabsContent>
                <TabsContent value="activity" className="space-y-4">
                    <RecentActivity portfolioType={portfolioType} />
                </TabsContent>
                <TabsContent value="insights" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Portfolio Analysis</CardTitle>
                            <CardDescription>Personalized insights and recommendations for your portfolio</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {portfolioType === "DEMO" ? (
                                    <>
                                        <div className="rounded-lg border p-3">
                                            <h3 className="font-medium">Diversification Opportunity</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Your portfolio is heavily weighted in technology stocks (65%). Consider adding exposure to
                                                other sectors like healthcare or consumer staples to reduce volatility.
                                            </p>
                                        </div>
                                        <div className="rounded-lg border p-3">
                                            <h3 className="font-medium">Performance Insight</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                NVDA has been your best performer (+12.3%) while JNJ has underperformed (-2.1%). Consider
                                                rebalancing to maintain your target allocation.
                                            </p>
                                        </div>
                                        <div className="rounded-lg border p-3">
                                            <h3 className="font-medium">Cash Management</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                You have $10,000 in cash. Based on your growth goals, consider investing in ETFs that track
                                                broader market indices to put this cash to work.
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <p className="text-muted-foreground mb-4">
                                            No insights available for your real portfolio yet. Add holdings to receive personalized
                                            recommendations.
                                        </p>
                                        <Button className="gap-2">
                                            <ArrowRightIcon className="h-4 w-4" />
                                            Start Adding Holdings
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full gap-2">
                                <RefreshCwIcon className="h-4 w-4" />
                                Refresh Analysis
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
