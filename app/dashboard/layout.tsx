import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { SidebarToggleButton, SidebarKeyboardShortcut } from "@/components/ui/sidebar-keyboard-shortcut"
import { cookies } from "next/headers"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value !== "false"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <SidebarToggleButton />
        <SidebarKeyboardShortcut />
        <main className="flex-1 w-full bg-background">{children}</main>
      </div>
    </SidebarProvider>
  )
}
