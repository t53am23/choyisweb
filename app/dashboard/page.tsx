"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Smartphone,
  Globe,
  Zap,
  Wifi,
  Tv,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

const quickServices = [
  { icon: Smartphone, label: "Airtime", href: "/dashboard/airtime", color: "var(--service-airtime)", bgColor: "var(--service-airtime-bg)" },
  { icon: Globe, label: "Data", href: "/dashboard/data", color: "var(--service-data)", bgColor: "var(--service-data-bg)" },
  { icon: Zap, label: "Electricity", href: "/dashboard/electricity", color: "var(--service-electricity)", bgColor: "var(--service-electricity-bg)" },
  { icon: Wifi, label: "Internet", href: "/dashboard/internet", color: "var(--service-internet)", bgColor: "var(--service-internet-bg)" },
  { icon: Tv, label: "TV", href: "/dashboard/tv", color: "var(--service-tv)", bgColor: "var(--service-tv-bg)" },
  { icon: Sparkles, label: "AI Chat", href: "/dashboard/ai", color: "var(--service-ai)", bgColor: "var(--service-ai-bg)" },
]

const recentTransactions = [
  { id: "1", type: "Data", provider: "MTN Nigeria", amount: "₦1,500", status: "delivered", time: "2 min ago" },
  { id: "2", type: "Airtime", provider: "Glo", amount: "₦500", status: "delivered", time: "1 hour ago" },
  { id: "3", type: "Electricity", provider: "IKEDC", amount: "₦5,000", status: "pending", time: "3 hours ago" },
  { id: "4", type: "AI Credits", provider: "Choyis AI", amount: "₦2,500", status: "delivered", time: "Yesterday" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Welcome back, John</h1>
        <p className="text-sm text-muted-foreground">What would you like to do today?</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">AI Credits Balance</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              2,450
              <Sparkles className="h-5 w-5 text-[var(--service-ai)]" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/ai" className="text-xs text-primary hover:underline">
              Use AI Chat →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">This Month&apos;s Spending</CardDescription>
            <CardTitle className="text-2xl">₦24,500</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-[var(--service-airtime)]">
              <TrendingUp className="h-3 w-3" />
              12% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Successful Transactions</CardDescription>
            <CardTitle className="text-2xl">47</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/transactions" className="text-xs text-primary hover:underline">
              View history →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Referral Earnings</CardDescription>
            <CardTitle className="text-2xl">₦3,500</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/referrals" className="text-xs text-primary hover:underline">
              Invite friends →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Services</CardTitle>
          <CardDescription>Choose a service to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {quickServices.map((service) => (
              <Link
                key={service.label}
                href={service.href}
                className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 transition-all hover:border-primary/30 hover:shadow-sm"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: service.bgColor }}
                >
                  <service.icon className="h-5 w-5" style={{ color: service.color }} />
                </div>
                <span className="text-xs font-medium text-foreground">{service.label}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <CardDescription>Your latest activity</CardDescription>
          </div>
          <Link href="/dashboard/transactions">
            <Button variant="ghost" size="sm" className="gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-lg bg-secondary/30 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    {tx.status === "delivered" ? (
                      <CheckCircle className="h-4 w-4 text-[var(--service-airtime)]" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-[var(--service-electricity)]" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{tx.type}</p>
                    <p className="text-xs text-muted-foreground">{tx.provider}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{tx.amount}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {tx.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
