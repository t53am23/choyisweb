"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ChevronDown, Mail, CreditCard, Receipt, Sparkles } from "lucide-react"

const categories = [
  "Account issue",
  "Payment issue",
  "Airtime/Data issue",
  "Electricity/TV/Internet issue",
  "AI credits issue",
  "Team or school enquiry",
  "Other",
]

const quickHelp = [
  { icon: CreditCard, title: "Transaction issue", description: "Problems with your recent transaction" },
  { icon: Mail, title: "Payment confirmation", description: "Need confirmation for a payment" },
  { icon: Receipt, title: "Receipt request", description: "Request a receipt or invoice" },
  { icon: Sparkles, title: "AI credits support", description: "Questions about AI credits" },
]

export default function SupportPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("")
  const [showCategoryDropdown, setShowCategoryDropdown] = React.useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="4" className="fill-primary" />
                <circle cx="24" cy="8" r="4" className="fill-primary/60" />
                <circle cx="8" cy="24" r="4" className="fill-primary/60" />
                <circle cx="24" cy="24" r="4" className="fill-primary/40" />
              </svg>
              <span className="text-lg font-semibold text-foreground">Choyis TopUp</span>
            </Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 py-10 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">How can we help?</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Get in touch with our support team
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Contact Form */}
            <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
              <h2 className="text-lg font-medium text-foreground mb-5">Send us a message</h2>

              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullname">Full name</Label>
                    <Input
                      id="fullname"
                      type="text"
                      placeholder="John Doe"
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone number (optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="080 1234 5678"
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="Brief description"
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                      className="w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm hover:border-primary/50 transition-colors"
                    >
                      <span className={selectedCategory ? "text-foreground" : "text-muted-foreground"}>
                        {selectedCategory || "Select a category"}
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </button>
                    {showCategoryDropdown && (
                      <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-card shadow-lg">
                        {categories.map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(category)
                              setShowCategoryDropdown(false)
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors first:rounded-t-md last:rounded-b-md"
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your issue in detail..."
                    className="bg-background min-h-[100px]"
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Submit
                </Button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Contact Card */}
              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="text-sm font-medium text-foreground mb-2">Need help with a transaction?</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Contact us directly at
                </p>
                <a
                  href="mailto:info@choyis.com"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  info@choyis.com
                </a>
              </div>

              {/* Quick Help */}
              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="text-sm font-medium text-foreground mb-3">Quick help</h3>
                <div className="space-y-3">
                  {quickHelp.map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
