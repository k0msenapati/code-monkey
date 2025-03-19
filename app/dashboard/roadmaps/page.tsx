"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PlusCircle, BookOpen, ArrowRight, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRoadmapStore } from "@/store/roadmapStore"

export default function RoadmapsPage() {
  const { roadmaps, setActiveRoadmap } = useRoadmapStore()
  const router = useRouter()
  
  useEffect(() => {
    setActiveRoadmap(null)
  }, [setActiveRoadmap])

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Learning Roadmaps</h1>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/dashboard/roadmaps/create" className="flex items-center justify-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            <span className="whitespace-nowrap">Create Roadmap</span>
          </Link>
        </Button>
      </div>

      {roadmaps.length === 0 ? (
        <Card className="mb-6">
          <CardContent className="flex flex-col items-center justify-center p-6 sm:p-10">
            <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg sm:text-xl font-medium mb-2 text-center">No roadmaps yet</h3>
            <p className="text-muted-foreground text-center mb-6 text-sm sm:text-base">
              Create your first learning roadmap to organize your educational journey
            </p>
            <Button asChild>
              <Link href="/dashboard/roadmaps/create" className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Roadmap
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {roadmaps.map((roadmap) => (
            <Card key={roadmap.id} className="overflow-hidden flex flex-col h-full">
              <CardHeader className="pb-2 space-y-1">
                <div className="flex flex-col xs:flex-row justify-between gap-2 items-start xs:items-center mb-1">
                  <Badge className="whitespace-nowrap">{roadmap.category}</Badge>
                  <span className="text-xs text-muted-foreground truncate">
                    Created: {formatDate(roadmap.created)}
                  </span>
                </div>
                <CardTitle className="line-clamp-1 text-lg">{roadmap.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-sm">
                  {roadmap.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2 flex-1">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{roadmap.progress}%</span>
                  </div>
                  <Progress value={roadmap.progress} className="h-1" />
                </div>
                <div className="mt-4">
                  <div className="text-xs text-muted-foreground mb-2">Learning Path</div>
                  <ul className="space-y-1">
                    {roadmap.steps.slice(0, 3).map((step, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <div className={`min-w-2 w-2 h-2 rounded-full mr-2 ${step.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                        <span className="line-clamp-1">{step.title}</span>
                      </li>
                    ))}
                    {roadmap.steps.length > 3 && (
                      <li className="text-xs text-muted-foreground pl-4">
                        +{roadmap.steps.length - 3} more steps
                      </li>
                    )}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="pt-2 mt-auto">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/dashboard/roadmaps/${roadmap.id}`} className="flex items-center justify-center">
                    <span>View Roadmap</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

