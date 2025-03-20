"use client"

import { useState } from "react"
import { PlusCircle, Search, AlertCircle, Sparkles, Target, Clock, BookOpen, MapPin, ChevronRight, Edit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useFeatureFlags } from "@/providers/FeatureFlagProvider"
import { Badge } from "../ui/badge"
import Link from "next/link"

type Roadmap = {
  id: string
  title: string
  description: string
  category: string
  steps: RoadmapStep[]
  progress: number
  created: Date
}

type RoadmapStep = {
  id: string
  title: string
  description: string
  resources: { title: string; url: string }[]
  completed: boolean
}

const dummyRoadmaps: Roadmap[] = [
  {
    id: "1",
    title: "Full Stack Web Development",
    description: "Journey from beginner to full stack developer",
    category: "Web Development",
    progress: 65,
    created: new Date(2023, 7, 10),
    steps: [
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
    ],
  },
  {
    id: "2",
    title: "Machine Learning Fundamentals",
    description: "Introduction to ML concepts and tools",
    category: "Data Science",
    progress: 30,
    created: new Date(2023, 9, 5),
    steps: [
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
  },
  {
    id: "3",
    title: "Mobile App Development",
    description: "Building cross-platform mobile applications",
    category: "Mobile",
    progress: 15,
    created: new Date(2023, 10, 1),
    steps: [
      {
        id: "3-1",
        title: "React Native Basics",
        description: "Getting started with React Native",
        resources: [
          { title: "React Native Documentation", url: "#" },
          { title: "React Native Express", url: "#" },
        ],
        completed: true,
      },
      {
        id: "3-2",
        title: "State Management",
        description: "Managing application state effectively",
        resources: [
          { title: "Redux Documentation", url: "#" },
          { title: "Context API Tutorial", url: "#" },
        ],
        completed: false,
      },
      {
        id: "3-3",
        title: "Native Modules",
        description: "Working with device features and APIs",
        resources: [
          { title: "Native Modules Guide", url: "#" },
          { title: "Camera and Location APIs", url: "#" },
        ],
        completed: false,
      },
    ],
  },
]

export function RoadmapManager() {
  const { generateRoadmap } = useFeatureFlags()
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>(dummyRoadmaps)
  const [searchTerm, setSearchTerm] = useState("")
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false)
  const [goalInput, setGoalInput] = useState("")
  const [timeframeInput, setTimeframeInput] = useState("")
  const [priorKnowledgeInput, setPriorKnowledgeInput] = useState("")

  const filteredRoadmaps = roadmaps.filter(
    (roadmap) =>
      roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roadmap.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roadmap.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const deleteRoadmap = (id: string) => {
    setRoadmaps(roadmaps.filter((roadmap) => roadmap.id !== id))
  }

  const toggleStepCompletion = (roadmapId: string, stepId: string) => {
    setRoadmaps(
      roadmaps.map((roadmap) => {
        if (roadmap.id === roadmapId) {
          const updatedSteps = roadmap.steps.map((step) => {
            if (step.id === stepId) {
              return { ...step, completed: !step.completed }
            }
            return step
          })

          const completedSteps = updatedSteps.filter((step) => step.completed).length
          const progress = Math.round((completedSteps / updatedSteps.length) * 100)

          return { ...roadmap, steps: updatedSteps, progress }
        }
        return roadmap
      }),
    )
  }

  const handleGenerateRoadmap = () => {
    if (!goalInput) return

    setGeneratingRoadmap(true)

    setTimeout(() => {
      const newRoadmap: Roadmap = {
        id: Date.now().toString(),
        title: `${goalInput} Roadmap`,
        description: `AI-generated learning path for ${goalInput}`,
        category: goalInput.split(" ")[0] || "Technology",
        progress: 0,
        created: new Date(),
        steps: [
          {
            id: `new-1`,
            title: `${goalInput} Fundamentals`,
            description: "Master the core concepts and principles",
            resources: [
              { title: "Beginner's Guide", url: "#" },
              { title: "Interactive Tutorial", url: "#" },
            ],
            completed: false,
          },
          {
            id: `new-2`,
            title: "Intermediate Techniques",
            description: "Build on your foundation with more advanced topics",
            resources: [
              { title: "Comprehensive Course", url: "#" },
              { title: "Practice Projects", url: "#" },
            ],
            completed: false,
          },
          {
            id: `new-3`,
            title: "Advanced Applications",
            description: "Apply your knowledge in real-world scenarios",
            resources: [
              { title: "Case Studies", url: "#" },
              { title: "Expert Insights", url: "#" },
            ],
            completed: false,
          },
        ],
      }

      setRoadmaps([newRoadmap, ...roadmaps])
      setGeneratingRoadmap(false)
      setGoalInput("")
      setTimeframeInput("")
      setPriorKnowledgeInput("")
    }, 2500)
  }

  return (
    <Tabs defaultValue="my-roadmaps">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="my-roadmaps">My Roadmaps</TabsTrigger>
        {generateRoadmap && (
          <TabsTrigger value="generate">Generate Roadmap</TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="my-roadmaps" className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roadmaps..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Roadmap
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create New Roadmap</DialogTitle>
                <DialogDescription>Define your learning path and track your progress</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="roadmap-title">Title</Label>
                  <Input id="roadmap-title" placeholder="Roadmap title" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="roadmap-description">Description</Label>
                  <Textarea id="roadmap-description" placeholder="Describe your learning goal" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="roadmap-category">Category</Label>
                  <Input id="roadmap-category" placeholder="e.g. Web Development" />
                </div>
              </div>
              <DialogFooter>
                <Button>Create Roadmap</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {filteredRoadmaps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 border rounded-lg">
            <AlertCircle className="h-10 w-10 mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">No roadmaps found</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredRoadmaps.map((roadmap) => (
              <Card key={roadmap.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{roadmap.title}</CardTitle>
                      <CardDescription className="mt-1">{roadmap.description}</CardDescription>
                    </div>
                    <Badge>{roadmap.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm">{roadmap.progress}%</span>
                  </div>
                  <Progress value={roadmap.progress} className="h-2" />

                  <div className="mt-4">
                    <Button asChild className="w-full">
                      <Link href={`/roadmaps/${roadmap.id}`}>View Roadmap</Link>
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="pt-1">
                  <div className="flex justify-between w-full">
                    <p className="text-xs text-muted-foreground">Created: {roadmap.created.toLocaleDateString()}</p>
                    <div className="flex space-x-2">
                      <Button size="icon" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => deleteRoadmap(roadmap.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      {generateRoadmap && (
        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Learning Roadmap with AI</CardTitle>
              <CardDescription>Let AI create a personalized learning path based on your goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-primary" />
                  <Label htmlFor="goal">What do you want to learn?</Label>
                </div>
                <Textarea
                  id="goal"
                  placeholder="E.g., 'Master React development' or 'Learn cloud computing with AWS'"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <Label htmlFor="timeframe">Timeframe (optional)</Label>
                </div>
                <Input
                  id="timeframe"
                  placeholder="E.g., '3 months' or 'By end of year'"
                  value={timeframeInput}
                  onChange={(e) => setTimeframeInput(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <Label htmlFor="prior-knowledge">Prior Knowledge (optional)</Label>
                </div>
                <Textarea
                  id="prior-knowledge"
                  placeholder="What do you already know about this topic?"
                  value={priorKnowledgeInput}
                  onChange={(e) => setPriorKnowledgeInput(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleGenerateRoadmap} disabled={generatingRoadmap || !goalInput} className="w-full">
                {generatingRoadmap ? (
                  <>
                    Generating Roadmap...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Roadmap
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Roadmap Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center p-3 rounded-md border hover:bg-secondary/50 cursor-pointer transition-colors">
                <MapPin className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="font-medium">Frontend Development Mastery</p>
                  <p className="text-sm text-muted-foreground">From basics to advanced React techniques</p>
                </div>
                <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </div>

              <div className="flex items-center p-3 rounded-md border hover:bg-secondary/50 cursor-pointer transition-colors">
                <MapPin className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="font-medium">Python Data Science</p>
                  <p className="text-sm text-muted-foreground">Journey from programming to ML models</p>
                </div>
                <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </div>

              <div className="flex items-center p-3 rounded-md border hover:bg-secondary/50 cursor-pointer transition-colors">
                <MapPin className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="font-medium">DevOps Engineering</p>
                  <p className="text-sm text-muted-foreground">Build, test, and deploy applications at scale</p>
                </div>
                <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      )}
    </Tabs>
  )
}

