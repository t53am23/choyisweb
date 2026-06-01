import { Zap, Shield, Globe, Receipt } from "lucide-react"

const values = [
  {
    icon: Zap,
    title: "Instant delivery",
    description: "Get your services delivered instantly, every time",
  },
  {
    icon: Shield,
    title: "Secure checkout",
    description: "Your payments and data are always protected",
  },
  {
    icon: Globe,
    title: "Country-based services",
    description: "Choose a country and see what's available",
  },
  {
    icon: Receipt,
    title: "Saved receipts",
    description: "Keep order history and download receipts anytime",
  },
]

export function ValueSection() {
  return (
    <section className="py-8 md:py-10 border-y border-border bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground mb-4">
          One account for country-based top-ups, bills, receipts, and AI access
        </p>
        <p className="text-center text-xs text-muted-foreground mb-6">
          No long signup. Verify when needed. Secure checkout. Instant confirmation
        </p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {values.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
