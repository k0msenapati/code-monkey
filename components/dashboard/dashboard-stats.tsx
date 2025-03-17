import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, BookOpen, Map, Code, FileCode } from "lucide-react"

export function DashboardStats() {
  const stats = [
    {
      title: "AI Chat Messages",
      value: "128",
      icon: MessageSquare,
      description: "Past 30 days",
    },
    {
      title: "Quizzes Created",
      value: "14",
      icon: BookOpen,
      description: "Total quizzes",
    },
    {
      title: "Learning Roadmaps",
      value: "5",
      icon: Map,
      description: "Active roadmaps",
    },
    {
      title: "Code Snippets",
      value: "42",
      icon: FileCode,
      description: "Saved snippets",
    },
    {
      title: "Coding Sessions",
      value: "23",
      icon: Code,
      description: "This month",
    },
  ]

  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

