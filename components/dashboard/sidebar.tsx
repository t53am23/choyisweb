"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import {
  Home,
  Smartphone,
  Globe,
  Zap,
  Wifi,
  Tv,
  Sparkles,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Users,
  HelpCircle,
  CreditCard,
  Receipt,
  Gift,
  ChevronDown,
} from "lucide-react"

const navLinks = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Airtime", href: "/dashboard/airtime", icon: Smartphone },
  { label: "Data", href: "/dashboard/data", icon: Globe },
  { label: "Electricity", href: "/dashboard/electricity", icon: Zap },
  { label: "Internet", href: "/dashboard/internet", icon: Wifi },
  { label: "TV", href: "/dashboard/tv", icon: Tv },
  { label: "AI Chat", href: "/dashboard/ai", icon: Sparkles },
]

const bottomLinks = [
  { label: "Transactions", href: "/dashboard/transactions", icon: History },
  { label: "Teams", href: "/dashboard/teams", icon: Users },
  { label: "Referrals", href: "/dashboard/referrals", icon: Gift },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Help", href: "/support", icon: HelpCircle },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)
  const [showCreditDropdown, setShowCreditDropdown] = React.useState(false)

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === href
    return pathname.startsWith(href)
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="4" className="fill-primary" />
            <circle cx="24" cy="8" r="4" className="fill-primary/60" />
            <circle cx="8" cy="24" r="4" className="fill-primary/60" />
            <circle cx="24" cy="24" r="4" className="fill-primary/40" />
          </svg>
          <span className="text-base font-semibold text-foreground">Choyis TopUp</span>
        </Link>
      </div>

      {/* AI Credits Section */}
      <div className="px-3 py-3 border-b border-border">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCreditDropdown(!showCreditDropdown)}
            className="w-full flex items-center justify-between rounded-lg bg-[var(--service-ai-bg)] px-3 py-2 hover:bg-[var(--service-ai-bg)]/80 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--service-ai)]" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">AI Credits</p>
                <p className="text-sm font-semibold text-foreground">2,450</p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
          {showCreditDropdown && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-card shadow-lg p-2">
              <Link href="/dashboard/ai">
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                  <Sparkles className="h-3 w-3 mr-2" />
                  Use AI Chat
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                  <CreditCard className="h-3 w-3 mr-2" />
                  Buy More Credits
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <div className="space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>

        <div className="my-4 border-t border-border" />

        <div className="space-y-1">
          {bottomLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* User & Theme Toggle */}
      <div className="border-t border-border p-3">
        <div className="flex items-center justify-between mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="h-8 w-8"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Link href="/dashboard/transactions">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Receipt className="h-4 w-4" />
              <span className="sr-only">Transactions</span>
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-2">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-medium text-primary">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">john@example.com</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-card border-r border-border">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 px-4 bg-background border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="4" className="fill-primary" />
            <circle cx="24" cy="8" r="4" className="fill-primary/60" />
            <circle cx="8" cy="24" r="4" className="fill-primary/60" />
            <circle cx="24" cy="24" r="4" className="fill-primary/40" />
          </svg>
          <span className="text-base font-semibold text-foreground">Choyis TopUp</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  )
}
