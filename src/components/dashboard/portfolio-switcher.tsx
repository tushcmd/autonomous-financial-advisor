"use client"

import { useState, useEffect } from "react"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Portfolio {
  id: string
  name: string
  type: "DEMO" | "REAL"
}

interface PortfolioSwitcherProps {
  portfolioType: "DEMO" | "REAL"
}

export function PortfolioSwitcher({ portfolioType }: PortfolioSwitcherProps) {
  const [open, setOpen] = useState(false)
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null)
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])

  useEffect(() => {
    // In a real app, this would fetch from your API
    const demoPortfolios = [{ id: "1", name: "Demo Portfolio", type: "DEMO" as const }]

    const realPortfolios = [{ id: "2", name: "My Portfolio", type: "REAL" as const }]

    const filteredPortfolios = portfolioType === "DEMO" ? demoPortfolios : realPortfolios
    setPortfolios(filteredPortfolios)
    setSelectedPortfolio(filteredPortfolios[0] || null)
  }, [portfolioType])

  if (!selectedPortfolio) {
    return null
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between md:w-[240px]">
          {selectedPortfolio ? selectedPortfolio.name : "Select portfolio..."}
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 md:w-[240px]">
        <Command>
          <CommandInput placeholder="Search portfolio..." />
          <CommandList>
            <CommandEmpty>No portfolio found.</CommandEmpty>
            <CommandGroup>
              {portfolios.map((portfolio) => (
                <CommandItem
                  key={portfolio.id}
                  value={portfolio.id}
                  onSelect={() => {
                    setSelectedPortfolio(portfolio)
                    setOpen(false)
                  }}
                >
                  <CheckIcon
                    className={`mr-2 h-4 w-4 ${selectedPortfolio.id === portfolio.id ? "opacity-100" : "opacity-0"}`}
                  />
                  {portfolio.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
