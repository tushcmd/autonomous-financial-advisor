"use client"

import { useEffect, useRef } from "react"

interface PerformanceChartProps {
  portfolioType: "DEMO" | "REAL"
}

export function PerformanceChart({ portfolioType }: PerformanceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = canvas.height
    const padding = 40

    // Demo data - 30 days of portfolio values
    const demoData = Array.from({ length: 30 }, (_, i) => {
      // Start at 23000 and add some randomness, with a general upward trend
      return 23000 + i * 50 + (Math.random() * 500 - 250)
    })

    // Real data - empty or minimal data
    const realData = Array.from({ length: 5 }, (_, i) => {
      // Start at 5000 and add some randomness
      return 5000 + i * 20 + (Math.random() * 100 - 50)
    })

    const data = portfolioType === "DEMO" ? demoData : realData

    // Find min and max for scaling
    const minValue = Math.min(...data) * 0.95
    const maxValue = Math.max(...data) * 1.05

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#e2e8f0"
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Draw y-axis labels
    ctx.fillStyle = "#64748b"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"

    const yLabelCount = 5
    for (let i = 0; i <= yLabelCount; i++) {
      const y = height - padding - ((height - 2 * padding) * i) / yLabelCount
      const value = minValue + ((maxValue - minValue) * i) / yLabelCount
      ctx.fillText(`$${Math.round(value).toLocaleString()}`, padding - 10, y)

      // Draw horizontal grid line
      ctx.beginPath()
      ctx.strokeStyle = "#e2e8f0"
      ctx.setLineDash([5, 5])
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Draw x-axis labels
    ctx.textAlign = "center"
    ctx.textBaseline = "top"

    const xLabelCount = Math.min(7, data.length)
    for (let i = 0; i <= xLabelCount; i++) {
      const x = padding + ((width - 2 * padding) * i) / xLabelCount
      const dayIndex = Math.floor(((data.length - 1) * i) / xLabelCount)
      const daysAgo = data.length - 1 - dayIndex
      const label = daysAgo === 0 ? "Today" : `${daysAgo}d ago`
      ctx.fillText(label, x, height - padding + 10)
    }

    // Draw the line chart
    ctx.beginPath()
    ctx.strokeStyle = "#0ea5e9"
    ctx.lineWidth = 2

    // Create gradient for area under the line
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding)
    gradient.addColorStop(0, "rgba(14, 165, 233, 0.2)")
    gradient.addColorStop(1, "rgba(14, 165, 233, 0)")

    // Draw the data points
    data.forEach((value, index) => {
      const x = padding + ((width - 2 * padding) * index) / (data.length - 1)
      const y = height - padding - ((height - 2 * padding) * (value - minValue)) / (maxValue - minValue)

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Fill area under the line
    ctx.lineTo(padding + ((width - 2 * padding) * (data.length - 1)) / (data.length - 1), height - padding)
    ctx.lineTo(padding, height - padding)
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw data points
    data.forEach((value, index) => {
      if (index % Math.ceil(data.length / 10) === 0 || index === data.length - 1) {
        const x = padding + ((width - 2 * padding) * index) / (data.length - 1)
        const y = height - padding - ((height - 2 * padding) * (value - minValue)) / (maxValue - minValue)

        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = "#0ea5e9"
        ctx.fill()
        ctx.strokeStyle = "#fff"
        ctx.lineWidth = 2
        ctx.stroke()
      }
    })
  }, [portfolioType])

  return (
    <div className="w-full h-[300px]">
      <canvas ref={canvasRef} width={800} height={300} className="w-full h-full" />
    </div>
  )
}
