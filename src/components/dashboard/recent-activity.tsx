"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowDownIcon, ArrowUpIcon, LinkIcon } from "lucide-react"

interface RecentActivityProps {
  portfolioType: "DEMO" | "REAL"
}

interface ActivityItem {
  id: string
  type: "buy" | "sell" | "deposit" | "withdrawal" | "dividend"
  symbol?: string
  shares?: number
  price?: number
  amount: number
  date: string
}

export function RecentActivity({ portfolioType }: RecentActivityProps) {
  // In a real app, this data would come from your API
  const demoActivity: ActivityItem[] = [
    {
      id: "act1",
      type: "buy",
      symbol: "AAPL",
      shares: 2,
      price: 197.3,
      amount: 394.6,
      date: "2023-05-15",
    },
    {
      id: "act2",
      type: "buy",
      symbol: "MSFT",
      shares: 1,
      price: 410.34,
      amount: 410.34,
      date: "2023-05-10",
    },
    {
      id: "act3",
      type: "sell",
      symbol: "TSLA",
      shares: 1,
      price: 172.82,
      amount: 172.82,
      date: "2023-05-05",
    },
    {
      id: "act4",
      type: "deposit",
      amount: 5000,
      date: "2023-05-01",
    },
    {
      id: "act5",
      type: "dividend",
      symbol: "JNJ",
      amount: 25.5,
      date: "2023-04-28",
    },
  ]

  const realActivity: ActivityItem[] = []

  const activities = portfolioType === "DEMO" ? demoActivity : realActivity

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "buy":
        return <ArrowDownIcon className="h-4 w-4 text-emerald-500" />
      case "sell":
        return <ArrowUpIcon className="h-4 w-4 text-red-500" />
      case "deposit":
        return <ArrowDownIcon className="h-4 w-4 text-emerald-500" />
      case "withdrawal":
        return <ArrowUpIcon className="h-4 w-4 text-red-500" />
      case "dividend":
        return <ArrowDownIcon className="h-4 w-4 text-emerald-500" />
      default:
        return null
    }
  }

  const getActivityDescription = (activity: ActivityItem) => {
    switch (activity.type) {
      case "buy":
        return `Bought ${activity.shares} shares of ${activity.symbol} at $${activity.price?.toFixed(2)}`
      case "sell":
        return `Sold ${activity.shares} shares of ${activity.symbol} at $${activity.price?.toFixed(2)}`
      case "deposit":
        return `Deposited funds into account`
      case "withdrawal":
        return `Withdrew funds from account`
      case "dividend":
        return `Received dividend from ${activity.symbol}`
      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          {portfolioType === "DEMO"
            ? "Recent transactions in your demo portfolio"
            : "Recent transactions in your real portfolio"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 rounded-lg border p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                  </p>
                  <p className="text-sm text-muted-foreground">{getActivityDescription(activity)}</p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-sm font-medium">${activity.amount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{new Date(activity.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            {portfolioType === "DEMO" ? (
              <p className="text-muted-foreground">No recent activity found in your demo portfolio.</p>
            ) : (
              <>
                <p className="text-muted-foreground mb-4">
                  Connect your brokerage account to track your real trading activity.
                </p>
                <Button variant="outline" className="gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Connect Brokerage Account
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
