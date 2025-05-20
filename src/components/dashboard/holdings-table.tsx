"use client"

import { useState } from "react"
import { ArrowDownIcon, ArrowUpIcon, LinkIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AddPositionDialog } from "./add-position-dialog"
import { toast } from "sonner"

interface HoldingsTableProps {
  portfolioType: "DEMO" | "REAL"
}

interface Holding {
  symbol: string
  name: string
  shares: number
  price: number
  value: number
  costBasis: number
  gain: number
  gainPercent: number
}

export function HoldingsTable({ portfolioType }: HoldingsTableProps) {
  const [isAddPositionOpen, setIsAddPositionOpen] = useState(false)
  const [holdings, setHoldings] = useState<Holding[]>(() => {
    // Initial demo holdings
    if (portfolioType === "DEMO") {
      return [
        {
          symbol: "AAPL",
          name: "Apple Inc.",
          shares: 5,
          price: 197.3,
          value: 986.5,
          costBasis: 950.0,
          gain: 36.5,
          gainPercent: 3.84,
        },
        {
          symbol: "MSFT",
          name: "Microsoft Corp.",
          shares: 3,
          price: 410.34,
          value: 1231.02,
          costBasis: 1150.0,
          gain: 81.02,
          gainPercent: 7.05,
        },
        {
          symbol: "AMZN",
          name: "Amazon.com Inc.",
          shares: 4,
          price: 183.92,
          value: 735.68,
          costBasis: 700.0,
          gain: 35.68,
          gainPercent: 5.1,
        },
        {
          symbol: "GOOGL",
          name: "Alphabet Inc.",
          shares: 3,
          price: 165.78,
          value: 497.34,
          costBasis: 480.0,
          gain: 17.34,
          gainPercent: 3.61,
        },
        {
          symbol: "META",
          name: "Meta Platforms Inc.",
          shares: 2,
          price: 471.1,
          value: 942.2,
          costBasis: 850.0,
          gain: 92.2,
          gainPercent: 10.85,
        },
        {
          symbol: "TSLA",
          name: "Tesla Inc.",
          shares: 5,
          price: 172.82,
          value: 864.1,
          costBasis: 900.0,
          gain: -35.9,
          gainPercent: -3.99,
        },
        {
          symbol: "NVDA",
          name: "NVIDIA Corp.",
          shares: 2,
          price: 874.5,
          value: 1749.0,
          costBasis: 1560.0,
          gain: 189.0,
          gainPercent: 12.12,
        },
        {
          symbol: "JNJ",
          name: "Johnson & Johnson",
          shares: 5,
          price: 147.52,
          value: 737.6,
          costBasis: 753.0,
          gain: -15.4,
          gainPercent: -2.05,
        },
      ]
    }
    return []
  })

  // Mock cash balance - in a real app, this would come from your API
  const [cashBalance, setCashBalance] = useState(portfolioType === "DEMO" ? 10000 : 0)

  const handleAddPosition = (symbol: string, shares: number, price: number) => {
    // Check if we already have this stock
    const existingHoldingIndex = holdings.findIndex((h) => h.symbol === symbol)
    const totalCost = shares * price

    // Update cash balance
    setCashBalance((prev) => prev - totalCost)

    if (existingHoldingIndex >= 0) {
      // Update existing holding
      const existingHolding = holdings[existingHoldingIndex]
      const newShares = existingHolding.shares + shares
      const newCostBasis = (existingHolding.costBasis * existingHolding.shares + totalCost) / newShares
      const newValue = newShares * price
      const newGain = newValue - newCostBasis * newShares
      const newGainPercent = (newGain / (newCostBasis * newShares)) * 100

      const updatedHoldings = [...holdings]
      updatedHoldings[existingHoldingIndex] = {
        ...existingHolding,
        shares: newShares,
        costBasis: newCostBasis,
        value: newValue,
        gain: newGain,
        gainPercent: newGainPercent,
      }

      setHoldings(updatedHoldings)
      toast.success("Position Updated", {
        description: `Added ${shares} shares of ${symbol} to your existing position.`,
        duration: 3000
      })
    } else {
      // Create new holding
      const stockInfo = {
        symbol,
        name: getStockName(symbol),
        shares,
        price,
        value: shares * price,
        costBasis: price,
        gain: 0,
        gainPercent: 0,
      }

      setHoldings((prev) => [...prev, stockInfo])
      toast.success("Position Added", {
        description: `Successfully purchased ${shares} shares of ${symbol}.`,
        duration: 3000
      })
    }
  }

  // Helper function to get stock name from symbol
  const getStockName = (symbol: string): string => {
    const stockNames: Record<string, string> = {
      AAPL: "Apple Inc.",
      MSFT: "Microsoft Corp.",
      AMZN: "Amazon.com Inc.",
      GOOGL: "Alphabet Inc.",
      META: "Meta Platforms Inc.",
      TSLA: "Tesla Inc.",
      NVDA: "NVIDIA Corp.",
      JNJ: "Johnson & Johnson",
    }

    return stockNames[symbol] || symbol
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Portfolio Holdings</CardTitle>
            <CardDescription>
              {portfolioType === "DEMO"
                ? "Your demo portfolio holdings with simulated performance"
                : "Your real investment holdings"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Cash Balance: </span>
              <span className="font-medium">
                ${cashBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <Button size="sm" className="gap-2" onClick={() => setIsAddPositionOpen(true)}>
              <PlusIcon className="h-4 w-4" />
              Add Position
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {holdings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Shares</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Gain/Loss</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdings.map((holding) => (
                  <TableRow key={holding.symbol}>
                    <TableCell className="font-medium">{holding.symbol}</TableCell>
                    <TableCell>{holding.name}</TableCell>
                    <TableCell className="text-right">{holding.shares.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${holding.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${holding.value.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {holding.gain >= 0 ? (
                          <ArrowUpIcon className="mr-1 h-4 w-4 text-emerald-500" />
                        ) : (
                          <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
                        )}
                        <span className={holding.gain >= 0 ? "text-emerald-500" : "text-red-500"}>
                          {holding.gainPercent.toFixed(2)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              {portfolioType === "DEMO" ? (
                <>
                  <p className="text-muted-foreground mb-4">No holdings found in your demo portfolio.</p>
                  <Button onClick={() => setIsAddPositionOpen(true)}>Add Holdings</Button>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground mb-4">
                    Connect your brokerage account to view your real holdings.
                  </p>
                  <Button className="gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Connect Brokerage Account
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
        {holdings.length > 0 && (
          <CardFooter className="flex justify-between">
            <Button variant="outline">Export Data</Button>
            <Button onClick={() => setIsAddPositionOpen(true)}>Add New Position</Button>
          </CardFooter>
        )}
      </Card>

      <AddPositionDialog
        open={isAddPositionOpen}
        onOpenChange={setIsAddPositionOpen}
        portfolioType={portfolioType}
        cashBalance={cashBalance}
        onAddPosition={handleAddPosition}
      />
    </>
  )
}