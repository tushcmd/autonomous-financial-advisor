'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Download, ThumbsUp, ThumbsDown } from 'lucide-react'
import { cn } from "@/lib/utils"

interface Message {
    role: "agent" | "user"
    content: string
    timestamp: string
}

export default function ChatInterface() {
    const [input, setInput] = useState("")
    const [messages] = useState<Message[]>([
        {
            role: "agent",
            content: "Hello, I am a generative AI agent. How may I assist you today?",
            timestamp: "4:08:28 PM"
        },
        {
            role: "user",
            content: "Hi, I'd like to check my bill.",
            timestamp: "4:08:37 PM"
        },
        {
            role: "agent",
            content: "Please hold for a second.\n\nOk, I can help you with that\n\nI'm pulling up your current bill information\n\nYour current bill is $150, and it is due on August 31, 2024.\n\nIf you need more details, feel free to ask!",
            timestamp: "4:08:37 PM"
        },
        {
            role: "user",
            content: "Can you tell me more about the charges?",
            timestamp: "4:09:00 PM"
        },
        {
            role: "agent",
            content: "Here's a detailed breakdown of your $150 bill:\n\n1. Basic Service Fee: $50\n- Account maintenance\n- Customer support\n- Platform access\n\n2. Usage Charges: $85\n- Transaction fees\n- Premium features\n- API calls\n\n3. Additional Fees: $15\n- Taxes\n- Processing fees\n\nWould you like me to explain any specific item in more detail?",
            timestamp: "4:09:15 PM"
        },
        {
            role: "user",
            content: "What are the premium features included?",
            timestamp: "4:09:45 PM"
        },
        {
            role: "agent",
            content: "The premium features in your plan include:\n\n• Advanced Analytics Dashboard\n• Real-time Market Data\n• Automated Portfolio Rebalancing\n• Priority Customer Support\n• Custom API Integration\n• Enhanced Security Features\n\nYou've utilized all these features this month, which is reflected in your usage charges. Would you like to know how much each feature costs individually?",
            timestamp: "4:10:00 PM"
        },
        {
            role: "user",
            content: "Yes, please break down the costs for each premium feature.",
            timestamp: "4:10:30 PM"
        },
        {
            role: "agent",
            content: "Here's the cost breakdown for each premium feature:\n\n1. Advanced Analytics Dashboard: $25\n2. Real-time Market Data: $20\n3. Automated Portfolio Rebalancing: $15\n4. Priority Customer Support: $10\n5. Custom API Integration: $10\n6. Enhanced Security Features: $5\n\nTotal Premium Features Cost: $85\n\nNote: These costs are based on your current usage level. You can optimize costs by adjusting usage of specific features if needed.",
            timestamp: "4:10:45 PM"
        }
    ])

    return (
        <div className="flex-1 flex flex-col h-full relative">
            <ScrollArea className="flex-1 p-4 h-[calc(100vh-180px)]">
                <div className="space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex gap-2 max-w-[80%]",
                                message.role === "user" && "ml-auto"
                            )}
                        >
                            {message.role === "agent" && (
                                <div className="h-8 w-8 rounded-full bg-primary flex-shrink-0" />
                            )}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">
                                        {message.role === "agent" ? "GenerativeAgent" : "G5"}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {message.timestamp}
                                    </span>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                </div>
                                {message.role === "agent" && (
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <ThumbsUp className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <ThumbsDown className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
            <div className="p-4 border-t bg-background sticky bottom-0">
                <div className="flex gap-2">
                    <Textarea
                        placeholder="Type a message as a customer"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="min-h-[44px] max-h-32"
                    />
                    <Button className="px-8">Send</Button>
                </div>
            </div>
        </div>
    )
}
