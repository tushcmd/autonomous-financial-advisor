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
                    <div className="flex h-screen overflow-hidden bg-muted/5">
                        <Sidebar />
                        <div className="flex-1 flex flex-col lg:pl-72">
                            <TopNav />
                            <main className="flex-1 overflow-y-auto">
                                <div className="container py-6 px-4">
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
