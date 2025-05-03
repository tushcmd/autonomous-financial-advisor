
import { Inter } from "next/font/google"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"

import { SettingsProvider } from "@/contexts/settings-context"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

// export const metadata = {
//     title: "Flowers&Saints Dashboard",
//     description: "A modern, responsive financial dashboard",
//     generator: 'v0.dev'
// }

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <SettingsProvider>

                    <div className="min-h-screen flex">
                        <Sidebar />
                        <div className="flex-1">
                            <TopNav />
                            <div className="container mx-auto p-6 max-w-7xl">
                                <main className="w-full">{children}</main>
                            </div>
                        </div>
                    </div>
                </SettingsProvider>
            </body>
        </html>
    )
}
