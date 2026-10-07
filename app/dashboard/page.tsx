"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AirtimePage from "@/app/dashboard/airtime/page"
import DataPage from "@/app/dashboard/data/page"
import ElectricityPage from "@/app/dashboard/electricity/page"
import InternetPage from "@/app/dashboard/internet/page"
import TVPage from "@/app/dashboard/tv/page"
import { TransferWorkspace } from "@/components/transfers/transfer-workspace"
import { useUtilityVariations } from "@/lib/utilities/use-utility-variations"
import type { UtilityVariation } from "@/lib/utilities/vtpass"
import {
  ArrowRight, Globe, GraduationCap, Loader2, Mic, RefreshCw,
  Send, SendHorizontal, Sparkles, Smartphone, Tv, Wifi, Zap,
} from "lucide-react"

type ServiceId = "transfer" | "airtime" | "data" | "electricity" | "internet" | "tv" | "education" | "international"
type Draft = { service: ServiceId; provider?: string; identifier?: string; amount?: number }

const services = [
  { id: "transfer" as const, label: "Transfer", icon: SendHorizontal, color: "var(--primary)", bg: "color-mix(in oklab, var(--primary) 12%, transparent)" },
  { id: "airtime" as const, label: "Airtime", icon: Smartphone, color: "var(--service-airtime)", bg: "var(--service-airtime-bg)" },
  { id: "data" as const, label: "Data", icon: Globe, color: "var(--service-data)", bg: "var(--service-data-bg)" },
  { id: "electricity" as const, label: "Electricity", icon: Zap, color: "var(--service-electricity)", bg: "var(--service-electricity-bg)" },
  { id: "internet" as const, label: "Internet", icon: Wifi, color: "var(--service-internet)", bg: "var(--service-internet-bg)" },
  { id: "tv" as const, label: "TV", icon: Tv, color: "var(--service-tv)", bg: "var(--service-tv-bg)" },
  { id: "education" as const, label: "Education", icon: GraduationCap, color: "#db2777", bg: "#fce7f3" },
  { id: "international" as const, label: "International Airtime", icon: Globe, color: "#7c3aed", bg: "#ede9fe" },
]

const predictedRecharges = [
  { service: "data" as const, title: "MTN Data", due: "About 3 days", action: "Buy again", provider: "mtn-data", identifier: "08031231482" },
  { service: "electricity" as const, title: "AEDC Electricity", due: "About 6 days", action: "Pay again", provider: "abuja-electric", identifier: "04198812754", amount: 5000 },
  { service: "tv" as const, title: "GOtv", due: "About 11 days", action: "Buy again", provider: "gotv", identifier: "1234567890" },
]

function detectService(prompt: string): ServiceId {
  const value = prompt.toLowerCase()
  if (/electric|aedc|meter|disco/.test(value)) return "electricity"
  if (/data|bundle|gb|mb/.test(value)) return "data"
  if (/gotv|dstv|startimes|tv|cable/.test(value)) return "tv"
  if (/smile|spectranet|internet/.test(value)) return "internet"
  if (/waec|education|result checker/.test(value)) return "education"
  if (/international|foreign|ghana|cameroon/.test(value)) return "international"
  return "airtime"
}

function extractDraft(prompt: string): Draft {
  const service = detectService(prompt)
  const identifier = prompt.match(/\b0\d{10}\b/)?.[0]
  const amountMatch = prompt.replace(/,/g, "").match(/(?:₦|ngn\s*)?(\d{2,6})/i)
  const amount = amountMatch ? Number(amountMatch[1]) : undefined
  const provider = /mtn/i.test(prompt) ? (service === "data" ? "mtn-data" : "mtn") : undefined
  return { service, provider, identifier, amount }
}

function EducationPanel() {
  const [provider, setProvider] = React.useState("waec")
  const [selectedPlan, setSelectedPlan] = React.useState<UtilityVariation | null>(null)
  const [phone, setPhone] = React.useState("")
  const { variations, loading, error, retry } = useUtilityVariations(provider)

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Education payment</CardTitle><CardDescription>Products and prices are loaded from the live VTpass catalogue.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2"><Label htmlFor="education-product">Product</Label><select id="education-product" value={provider} onChange={(event) => { setProvider(event.target.value); setSelectedPlan(null) }} className="h-11 w-full rounded-lg border bg-background px-3 text-sm"><option value="waec">WAEC Result Checker PIN</option><option value="waec-registration">WAEC Registration PIN</option></select></div>
        <div className="space-y-2"><Label htmlFor="education-phone">Phone number</Label><Input id="education-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="0801 234 5678" /></div>
        <div className="space-y-2"><Label>Available products</Label>
          {loading && <p role="status" className="flex items-center gap-2 rounded-lg border p-4 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading live products…</p>}
          {!loading && error && <div role="alert" className="rounded-lg border border-destructive/30 p-4 text-sm text-destructive">{error}<Button variant="outline" size="sm" className="mt-3 block" onClick={retry}><RefreshCw /> Retry</Button></div>}
          {!loading && !error && <div className="grid gap-2 sm:grid-cols-2">{variations.map((plan) => <button key={plan.id} type="button" onClick={() => setSelectedPlan(plan)} className={`rounded-lg border p-3 text-left ${selectedPlan?.id === plan.id ? "border-primary bg-primary/5" : "hover:border-primary/30"}`}><span className="block text-sm font-medium">{plan.name}</span><span className="mt-1 block text-sm text-primary">₦{plan.amount.toLocaleString()}</span></button>)}</div>}
        </div>
        <Button className="w-full" disabled>Payment connection follows the catalogue batch</Button>
      </CardContent>
    </Card>
  )
}

