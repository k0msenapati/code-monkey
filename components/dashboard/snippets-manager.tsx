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
  Star,
  ChevronDown,
  ChevronUp
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
import { useSnippetStore, Snippet } from "@/store/snippetStore"
import { useRouter } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"

const DEFAULT_FOLDERS = ["React", "TypeScript", "Node.js", "CSS", "Python", "Algorithms", "Unsorted"]

export function SnippetsManager() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterFolder, setFilterFolder] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isAddFolderDialogOpen, setIsAddFolderDialogOpen] = useState(false)
  const [newFolder, setNewFolder] = useState("")
  const [folders, setFolders] = useState(DEFAULT_FOLDERS)
  const [newSnippet, setNewSnippet] = useState<Partial<Snippet>>({
    title: "",
    description: "",
    language: "javascript",
    code: "",
    tags: [],
    folder: ""
  })
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null)
  const [foldersExpanded, setFoldersExpanded] = useState(false)
  const [actionsExpanded, setActionsExpanded] = useState(false)

  const { snippets, addSnippet, updateSnippet, removeSnippet } = useSnippetStore()
  
  const { toast } = useToast()

  const formatDate = (dateValue: Date | string) => {
    if (!dateValue) return 'Unknown date';
    
    if (typeof dateValue === 'string') {
      return new Date(dateValue).toLocaleDateString();
    }
    
    return dateValue.toLocaleDateString();
  };

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch =
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (snippet.tags && snippet.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())))

    const matchesFolder = filterFolder ? (snippet.folder || "Unsorted") === filterFolder : true

    return matchesSearch && matchesFolder
  })

  const deleteSnippet = (id: string) => {
    removeSnippet(id)
    if (selectedSnippet?.id === id) {
      setSelectedSnippet(null)
    }

    toast({
      title: "Snippet deleted",
      description: "The snippet has been deleted from your collection",
    })
  }

  const toggleFavorite = (id: string) => {
    const snippet = snippets.find(s => s.id === id)
    if (snippet) {
      const updated = { ...snippet, favorite: !snippet.favorite }
      updateSnippet(updated)
      
      if (selectedSnippet?.id === id) {
        setSelectedSnippet(updated)
      }

      toast({
        title: snippet.favorite ? "Removed from favorites" : "Added to favorites",
        description: snippet.favorite 
          ? "Snippet removed from your favorites" 
          : "Snippet added to your favorites",
      })
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
      created: new Date()
    }

    addSnippet(snippet)
    setNewSnippet({
      title: "",
      description: "",
      language: "javascript",
      code: "",
      tags: [],
      folder: ""
    })
    setIsAddDialogOpen(false)

    toast({
      title: "Snippet saved",
      description: "Your new snippet has been added to the collection",
    })
  }

  const addFolder = () => {
    if (!newFolder.trim()) return;
    
    if (folders.includes(newFolder.trim())) {
      toast({
        title: "Folder already exists",
        description: "Please use a different folder name",
        variant: "destructive",
      })
      return;
    }
    
    setFolders([...folders, newFolder.trim()]);
    setNewFolder("");
    setIsAddFolderDialogOpen(false);
    
    toast({
      title: "Folder created",
      description: `"${newFolder}" folder has been created`,
    })
  }

  const importFromClipboard = async () => {
    try {
      const clipboardContent = await navigator.clipboard.readText();
      
      if (!clipboardContent.trim()) {
        toast({
          title: "Clipboard is empty",
          description: "There is no content to import",
          variant: "destructive",
        })
        return;
      }
      
      setNewSnippet({
        ...newSnippet,
        code: clipboardContent,
        title: `Imported snippet ${new Date().toLocaleTimeString()}`,
      });
      
      setIsAddDialogOpen(true);
      
      toast({
        title: "Content imported",
        description: "Clipboard content has been imported, please review and save",
      })
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Failed to read from clipboard. Check permissions.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:hidden space-y-4">
        <Button 
          variant="outline" 
          className="w-full flex justify-between items-center"
          onClick={() => setFoldersExpanded(!foldersExpanded)}
        >
          <span className="flex items-center">
            <Folder className="h-4 w-4 mr-2" />
            Folders
          </span>
          {foldersExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        
        {foldersExpanded && (
          <Card>
            <CardContent className="px-2 py-2">
              <ScrollArea className="h-[200px] px-4">
                <div className="space-y-1">
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
              </ScrollArea>
            </CardContent>
            <CardFooter className="pt-2 pb-3">
              <Button variant="outline" className="w-full" onClick={() => setIsAddFolderDialogOpen(true)}>
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </Button>
            </CardFooter>
          </Card>
        )}
        
        <Button 
          variant="outline" 
          className="w-full flex justify-between items-center"
          onClick={() => setActionsExpanded(!actionsExpanded)}
        >
          <span className="flex items-center">
            <PlusCircle className="h-4 w-4 mr-2" />
            Quick Actions
          </span>
          {actionsExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        
        {actionsExpanded && (
          <Card>
            <CardContent className="space-y-2 py-4">
              <Button variant="outline" className="w-full justify-start" onClick={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Snippet
              </Button>

              <Button variant="outline" className="w-full justify-start" onClick={importFromClipboard}>
                <Clipboard className="h-4 w-4 mr-2" />
                Import from Clipboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="hidden md:block md:col-span-3 lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-lg">Folders</CardTitle>
          </CardHeader>
          <CardContent className="px-2 py-0">
            <ScrollArea className="h-[320px] px-4">
              <div className="space-y-1">
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
            </ScrollArea>
          </CardContent>
          <CardFooter className="pt-2 pb-3">
            <Button variant="outline" className="w-full" onClick={() => setIsAddFolderDialogOpen(true)}>
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
              <PlusCircle className="h-4 w-4" />
              New Snippet
            </Button>

            <Button variant="outline" className="w-full justify-start overflow-ellipsis" onClick={importFromClipboard}>
              <Clipboard className="h-4 w-4" />
              Clipboard Im..
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-9 lg:col-span-10 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search snippets..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Snippet
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSnippets.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center h-60 border rounded-lg">
              <AlertCircle className="h-10 w-10 mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">No snippets found</p>
              {searchTerm && (
                <Button variant="link" onClick={() => setSearchTerm("")}>
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            filteredSnippets.map((snippet) => (
              <Card
                key={snippet.id}
                className={`overflow-hidden cursor-pointer transition-all hover:border-primary ${
                  selectedSnippet?.id === snippet.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedSnippet(snippet)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-semibold truncate max-w-[70%]">
                      {snippet.title}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      {snippet.favorite && (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      )}
                      <Badge>{snippet.language}</Badge>
                    </div>
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
                    {snippet.tags?.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {snippet.tags && snippet.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{snippet.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 justify-between">
                  <span className="text-xs text-muted-foreground">{snippet.folder || "Unsorted"}</span>
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
                              toggleFavorite(snippet.id)
                            }}
                          >
                            <Star className={`h-4 w-4 ${snippet.favorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{snippet.favorite ? "Remove from favorites" : "Add to favorites"}</p>
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
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-4 flex-col sm:flex-row">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    {selectedSnippet.title}
                    {selectedSnippet.favorite && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Favorite snippet</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </CardTitle>
                  <CardDescription>{selectedSnippet.description}</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                  <Button variant="outline" size="sm" onClick={() => toggleFavorite(selectedSnippet.id)}>
                    <Star className={`h-4 w-4 mr-2 ${selectedSnippet.favorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                    {selectedSnippet.favorite ? "Unfavorite" : "Favorite"}
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
                <div className="flex items-center flex-wrap gap-2">
                  <Badge className="mr-2">{selectedSnippet.language}</Badge>
                  <span className="text-sm text-muted-foreground">
                    Created: {formatDate(selectedSnippet.created)}
                  </span>
                  <ArrowRight className="h-3 w-3 mx-2 text-muted-foreground hidden sm:block" />
                  <Badge variant="outline">{selectedSnippet.folder || "Unsorted"}</Badge>
                </div>

                <ScrollArea className="max-h-[400px]">
                  <pre className="bg-secondary/50 p-4 rounded-md overflow-x-auto">
                    <code>{selectedSnippet.code}</code>
                  </pre>
                </ScrollArea>

                <div className="flex items-center flex-wrap">
                  <Tag className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                  <div className="flex flex-wrap gap-1">
                    {selectedSnippet.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {(!selectedSnippet.tags || selectedSnippet.tags.length === 0) && (
                      <span className="text-sm text-muted-foreground">No tags</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t pt-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedSnippet(null)}
              >
                Close
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => copySnippet(selectedSnippet.code)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => router.push(`/dashboard/editor/snippet/${selectedSnippet.id}`)}
                >
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
                    {folders.filter(f => f !== "Unsorted").map((folder) => (
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

      <Dialog open={isAddFolderDialogOpen} onOpenChange={setIsAddFolderDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Add a new folder to organize your snippets
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                placeholder="e.g., Algorithms, React, CSS..."
                value={newFolder}
                onChange={(e) => setNewFolder(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddFolderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addFolder} disabled={!newFolder.trim()}>
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

