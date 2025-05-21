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
                    <div className="relative min-h-screen lg:flex">
                        {/* Sidebar */}
                        <div className="fixed inset-y-0 z-50">
                            <Sidebar />
                        </div>
                        {/* Content */}
                        <div className="flex-1 w-full lg:pl-[240px]">
                            <TopNav />
                            <div className="container mx-auto p-6 max-w-7xl">
                                <main className="w-full">{children}</main>
                            </div>
                        </div>
                    </div>
                </SettingsProvider>
                <Toaster />
            </body>
        </html>
    )
}
