"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  ChevronDown,
  Receipt,
  Calendar
} from "lucide-react"

const transactions = [
  {
    id: "TXN001",
    type: "airtime",
    description: "MTN Airtime Top-up",
    recipient: "080 1234 5678",
    amount: 1000,
    status: "completed",
    date: "2026-06-01T14:30:00",
    reference: "CHY-AIR-001234",
  },
  {
    id: "TXN002",
    type: "data",
    description: "MTN 5GB Data Bundle",
    recipient: "080 1234 5678",
    amount: 2500,
    status: "completed",
    date: "2026-06-01T12:15:00",
    reference: "CHY-DAT-001235",
  },
  {
    id: "TXN003",
    type: "electricity",
    description: "EKEDC Prepaid",
    recipient: "45678901234",
    amount: 10000,
    status: "completed",
    date: "2026-05-31T09:45:00",
    reference: "CHY-ELC-001236",
  },
  {
    id: "TXN004",
    type: "tv",
    description: "DStv Compact",
    recipient: "1234567890",
    amount: 15700,
    status: "completed",
    date: "2026-05-30T16:20:00",
    reference: "CHY-TV-001237",
  },
  {
    id: "TXN005",
    type: "internet",
    description: "Spectranet 25GB",
    recipient: "SPT-12345",
    amount: 10000,
    status: "pending",
    date: "2026-05-30T11:00:00",
    reference: "CHY-INT-001238",
  },
  {
    id: "TXN006",
    type: "ai",
    description: "AI Credits Top-up",
    recipient: "user@email.com",
    amount: 5000,
    status: "completed",
    date: "2026-05-29T08:30:00",
    reference: "CHY-AI-001239",
  },
  {
    id: "TXN007",
    type: "airtime",
    description: "Glo Airtime Top-up",
    recipient: "090 8765 4321",
    amount: 500,
    status: "failed",
    date: "2026-05-28T19:15:00",
    reference: "CHY-AIR-001240",
  },
]

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
  const [selectedTransaction, setSelectedTransaction] = React.useState<typeof transactions[0] | null>(null)

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.recipient.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || tx.type === filterType
    return matchesSearch && matchesType
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

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
                <button
                  key={tx.id}
                  type="button"
                  onClick={() => setSelectedTransaction(tx)}
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
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Receipt Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center border-b">
              <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                <Receipt className="h-6 w-6 text-emerald-600" />
              </div>
              <CardTitle>Transaction Receipt</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between py-2 border-b border-dashed">
                <span className="text-muted-foreground">Reference</span>
                <span className="font-medium">{selectedTransaction.reference}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dashed">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium capitalize">{selectedTransaction.type}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dashed">
                <span className="text-muted-foreground">Description</span>
                <span className="font-medium">{selectedTransaction.description}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dashed">
                <span className="text-muted-foreground">Recipient</span>
                <span className="font-medium">{selectedTransaction.recipient}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dashed">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold text-lg">₦{selectedTransaction.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dashed">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-medium ${statusConfig[selectedTransaction.status].color}`}>
                  {statusConfig[selectedTransaction.status].label}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(selectedTransaction.date)}
                </span>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedTransaction(null)}>
                  Close
                </Button>
                <Button className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
