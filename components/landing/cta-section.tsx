import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-8 md:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary to-[var(--service-data)] p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-primary-foreground sm:text-2xl">
                All your everyday services. And powerful AI
              </h2>
              <p className="mt-1 text-sm text-primary-foreground/80">
                One account. Endless possibilities
              </p>
            </div>

            <Link href="/signup">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 whitespace-nowrap"
              >
                Get Started Today <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
