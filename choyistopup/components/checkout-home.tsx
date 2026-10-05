"use client"

/*
THESIS: A real utility counter in the first viewport; it refuses the marketing-first SaaS hero.
OWN-WORLD: Bright payment canvas, Choyis navy/blue/cyan, large type, and bespoke two-tone utility pictograms.
STORY: Choose a service, complete its real form, understand payment safety, and recover the transaction.
FIRST VIEWPORT: Compact header, concise promise, seven-service selector, then one dominant checkout workspace.
FORM: Familiar international payments canon, informed by Paytm/BuyPower/Finapt, staged as a public service counter.
*/

import * as React from "react"
import { CheckCircle2, ChevronRight, Headphones, LockKeyhole, Menu, ReceiptText, ShieldCheck, Sparkles, X } from "lucide-react"
import AirtimePage from "@/app/dashboard/airtime/page"
import DataPage from "@/app/dashboard/data/page"
import ElectricityPage from "@/app/dashboard/electricity/page"
import InternetPage from "@/app/dashboard/internet/page"
import TVPage from "@/app/dashboard/tv/page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUtilityVariations } from "@/lib/utilities/use-utility-variations"
import type { UtilityVariation } from "@/lib/utilities/vtpass"
import { ServiceIcon, type ServiceIconName } from "./service-icon"

type ServiceId = ServiceIconName

const services: Array<{ id: ServiceId; label: string; tone: string; status: string }> = [
  { id: "airtime", label: "Airtime", tone: "mint", status: "Live plans" },
  { id: "data", label: "Mobile data", tone: "blue", status: "Live plans" },
  { id: "electricity", label: "Electricity", tone: "amber", status: "Verify meter" },
  { id: "internet", label: "Internet", tone: "cyan", status: "Live plans" },
  { id: "tv", label: "TV", tone: "violet", status: "Live plans" },
  { id: "education", label: "Education", tone: "rose", status: "Catalogue only" },
  { id: "international", label: "International airtime", tone: "indigo", status: "Coming later" },
]

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span /><span /><span /><span />
    </span>
  )
}

function EducationCheckout() {
  const [provider, setProvider] = React.useState("waec")
  const [phone, setPhone] = React.useState("")
  const [selectedPlan, setSelectedPlan] = React.useState<UtilityVariation | null>(null)
  const { variations, loading, error, retry } = useUtilityVariations(provider)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education payment</CardTitle>
        <CardDescription>Products and current prices are loaded from the live catalogue.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="education-product">Product</Label>
          <select id="education-product" value={provider} onChange={(event) => { setProvider(event.target.value); setSelectedPlan(null) }} className="premium-select">
            <option value="waec">WAEC Result Checker PIN</option>
            <option value="waec-registration">WAEC Registration PIN</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="education-phone">Phone number for delivery updates</Label>
          <Input id="education-phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="0801 234 5678" />
        </div>
        <div className="space-y-3">
          <Label>Available products</Label>
          {loading && <p role="status" className="catalog-state">Loading live products…</p>}
          {!loading && error && <div role="alert" className="catalog-state catalog-error"><p>{error}</p><Button variant="outline" onClick={retry}>Try again</Button></div>}
          {!loading && !error && variations.length === 0 && <p className="catalog-state">No products are currently available.</p>}
          {!loading && !error && variations.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {variations.map((plan) => (
                <button key={plan.id} type="button" onClick={() => setSelectedPlan(plan)} className={`plan-option ${selectedPlan?.id === plan.id ? "selected" : ""}`}>
                  <span>{plan.name}</span><strong>₦{plan.amount.toLocaleString()}</strong>
                </button>
              ))}
            </div>
          )}
        </div>
        <Button className="h-13 w-full text-base" disabled>Education payment connection is not enabled yet</Button>
      </CardContent>
    </Card>
  )
}

function InternationalCheckout() {
  return (
    <div className="availability-state" role="status">
      <div className="availability-icon"><ServiceIcon name="international" /></div>
      <div>
        <h3>International airtime</h3>
        <p>The secure country, product, operator and denomination catalogue is not enabled in this isolated app yet. Nothing is hardcoded, and no VTpass credential is exposed in the browser.</p>
      </div>
      <span>Secure catalogue required</span>
    </div>
  )
}

