"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { LinkIcon } from "lucide-react"

interface AssetAllocationProps {
  portfolioType: "DEMO" | "REAL"
}

interface AssetCategory {
  name: string
  value: number
  color: string
}

export function AssetAllocation({ portfolioType }: AssetAllocationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Demo data - asset allocation
    const demoData: AssetCategory[] = [
      { name: "Technology", value: 65, color: "#0ea5e9" },
      { name: "Healthcare", value: 15, color: "#10b981" },
      { name: "Consumer", value: 10, color: "#f59e0b" },
      { name: "Financial", value: 5, color: "#8b5cf6" },
      { name: "Other", value: 5, color: "#6b7280" },
    ]

    // Real data - empty or minimal data
    const realData: AssetCategory[] = []

    const data = portfolioType === "DEMO" ? demoData : realData

    if (data.length === 0) {
      // Draw empty state
      ctx.font = "14px sans-serif"
      ctx.fillStyle = "#6b7280"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("No asset allocation data available", canvas.width / 2, canvas.height / 2)
      return
    }

    // Draw pie chart
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 40

    let startAngle = 0
    const total = data.reduce((sum, item) => sum + item.value, 0)

    // Draw pie slices
    data.forEach((item) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()

      ctx.fillStyle = item.color
      ctx.fill()

      // Draw slice label if slice is big enough
      if (item.value / total > 0.05) {
        const labelAngle = startAngle + sliceAngle / 2
        const labelRadius = radius * 0.7
        const labelX = centerX + Math.cos(labelAngle) * labelRadius
        const labelY = centerY + Math.sin(labelAngle) * labelRadius

        ctx.font = "bold 12px sans-serif"
        ctx.fillStyle = "#ffffff"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(`${item.value}%`, labelX, labelY)
      }

      startAngle += sliceAngle
    })

    // Draw legend
    const legendX = canvas.width - 150
    const legendY = 40
    const legendSpacing = 25

    data.forEach((item, index) => {
      const y = legendY + index * legendSpacing

      // Draw color box
      ctx.fillStyle = item.color
      ctx.fillRect(legendX, y, 15, 15)

      // Draw text
      ctx.font = "12px sans-serif"
      ctx.fillStyle = "#64748b"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText(`${item.name} (${item.value}%)`, legendX + 25, y + 7)
    })
  }, [portfolioType])

  return (
    <div className="w-full h-[300px]">
      {portfolioType === "DEMO" ? (
        <canvas ref={canvasRef} width={500} height={300} className="w-full h-full" />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p className="text-muted-foreground">No asset allocation data available for your real portfolio yet.</p>
          <p className="text-sm text-muted-foreground mt-2 mb-4">
            Connect your brokerage account to see your asset allocation.
          </p>
          <Button variant="outline" size="sm" className="gap-2">
            <LinkIcon className="h-4 w-4" />
            Connect Account
          </Button>
        </div>
      )}
    </div>
  )
}