function InternationalAirtimePanel() {
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Globe className="h-5 w-5 text-violet-600" />International Airtime</CardTitle><CardDescription>VTpass supplies countries, product types, operators and denominations dynamically.</CardDescription></CardHeader>
      <CardContent>
        <div className="rounded-xl border border-dashed p-5">
          <p className="text-sm font-medium">Secure catalogue connection required</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">The existing web proxy does not yet expose VTpass’s international country and operator sequence. It must remain server-side so API credentials are never placed in the browser. No provider or denomination has been hardcoded here.</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const [selectedService, setSelectedService] = React.useState<ServiceId>("airtime")
  const [draft, setDraft] = React.useState<Draft>({ service: "airtime" })
  const [prompt, setPrompt] = React.useState("")
  const workspaceRef = React.useRef<HTMLElement>(null)

  function openWorkspace(nextDraft: Draft) {
    setDraft(nextDraft)
    setSelectedService(nextDraft.service)
    window.setTimeout(() => workspaceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0)
  }

  function prepareRequest(event: React.FormEvent) {
    event.preventDefault()
    if (!prompt.trim()) return
    openWorkspace(extractDraft(prompt))
  }

  const workspace = {
    transfer: <TransferWorkspace embedded />,
    airtime: <AirtimePage key={`airtime-${draft.identifier}-${draft.amount}`} embedded initialPhone={draft.identifier} initialProvider={draft.provider} initialAmount={draft.amount} />,
    data: <DataPage key={`data-${draft.identifier}-${draft.provider}`} embedded initialPhone={draft.identifier} initialProvider={draft.provider} />,
    electricity: <ElectricityPage key={`electricity-${draft.identifier}-${draft.amount}`} embedded initialMeter={draft.identifier} initialProvider={draft.provider} initialAmount={draft.amount} />,
    internet: <InternetPage embedded />,
    tv: <TVPage key={`tv-${draft.identifier}-${draft.provider}`} embedded initialAccount={draft.identifier} initialProvider={draft.provider} />,
    education: <EducationPanel />,
    international: <InternationalAirtimePanel />,
  }[selectedService]

  return (
    <div className="space-y-7">
      <section className="rounded-2xl border border-primary/15 bg-[linear-gradient(135deg,var(--card)_0%,var(--service-ai-bg)_130%)] p-4 shadow-sm sm:p-5">
        <form onSubmit={prepareRequest} className="flex items-center gap-2 rounded-xl border bg-background p-2">
          <Sparkles className="ml-2 hidden h-5 w-5 text-primary sm:block" aria-hidden="true" />
          <label htmlFor="choyis-request" className="sr-only">Ask Choyis to prepare a top up</label>
          <input id="choyis-request" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask Choyis to buy airtime, data or pay a bill…" className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm outline-none placeholder:text-muted-foreground" />
          <Button type="button" variant="ghost" size="icon" className="h-11 w-11" aria-label="Use voice to ask Choyis"><Mic className="h-5 w-5" /></Button>
          <Button type="submit" size="icon" className="h-11 w-11" aria-label="Prepare transaction"><Send className="h-4 w-4" /></Button>
        </form>
        <p className="mt-2 px-1 text-xs text-muted-foreground">Choyis prepares the same form below for you to review. Payment never starts without your confirmation.</p>
      </section>

      <section aria-labelledby="due-title">
        <div className="mb-3"><h1 id="due-title" className="text-lg font-semibold">Likely due soon</h1><p className="text-sm text-muted-foreground">Estimated from your previous purchase rhythm.</p></div>
        <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
          {predictedRecharges.map((item) => (
            <article key={item.title} className="min-w-[78%] snap-start rounded-xl border bg-card p-4 shadow-sm sm:min-w-[260px]">
              <div className="flex items-start justify-between gap-3"><p className="text-sm font-semibold">{item.title}</p><span className="rounded-full bg-secondary px-2 py-1 text-[11px] text-muted-foreground">Estimated</span></div>
              <p className="mt-4 text-xl font-semibold">{item.due}</p>
              <Button variant="ghost" className="mt-2 h-9 px-0 text-primary hover:bg-transparent" onClick={() => openWorkspace({ service: item.service, provider: item.provider, identifier: item.identifier, amount: item.amount })}>{item.action} <ArrowRight /></Button>
            </article>
          ))}
        </div>
      </section>

      <section ref={workspaceRef} aria-labelledby="services-title" className="scroll-mt-20">
        <div className="mb-3"><h2 id="services-title" className="text-lg font-semibold">Top up directly</h2><p className="text-sm text-muted-foreground">Choose a service. The transaction stays on this page.</p></div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0" role="tablist" aria-label="Top up services">
          {services.map((service) => <button key={service.id} type="button" role="tab" aria-selected={selectedService === service.id} onClick={() => { setSelectedService(service.id); setDraft({ service: service.id }) }} className={`flex min-h-20 min-w-[108px] flex-col items-center justify-center gap-2 rounded-xl border px-3 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${selectedService === service.id ? "border-primary bg-primary/5 shadow-sm" : "bg-card hover:border-primary/30"}`}><span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: service.bg }}><service.icon className="h-4.5 w-4.5" style={{ color: service.color }} /></span><span className="text-xs font-medium">{service.label}</span></button>)}
        </div>
        <div role="tabpanel" aria-label={`${services.find((service) => service.id === selectedService)?.label} transaction`} className="mt-2">{workspace}</div>
      </section>
    </div>
  )
}
