"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart3, CheckCircle2, Clock3, Globe, Mic, Send, Sparkles, Smartphone, Tv, Wifi, Zap } from "lucide-react"

const quickServices = [
  { icon: Smartphone, label: "Airtime", href: "/dashboard/airtime", color: "var(--service-airtime)", bg: "var(--service-airtime-bg)" },
  { icon: Globe, label: "Data", href: "/dashboard/data", color: "var(--service-data)", bg: "var(--service-data-bg)" },
  { icon: Zap, label: "Electricity", href: "/dashboard/electricity", color: "var(--service-electricity)", bg: "var(--service-electricity-bg)" },
  { icon: Wifi, label: "Internet", href: "/dashboard/internet", color: "var(--service-internet)", bg: "var(--service-internet-bg)" },
  { icon: Tv, label: "TV", href: "/dashboard/tv", color: "var(--service-tv)", bg: "var(--service-tv-bg)" },
]

const predictedRecharges = [
  { service: "Data", provider: "MTN", account: "0803 ••• 1482", detail: "5 GB monthly", amount: "₦1,500", days: 3, href: "/dashboard/data" },
  { service: "Airtime", provider: "Glo", account: "0805 ••• 9016", detail: "Usual recharge", amount: "₦500", days: 6, href: "/dashboard/airtime" },
  { service: "TV", provider: "GOtv", account: "IUC ••• 8041", detail: "Jolli package", amount: "₦3,950", days: 11, href: "/dashboard/tv" },
]

const recentTransactions = [
  { type: "Data", provider: "MTN · 0803 ••• 1482", amount: "₦1,500", time: "2 min ago" },
  { type: "Airtime", provider: "Glo · 0805 ••• 9016", amount: "₦500", time: "1 hour ago" },
  { type: "Electricity", provider: "AEDC · Meter ••• 2754", amount: "₦5,000", time: "Yesterday" },
]

export default function DashboardPage() {
  const [prompt, setPrompt] = React.useState("")
  const [message, setMessage] = React.useState("")

  function prepareRequest(event: React.FormEvent) {
    event.preventDefault()
    setMessage(prompt.trim() ? "Request captured as a preview. No payment has started." : "Tell Choyis what you want to buy first.")
  }

  return (
    <div className="space-y-7">
      <section className="overflow-hidden rounded-2xl border border-primary/15 bg-[linear-gradient(135deg,var(--card)_0%,var(--service-ai-bg)_130%)] p-5 shadow-sm sm:p-7">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-background/80 px-3 py-1 text-xs font-medium text-primary"><Sparkles className="h-3.5 w-3.5" /> Choyis AI preview</div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">What would you like to top up?</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Type it naturally. Choyis will prepare the purchase for you to review before any payment begins.</p>
          <form onSubmit={prepareRequest} className="mt-5 flex items-center gap-2 rounded-xl border bg-background p-2 shadow-sm">
            <label htmlFor="choyis-request" className="sr-only">Ask Choyis to prepare a top up</label>
            <Sparkles className="ml-2 hidden h-5 w-5 text-primary sm:block" aria-hidden="true" />
            <input id="choyis-request" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Buy ₦1,000 MTN airtime for 0803…" className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm outline-none placeholder:text-muted-foreground" />
            <Button type="button" variant="ghost" size="icon" className="h-11 w-11" aria-label="Use voice to ask Choyis" onClick={() => setMessage("Voice purchasing is coming after secure AI actions are connected.")}><Mic className="h-5 w-5" /></Button>
            <Button type="submit" size="icon" className="h-11 w-11" aria-label="Prepare top up"><Send className="h-4 w-4" /></Button>
          </form>
          <p className="mt-2 min-h-5 text-xs text-muted-foreground" aria-live="polite">{message || "Try: “Buy my usual MTN data” or “Recharge AEDC with ₦5,000”."}</p>
        </div>
      </section>

      <section aria-labelledby="services-title">
        <div className="mb-3"><h2 id="services-title" className="text-lg font-semibold">Top up directly</h2><p className="text-sm text-muted-foreground">Choose a service when you already know what you need.</p></div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3">
          {quickServices.map((service) => (
            <Link key={service.label} href={service.href} className="group flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border bg-card p-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: service.bg }}><service.icon className="h-5 w-5" style={{ color: service.color }} /></span>
              <span className="text-xs font-medium sm:text-sm">{service.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="repeat-title">
        <div className="mb-3 flex items-end justify-between gap-3"><div><h2 id="repeat-title" className="text-lg font-semibold">Likely due soon</h2><p className="text-sm text-muted-foreground">Estimated from your previous purchase rhythm.</p></div><Link href="/dashboard/insights" className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex">View insights <ArrowRight className="h-4 w-4" /></Link></div>
        <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {predictedRecharges.map((item) => (
            <article key={item.account} className="min-w-[82%] snap-start rounded-xl border bg-card p-4 shadow-sm sm:min-w-[290px]">
              <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold">{item.provider} {item.service}</p><p className="mt-0.5 text-xs text-muted-foreground">{item.account}</p></div><span className="rounded-full bg-secondary px-2 py-1 text-[11px] font-medium text-muted-foreground">Estimated</span></div>
              <p className="mt-5 text-2xl font-semibold tracking-tight">About {item.days} days</p><p className="mt-1 text-xs text-muted-foreground">{item.detail} · {item.amount}</p>
              <Button asChild variant="outline" className="mt-4 w-full"><Link href={item.href}>Buy again <ArrowRight className="h-4 w-4" /></Link></Button>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
        <Card className="gap-4"><CardHeader className="flex-row items-center justify-between gap-4"><div><CardTitle className="text-lg">Recent activity</CardTitle><CardDescription>Latest completed top ups</CardDescription></div><Button asChild variant="ghost" size="sm"><Link href="/dashboard/transactions">View all <ArrowRight /></Link></Button></CardHeader>
          <CardContent className="space-y-1">{recentTransactions.map((tx) => <div key={`${tx.type}-${tx.time}`} className="flex items-center justify-between gap-3 border-b py-3 last:border-0"><div className="flex min-w-0 items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--service-airtime-bg)]"><CheckCircle2 className="h-4 w-4 text-[var(--service-airtime)]" /></span><div className="min-w-0"><p className="text-sm font-medium">{tx.type}</p><p className="truncate text-xs text-muted-foreground">{tx.provider}</p></div></div><div className="shrink-0 text-right"><p className="text-sm font-semibold">{tx.amount}</p><p className="flex items-center justify-end gap-1 text-xs text-muted-foreground"><Clock3 className="h-3 w-3" />{tx.time}</p></div></div>)}</CardContent>
        </Card>
        <Card className="gap-4 border-primary/10 bg-secondary/30"><CardHeader><span className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"><BarChart3 className="h-5 w-5 text-primary" /></span><CardTitle className="text-lg">Your spending, clearly</CardTitle><CardDescription>See patterns by service, account and month without a spreadsheet.</CardDescription></CardHeader><CardContent><Button asChild className="w-full"><Link href="/dashboard/insights">Open insights <ArrowRight /></Link></Button><p className="mt-3 text-center text-[11px] text-muted-foreground">Preview data until your account history is connected.</p></CardContent></Card>
      </div>
    </div>
  )
}
