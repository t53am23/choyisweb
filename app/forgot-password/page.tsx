"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
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
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Reset your password</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your email or phone number and we&apos;ll send you a reset link
            </p>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address or phone number</Label>
              <Input
                id="email"
                type="text"
                placeholder="you@example.com or 080 1234 5678"
                className="bg-background"
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Send reset link
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
