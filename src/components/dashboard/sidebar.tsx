"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Home,
  BarChart2,
  Folder,
  Wallet,
  Users2,
  Shield,
  MessagesSquare,
  Settings,
  HelpCircle,
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Overview
          </h2>
          <div className="space-y-1">
            <Button
              asChild
              variant={pathname === "/dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/dashboard/analytics" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/dashboard/analytics">
                <BarChart2 className="mr-2 h-4 w-4" />
                Analytics
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Management
          </h2>
          <div className="space-y-1">
            <Button
              asChild
              variant={pathname === "/dashboard/notes" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/dashboard/notes">
                <Folder className="mr-2 h-4 w-4" />
                Notes
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/dashboard/transactions" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/dashboard/transactions">
                <Wallet className="mr-2 h-4 w-4" />
                Transactions
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/dashboard/members" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/dashboard/members">
                <Users2 className="mr-2 h-4 w-4" />
                Members
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/dashboard/permissions" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/dashboard/permissions">
                <Shield className="mr-2 h-4 w-4" />
                Permissions
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/dashboard/chat" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/dashboard/chat">
                <MessagesSquare className="mr-2 h-4 w-4" />
                Chat
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Settings
          </h2>
          <div className="space-y-1">
            <Button
              asChild
              variant={pathname === "/dashboard/settings" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/dashboard/help" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/dashboard/help">
                <HelpCircle className="mr-2 h-4 w-4" />
                Help
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
