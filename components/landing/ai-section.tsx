"use client"

import { Sparkles, Wand2, Code, BookOpen, FileEdit, ChevronDown, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const features = [
  { icon: Sparkles, title: "Multiple AI models", description: "Switch models in one chat to get the best answer" },
  { icon: Code, title: "Coding & debugging", description: "Get help with code, find bugs, and learn" },
  { icon: BookOpen, title: "Study & exam prep", description: "Summarize topics and get clear explanations" },
  { icon: FileEdit, title: "Writing & content", description: "Draft emails, articles, and creative content" },
]

export function AISection() {
  return (
    <section id="ai" className="py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-10 items-center">
          {/* Left: AI Chat Preview */}
          <div className="order-2 lg:order-1 rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            {/* Chat header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-secondary/30">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[var(--service-ai)]" />
                <span className="text-sm font-medium">AI Chat</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Credits:</span>
                <span className="text-xs font-medium">2,450</span>
              </div>
            </div>

            {/* Model selector */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
              <span className="text-xs text-muted-foreground">Model</span>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 px-2">
                Auto Mode <ChevronDown className="h-3 w-3" />
              </Button>
            </div>

            {/* Chat thread preview */}
            <div className="p-4 space-y-4 min-h-[160px]">
              <div className="flex gap-3">
                <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <span className="text-xs font-medium">Y</span>
                </div>
                <div className="rounded-xl bg-secondary px-3 py-2 text-sm max-w-[80%]">
                  Help me write a professional email to request a meeting
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-7 w-7 rounded-full bg-[var(--service-ai)] flex items-center justify-center shrink-0">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="rounded-xl border border-border bg-card px-3 py-2 text-sm max-w-[80%]">
                  <p className="text-muted-foreground">Here&apos;s a professional meeting request:</p>
                  <p className="mt-1">Subject: Meeting Request - Project Discussion...</p>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-border p-3">
              <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
                <span className="text-sm text-muted-foreground flex-1">Type your message...</span>
                <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center">
                  <ArrowRight className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Copy and Features */}
          <div className="order-1 lg:order-2">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              One account. Many powerful AI models
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Use Choyis TopUp to access leading AI models for writing, coding, research, business, and customer support
            </p>

            {/* Feature grid */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              {features.map((item) => (
                <div key={item.title} className="flex items-start gap-2.5">
                  <div className="rounded-lg bg-[var(--service-ai-bg)] p-2 shrink-0">
                    <item.icon className="h-4 w-4 text-[var(--service-ai)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="#ai">
              <Button variant="link" className="mt-4 p-0 h-auto text-sm gap-1 text-primary">
                Try AI Chat <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
