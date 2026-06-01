"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, Zap, Clock, Check, AlertCircle } from "lucide-react"

const discos = [
  { id: "ikedc", name: "IKEDC (Ikeja Electric)", region: "Lagos" },
  { id: "ekedc", name: "EKEDC (Eko Electric)", region: "Lagos" },
  { id: "aedc", name: "AEDC (Abuja Electric)", region: "Abuja" },
  { id: "phed", name: "PHED (Port Harcourt)", region: "Rivers" },
  { id: "kedco", name: "KEDCO (Kano Electric)", region: "Kano" },
  { id: "ibedc", name: "IBEDC (Ibadan Electric)", region: "Oyo" },
]

const recentMeters = [
  { meterNumber: "45123456789", name: "Home", disco: "IKEDC" },
  { meterNumber: "45987654321", name: "Office", disco: "EKEDC" },
]

export default function ElectricityPage() {
  const [selectedDisco, setSelectedDisco] = React.useState(discos[0])
  const [showDiscoDropdown, setShowDiscoDropdown] = React.useState(false)
  const [meterNumber, setMeterNumber] = React.useState("")
  const [amount, setAmount] = React.useState("")
  const [meterVerified, setMeterVerified] = React.useState(false)
  const [customerName, setCustomerName] = React.useState("")

  const verifyMeter = () => {
    // Simulated verification
    setMeterVerified(true)
    setCustomerName("John Doe")
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <Zap className="h-6 w-6 text-[var(--service-electricity)]" />
          Pay Electricity
        </h1>
        <p className="text-sm text-muted-foreground">Purchase electricity tokens for prepaid meters</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Electricity Token</CardTitle>
              <CardDescription>Enter your meter details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Disco Selection */}
              <div className="space-y-2">
                <Label>Distribution Company (DisCo)</Label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDiscoDropdown(!showDiscoDropdown)}
                    className="w-full flex items-center justify-between rounded-lg border border-input bg-background px-4 py-3 hover:border-primary/50 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <span className="h-8 w-8 rounded-full bg-[var(--service-electricity)]/20 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-[var(--service-electricity)]" />
                      </span>
                      <div className="text-left">
                        <span className="font-medium block">{selectedDisco.name}</span>
                        <span className="text-xs text-muted-foreground">{selectedDisco.region}</span>
                      </div>
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                  {showDiscoDropdown && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-card shadow-lg max-h-64 overflow-y-auto">
                      {discos.map((disco) => (
                        <button
                          key={disco.id}
                          type="button"
                          onClick={() => {
                            setSelectedDisco(disco)
                            setShowDiscoDropdown(false)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          <span className="h-8 w-8 rounded-full bg-[var(--service-electricity)]/20 flex items-center justify-center">
                            <Zap className="h-4 w-4 text-[var(--service-electricity)]" />
                          </span>
                          <div className="text-left">
                            <span className="font-medium block">{disco.name}</span>
                            <span className="text-xs text-muted-foreground">{disco.region}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Meter Number */}
              <div className="space-y-2">
                <Label htmlFor="meter">Meter Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="meter"
                    type="text"
                    placeholder="Enter meter number"
                    value={meterNumber}
                    onChange={(e) => {
                      setMeterNumber(e.target.value)
                      setMeterVerified(false)
                    }}
                    className="bg-background flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={verifyMeter}
                    disabled={!meterNumber}
                  >
                    Verify
                  </Button>
                </div>
              </div>

              {/* Verification Result */}
              {meterVerified && (
                <div className="rounded-lg bg-[var(--service-airtime-bg)] border border-[var(--service-airtime)]/20 p-3 flex items-center gap-3">
                  <Check className="h-5 w-5 text-[var(--service-airtime)]" />
                  <div>
                    <p className="text-sm font-medium">Meter Verified</p>
                    <p className="text-xs text-muted-foreground">Customer: {customerName}</p>
                  </div>
                </div>
              )}

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount (min ₦1,000)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-background"
                  min={1000}
                />
              </div>

              {/* Quick Amounts */}
              <div className="grid grid-cols-3 gap-2">
                {[1000, 2000, 5000, 10000, 20000, 50000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt.toString())}
                    className={`rounded-lg border p-2 text-sm font-medium transition-all ${
                      amount === amt.toString()
                        ? "border-[var(--service-electricity)] bg-[var(--service-electricity)]/5 text-[var(--service-electricity)]"
                        : "border-border bg-background hover:border-[var(--service-electricity)]/30"
                    }`}
                  >
                    ₦{amt.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Summary */}
              {amount && meterVerified && (
                <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">₦{Number(amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span className="font-medium">₦100</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-semibold">₦{(Number(amount) + 100).toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Submit */}
              <Button
                className="w-full bg-[var(--service-electricity)] hover:bg-[var(--service-electricity)]/90 text-white"
                disabled={!amount || !meterVerified}
              >
                Pay Electricity Bill
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Recent Meters */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Saved Meters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentMeters.map((item) => (
                  <button
                    key={item.meterNumber}
                    type="button"
                    onClick={() => {
                      setMeterNumber(item.meterNumber)
                      verifyMeter()
                    }}
                    className="w-full flex items-center justify-between rounded-lg border border-border p-3 hover:border-primary/30 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.meterNumber}</p>
                      <p className="text-xs text-muted-foreground">{item.name} • {item.disco}</p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="bg-[var(--service-electricity-bg)] border-[var(--service-electricity)]/20">
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[var(--service-electricity)]" />
                  <span className="text-sm">Instant token delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[var(--service-electricity)]" />
                  <span className="text-sm">All DisCos supported</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-[var(--service-electricity)]" />
                  <span className="text-sm">Min purchase: ₦1,000</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
