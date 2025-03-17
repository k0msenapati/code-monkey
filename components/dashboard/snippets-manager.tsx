"use client"

import { useState } from "react"
import {
  PlusCircle,
  Edit,
  Trash,
  Copy,
  Search,
  Tag,
  MessageSquare,
  BookOpen,
  FolderPlus,
  Folder,
  ArrowRight,
  Clipboard,
  AlertCircle,
  Code,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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

const dummySnippets: Snippet[] = [
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

const folders = ["React", "TypeScript", "Node.js", "CSS", "Python", "Algorithms"]

export function SnippetsManager() {
  const [snippets, setSnippets] = useState<Snippet[]>(dummySnippets)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterFolder, setFilterFolder] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newSnippet, setNewSnippet] = useState<Partial<Snippet>>({
    title: "",
    description: "",
    language: "javascript",
    code: "",
    tags: [],
    folder: "",
  })
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null)

  const { toast } = useToast()

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch =
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesFolder = filterFolder ? snippet.folder === filterFolder : true

    return matchesSearch && matchesFolder
  })

  const deleteSnippet = (id: string) => {
    setSnippets(snippets.filter((snippet) => snippet.id !== id))
    if (selectedSnippet?.id === id) {
      setSelectedSnippet(null)
    }

    toast({
      title: "Snippet deleted",
      description: "The snippet has been deleted from your collection",
    })
  }

  const toggleFavorite = (id: string) => {
    setSnippets(
      snippets.map((snippet) => {
        if (snippet.id === id) {
          return { ...snippet, favorite: !snippet.favorite }
        }
        return snippet
      }),
    )

    if (selectedSnippet?.id === id) {
      setSelectedSnippet({ ...selectedSnippet, favorite: !selectedSnippet.favorite })
    }
  }

  const copySnippet = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Code copied",
      description: "The code has been copied to your clipboard",
    })
  }

  const saveSnippet = () => {
    if (!newSnippet.title || !newSnippet.code) return

    const snippet: Snippet = {
      id: Date.now().toString(),
      title: newSnippet.title || "",
      description: newSnippet.description || "",
      language: newSnippet.language || "javascript",
      code: newSnippet.code || "",
      tags: newSnippet.tags || [],
      favorite: false,
      folder: newSnippet.folder || "Unsorted",
      created: new Date(),
    }

    setSnippets([snippet, ...snippets])
    setNewSnippet({
      title: "",
      description: "",
      language: "javascript",
      code: "",
      tags: [],
      folder: "",
    })
    setIsAddDialogOpen(false)

    toast({
      title: "Snippet saved",
      description: "Your new snippet has been added to the collection",
    })
  }

  const sendToChat = (snippet: Snippet) => {
    // Simulate sending to chat
    toast({
      title: "Sent to AI chat",
      description: "Your snippet has been sent to the AI chat for analysis",
    })
  }

  const generateQuiz = (snippet: Snippet) => {
    // Simulate generating quiz
    toast({
      title: "Generating quiz",
      description: "Creating a quiz based on this snippet",
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Folders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                variant={filterFolder === null ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setFilterFolder(null)}
              >
                <Folder className="h-4 w-4 mr-2" />
                All Snippets
              </Button>

              {folders.map((folder) => (
                <Button
                  key={folder}
                  variant={filterFolder === folder ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setFilterFolder(folder)}
                >
                  <Folder className="h-4 w-4 mr-2" />
                  {folder}
                </Button>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Snippet
            </Button>

            <Button variant="outline" className="w-full justify-start">
              <Clipboard className="h-4 w-4 mr-2" />
              Import from Clipboard
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-3 space-y-6">
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search snippets..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Snippet
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSnippets.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center h-60 border rounded-lg">
              <AlertCircle className="h-10 w-10 mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">No snippets found</p>
            </div>
          ) : (
            filteredSnippets.map((snippet) => (
              <Card
                key={snippet.id}
                className={`overflow-hidden cursor-pointer transition-all ${
                  selectedSnippet?.id === snippet.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedSnippet(snippet)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-base font-semibold truncate">{snippet.title}</CardTitle>
                    <Badge>{snippet.language}</Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{snippet.description || "No description"}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <pre className="text-xs bg-secondary/50 p-2 rounded-md overflow-x-auto max-h-32">
                    <code>
                      {snippet.code.slice(0, 200)}
                      {snippet.code.length > 200 ? "..." : ""}
                    </code>
                  </pre>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {snippet.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 justify-between">
                  <span className="text-xs text-muted-foreground">{snippet.folder}</span>
                  <div className="flex space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              copySnippet(snippet.code)
                            }}
                          >
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
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              sendToChat(snippet)
                            }}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Send to AI Chat</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteSnippet(snippet.id)
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete snippet</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>

        {selectedSnippet && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedSnippet.title}</CardTitle>
                  <CardDescription>{selectedSnippet.description}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => sendToChat(selectedSnippet)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send to Chat
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => generateQuiz(selectedSnippet)}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Generate Quiz
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/editor/snippet/${selectedSnippet.id}`}>
                      <Code className="h-4 w-4 mr-2" />
                      Open in Editor
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Badge className="mr-2">{selectedSnippet.language}</Badge>
                  <span className="text-sm text-muted-foreground">
                    Created: {selectedSnippet.created.toLocaleDateString()}
                  </span>
                  <ArrowRight className="h-3 w-3 mx-2 text-muted-foreground" />
                  <Badge variant="outline">{selectedSnippet.folder}</Badge>
                </div>

                <pre className="bg-secondary/50 p-4 rounded-md overflow-x-auto">
                  <code>{selectedSnippet.code}</code>
                </pre>

                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div className="flex flex-wrap gap-1">
                    {selectedSnippet.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <div></div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => copySnippet(selectedSnippet.code)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteSnippet(selectedSnippet.id)}>
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Snippet</DialogTitle>
            <DialogDescription>Save a new code snippet to your collection</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Snippet title"
                  value={newSnippet.title}
                  onChange={(e) => setNewSnippet({ ...newSnippet, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={newSnippet.language}
                  onValueChange={(value) => setNewSnippet({ ...newSnippet, language: value })}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="csharp">C#</SelectItem>
                    <SelectItem value="php">PHP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Brief description of the snippet"
                value={newSnippet.description}
                onChange={(e) => setNewSnippet({ ...newSnippet, description: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="code">Code</Label>
              <Textarea
                id="code"
                placeholder="Paste your code here"
                className="font-mono min-h-[150px]"
                value={newSnippet.code}
                onChange={(e) => setNewSnippet({ ...newSnippet, code: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  placeholder="react, hooks, typescript"
                  onChange={(e) =>
                    setNewSnippet({
                      ...newSnippet,
                      tags: e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="folder">Folder</Label>
                <Select
                  value={newSnippet.folder}
                  onValueChange={(value) => setNewSnippet({ ...newSnippet, folder: value })}
                >
                  <SelectTrigger id="folder">
                    <SelectValue placeholder="Select folder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unsorted">Unsorted</SelectItem>
                    {folders.map((folder) => (
                      <SelectItem key={folder} value={folder}>
                        {folder}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveSnippet} disabled={!newSnippet.title || !newSnippet.code}>
              Save Snippet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

