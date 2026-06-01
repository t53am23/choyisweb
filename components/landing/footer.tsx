import Link from "next/link"
import { Twitter, Linkedin, Instagram, Facebook, MessageCircle } from "lucide-react"

const footerLinks = {
  product: [
    { label: "Services", href: "#services" },
    { label: "AI Chat", href: "#ai" },
    { label: "Teams", href: "#teams" },
    { label: "Pricing", href: "#pricing" },
    { label: "Referrals", href: "/referrals" },
  ],
  support: [
    { label: "Help Center", href: "/support" },
    { label: "Contact Us", href: "/support" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "System Status", href: "#" },
  ],
  legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Refund Policy", href: "/refund" },
  ],
}

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: MessageCircle, href: "#", label: "WhatsApp" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="4" className="fill-primary" />
                <circle cx="24" cy="8" r="4" className="fill-primary/60" />
                <circle cx="8" cy="24" r="4" className="fill-primary/60" />
                <circle cx="24" cy="24" r="4" className="fill-primary/40" />
              </svg>
              <span className="text-lg font-semibold text-foreground">Choyis TopUp</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Pay bills, buy data, and access powerful AI from one account
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Need help with a transaction? Contact us at{" "}
              <a href="mailto:info@choyis.com" className="text-primary hover:underline">
                info@choyis.com
              </a>
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Product</h4>
            <ul className="space-y-1.5">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Support</h4>
            <ul className="space-y-1.5">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Legal</h4>
            <ul className="space-y-1.5">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-6 pt-5 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">Connect</span>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4 text-muted-foreground" />
                </a>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Choyis TopUp. All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
