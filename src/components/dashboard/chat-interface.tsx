"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Download, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { chatWithPortfolioAgent } from "@/actions/mastra-chat";
import ReactMarkdown from "react-markdown";

interface Message {
    role: "agent" | "user";
    content: string;
    timestamp: string;
}

interface ChatInterfaceProps {
    userId: string;
    portfolioType: "DEMO" | "REAL";
}

export default function ChatInterface({
    userId,
    portfolioType,
}: ChatInterfaceProps) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "agent",
            content: `Hello! I'm your AI financial advisor. I'll be analyzing your ${portfolioType.toLowerCase()} portfolio to provide personalized advice. How can I help you today?`,
            timestamp: new Date().toLocaleTimeString(),
        },
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to bottom when messages change
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        const userMessage: Message = {
            role: "user",
            content: input,
            timestamp: new Date().toLocaleTimeString(),
        };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput("");
        setLoading(true);

        try {
            const agentReply = await chatWithPortfolioAgent(
                userId,
                userMessage.content,
                portfolioType,
                updatedMessages // Pass the conversation history
            );
            setMessages((msgs) => [
                ...msgs,
                {
                    role: "agent",
                    content: agentReply,
                    timestamp: new Date().toLocaleTimeString(),
                },
            ]);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err: unknown) {
            setMessages((msgs) => [
                ...msgs,
                {
                    role: "agent",
                    content: `Sorry, there was an error processing your request for your ${portfolioType.toLowerCase()} portfolio.`,
                    timestamp: new Date().toLocaleTimeString(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full relative">
            <ScrollArea className="flex-1 p-4 h-[calc(100vh-180px)]">
                <div className="flex flex-col space-y-4" ref={scrollRef}>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex gap-2 max-w-[80%]",
                                message.role === "user"
                                    ? "self-end text-right"
                                    : "self-start"
                            )}
                        >
                            {message.role === "agent" && (
                                <div className="h-8 w-8 rounded-full bg-primary flex-shrink-0" />
                            )}
                            <div className="space-y-2">
                                <div className={cn(
                                    "flex items-center gap-2",
                                    message.role === "user" ? "justify-end flex-row-reverse" : ""
                                )}>
                                    <span className="text-sm font-medium">
                                        {message.role === "agent" ? "GenerativeAgent" : "G5"}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {message.timestamp}
                                    </span>
                                </div>
                                <div className={cn(
                                    "p-3 bg-muted/50 rounded-lg",
                                    message.role === "user" ? "bg-primary/10" : ""
                                )}>
                                    {message.role === "agent" ? (
                                        <div className="text-sm whitespace-pre-wrap">
                                            <ReactMarkdown>
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <p className="text-sm whitespace-pre-wrap">
                                            {message.content}
                                        </p>
                                    )}
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
                    <Button className="px-8" onClick={handleSend} disabled={loading}>
                        {loading ? "Sending..." : "Send"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
