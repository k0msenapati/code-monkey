"use client"

import { useState } from "react"
import { PlusCircle, Trash, Play, Search, Sparkles, AlertCircle, Edit, Eye, Clock, FileDown, Check, ArrowLeft, ArrowRight } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQuizStore, Quiz, Question } from "@/store/quizStore"
import { generateQuizWithAI } from "@/lib/quiz-generation"

export function QuizManager() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("my-quizzes")
  const [generatingQuiz, setGeneratingQuiz] = useState(false)
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false)
  const [isImportQuizOpen, setIsImportQuizOpen] = useState(false)
  const [isExampleQuizOpen, setIsExampleQuizOpen] = useState(false)
  const [viewingQuiz, setViewingQuiz] = useState<Quiz | null>(null)
  const [previewQuestion, setPreviewQuestion] = useState<number>(0)
  
  const [generationTopic, setGenerationTopic] = useState("")
  const [generationCode, setGenerationCode] = useState("")
  const [generationDifficulty, setGenerationDifficulty] = useState("intermediate")
  const [generationQuestions, setGenerationQuestions] = useState("10")
  
  const [newQuiz, setNewQuiz] = useState<Partial<Quiz>>({
    title: "",
    description: "",
    category: "",
    difficulty: "intermediate",
    questions: []
  })
  
  const { quizzes, addQuiz, removeQuiz } = useQuizStore()

  const formatDate = (dateValue: Date | string) => {
    if (!dateValue) return 'Unknown date';
    
    if (typeof dateValue === 'string') {
      return new Date(dateValue).toLocaleDateString();
    }
    
    return dateValue.toLocaleDateString();
  };
  
  const filteredQuizzes = quizzes.filter((quiz) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      quiz.title.toLowerCase().includes(lowerSearch) ||
      quiz.description.toLowerCase().includes(lowerSearch) ||
      quiz.category.toLowerCase().includes(lowerSearch)
    );
  });

  const handleDeleteQuiz = (id: string) => {
    removeQuiz(id);
    
    if (viewingQuiz?.id === id) {
      setViewingQuiz(null);
    }
    
    toast({
      title: "Quiz deleted",
      description: "The quiz has been removed from your collection",
    });
  };
  
  const handleCreateQuiz = () => {
    if (!newQuiz.title || !newQuiz.questions || newQuiz.questions.length === 0) {
      toast({
        title: "Unable to create quiz",
        description: "Please provide a title and at least one question",
        variant: "destructive"
      });
      return;
    }
    
    const quiz: Quiz = {
      id: Date.now().toString(),
      title: newQuiz.title || "",
      description: newQuiz.description || "",
      category: newQuiz.category || "General",
      difficulty: (newQuiz.difficulty as "beginner" | "intermediate" | "advanced") || "intermediate",
      questions: newQuiz.questions || [],
      created: new Date()
    };
    
    addQuiz(quiz);
    setIsCreateQuizOpen(false);
    
    toast({
      title: "Quiz created",
      description: "Your new quiz has been created successfully",
    });
    
    setNewQuiz({
      title: "",
      description: "",
      category: "",
      difficulty: "intermediate",
      questions: []
    });
  };

  const handleGenerateQuiz = async () => {
    if (!generationTopic && !generationCode) {
      toast({
        title: "Missing information",
        description: "Please provide either a topic or code snippet for the quiz",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setGeneratingQuiz(true);
      
      toast({
        title: "Generating quiz",
        description: "This may take a moment...",
      });
      
      const quiz = await generateQuizWithAI(
        generationTopic,
        generationCode || null,
        generationDifficulty,
        parseInt(generationQuestions)
      );
      
      addQuiz(quiz);
      
      toast({
        title: "Quiz generated successfully",
        description: `Your quiz "${quiz.title}" is ready to play`,
      });
      
      setGenerationTopic("");
      setGenerationCode("");
      
      setActiveTab("my-quizzes");
      setViewingQuiz(quiz);
      
    } catch (error) {
      console.error("Quiz generation error:", error);
      toast({
        title: "Failed to generate quiz",
        description: (error as Error).message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setGeneratingQuiz(false);
    }
  };
  
  const handleExportQuiz = (quiz: Quiz) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quiz, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${quiz.title.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Quiz exported",
      description: "The quiz has been downloaded as a JSON file",
    });
  };
  
  const handleImportQuiz = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonQuiz = JSON.parse(event.target?.result as string);
        
        if (!jsonQuiz.title || !jsonQuiz.questions || !Array.isArray(jsonQuiz.questions)) {
          throw new Error("Invalid quiz format");
        }
        
        const quiz: Quiz = {
          id: Date.now().toString(),
          title: jsonQuiz.title,
          description: jsonQuiz.description || "",
          category: jsonQuiz.category || "Imported",
          difficulty: (jsonQuiz.difficulty as "beginner" | "intermediate" | "advanced") || "intermediate",
          questions: jsonQuiz.questions.map((q: any, i: number) => ({
            id: q.id || `q${i+1}`,
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || "No explanation provided"
          })),
          created: new Date()
        };
        
        addQuiz(quiz);
        setIsImportQuizOpen(false);
        
        toast({
          title: "Quiz imported",
          description: `The quiz "${quiz.title}" has been imported successfully`,
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "The selected file is not a valid quiz JSON",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };
  
  const handleShowExampleQuiz = () => {
    const exampleQuiz: Quiz = {
      id: "example-quiz",
      title: "JavaScript Fundamentals",
      description: "Test your knowledge of JavaScript basics",
      category: "JavaScript",
      difficulty: "beginner",
      questions: [
        {
          id: "q1",
          text: "Which of these is NOT a JavaScript data type?",
          options: [
            { id: "a", text: "String" },
            { id: "b", text: "Boolean" },
            { id: "c", text: "Float" },
            { id: "d", text: "Number" }
          ],
          correctAnswer: "c",
          explanation: "JavaScript has no Float type. Its Number type handles both integers and floating-point values."
        },
        {
          id: "q2",
          text: "What does the '===' operator do?",
          options: [
            { id: "a", text: "Checks for value equality only" },
            { id: "b", text: "Checks for both value and type equality" },
            { id: "c", text: "Assigns a value to a variable" },
            { id: "d", text: "Checks if variables point to the same object" }
          ],
          correctAnswer: "b",
          explanation: "The strict equality operator '===' checks both value and type without performing type conversion."
        }
      ],
      created: new Date()
    };
    
    setViewingQuiz(exampleQuiz);
    setIsExampleQuizOpen(true);
  };
  
  const handleViewQuiz = (quiz: Quiz) => {
    setViewingQuiz(quiz);
    setPreviewQuestion(0);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="my-quizzes">My Quizzes</TabsTrigger>
        <TabsTrigger value="generate">Generate Quiz</TabsTrigger>
      </TabsList>

      {/* My Quizzes Tab */}
      <TabsContent value="my-quizzes" className="space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search quizzes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Dialog open={isImportQuizOpen} onOpenChange={setIsImportQuizOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FileDown className="h-4 w-4 mr-2" />
                  Import Quiz
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Quiz</DialogTitle>
                  <DialogDescription>Upload a JSON file to import a quiz</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Label htmlFor="quiz-file">Quiz JSON File</Label>
                  <Input id="quiz-file" type="file" accept=".json" onChange={handleImportQuiz} />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsImportQuizOpen(false)}>
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isCreateQuizOpen} onOpenChange={setIsCreateQuizOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Quiz
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Quiz</DialogTitle>
                  <DialogDescription>Add details for your custom quiz</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      placeholder="Quiz title" 
                      value={newQuiz.title || ""}
                      onChange={(e) => setNewQuiz({...newQuiz, title: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Quiz description" 
                      value={newQuiz.description || ""}
                      onChange={(e) => setNewQuiz({...newQuiz, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Input 
                        id="category" 
                        placeholder="e.g. JavaScript" 
                        value={newQuiz.category || ""}
                        onChange={(e) => setNewQuiz({...newQuiz, category: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select 
                        value={newQuiz.difficulty}
                        onValueChange={(value: "beginner" | "intermediate" | "advanced") => 
                          setNewQuiz({...newQuiz, difficulty: value})
                        }
                      >
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
                  
                  <div className="grid gap-2">
                    <Label>Questions (Coming soon)</Label>
                    <p className="text-sm text-muted-foreground">
                      Quiz question editor is currently under development. 
                      For now, you can create quizzes using the AI generation feature.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateQuizOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateQuiz} disabled={!newQuiz.title}>
                    Save Quiz
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quiz Table */}
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
                      {searchTerm && (
                        <Button variant="link" onClick={() => setSearchTerm("")} className="mt-2">
                          Clear search
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredQuizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{quiz.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{quiz.description}</div>
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
                    <TableCell>{quiz.questions.length}</TableCell>
                    <TableCell>{formatDate(quiz.created)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="icon" variant="ghost" onClick={() => handleViewQuiz(quiz)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" asChild>
                          <Link href={`/dashboard/quizzes/play/${quiz.id}`}>
                            <Play className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleExportQuiz(quiz)}>
                          <FileDown className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteQuiz(quiz.id)}>
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

      {/* Generate Quiz Tab */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select 
                  value={generationDifficulty}
                  onValueChange={setGenerationDifficulty}
                >
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
                <Select 
                  value={generationQuestions}
                  onValueChange={setGenerationQuestions}
                >
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
              <li>Generated quizzes can be exported and shared with others</li>
              <li>You can combine a topic and code for context-aware questions</li>
            </ul>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Quiz Preview Dialog */}
      <Dialog open={!!viewingQuiz} onOpenChange={(open) => !open && setViewingQuiz(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          {viewingQuiz && (
            <>
              <DialogHeader>
                <DialogTitle>{viewingQuiz.title}</DialogTitle>
                <DialogDescription>{viewingQuiz.description}</DialogDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge>{viewingQuiz.category}</Badge>
                  <Badge 
                    variant={
                      viewingQuiz.difficulty === "beginner"
                        ? "secondary"
                        : viewingQuiz.difficulty === "intermediate"
                          ? "default"
                          : "destructive"
                    }
                  >
                    {viewingQuiz.difficulty}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(viewingQuiz.created)}
                  </Badge>
                </div>
              </DialogHeader>
              
              <div className="py-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    Question Preview ({previewQuestion + 1}/{viewingQuiz.questions.length})
                  </h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPreviewQuestion(prev => Math.max(0, prev - 1))} 
                      disabled={previewQuestion === 0}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPreviewQuestion(prev => 
                        Math.min(viewingQuiz.questions.length - 1, prev + 1)
                      )} 
                      disabled={previewQuestion >= viewingQuiz.questions.length - 1}
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      {viewingQuiz.questions[previewQuestion].text}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-2">
                      {viewingQuiz.questions[previewQuestion].options.map((option) => (
                        <div
                          key={option.id}
                          className={`flex items-center space-x-2 rounded-md border p-3 ${
                            option.id === viewingQuiz.questions[previewQuestion].correctAnswer
                              ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                              : ""
                          }`}
                        >
                          <div className="flex h-5 w-5 items-center justify-center rounded-full border mr-3">
                            {option.id === viewingQuiz.questions[previewQuestion].correctAnswer && (
                              <Check className="h-3 w-3 text-green-500" />
                            )}
                          </div>
                          <span>{option.text}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Tabs>
  )
}
