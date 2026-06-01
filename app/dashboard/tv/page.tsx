"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tv, ChevronDown, Clock, CheckCircle2 } from "lucide-react"

const providers = [
  { id: "dstv", name: "DStv", logo: "DS", color: "bg-blue-600" },
  { id: "gotv", name: "GOtv", logo: "GO", color: "bg-green-600" },
  { id: "startimes", name: "StarTimes", logo: "ST", color: "bg-orange-500" },
  { id: "showmax", name: "Showmax", logo: "SH", color: "bg-red-500" },
]

const packages = [
  { id: "1", name: "DStv Premium", price: 37000, provider: "dstv", duration: "1 Month" },
  { id: "2", name: "DStv Compact Plus", price: 25000, provider: "dstv", duration: "1 Month" },
  { id: "3", name: "DStv Compact", price: 15700, provider: "dstv", duration: "1 Month" },
  { id: "4", name: "DStv Confam", price: 9300, provider: "dstv", duration: "1 Month" },
  { id: "5", name: "GOtv Max", price: 7200, provider: "gotv", duration: "1 Month" },
  { id: "6", name: "GOtv Jolli", price: 4850, provider: "gotv", duration: "1 Month" },
  { id: "7", name: "GOtv Jinja", price: 3300, provider: "gotv", duration: "1 Month" },
  { id: "8", name: "StarTimes Basic", price: 1900, provider: "startimes", duration: "1 Month" },
  { id: "9", name: "StarTimes Smart", price: 3800, provider: "startimes", duration: "1 Month" },
]

const recentTransactions = [
  { id: "1", package: "DStv Compact", provider: "DStv", amount: 15700, status: "completed", date: "Today, 10:15 AM" },
  { id: "2", package: "GOtv Max", provider: "GOtv", amount: 7200, status: "completed", date: "Last week" },
]

export default function TVPage() {
  const [selectedProvider, setSelectedProvider] = React.useState(providers[0])
  const [selectedPackage, setSelectedPackage] = React.useState<string | null>(null)
  const [showProviderDropdown, setShowProviderDropdown] = React.useState(false)
  const [smartcardNumber, setSmartcardNumber] = React.useState("")

  const filteredPackages = packages.filter(pkg => pkg.provider === selectedProvider.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">TV Subscriptions</h1>
        <p className="text-muted-foreground">Renew your TV subscription instantly</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Tv className="h-5 w-5 text-purple-500" />
                </div>
                Renew TV Subscription
              </CardTitle>
              <CardDescription>Select a provider and package to continue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Provider Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Select Provider</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowProviderDropdown(!showProviderDropdown)}
                    className="w-full flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm hover:border-purple-300 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <span className={`h-8 w-8 rounded-lg ${selectedProvider.color} flex items-center justify-center text-xs font-bold text-white`}>
                        {selectedProvider.logo}
                      </span>
                      <span className="font-medium">{selectedProvider.name}</span>
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                  {showProviderDropdown && (
                    <div className="absolute z-10 mt-2 w-full rounded-lg border border-border bg-card shadow-lg">
                      {providers.map((provider) => (
                        <button
                          key={provider.id}
                          type="button"
                          onClick={() => {
                            setSelectedProvider(provider)
                            setShowProviderDropdown(false)
                            setSelectedPackage(null)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          <span className={`h-8 w-8 rounded-lg ${provider.color} flex items-center justify-center text-xs font-bold text-white`}>
                            {provider.logo}
                          </span>
                          <span>{provider.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Smartcard Number */}
              <div>
                <label className="text-sm font-medium mb-2 block">Smartcard / IUC Number</label>
                <Input
                  type="text"
                  placeholder="Enter your smartcard or IUC number"
                  value={smartcardNumber}
                  onChange={(e) => setSmartcardNumber(e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Package Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Select Package</label>
                <div className="grid grid-cols-2 gap-3">
                  {filteredPackages.map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`flex flex-col items-start rounded-lg border p-4 transition-all text-left ${
                        selectedPackage === pkg.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-border hover:border-purple-300"
                      }`}
                    >
                      <span className="text-sm font-medium">{pkg.name}</span>
                      <span className="text-xs text-muted-foreground">{pkg.duration}</span>
                      <span className="text-lg font-semibold text-purple-600 mt-1">₦{pkg.price.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full h-12 bg-purple-500 hover:bg-purple-600 text-white"
                disabled={!selectedPackage || !smartcardNumber}
              >
                Continue to Payment
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent TV Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{tx.package}</p>
                    <p className="text-xs text-muted-foreground">{tx.provider} • {tx.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">₦{tx.amount.toLocaleString()}</p>
                    <p className="text-xs text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {tx.status}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
