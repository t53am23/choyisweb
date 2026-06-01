"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Copy, Check, Share2, Mail, MessageCircle, ChevronDown, Gift, Twitter, Facebook } from "lucide-react"

const countries = [
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
]

const referralHistory = [
  { name: "Adeola M.", status: "Signed up", date: "May 28, 2026", reward: "Pending" },
  { name: "Kwame A.", status: "First transaction", date: "May 25, 2026", reward: "₦500 earned" },
  { name: "John D.", status: "Invited", date: "May 20, 2026", reward: "-" },
]

export default function ReferralsPage() {
  const [copied, setCopied] = React.useState(false)
  const [selectedCountry, setSelectedCountry] = React.useState(countries[0])
  const [showCountryDropdown, setShowCountryDropdown] = React.useState(false)

  const referralCode = "CHOYIS2450"
  const referralLink = `https://choyis.com/r/${referralCode}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareViaWhatsApp = () => {
    const text = `Join Choyis TopUp and get started with airtime, data, bills, and AI! Use my referral link: ${referralLink}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const shareViaEmail = () => {
    const subject = "Join Choyis TopUp - Pay bills, buy data & access AI"
    const body = `Hey!\n\nI've been using Choyis TopUp to pay bills, buy data, and access powerful AI. Check it out using my referral link:\n\n${referralLink}\n\nSee you there!`
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank')
  }

  const shareViaTwitter = () => {
    const text = `I use @ChoyisTopUp for airtime, data, bills & AI access. Join using my link: ${referralLink}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
  }

  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank')
  }

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
      <main className="flex-1 py-8 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
              <Gift className="h-3 w-3" />
              Earn Choyis credits
            </div>
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Invite friends, earn rewards</h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              Share your referral link and earn credits when your friends make their first successful transaction
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Referral Info */}
            <div className="lg:col-span-2 space-y-5">
              {/* Referral Code & Link */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="text-lg font-medium text-foreground mb-4">Your referral link</h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Referral code</Label>
                    <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-4 py-3">
                      <span className="text-lg font-mono font-semibold text-foreground flex-1">{referralCode}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Referral link</Label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 rounded-lg bg-secondary/50 px-4 py-3">
                        <span className="text-sm text-muted-foreground truncate block">{referralLink}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={copyToClipboard}
                        className="shrink-0"
                      >
                        {copied ? <Check className="h-4 w-4 text-[var(--service-airtime)]" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Share buttons */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={shareViaWhatsApp}>
                      <MessageCircle className="h-4 w-4 text-[var(--service-airtime)]" />
                      WhatsApp
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2" onClick={shareViaEmail}>
                      <Mail className="h-4 w-4 text-[var(--service-data)]" />
                      Email
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2" onClick={shareViaTwitter}>
                      <Twitter className="h-4 w-4 text-[var(--service-internet)]" />
                      Twitter
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2" onClick={shareViaFacebook}>
                      <Facebook className="h-4 w-4 text-[var(--service-data)]" />
                      Facebook
                    </Button>
                  </div>
                </div>
              </div>

              {/* Invite by Email/Phone */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="text-lg font-medium text-foreground mb-4">Invite someone directly</h2>

                <form className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="friendName">Friend&apos;s name</Label>
                      <Input
                        id="friendName"
                        type="text"
                        placeholder="Their name"
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="friendContact">Email or phone</Label>
                      <Input
                        id="friendContact"
                        type="text"
                        placeholder="Email or phone number"
                        className="bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Country</Label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        className="w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm hover:border-primary/50 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span>{selectedCountry.flag}</span>
                          <span>{selectedCountry.name}</span>
                        </span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </button>
                      {showCountryDropdown && (
                        <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-card shadow-lg">
                          {countries.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(country)
                                setShowCountryDropdown(false)
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors first:rounded-t-md last:rounded-b-md"
                            >
                              <span>{country.flag}</span>
                              <span>{country.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Personal message (optional)</Label>
                    <Textarea
                      id="message"
                      placeholder="Add a personal message..."
                      className="bg-background"
                    />
                  </div>

                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Send invite
                  </Button>
                </form>
              </div>

              {/* Referral History */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="text-lg font-medium text-foreground mb-4">Referral history</h2>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-xs font-medium text-muted-foreground py-2">Name</th>
                        <th className="text-left text-xs font-medium text-muted-foreground py-2">Status</th>
                        <th className="text-left text-xs font-medium text-muted-foreground py-2">Date</th>
                        <th className="text-left text-xs font-medium text-muted-foreground py-2">Reward</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referralHistory.map((item, index) => (
                        <tr key={index} className="border-b border-border last:border-0">
                          <td className="py-3 text-sm text-foreground">{item.name}</td>
                          <td className="py-3">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              item.status === "First transaction"
                                ? "bg-[var(--service-airtime-bg)] text-[var(--service-airtime)]"
                                : item.status === "Signed up"
                                ? "bg-primary/10 text-primary"
                                : "bg-secondary text-muted-foreground"
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 text-sm text-muted-foreground">{item.date}</td>
                          <td className="py-3 text-sm text-foreground">{item.reward}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* How it works */}
              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="text-sm font-medium text-foreground mb-3">How it works</h3>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shrink-0">1</span>
                    <span className="text-muted-foreground">Share your referral link with friends</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shrink-0">2</span>
                    <span className="text-muted-foreground">They sign up using your link</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shrink-0">3</span>
                    <span className="text-muted-foreground">When they complete their first successful transaction, you earn credits</span>
                  </li>
                </ol>
              </div>

              {/* Note */}
              <div className="rounded-xl border border-border bg-secondary/30 p-4">
                <p className="text-xs text-muted-foreground">
                  Rewards are unlocked only after a valid first successful transaction by your referred friend. Credits are added to your Choyis account automatically
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