export function CheckoutHome() {
  const [selectedService, setSelectedService] = React.useState<ServiceId>("airtime")
  const [menuOpen, setMenuOpen] = React.useState(false)
  const workspaceRef = React.useRef<HTMLElement>(null)
  const active = services.find((service) => service.id === selectedService) ?? services[0]

  const workspace: Record<ServiceId, React.ReactNode> = {
    airtime: <AirtimePage embedded />,
    data: <DataPage embedded />,
    electricity: <ElectricityPage embedded />,
    internet: <InternetPage embedded />,
    tv: <TVPage embedded />,
    education: <EducationCheckout />,
    international: <InternationalCheckout />,
  }

  function chooseService(service: ServiceId) {
    setSelectedService(service)
    window.setTimeout(() => workspaceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0)
  }

  function handleServiceKey(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const keyTargets: Record<string, number> = {
      ArrowRight: (index + 1) % services.length,
      ArrowDown: (index + 1) % services.length,
      ArrowLeft: (index - 1 + services.length) % services.length,
      ArrowUp: (index - 1 + services.length) % services.length,
      Home: 0,
      End: services.length - 1,
    }

    const nextIndex = keyTargets[event.key]
    if (nextIndex === undefined) return
    event.preventDefault()
    const nextService = services[nextIndex]
    setSelectedService(nextService.id)
    document.getElementById(`service-tab-${nextService.id}`)?.focus()
  }

  return (
    <main>
      <header className="site-header">
        <div className="site-shell header-inner">
          <a className="brand" href="#top" aria-label="Choyis TopUp home"><BrandMark /><span>Choyis <strong>TopUp</strong></span></a>
          <nav className={`header-nav ${menuOpen ? "open" : ""}`} aria-label="Main navigation">
            <a href="#services" onClick={() => setMenuOpen(false)}>Buy a service</a>
            <a href="#safety" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="mailto:info@choyis.com" onClick={() => setMenuOpen(false)}>Help</a>
          </nav>
          <div className="header-actions">
            <a className="text-action" href="mailto:info@choyis.com">Get help</a>
            <button className="menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label="Toggle navigation">
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <section id="top" className="hero-section">
        <div className="site-shell hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles /> Built for everyday payments</div>
            <h1>Top up and pay bills, <span>without the runaround.</span></h1>
            <p>Choose a service and prepare everything in one clear place. Browse live provider data, verify account details and pay where checkout is currently enabled.</p>
            <div className="hero-assurances" aria-label="Service assurances">
              <span><CheckCircle2 /> Live catalogue</span>
              <span><ShieldCheck /> Clear verification</span>
              <span><ReceiptText /> Recoverable receipt</span>
            </div>
          </div>
          <aside className="hero-note" aria-label="Guest checkout information">
            <span className="note-icon"><ChevronRight /></span>
            <div><strong>Start without searching through menus</strong><p>Your selected service opens immediately below and stays on this page.</p></div>
          </aside>
        </div>
      </section>

      <section id="services" className="checkout-section" ref={workspaceRef}>
        <div className="site-shell">
          <div className="section-heading">
            <div><p>What do you need today?</p><h2>Choose a service</h2></div>
            <span>Prices and plans load from the connected provider catalogue.</span>
          </div>

          <div className="service-grid" role="tablist" aria-label="Top up services">
            {services.map((service, index) => (
              <button key={service.id} id={`service-tab-${service.id}`} aria-controls="checkout-panel" type="button" role="tab" aria-selected={selectedService === service.id} tabIndex={selectedService === service.id ? 0 : -1} className={`service-tile ${service.tone} ${selectedService === service.id ? "active" : ""}`} onClick={() => chooseService(service.id)} onKeyDown={(event) => handleServiceKey(event, index)}>
                <span className="service-icon"><ServiceIcon name={service.id} /></span>
                <span className="service-name">{service.label}</span>
                <span className="service-status">{service.status}</span>
                <ChevronRight className="service-arrow" />
              </button>
            ))}
          </div>

          <div id="checkout-panel" className="workspace-frame" role="tabpanel" aria-labelledby={`service-tab-${selectedService}`}>
            <div className="workspace-heading">
              <div className={`workspace-symbol ${active.tone}`}><ServiceIcon name={active.id} /></div>
              <div><span>Selected service</span><h2>{active.label}</h2></div>
              <p>Review every detail before payment starts.</p>
            </div>
            <div className="account-notice" role="note"><LockKeyhole /><span><strong>Preview safely.</strong> A signed-in Choyis account is required when an enabled service reaches payment.</span></div>
            <div key={selectedService} className="workspace-content checkout-stage">{workspace[selectedService]}</div>
          </div>
        </div>
      </section>

      <section id="safety" className="confidence-section">
        <div className="site-shell confidence-grid">
          <div className="confidence-intro"><p>Designed for the moment payment matters</p><h2>Clear before, during and after checkout.</h2></div>
          <div className="confidence-item"><LockKeyhole /><div><h3>Payment stays separate</h3><p>On enabled services, your request is confirmed before payment begins. Vending starts only after verified payment.</p></div></div>
          <div className="confidence-item"><ReceiptText /><div><h3>Every attempt has a reference</h3><p>Pending transactions can be checked without creating a second payment.</p></div></div>
          <div className="confidence-item"><Headphones /><div><h3>Help is easy to find</h3><p>Keep your reference and contact support whenever a transaction needs attention.</p></div></div>
        </div>
      </section>

      <footer><div className="site-shell footer-inner"><a className="brand" href="#top"><BrandMark /><span>Choyis <strong>TopUp</strong></span></a><p>Everyday services, made easier to complete.</p><a href="mailto:info@choyis.com">info@choyis.com</a></div></footer>
    </main>
  )
}
