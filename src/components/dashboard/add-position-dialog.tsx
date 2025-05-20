"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CheckIcon, SearchIcon, TrendingUpIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Stock {
  symbol: string
  name: string
  price: number
  change: number
}

interface AddPositionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  portfolioType: "DEMO" | "REAL"
  cashBalance: number
  onAddPosition: (symbol: string, shares: number, price: number) => void
}

export function AddPositionDialog({
  open,
  onOpenChange,
  portfolioType,
  cashBalance,
  onAddPosition,
}: AddPositionDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [shares, setShares] = useState<number>(1)
  const [orderType, setOrderType] = useState<"market" | "limit">("market")
  const [limitPrice, setLimitPrice] = useState<number | null>(null)
  const [stockSearchOpen, setStockSearchOpen] = useState(false)

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setSearchTerm("")
      setSelectedStock(null)
      setShares(1)
      setOrderType("market")
      setLimitPrice(null)
    }
  }, [open])

  // Update limit price when stock is selected
  useEffect(() => {
    if (selectedStock) {
      setLimitPrice(selectedStock.price)
    }
  }, [selectedStock])

  // Mock stock search results - in a real app, this would come from an API
  const searchResults: Stock[] = [
    { symbol: "AAPL", name: "Apple Inc.", price: 197.3, change: 1.2 },
    { symbol: "MSFT", name: "Microsoft Corp.", price: 410.34, change: 0.5 },
    { symbol: "AMZN", name: "Amazon.com Inc.", price: 183.92, change: -0.3 },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 165.78, change: 0.8 },
    { symbol: "META", name: "Meta Platforms Inc.", price: 471.1, change: 2.1 },
    { symbol: "TSLA", name: "Tesla Inc.", price: 172.82, change: -1.5 },
    { symbol: "NVDA", name: "NVIDIA Corp.", price: 874.5, change: 3.2 },
    { symbol: "JNJ", name: "Johnson & Johnson", price: 147.52, change: -0.2 },
  ].filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setShares(value)
    } else {
      setShares(1)
    }
  }

  const handleLimitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    if (!isNaN(value) && value > 0) {
      setLimitPrice(value)
    } else {
      setLimitPrice(selectedStock?.price || null)
    }
  }

  const totalCost = selectedStock ? shares * (orderType === "market" ? selectedStock.price : limitPrice || 0) : 0
  const canAfford = totalCost <= cashBalance
  const isValidOrder = selectedStock && shares > 0 && (orderType === "market" || (limitPrice && limitPrice > 0))

  const handleSubmit = () => {
    if (selectedStock && isValidOrder && canAfford) {
      onAddPosition(selectedStock.symbol, shares, orderType === "market" ? selectedStock.price : limitPrice!)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Position</DialogTitle>
          <DialogDescription>
            Purchase shares using your available cash balance of $
            {cashBalance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Stock Selection */}
          <div className="grid gap-2">
            <Label htmlFor="stock">Select Stock</Label>
            <Popover open={stockSearchOpen} onOpenChange={setStockSearchOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={stockSearchOpen} className="justify-between">
                  {selectedStock ? (
                    <div className="flex items-center">
                      <span className="font-medium">{selectedStock.symbol}</span>
                      <span className="ml-2 text-muted-foreground">{selectedStock.name}</span>
                    </div>
                  ) : (
                    <span>Search for a stock...</span>
                  )}
                  <SearchIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Search for a stock..." value={searchTerm} onValueChange={setSearchTerm} />
                  <CommandList>
                    <CommandEmpty>No stocks found.</CommandEmpty>
                    <CommandGroup>
                      {searchResults.map((stock) => (
                        <CommandItem
                          key={stock.symbol}
                          value={stock.symbol}
                          onSelect={() => {
                            setSelectedStock(stock)
                            setStockSearchOpen(false)
                          }}
                        >
                          <div className="flex w-full items-center justify-between">
                            <div className="flex items-center">
                              <CheckIcon
                                className={`mr-2 h-4 w-4 ${
                                  selectedStock?.symbol === stock.symbol ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              <span className="font-medium">{stock.symbol}</span>
                              <span className="ml-2 text-muted-foreground">{stock.name}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="mr-2">${stock.price.toFixed(2)}</span>
                              <span
                                className={`flex items-center ${
                                  stock.change >= 0 ? "text-emerald-500" : "text-red-500"
                                }`}
                              >
                                {stock.change >= 0 ? "+" : ""}
                                {stock.change.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {selectedStock && (
            <>
              {/* Current Price */}
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Current Price</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">${selectedStock.price.toFixed(2)}</span>
                  <span
                    className={`flex items-center text-sm ${
                      selectedStock.change >= 0 ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {selectedStock.change >= 0 ? "+" : ""}
                    {selectedStock.change.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Order Type */}
              <div className="grid gap-2">
                <Label>Order Type</Label>
                <RadioGroup
                  defaultValue="market"
                  value={orderType}
                  onValueChange={(value) => setOrderType(value as "market" | "limit")}
                  className="flex"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="market" id="market" />
                    <Label htmlFor="market" className="cursor-pointer">
                      Market
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <RadioGroupItem value="limit" id="limit" />
                    <Label htmlFor="limit" className="cursor-pointer">
                      Limit
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Limit Price (if limit order) */}
              {orderType === "limit" && (
                <div className="grid gap-2">
                  <Label htmlFor="limitPrice">Limit Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="limitPrice"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={limitPrice?.toString() || ""}
                      onChange={handleLimitPriceChange}
                      className="pl-7"
                    />
                  </div>
                </div>
              )}

              {/* Shares */}
              <div className="grid gap-2">
                <Label htmlFor="shares">Number of Shares</Label>
                <Input id="shares" type="number" min="1" step="1" value={shares} onChange={handleSharesChange} />
              </div>

              <Separator />

              {/* Order Summary */}
              <div className="space-y-2">
                <h3 className="font-medium">Order Summary</h3>
                <div className="rounded-lg border p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Stock</span>
                    <span>
                      {selectedStock.symbol} ({selectedStock.name})
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Order Type</span>
                    <span className="capitalize">{orderType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price</span>
                    <span>
                      ${(orderType === "market" ? selectedStock.price : limitPrice || 0).toFixed(2)}
                      {orderType === "limit" && " (Limit)"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shares</span>
                    <span>{shares}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Estimated Total</span>
                    <span>${totalCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cash Balance After Purchase</span>
                    <span
                      className={`font-medium ${cashBalance - totalCost < 0 ? "text-red-500" : "text-emerald-500"}`}
                    >
                      ${(cashBalance - totalCost).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {!canAfford && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500">
                  Insufficient cash balance for this purchase. Please reduce the number of shares or add funds to your
                  account.
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValidOrder || !canAfford} className="gap-2">
            <CheckIcon className="h-4 w-4" />
            Place Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
