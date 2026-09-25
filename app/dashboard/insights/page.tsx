import Link from "next/link"
import { ArrowRight, CalendarDays, Globe, Smartphone, TrendingDown, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const months = [
  { label: "Apr", amount: 12800 }, { label: "May", amount: 16400 }, { label: "Jun", amount: 14200 },
  { label: "Jul", amount: 19800 }, { label: "Aug", amount: 17300 }, { label: "Sep", amount: 15650 },
]
const maximum = Math.max(...months.map((month) => month.amount))
const breakdown = [
  { label: "Data", amount: "₦7,500", percent: 48, icon: Globe, color: "var(--service-data)" },
  { label: "Electricity", amount: "₦5,000", percent: 32, icon: Zap, color: "var(--service-electricity)" },
  { label: "Airtime", amount: "₦3,150", percent: 20, icon: Smartphone, color: "var(--service-airtime)" },
]

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><div className="mb-2 inline-flex rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">Preview data</div><h1 className="text-2xl font-semibold tracking-tight">Spending insights</h1><p className="mt-1 text-sm text-muted-foreground">Understand your top-up habits and know what may be due next.</p></div>
        <Button variant="outline" className="w-full sm:w-auto"><CalendarDays className="h-4 w-4" /> September 2026</Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="gap-2 p-5"><CardDescription>This month</CardDescription><CardTitle className="text-2xl">₦15,650</CardTitle></Card>
        <Card className="gap-2 p-5"><CardDescription>Top-ups completed</CardDescription><CardTitle className="text-2xl">8</CardTitle></Card>
        <Card className="gap-2 p-5"><CardDescription>Compared with August</CardDescription><CardTitle className="flex items-center gap-2 text-2xl"><TrendingDown className="h-5 w-5 text-[var(--service-airtime)]" /> 9.5% less</CardTitle></Card>
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Card><CardHeader><CardTitle className="text-lg">Six-month spend</CardTitle><CardDescription>Your completed purchases by month</CardDescription></CardHeader><CardContent><div className="flex h-56 items-end gap-3 border-b border-l px-3 pb-3 sm:gap-5" aria-label="Monthly spending bar chart">{months.map((month) => <div key={month.label} className="flex h-full flex-1 flex-col justify-end gap-2"><div className="w-full rounded-t-md bg-primary/80 transition-colors hover:bg-primary" style={{ height: `${Math.max((month.amount / maximum) * 100, 8)}%` }}><span className="sr-only">{month.label}: ₦{month.amount.toLocaleString()}</span></div><span className="text-center text-[11px] text-muted-foreground">{month.label}</span></div>)}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-lg">Where it went</CardTitle><CardDescription>September by service</CardDescription></CardHeader><CardContent className="space-y-5">{breakdown.map((item) => <div key={item.label}><div className="mb-2 flex items-center justify-between text-sm"><span className="flex items-center gap-2 font-medium"><item.icon className="h-4 w-4" style={{ color: item.color }} />{item.label}</span><span>{item.amount}</span></div><div className="h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full" style={{ width: `${item.percent}%`, backgroundColor: item.color }} /></div></div>)}</CardContent></Card>
      </div>
      <Card className="gap-4 border-primary/15 bg-[linear-gradient(135deg,var(--card),var(--service-ai-bg))]"><CardHeader><CardTitle className="text-lg">A useful pattern</CardTitle><CardDescription>Your MTN data is usually renewed every 29 days. Based on that rhythm, the next purchase may be due in about 3 days.</CardDescription></CardHeader><CardContent className="flex flex-col gap-3 sm:flex-row"><Button asChild><Link href="/dashboard/data">Buy data again <ArrowRight /></Link></Button><Button asChild variant="ghost"><Link href="/dashboard">Ask Choyis instead</Link></Button></CardContent></Card>
      <p className="text-xs leading-5 text-muted-foreground">These insights are an interface preview based on sample history. “Due” dates are estimates, not a provider-reported balance or expiry. Live data will come from the shared Choyis account after backend connection.</p>
    </div>
  )
}
