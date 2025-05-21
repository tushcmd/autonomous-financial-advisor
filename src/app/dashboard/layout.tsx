import { Inter } from "next/font/google"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"

import { SettingsProvider } from "@/contexts/settings-context"
import type React from "react"
import { Toaster } from "sonner"


const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "Financial Advisor Dashboard",
    description: "Everything to make you a profitable investor",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <SettingsProvider>
                    <div className="h-screen flex flex-col">
                        <TopNav />
                        <div className="flex flex-1 overflow-hidden">
                            <aside className="w-[240px] flex-shrink-0 border-r">
                                <Sidebar />
                            </aside>
                            <main className="flex-1 overflow-y-auto">
                                <div className="container mx-auto p-6 max-w-7xl">
                                    {children}
                                </div>
                            </main>
                        </div>
                    </div>
                </SettingsProvider>
                <Toaster />
            </body>
        </html>
    )
}
