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
  // Menu,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
  { name: "Notes", href: "/dashboard/notes", icon: Folder },
  { name: "Transactions", href: "/dashboard/transactions", icon: Wallet },
  { name: "Members", href: "/dashboard/members", icon: Users2 },
  { name: "Permissions", href: "/dashboard/permissions", icon: Shield },
  { name: "Chat", href: "/dashboard/chat", icon: MessagesSquare },
]

const bottomNavigation = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help", href: "/dashboard/help", icon: HelpCircle },
]

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-3 font-semibold shrink-0">
        <Link href="/">AFINAD</Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="grid gap-1 px-2 py-4">
          {navigation.map((item) => (
            <Button
              key={item.href}
              asChild
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="justify-start"
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
      <div className="border-t shrink-0">
        <nav className="grid gap-1 px-2 py-2">
          {bottomNavigation.map((item) => (
            <Button
              key={item.href}
              asChild
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="justify-start"
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  )

  return (
    <aside className={cn("hidden lg:block fixed inset-y-0 left-0 z-20 w-72 border-r", className)}>
      <SidebarContent />
    </aside>
  )
}
