"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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
  Menu,
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

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-4">
      <div className="flex h-14 items-center border-b px-3 font-semibold">
        <Link href="/">Flowers&Saints</Link>
      </div>
      <div className="flex-1 overflow-auto">
        <nav className="grid gap-1 px-2">
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
      <div className="mt-auto border-t">
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
    <>
      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="sm" className="px-2 ml-2">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <aside className={cn("pb-12 hidden lg:block w-72", className)}>
        <SidebarContent />
      </aside>
    </>
  )
}
