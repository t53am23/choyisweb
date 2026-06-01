import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="lg:pl-64 pt-14 lg:pt-0">
        <div className="px-4 py-6 lg:px-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
