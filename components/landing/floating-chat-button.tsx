"use client"

import Link from "next/link"
import { MessageCircle } from "lucide-react"

export function FloatingChatButton() {
  return (
    <Link
      href="/support"
      className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105 md:h-14 md:w-14"
      aria-label="Chat with support"
    >
      <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
    </Link>
  )
}
