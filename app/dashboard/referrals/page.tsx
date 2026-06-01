"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Gift, 
  Copy, 
  Check,
  Share2,
  Mail,
  Phone,
  Users,
  Coins,
  Clock,
  CheckCircle2,
  ChevronDown,
  MessageCircle
} from "lucide-react"

const referralHistory = [
  {
    id: "1",
    name: "Michael Chen",
    email: "michael@email.com",
    status: "rewarded",
    reward: 500,
    date: "2026-05-28",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@email.com",
    status: "transaction_completed",
    reward: 500,
    date: "2026-05-25",
  },
  {
    id: "3",
    name: "David Williams",
    email: "david@email.com",
    status: "signed_up",
    reward: 0,
    date: "2026-05-20",
  },
  {
    id: "4",
    name: "Emily Brown",
    email: "emily@email.com",
    status: "invited",
    reward: 0,
    date: "2026-05-15",
  },
]

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  invited: { label: "Invited", color: "text-slate-600", bg: "bg-slate-100", icon: Mail },
  signed_up: { label: "Signed Up", color: "text-blue-600", bg: "bg-blue-50", icon: Users },
  transaction_completed: { label: "First Transaction", color: "text-amber-600", bg: "bg-amber-50", icon: CheckCircle2 },
  rewarded: { label: "Reward Earned", color: "text-emerald-600", bg: "bg-emerald-50", icon: Coins },
}

const countries = [
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
]

export default function DashboardReferralsPage() {
  const [copied, setCopied] = React.useState(false)
  const [referralCode] = React.useState("CHOYIS-USR-X7K9M2")
  const [referralLink] = React.useState("https://choyis.com/ref/X7K9M2")
  const [showInviteForm, setShowInviteForm] = React.useState(false)
  const [friendName, setFriendName] = React.useState("")
  const [friendContact, setFriendContact] = React.useState("")
  const [friendCountry, setFriendCountry] = React.useState(countries[0])
  const [friendMessage, setFriendMessage] = React.useState("")
  const [showCountryDropdown, setShowCountryDropdown] = React.useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareViaWhatsApp = () => {
    const text = `Join Choyis TopUp and get started with easy top-ups and AI access! Use my referral code: ${referralCode} or sign up here: ${referralLink}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank")
  }

  const shareViaEmail = () => {
    const subject = "Join Choyis TopUp - Top up, pay bills, and access AI"
    const body = `Hey!\n\nI've been using Choyis TopUp for airtime, data, bill payments, and AI chat. It's really convenient!\n\nUse my referral code: ${referralCode}\nOr sign up here: ${referralLink}\n\nYou'll get credits when you complete your first transaction!`
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank")
  }

  const totalReferrals = referralHistory.length
  const totalEarned = referralHistory.reduce((sum, r) => sum + r.reward, 0)
  const pendingRewards = referralHistory.filter(r => r.status === "signed_up" || r.status === "transaction_completed").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Referrals</h1>
        <p className="text-muted-foreground">Invite friends and earn Choyis credits</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Referrals</p>
                <p className="text-2xl font-semibold">{totalReferrals}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Coins className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Earned</p>
                <p className="text-2xl font-semibold">{totalEarned.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-semibold">{pendingRewards}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <Gift className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reward per Referral</p>
                <p className="text-2xl font-semibold">500</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Referral Code & Link */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-blue-600" />
              Your Referral Code
            </CardTitle>
            <CardDescription>Share your code or link with friends</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Referral Code */}
            <div>
              <label className="text-sm font-medium mb-2 block">Referral Code</label>
              <div className="flex gap-2">
                <div className="flex-1 px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-lg font-semibold text-center">
                  {referralCode}
                </div>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(referralCode)}
                  className="gap-2"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>

            {/* Referral Link */}
            <div>
              <label className="text-sm font-medium mb-2 block">Referral Link</label>
              <div className="flex gap-2">
                <Input
                  value={referralLink}
                  readOnly
                  className="flex-1 bg-slate-50"
                />
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(referralLink)}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Share Buttons */}
            <div>
              <label className="text-sm font-medium mb-2 block">Share via</label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                  onClick={shareViaWhatsApp}
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={shareViaEmail}
                >
                  <Mail className="h-4 w-4" />
                  Email
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: "Join Choyis TopUp",
                        text: `Use my referral code: ${referralCode}`,
                        url: referralLink,
                      })
                    }
                  }}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invite Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              Invite a Friend
            </CardTitle>
            <CardDescription>Send a personal invitation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Friend&apos;s Name</label>
              <Input
                type="text"
                placeholder="Enter name"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Email or Phone</label>
              <Input
                type="text"
                placeholder="email@example.com or +234..."
                value={friendContact}
                onChange={(e) => setFriendContact(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Country</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  className="w-full flex items-center justify-between rounded-lg border border-border bg-background px-4 py-2.5 text-sm hover:border-blue-300 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>{friendCountry.flag}</span>
                    <span>{friendCountry.name}</span>
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
                {showCountryDropdown && (
                  <div className="absolute z-10 mt-2 w-full rounded-lg border border-border bg-card shadow-lg">
                    {countries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => {
                          setFriendCountry(country)
                          setShowCountryDropdown(false)
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        <span>{country.flag}</span>
                        <span>{country.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Message (Optional)</label>
              <textarea
                placeholder="Add a personal message..."
                value={friendMessage}
                onChange={(e) => setFriendMessage(e.target.value)}
                className="w-full h-20 px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button className="w-full gap-2">
              <Mail className="h-4 w-4" />
              Send Invitation
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Referral History */}
      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
          <CardDescription>Track the status of your referrals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {referralHistory.map((referral) => {
              const status = statusConfig[referral.status]
              const StatusIcon = status.icon
              
              return (
                <div key={referral.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                      {referral.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium">{referral.name}</p>
                      <p className="text-sm text-muted-foreground">{referral.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${status.bg} ${status.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </div>
                    {referral.reward > 0 && (
                      <span className="text-sm font-semibold text-emerald-600">+{referral.reward} credits</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          
          <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
            Rewards are unlocked only after your referral completes their first valid transaction.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
