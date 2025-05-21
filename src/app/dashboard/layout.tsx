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
                    <div className="flex min-h-screen">
                        <Sidebar className="border-r" />
                        <div className="flex-1">
                            <TopNav />
                            <main className="p-8">
                                {children}
                            </main>
                        </div>
                    </div>
                </SettingsProvider>
                <Toaster />
            </body>
        </html>
    )
}
