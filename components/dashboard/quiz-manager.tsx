"use client"

import { useState } from "react"
import { PlusCircle, Trash, Play, Search, Sparkles, AlertCircle } from "lucide-react"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

type Quiz = {
  id: string
  title: string
  description: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  questions: number
  created: Date
}

const dummyQuizzes: Quiz[] = [
  {
    id: "1",
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics",
    category: "JavaScript",
    difficulty: "beginner",
    questions: 10,
    created: new Date(2023, 8, 15),
  },
  {
    id: "2",
    title: "React Hooks Deep Dive",
    description: "Advanced questions about React hooks",
    category: "React",
    difficulty: "advanced",
    questions: 8,
    created: new Date(2023, 9, 2),
  },
  {
    id: "3",
    title: "CSS Grid & Flexbox",
    description: "Layout challenges with CSS Grid and Flexbox",
    category: "CSS",
    difficulty: "intermediate",
    questions: 12,
    created: new Date(2023, 7, 20),
  },
  {
    id: "4",
    title: "TypeScript Types & Interfaces",
    description: "Understanding TypeScript's type system",
    category: "TypeScript",
    difficulty: "intermediate",
    questions: 15,
    created: new Date(2023, 10, 5),
  },
  {
    id: "5",
    title: "Node.js Basics",
    description: "Fundamentals of Node.js development",
    category: "Node.js",
    difficulty: "beginner",
    questions: 10,
    created: new Date(2023, 6, 12),
  },
]

export function QuizManager() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(dummyQuizzes)
  const [searchTerm, setSearchTerm] = useState("")
  const [generatingQuiz, setGeneratingQuiz] = useState(false)
  const [generationTopic, setGenerationTopic] = useState("")
  const [generationCode, setGenerationCode] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const deleteQuiz = (id: string) => {
    setQuizzes(quizzes.filter((quiz) => quiz.id !== id))
  }

  const handleGenerateQuiz = () => {
    setGeneratingQuiz(true)

    // Simulate AI generating a quiz
    setTimeout(() => {
      const newQuiz: Quiz = {
        id: Date.now().toString(),
        title: generationTopic ? `${generationTopic} Quiz` : "Coding Patterns Quiz",
        description: `AI-generated quiz on ${generationTopic || "coding patterns"}`,
        category: generationTopic ? generationTopic : "Programming",
        difficulty: "intermediate",
        questions: Math.floor(Math.random() * 10) + 5,
        created: new Date(),
      }

      setQuizzes([newQuiz, ...quizzes])
      setGeneratingQuiz(false)
      setGenerationTopic("")
      setGenerationCode("")
      setDialogOpen(false)
    }, 2000)
  }

  return (
    <Tabs defaultValue="my-quizzes">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="my-quizzes">My Quizzes</TabsTrigger>
        <TabsTrigger value="generate">Generate Quiz</TabsTrigger>
      </TabsList>

      <TabsContent value="my-quizzes" className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search quizzes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Quiz
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Quiz</DialogTitle>
                <DialogDescription>Add the details for your new quiz</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Quiz title" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Quiz description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" placeholder="e.g. JavaScript" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select defaultValue="intermediate">
                      <SelectTrigger id="difficulty">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button>Save Quiz</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuizzes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <AlertCircle className="h-8 w-8 mb-2" />
                      <p>No quizzes found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredQuizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{quiz.title}</div>
                        <div className="text-sm text-muted-foreground">{quiz.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>{quiz.category}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          quiz.difficulty === "beginner"
                            ? "secondary"
                            : quiz.difficulty === "intermediate"
                              ? "default"
                              : "destructive"
                        }
                      >
                        {quiz.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>{quiz.questions}</TableCell>
                    <TableCell>{quiz.created.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="icon" variant="ghost" asChild>
                          <Link href={`/quizzes/play/${quiz.id}`}>
                            <Play className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteQuiz(quiz.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <TabsContent value="generate" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Quiz with AI</CardTitle>
            <CardDescription>
              Create a new quiz by providing a topic or code snippet for the AI to analyze
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="e.g. React Hooks, JavaScript Promises, CSS Grid..."
                value={generationTopic}
                onChange={(e) => setGenerationTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code-input">Or paste code for analysis</Label>
              <Textarea
                id="code-input"
                placeholder="// Paste code here to generate a quiz about the concepts used"
                className="font-mono min-h-[200px]"
                value={generationCode}
                onChange={(e) => setGenerationCode(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select defaultValue="intermediate">
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="questions">Number of Questions</Label>
              <Select defaultValue="10">
                <SelectTrigger id="questions">
                  <SelectValue placeholder="Select number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Questions</SelectItem>
                  <SelectItem value="10">10 Questions</SelectItem>
                  <SelectItem value="15">15 Questions</SelectItem>
                  <SelectItem value="20">20 Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleGenerateQuiz}
              disabled={generatingQuiz || (!generationTopic && !generationCode)}
              className="w-full"
            >
              {generatingQuiz ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Generating Quiz...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Quiz
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quiz Generation Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Be specific with your topic to get more targeted questions</li>
              <li>For code-based quizzes, include enough code to demonstrate concepts</li>
              <li>Mix difficulty levels for a more comprehensive learning experience</li>
              <li>Generated quizzes can be edited after creation</li>
              <li>You can combine a topic and code for context-aware questions</li>
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

