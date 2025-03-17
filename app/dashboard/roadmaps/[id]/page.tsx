"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, BookOpen, Clock, Target, LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

type RoadmapStep = {
  id: string
  title: string
  description: string
  resources: { title: string; url: string }[]
  completed: boolean
}

type Roadmap = {
  id: string
  title: string
  description: string
  category: string
  steps: RoadmapStep[]
  progress: number
  created: Date
}

// Mock roadmap data
const getMockRoadmap = (id: string): Roadmap => {
  return {
    id,
    title: id === "1" ? "Full Stack Web Development" : "Machine Learning Fundamentals",
    description: id === "1" ? "Journey from beginner to full stack developer" : "Introduction to ML concepts and tools",
    category: id === "1" ? "Web Development" : "Data Science",
    progress: id === "1" ? 65 : 30,
    created: new Date(2023, id === "1" ? 7 : 9, id === "1" ? 10 : 5),
    steps:
      id === "1"
        ? [
            {
              id: "1-1",
              title: "HTML & CSS Fundamentals",
              description: "Master the building blocks of the web",
              resources: [
                { title: "MDN Web Docs - HTML", url: "#" },
                { title: "CSS Tricks", url: "#" },
              ],
              completed: true,
            },
            {
              id: "1-2",
              title: "JavaScript Basics",
              description: "Learn core JavaScript concepts and DOM manipulation",
              resources: [
                { title: "JavaScript.info", url: "#" },
                { title: "Eloquent JavaScript", url: "#" },
              ],
              completed: true,
            },
            {
              id: "1-3",
              title: "Frontend Frameworks",
              description: "Build interactive UIs with React",
              resources: [
                { title: "React Documentation", url: "#" },
                { title: "React Hooks Tutorial", url: "#" },
              ],
              completed: true,
            },
            {
              id: "1-4",
              title: "Backend Development",
              description: "Server-side programming with Node.js",
              resources: [
                { title: "Node.js Documentation", url: "#" },
                { title: "Express.js Guide", url: "#" },
              ],
              completed: false,
            },
            {
              id: "1-5",
              title: "Databases",
              description: "Working with SQL and NoSQL databases",
              resources: [
                { title: "MongoDB University", url: "#" },
                { title: "PostgreSQL Tutorial", url: "#" },
              ],
              completed: false,
            },
          ]
        : [
            {
              id: "2-1",
              title: "Python for Data Science",
              description: "Learn Python basics for data analysis",
              resources: [
                { title: "Python Data Science Handbook", url: "#" },
                { title: "Pandas Documentation", url: "#" },
              ],
              completed: true,
            },
            {
              id: "2-2",
              title: "Mathematics for ML",
              description: "Essential math concepts for machine learning",
              resources: [
                { title: "Linear Algebra Review", url: "#" },
                { title: "Statistics and Probability", url: "#" },
              ],
              completed: false,
            },
            {
              id: "2-3",
              title: "ML Algorithms",
              description: "Understanding core ML algorithms",
              resources: [
                { title: "Scikit-learn Tutorials", url: "#" },
                { title: "Machine Learning Crash Course", url: "#" },
              ],
              completed: false,
            },
          ],
  }
}

export default function RoadmapDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)

  useEffect(() => {
    // In a real app, you would fetch the roadmap data from an API
    const roadmapData = getMockRoadmap(params.id)
    setRoadmap(roadmapData)
  }, [params.id])

  const toggleStepCompletion = (stepId: string) => {
    if (!roadmap) return

    const updatedSteps = roadmap.steps.map((step) => {
      if (step.id === stepId) {
        return { ...step, completed: !step.completed }
      }
      return step
    })

    const completedSteps = updatedSteps.filter((step) => step.completed).length
    const progress = Math.round((completedSteps / updatedSteps.length) * 100)

    setRoadmap({ ...roadmap, steps: updatedSteps, progress })
  }

  if (!roadmap) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/roadmaps">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Roadmaps
        </Link>
      </Button>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold">{roadmap.title}</h1>
            <p className="text-muted-foreground mt-1">{roadmap.description}</p>
          </div>
          <Badge>{roadmap.category}</Badge>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle>Progress Overview</CardTitle>
            <CardDescription>Track your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm">{roadmap.progress}%</span>
            </div>
            <Progress value={roadmap.progress} className="h-2 mb-4" />

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <Target className="h-8 w-8 text-primary mb-2" />
                <span className="text-lg font-bold">{roadmap.steps.length}</span>
                <span className="text-sm text-muted-foreground">Total Steps</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <Check className="h-8 w-8 text-green-500 mb-2" />
                <span className="text-lg font-bold">{roadmap.steps.filter((step) => step.completed).length}</span>
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <Clock className="h-8 w-8 text-orange-500 mb-2" />
                <span className="text-lg font-bold">
                  {roadmap.steps.length - roadmap.steps.filter((step) => step.completed).length}
                </span>
                <span className="text-sm text-muted-foreground">Remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Learning Path</h2>
          {roadmap.steps.map((step, index) => (
            <Card key={step.id} className={step.completed ? "border-green-500" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <Button
                      size="sm"
                      variant={step.completed ? "default" : "outline"}
                      className="h-6 w-6 rounded-full p-0 mr-3 mt-1"
                      onClick={() => toggleStepCompletion(step.id)}
                    >
                      {step.completed && <Check className="h-3 w-3" />}
                    </Button>
                    <div>
                      <CardTitle className="text-base">
                        {index + 1}. {step.title}
                      </CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={step.completed ? "default" : "outline"}>
                    {step.completed ? "Completed" : "In Progress"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-primary" />
                    <h4 className="text-sm font-medium">Learning Resources</h4>
                  </div>
                  <ul className="space-y-2 pl-6">
                    {step.resources.map((resource, i) => (
                      <li key={i} className="flex items-center">
                        <LinkIcon className="h-3 w-3 mr-2 text-muted-foreground" />
                        <a href={resource.url} className="text-sm text-primary hover:underline">
                          {resource.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

