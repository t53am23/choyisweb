import { MousePointer, CreditCard, CheckCircle, ArrowRight } from "lucide-react"

const steps = [
  {
    number: "1",
    icon: MousePointer,
    title: "Choose a service",
    description: "Select airtime, data, bills, internet, TV, or AI",
  },
  {
    number: "2",
    icon: CreditCard,
    title: "Secure checkout with Paystack and Stripe",
    description: "Complete a pay-as-you-go purchase",
  },
  {
    number: "3",
    icon: CheckCircle,
    title: "Get instant confirmation",
    description: "View your order status, receipt, and transaction history",
  },
]

export function HowItWorks() {
  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl mb-8">
          How it works
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
          {steps.map((step, index) => (
            <div key={step.title} className="flex items-center">
              <div className="flex flex-col items-center text-center max-w-[200px]">
                <div className="relative mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-sm font-medium text-foreground">{step.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <ArrowRight className="hidden md:block mx-6 h-5 w-5 text-muted-foreground/50" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
