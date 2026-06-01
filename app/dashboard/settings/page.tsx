"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Bell, 
  CreditCard,
  Key,
  Globe,
  Moon,
  Sun,
  ChevronDown,
  Save,
  LogOut
} from "lucide-react"

export default function SettingsPage() {
  const [theme, setTheme] = React.useState("light")
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: true,
    push: false,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">First Name</label>
                  <Input type="text" defaultValue="John" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Last Name</label>
                  <Input type="text" defaultValue="Doe" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="email" defaultValue="john@example.com" className="pl-10" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="tel" defaultValue="+234 801 234 5678" className="pl-10" />
                </div>
              </div>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>Manage your password and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Current Password</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="password" placeholder="Enter current password" className="pl-10" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">New Password</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="password" placeholder="Enter new password" className="pl-10" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Confirm New Password</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="password" placeholder="Confirm new password" className="pl-10" />
                </div>
              </div>
              <Button variant="outline" className="gap-2">
                <Key className="h-4 w-4" />
                Update Password
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive transaction updates via email</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.email ? "bg-blue-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.email ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive transaction updates via SMS</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifications(prev => ({ ...prev, sms: !prev.sms }))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.sms ? "bg-blue-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.sms ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifications(prev => ({ ...prev, push: !prev.push }))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.push ? "bg-blue-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.push ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  theme === "light" ? "border-blue-500 bg-blue-50" : "border-border hover:bg-secondary"
                }`}
              >
                <Sun className="h-5 w-5" />
                <span className="font-medium">Light</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  theme === "dark" ? "border-blue-500 bg-blue-50" : "border-border hover:bg-secondary"
                }`}
              >
                <Moon className="h-5 w-5" />
                <span className="font-medium">Dark</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  theme === "system" ? "border-blue-500 bg-blue-50" : "border-border hover:bg-secondary"
                }`}
              >
                <Globe className="h-5 w-5" />
                <span className="font-medium">System</span>
              </button>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Payments are processed securely via Paystack and Stripe.
              </p>
              <Button variant="outline" className="w-full">
                Manage Payment Methods
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-base text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full gap-2 text-red-600 border-red-200 hover:bg-red-50">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
              <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
