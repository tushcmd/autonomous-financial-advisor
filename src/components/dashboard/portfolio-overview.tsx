"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface PortfolioOverviewProps {
  portfolioType: "DEMO" | "REAL"
}

export function PortfolioOverview({ portfolioType }: PortfolioOverviewProps) {
  // In a real app, this data would come from your API
  const demoData = {
    totalValue: 24685.5,
    cashBalance: 10000.0,
    investedValue: 14685.5,
    goalProgress: 65,
    goalType: "GROWTH",
  }

  const realData = {
    totalValue: 5240.0,
    cashBalance: 0.0,
    investedValue: 5240.0,
    goalProgress: 12,
    goalType: "GROWTH",
  }

  const data = portfolioType === "DEMO" ? demoData : realData

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Overview</CardTitle>
        <CardDescription>
          {portfolioType === "DEMO"
            ? "Your demo portfolio with simulated investments"
            : "Your real investment portfolio"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">
                ${data.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cash Balance</p>
              <p className="text-2xl font-bold">
                ${data.cashBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-muted-foreground">Goal Progress ({data.goalType})</p>
              <p className="text-sm font-medium">{data.goalProgress}%</p>
            </div>
            <Progress value={data.goalProgress} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
