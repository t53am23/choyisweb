"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  Plus, 
  Search, 
  MoreVertical, 
  Mail, 
  Shield, 
  Coins,
  UserPlus,
  Settings,
  Trash2,
  Edit,
  ChevronDown
} from "lucide-react"

const teamMembers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@company.com",
    role: "admin",
    credits: 5000,
    spent: 12500,
    status: "active",
    avatar: "JD",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@company.com",
    role: "member",
    credits: 2500,
    spent: 8200,
    status: "active",
    avatar: "JS",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@company.com",
    role: "member",
    credits: 1500,
    spent: 3400,
    status: "active",
    avatar: "MJ",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah@company.com",
    role: "viewer",
    credits: 500,
    spent: 1200,
    status: "pending",
    avatar: "SW",
  },
]

const roleConfig: Record<string, { label: string; color: string; bg: string }> = {
  admin: { label: "Admin", color: "text-purple-600", bg: "bg-purple-50" },
  member: { label: "Member", color: "text-blue-600", bg: "bg-blue-50" },
  viewer: { label: "Viewer", color: "text-slate-600", bg: "bg-slate-100" },
}

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [showInviteModal, setShowInviteModal] = React.useState(false)
  const [showMemberMenu, setShowMemberMenu] = React.useState<string | null>(null)
  const [inviteEmail, setInviteEmail] = React.useState("")
  const [inviteRole, setInviteRole] = React.useState("member")
  const [inviteCredits, setInviteCredits] = React.useState("1000")

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalCredits = teamMembers.reduce((sum, m) => sum + m.credits, 0)
  const totalSpent = teamMembers.reduce((sum, m) => sum + m.spent, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Team Management</h1>
          <p className="text-muted-foreground">Manage your team members and credit allocation</p>
        </div>
        <Button className="gap-2" onClick={() => setShowInviteModal(true)}>
          <UserPlus className="h-4 w-4" />
          Invite Member
        </Button>
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
                <p className="text-sm text-muted-foreground">Team Size</p>
                <p className="text-2xl font-semibold">{teamMembers.length}</p>
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
                <p className="text-sm text-muted-foreground">Total Credits</p>
                <p className="text-2xl font-semibold">{totalCredits.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Coins className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-semibold">₦{totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <Shield className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-semibold">{teamMembers.filter(m => m.role === "admin").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search team members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Team Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage roles and credit allocation for your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {filteredMembers.map((member) => {
              const role = roleConfig[member.role]
              
              return (
                <div key={member.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                      {member.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{member.name}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${role.bg} ${role.color}`}>
                          {role.label}
                        </span>
                        {member.status === "pending" && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-600">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium">{member.credits.toLocaleString()} credits</p>
                      <p className="text-xs text-muted-foreground">₦{member.spent.toLocaleString()} spent</p>
                    </div>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowMemberMenu(showMemberMenu === member.id ? null : member.id)}
                        className="p-2 rounded-lg hover:bg-secondary transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {showMemberMenu === member.id && (
                        <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-border bg-card shadow-lg">
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary transition-colors rounded-t-lg">
                            <Edit className="h-4 w-4" />
                            Edit Member
                          </button>
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary transition-colors">
                            <Coins className="h-4 w-4" />
                            Allocate Credits
                          </button>
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary transition-colors">
                            <Shield className="h-4 w-4" />
                            Change Role
                          </button>
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-lg">
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Invite Team Member
              </CardTitle>
              <CardDescription>Send an invitation to join your team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Role</label>
                <div className="relative">
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm appearance-none cursor-pointer"
                  >
                    <option value="admin">Admin - Full access</option>
                    <option value="member">Member - Can make purchases</option>
                    <option value="viewer">Viewer - View only</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Initial Credits</label>
                <div className="relative">
                  <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="1000"
                    value={inviteCredits}
                    onChange={(e) => setInviteCredits(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 gap-2">
                  <Mail className="h-4 w-4" />
                  Send Invite
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
