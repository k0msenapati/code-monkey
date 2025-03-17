"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Code2,
  Home,
  MessageSquare,
  Map,
  BrainCircuit,
  FileCode,
  Settings,
  BookOpen,
  User,
  LogOut,
  Bell,
  CreditCard,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeSwitch } from "@/components/theme-switch"

export function DashboardSidebar() {
  const pathname = usePathname()

  const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: Home },
    { title: "AI Chat", href: "/dashboard/chat", icon: MessageSquare },
    { title: "Quizzes", href: "/dashboard/quizzes", icon: BookOpen },
    { title: "Roadmaps", href: "/dashboard/roadmaps", icon: Map },
    { title: "Code Editor", href: "/dashboard/editor", icon: Code2 },
    { title: "Snippets", href: "/dashboard/snippets", icon: FileCode },
  ]

  return (
    <Sidebar variant="floating">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-center w-full">
              <BrainCircuit className="h-6 w-6 text-primary" />
              <span className="ml-2 text-xl font-bold text-primary">CodeMonkey</span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                      <AvatarFallback>CM</AvatarFallback>
                    </Avatar>
                    <span>John Doe</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

