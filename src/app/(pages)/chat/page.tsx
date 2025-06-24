"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import ChatInterface from "@/components/dashboard/chat-interface";
import { Button } from "@/components/ui/button";
import { LineChartIcon, DollarSignIcon, X } from "lucide-react";

export default function ChatPage() {
    const { data: session } = useSession();
    const [portfolioType, setPortfolioType] = useState<"DEMO" | "REAL">("DEMO");

    if (!session?.user?.id) {
        return <div>Please sign in to use the chat interface.</div>;
    }

    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-8rem)]">
            {/* Header */}
            <header className="h-14 border-b px-4 flex items-center justify-between bg-background">
                <div className="flex items-center gap-4">
                    <h1 className="text-sm font-medium">Portfolio Advisor Chat</h1>
                    <div className="flex items-center gap-2">
                        <Button
                            variant={portfolioType === "DEMO" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPortfolioType("DEMO")}
                            className="gap-2"
                        >
                            <LineChartIcon className="h-4 w-4" />
                            Demo Portfolio
                        </Button>
                        <Button
                            variant={portfolioType === "REAL" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPortfolioType("REAL")}
                            className="gap-2"
                        >
                            <DollarSignIcon className="h-4 w-4" />
                            Real Portfolio
                        </Button>
                    </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                </Button>
            </header>
            <ChatInterface userId={session.user.id} portfolioType={portfolioType} />
        </div>
    );
}