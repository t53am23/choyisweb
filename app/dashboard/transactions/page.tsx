"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { transactions } from "@/lib/transactions"
import { 
  Search, 
  Filter, 
  Download, 
  Smartphone, 
  Globe, 
  Zap, 
  Wifi, 
  Tv, 
  Sparkles,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown
} from "lucide-react"

const typeIcons: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  airtime: { icon: Smartphone, color: "text-emerald-500", bg: "bg-emerald-50" },
  data: { icon: Globe, color: "text-blue-500", bg: "bg-blue-50" },
  electricity: { icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
  internet: { icon: Wifi, color: "text-cyan-500", bg: "bg-cyan-50" },
  tv: { icon: Tv, color: "text-purple-500", bg: "bg-purple-50" },
  ai: { icon: Sparkles, color: "text-teal-500", bg: "bg-teal-50" },
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  completed: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", label: "Completed" },
  pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", label: "Pending" },
  failed: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", label: "Failed" },
}

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filterType, setFilterType] = React.useState<string>("all")
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false)

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.recipient.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || tx.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Transactions</h1>
          <p className="text-muted-foreground">View and manage your transaction history</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Transactions</p>
            <p className="text-2xl font-semibold">{transactions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-semibold">₦{transactions.reduce((sum, tx) => sum + tx.amount, 0).toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-semibold text-emerald-600">{transactions.filter(tx => tx.status === "completed").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-semibold text-amber-600">{transactions.filter(tx => tx.status === "pending").length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background text-sm hover:bg-secondary transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>{filterType === "all" ? "All Types" : filterType.charAt(0).toUpperCase() + filterType.slice(1)}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          {showFilterDropdown && (
            <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-border bg-card shadow-lg">
              {["all", "airtime", "data", "electricity", "internet", "tv", "ai"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setFilterType(type)
                    setShowFilterDropdown(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors first:rounded-t-lg last:rounded-b-lg capitalize"
                >
                  {type === "all" ? "All Types" : type}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transactions List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredTransactions.map((tx) => {
              const TypeIcon = typeIcons[tx.type]?.icon || Smartphone
              const typeColor = typeIcons[tx.type]?.color || "text-gray-500"
              const typeBg = typeIcons[tx.type]?.bg || "bg-gray-50"
              const status = statusConfig[tx.status]

              return (
                <Link
                  key={tx.id}
                  href={`/dashboard/transactions/${tx.id}`}
                  className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-xl ${typeBg} flex items-center justify-center`}>
                      <TypeIcon className={`h-5 w-5 ${typeColor}`} />
                    </div>
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-sm text-muted-foreground">{tx.recipient}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₦{tx.amount.toLocaleString()}</p>
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${status.bg} ${status.color}`}>
                      <status.icon className="h-3 w-3" />
                      {status.label}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
