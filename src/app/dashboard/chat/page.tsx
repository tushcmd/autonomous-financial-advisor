import ChatInterface from "@/components/dashboard/chat-interface";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";



export default function Page() {
    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-64px)]">
            {/* Header */}
            <header className="h-14 border-b px-4 flex items-center justify-between sticky top-0 bg-background z-10">
                <h1 className="text-sm font-medium">A conversation</h1>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                        Save conversation
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </header>
            <ChatInterface />
        </div>
    )
}