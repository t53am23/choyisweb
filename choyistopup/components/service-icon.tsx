import type { SVGProps } from "react"

export type ServiceIconName = "airtime" | "data" | "electricity" | "internet" | "tv" | "education" | "international"

export function ServiceIcon({ name, ...props }: SVGProps<SVGSVGElement> & { name: ServiceIconName }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      {name === "airtime" && <g {...common}><rect x="9" y="4" width="14" height="24" rx="3"/><path d="M13 8h6M14 24h4"/><path d="m20.5 11.5 2-2m-11 11-2 2" opacity=".45"/></g>}
      {name === "data" && <g {...common}><circle cx="16" cy="16" r="11"/><path d="M5 16h22M16 5c3.2 3 4.8 6.7 4.8 11S19.2 24 16 27M16 5c-3.2 3-4.8 6.7-4.8 11S12.8 24 16 27"/></g>}
      {name === "electricity" && <g {...common}><path d="M18.7 3 8 18h7l-1.7 11L24 14h-7l1.7-11Z"/><path d="M5 25h4" opacity=".45"/></g>}
      {name === "internet" && <g {...common}><path d="M4.5 12.5a17 17 0 0 1 23 0M8.5 17a11 11 0 0 1 15 0M12.5 21.5a5 5 0 0 1 7 0"/><circle cx="16" cy="26" r="1.4" fill="currentColor" stroke="none"/></g>}
      {name === "tv" && <g {...common}><rect x="4" y="9" width="24" height="17" rx="3"/><path d="m11 4 5 5 5-5M9 21h9M23 15h.01M23 20h.01"/></g>}
      {name === "education" && <g {...common}><path d="m3 12 13-6 13 6-13 6-13-6Z"/><path d="M8 15v7c4.5 3 11.5 3 16 0v-7M29 12v8"/></g>}
      {name === "international" && <g {...common}><circle cx="16" cy="16" r="11"/><path d="M5 16h22M16 5c3.4 3.2 5 7 5 11s-1.6 7.8-5 11M16 5c-3.4 3.2-5 7-5 11s1.6 7.8 5 11"/><path d="m23.5 6.5 2-2m0 0h-4m4 0v4" strokeWidth="2.2"/></g>}
    </svg>
  )
}
