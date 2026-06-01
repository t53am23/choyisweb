"use client"

import { Smartphone, Wifi, Zap, Tv, Globe, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const services = [
  {
    id: "airtime",
    icon: Smartphone,
    title: "Airtime",
    description: "Top up airtime instantly",
    action: "Start",
    color: "var(--service-airtime)",
    bgColor: "var(--service-airtime-bg)",
  },
  {
    id: "data",
    icon: Globe,
    title: "Data",
    description: "Buy data bundles",
    action: "Buy Data",
    color: "var(--service-data)",
    bgColor: "var(--service-data-bg)",
  },
  {
    id: "electricity",
    icon: Zap,
    title: "Electricity",
    description: "Pay electricity bills",
    action: "Pay Bill",
    color: "var(--service-electricity)",
    bgColor: "var(--service-electricity-bg)",
  },
  {
    id: "internet",
    icon: Wifi,
    title: "Internet",
    description: "Buy internet plans",
    action: "Buy Internet",
    color: "var(--service-internet)",
    bgColor: "var(--service-internet-bg)",
  },
  {
    id: "tv",
    icon: Tv,
    title: "TV",
    description: "Renew TV subscriptions",
    action: "Renew TV",
    color: "var(--service-tv)",
    bgColor: "var(--service-tv-bg)",
  },
  {
    id: "ai",
    icon: Sparkles,
    title: "AI",
    description: "Access AI chat",
    action: "Open AI Chat",
    color: "var(--service-ai)",
    bgColor: "var(--service-ai-bg)",
  },
]

export function ServicesSection() {
  const scrollToHero = (serviceId: string) => {
    // Find hero section and scroll to it, then we could pre-select the service
    const heroSection = document.querySelector('section')
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="services" className="py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Top up, pay bills, and stay connected
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Top up, pay, and stay connected with the services you use most
          </p>
        </div>

        {/* Services Grid - matching the reference image exactly */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="group flex flex-col items-center rounded-xl border border-border bg-card p-4 md:p-5 transition-all hover:border-[color:var(--service-color)] hover:shadow-sm"
              style={{ '--service-color': service.color } as React.CSSProperties}
            >
              {/* Icon with colored background */}
              <div 
                className="mb-3 flex h-14 w-14 items-center justify-center rounded-full"
                style={{ backgroundColor: service.bgColor }}
              >
                <service.icon 
                  className="h-6 w-6" 
                  style={{ color: service.color }}
                />
              </div>
              
              <h3 className="text-base font-semibold text-foreground">{service.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground text-center">{service.description}</p>
              
              {/* Action Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollToHero(service.id)}
                className="mt-3 w-full font-medium"
                style={{ 
                  backgroundColor: service.bgColor,
                  color: service.color,
                }}
              >
                {service.action}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
