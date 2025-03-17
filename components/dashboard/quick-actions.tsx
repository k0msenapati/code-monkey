import { Button } from "@/components/ui/button"
import { MessageSquare, BookOpen, Map, Code, FileCode } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "Start AI Chat",
      icon: MessageSquare,
      href: "/chat",
      variant: "default" as const,
    },
    {
      title: "Create New Quiz",
      icon: BookOpen,
      href: "/quizzes/new",
      variant: "outline" as const,
    },
    {
      title: "Generate Roadmap",
      icon: Map,
      href: "/roadmaps/new",
      variant: "outline" as const,
    },
    {
      title: "Open Code Editor",
      icon: Code,
      href: "/editor",
      variant: "outline" as const,
    },
    {
      title: "Add Code Snippet",
      icon: FileCode,
      href: "/snippets/new",
      variant: "outline" as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {actions.map((action) => (
        <Button key={action.title} variant={action.variant} className="justify-start h-auto py-3" asChild>
          <Link href={action.href}>
            <action.icon className="h-4 w-4 mr-2" />
            {action.title}
          </Link>
        </Button>
      ))}
    </div>
  )
}

