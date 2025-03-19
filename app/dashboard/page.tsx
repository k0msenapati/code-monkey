"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSnippetStore } from "@/store/snippetStore"
import { useRoadmapStore } from "@/store/roadmapStore"
import { useChatStore } from "@/store/chatStore"
import { useEffect, useState } from "react"
import { CircleOff, Code2, FileCode2, GitPullRequest, LucideIcon, MessageSquare, PlusCircle, Terminal, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

interface ActivityItem {
  id: string
  title: string
  description: string
  timestamp: Date
  type: "snippet" | "roadmap" | "chat"
  icon: LucideIcon
}

interface DashboardMetric {
  title: string
  value: number | string
  description: string
  icon: LucideIcon
  color: string
}

export default function DashboardPage() {
  const snippets = useSnippetStore((state) => state.snippets)
  const roadmaps = useRoadmapStore((state) => state.roadmaps || [])
  const chatSessions = useChatStore((state) => state.sessions || [])
  
  const [isLoading, setIsLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  
  const metrics: DashboardMetric[] = [
    {
      title: "Code Snippets",
      value: snippets.length,
      description: "Total saved snippets",
      icon: Code2,
      color: "bg-blue-500"
    },
    {
      title: "Learning Roadmaps",
      value: roadmaps.length,
      description: "Personal learning paths",
      icon: GitPullRequest,
      color: "bg-purple-500"
    },
    {
      title: "Chat Sessions",
      value: chatSessions.length,
      description: "AI conversations",
      icon: MessageSquare,
      color: "bg-green-500"
    }
  ]
  
  useEffect(() => {
    const getRecentActivity = () => {
      setIsLoading(true)
      
      const snippetActivities = snippets.map(snippet => ({
        id: snippet.id,
        title: snippet.title,
        description: `Code snippet - ${snippet.language}`,
        timestamp: snippet.created,
        type: "snippet" as const,
        icon: FileCode2
      }))
      
      const roadmapActivities = roadmaps.map(roadmap => ({
        id: roadmap.id,
        title: roadmap.title,
        description: `Learning roadmap`,
        timestamp: new Date(roadmap.created || Date.now()),
        type: "roadmap" as const,
        icon: GitPullRequest
      }))
      
      const chatActivities = chatSessions.map(session => ({
        id: session.id,
        title: session.title || "Chat Session",
        description: `Chat conversation`,
        timestamp: new Date(session.createdAt || Date.now()),
        type: "chat" as const,
        icon: MessageSquare
      }))
      
      const allActivities = [...snippetActivities, ...roadmapActivities, ...chatActivities]
        .sort((a, b) => {
          const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
          const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
          return timeB - timeA;
        })
        .slice(0, 5)
      
      setRecentActivity(allActivities)
      setIsLoading(false)
    }
    
    getRecentActivity()
  }, [snippets, roadmaps, chatSessions])
  
  const quickActions = [
    {
      title: "New Code Snippet",
      icon: PlusCircle,
      description: "Create a new snippet",
      href: "/snippets/new",
      color: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      title: "Generate Roadmap",
      icon: GitPullRequest,
      description: "Create a learning path",
      href: "/roadmaps/new",
      color: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    {
      title: "New Chat",
      icon: MessageSquare,
      description: "Start an AI conversation",
      href: "/chat",
      color: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      title: "Run Code",
      icon: Terminal,
      description: "Execute code snippets",
      href: "/snippets",
      color: "bg-gradient-to-br from-amber-500 to-amber-600"
    }
  ]
  
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome to CodeMonkey</h1>
          <p className="text-muted-foreground">Your coding companion dashboard</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {metrics.map((metric, i) => (
          <Card key={i} className="overflow-hidden border-none shadow-md">
            <div className="flex">
              <div className={`${metric.color} p-4 flex items-center justify-center`}>
                <metric.icon className="h-8 w-8 text-white" />
              </div>
              <CardContent className="p-4 flex-1">
                <div className="font-semibold text-sm text-muted-foreground mb-1">{metric.title}</div>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="text-xs text-muted-foreground">{metric.description}</div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-8 md:grid-cols-7">
        <Card className="md:col-span-4 border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest interactions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((item) => (
                  <Link 
                    href={`/${item.type}s/${item.id}`} 
                    key={`${item.type}-${item.id}`}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className={`p-2 rounded-full bg-${
                      item.type === "snippet" ? "blue" : 
                      item.type === "roadmap" ? "purple" : 
                      "green"
                    }-100`}>
                      <item.icon className={`h-5 w-5 text-${
                        item.type === "snippet" ? "blue" : 
                        item.type === "roadmap" ? "purple" : 
                        "green"
                      }-500`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium line-clamp-1">{item.title}</div>
                      <div className="text-sm text-muted-foreground flex justify-between">
                        <span>{item.description}</span>
                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CircleOff className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg">No recent activity</h3>
                <p className="text-muted-foreground">Start creating snippets, roadmaps, or chat with AI</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3 border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {quickActions.map((action, i) => (
                <Link 
                  href={action.href} 
                  key={i} 
                  className="block"
                >
                  <div className={`${action.color} text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all`}>
                    <div className="flex items-center">
                      <action.icon className="h-8 w-8 mr-3" />
                      <div>
                        <h3 className="font-bold text-lg">{action.title}</h3>
                        <p className="text-sm opacity-90">{action.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {roadmaps.length > 0 && (
        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Your Learning Progress</CardTitle>
            <CardDescription>Track your roadmap progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roadmaps.slice(0, 3).map((roadmap) => {
                const completedSteps = roadmap.steps?.filter(step => step.completed)?.length || 0;
                const totalSteps = roadmap.steps?.length || 1;
                const progress = (completedSteps / totalSteps) * 100;
                
                return (
                  <div key={roadmap.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{roadmap.title}</span>
                      <span className="text-sm text-muted-foreground">{completedSteps} of {totalSteps} steps</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

