import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "chat",
      title: "AI Chat Session",
      description: "Asked about React hooks optimization",
      time: "2 hours ago",
      icon: "AI",
    },
    {
      id: 2,
      type: "quiz",
      title: "Completed Quiz",
      description: "JavaScript Promises - Score: 8/10",
      time: "Yesterday",
      icon: "Q",
    },
    {
      id: 3,
      type: "roadmap",
      title: "Roadmap Updated",
      description: "Added new milestone to Backend Development path",
      time: "2 days ago",
      icon: "R",
    },
    {
      id: 4,
      type: "snippet",
      title: "New Snippet Created",
      description: "React custom hook for form validation",
      time: "3 days ago",
      icon: "S",
    },
    {
      id: 5,
      type: "editor",
      title: "Code Execution",
      description: "Ran TypeScript algorithm solution",
      time: "4 days ago",
      icon: "C",
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center space-x-4">
          <Avatar>
            <AvatarFallback className="bg-primary/10 text-primary">{activity.icon}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium">{activity.title}</p>
            <p className="text-sm text-muted-foreground">{activity.description}</p>
          </div>
          <div className="ml-auto text-xs text-muted-foreground">{activity.time}</div>
        </div>
      ))}
    </div>
  )
}

