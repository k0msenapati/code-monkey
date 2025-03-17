"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Play, Copy, Share2, Save, FileCode, Terminal, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

type Snippet = {
  id: string
  title: string
  description: string
  language: string
  code: string
  tags: string[]
  favorite: boolean
  folder: string
  created: Date
}

// Mock snippet data
const getMockSnippet = (id: string): Snippet => {
  const snippets = [
    {
      id: "1",
      title: "React useEffect Cleanup",
      description: "Pattern for cleaning up side effects in React hooks",
      language: "javascript",
      code: `useEffect(() => {
  const subscription = subscribeToData();
  
  // Cleanup function
  return () => {
    subscription.unsubscribe();
  };
}, []);`,
      tags: ["react", "hooks", "cleanup"],
      favorite: true,
      folder: "React",
      created: new Date(2023, 9, 5),
    },
    {
      id: "2",
      title: "TypeScript Interface with Generics",
      description: "Reusable interface with generic type parameters",
      language: "typescript",
      code: `interface Result<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function useData<T>(): Result<T> {
  // Implementation...
}`,
      tags: ["typescript", "generics", "interface"],
      favorite: false,
      folder: "TypeScript",
      created: new Date(2023, 8, 20),
    },
    {
      id: "3",
      title: "Express Error Handler Middleware",
      description: "Centralized error handling for Express applications",
      language: "javascript",
      code: `// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
});`,
      tags: ["express", "middleware", "error-handling"],
      favorite: true,
      folder: "Node.js",
      created: new Date(2023, 7, 15),
    },
    {
      id: "4",
      title: "CSS Grid Layout Template",
      description: "Responsive grid layout with named areas",
      language: "css",
      code: `.container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: auto auto 1fr auto;
  grid-template-areas: 
    "header header header header header header header header header header header header"
    "nav nav nav nav nav nav nav nav nav nav nav nav"
    "sidebar sidebar content content content content content content content content content content"
    "footer footer footer footer footer footer footer footer footer footer footer footer";
  min-height: 100vh;
}

@media (max-width: 768px) {
  .container {
    grid-template-areas: 
      "header header header header header header header header header header header header"
      "nav nav nav nav nav nav nav nav nav nav nav nav"
      "content content content content content content content content content content content content"
      "sidebar sidebar sidebar sidebar sidebar sidebar sidebar sidebar sidebar sidebar sidebar sidebar"
      "footer footer footer footer footer footer footer footer footer footer footer footer";
  }
}`,
      tags: ["css", "grid", "responsive"],
      favorite: false,
      folder: "CSS",
      created: new Date(2023, 10, 1),
    },
    {
      id: "5",
      title: "Python List Comprehension",
      description: "Common list comprehension patterns",
      language: "python",
      code: `# Basic list comprehension
squares = [x**2 for x in range(10)]

# With condition
even_squares = [x**2 for x in range(10) if x % 2 == 0]

# With transformation and condition
names = ['Alice', 'Bob', 'Charlie', 'David']
short_names = [name.upper() for name in names if len(name) < 6]

# Dictionary comprehension
name_lengths = {name: len(name) for name in names}`,
      tags: ["python", "list-comprehension", "data-structures"],
      favorite: true,
      folder: "Python",
      created: new Date(2023, 6, 10),
    },
  ]

  return snippets.find((snippet) => snippet.id === id) || snippets[0]
}

export default function SnippetEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [snippet, setSnippet] = useState<Snippet | null>(null)
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState<string>("")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    // In a real app, you would fetch the snippet data from an API
    const snippetData = getMockSnippet(params.id)
    setSnippet(snippetData)
    setCode(snippetData.code)
    setLanguage(snippetData.language)
  }, [params.id])

  const runCode = () => {
    setIsRunning(true)
    setOutput("")

    // Simulate code execution
    setTimeout(() => {
      let result = ""

      if (language === "javascript" || language === "typescript") {
        result =
          "// Output will appear here\nconsole.log('Running snippet...');\n\n> Running code...\n> Finished in 0.15s"
      } else if (language === "python") {
        result = "# Output will appear here\nprint('Running snippet...')\n\n> Running code...\n> Finished in 0.12s"
      } else if (language === "css") {
        result = "/* CSS doesn't produce runtime output */\n\n> Styles applied successfully"
      }

      setOutput(result)
      setIsRunning(false)
    }, 1200)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Code copied",
      description: "The code has been copied to your clipboard",
    })
  }

  const shareCode = () => {
    // Simulate sharing functionality
    toast({
      title: "Share link created",
      description: "Anyone with the link can view this code",
    })
  }

  const saveSnippet = () => {
    // Simulate saving to snippets
    toast({
      title: "Snippet updated",
      description: "Your changes have been saved",
    })
  }

  if (!snippet) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/snippets">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Snippets
          </Link>
        </Button>
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">{snippet.title}</h1>
          <Badge>{snippet.language}</Badge>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={saveSnippet}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <p className="text-muted-foreground mb-6">{snippet.description}</p>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Select value={language} onValueChange={(value: any) => setLanguage(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={copyCode}>
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy code</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={shareCode}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share code</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 flex-1">
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <FileCode className="h-4 w-4 mr-2" />
              Editor
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full min-h-[400px] p-4 font-mono text-sm bg-background resize-none focus:outline-none border-0"
            />
          </CardContent>
          <CardFooter className="border-t">
            <Button onClick={runCode} disabled={isRunning} className="ml-auto">
              {isRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Terminal className="h-4 w-4 mr-2" />
              Output
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <pre className="w-full h-full min-h-[400px] p-4 font-mono text-sm bg-black text-green-400 overflow-auto">
              {output || "> Code output will appear here..."}
            </pre>
          </CardContent>
          <CardFooter className="border-t">
            <Button variant="outline" size="sm" onClick={() => setOutput("")} className="ml-auto" disabled={!output}>
              Clear
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {snippet.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

