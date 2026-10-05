import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Choyis TopUp — Airtime, Data and Bills",
  description: "Buy airtime and data, pay bills and keep every transaction easy to recover.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
