"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, Play, Copy, Share2, Save, FileCode, 
  Terminal, RefreshCw, ChevronUp, ChevronDown 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useSnippetStore } from "@/store/snippetStore"
import { SnippetCard } from "@/components/snippet-card"
import { languages } from "@/lib/supported-languages"
import { executeCode } from "@/lib/code-execution"

export default function SnippetEditorPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const unwrappedParams = params instanceof Promise ? use(params) : params;
  const snippetId = unwrappedParams.id;
  
  const router = useRouter()
  const { toast } = useToast()
  const [showSnippets, setShowSnippets] = useState(true)
  
  const { 
    snippets, 
    activeSnippet,
    setActiveSnippet,
    updateCode,
    updateLanguage,
    saveSnippet,
    clearOutput,
    setOutput,
    setIsRunning,
    code,
    language,
    output,
    isRunning
  } = useSnippetStore()

  useEffect(() => {
    const snippet = snippets.find(s => s.id === snippetId)
    if (snippet) {
      setActiveSnippet(snippet)
    } else if (snippetId === "new") {
      router.push("/dashboard/editor")
    } else if (snippets.length > 0) {
      setActiveSnippet(snippets[0])
    }
  }, [snippetId, snippets, setActiveSnippet, router])

  const handleRunCode = async () => {
    if (!code.trim()) {
      toast({
        title: "No code to run",
        description: "Please enter some code first",
        variant: "destructive"
      })
      return
    }
    
    setIsRunning(true)
    clearOutput()
    
    try {
      const result = await executeCode(language, code)
      
      let formattedOutput = `> Running ${language} code...\n`
      
      if (result.success) {
        formattedOutput += `> Execution completed in ${result.executionTime || "N/A"}s\n`
        formattedOutput += `> Memory used: ${result.memory || "N/A"} KB\n\n`
      } else {
        formattedOutput += `> Execution failed\n\n`
      }
      
      formattedOutput += result.output
      
      setOutput(formattedOutput)
    } catch (error) {
      setOutput(`Error: ${(error as Error).message}`)
    } finally {
      setIsRunning(false)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Code copied",
      description: "The code has been copied to your clipboard",
    })
  }

  const shareCode = () => {
    toast({
      title: "Share link created",
      description: "Anyone with the link can view this code",
    })
  }

  const handleSaveSnippet = () => {
    saveSnippet()
    toast({
      title: "Snippet updated",
      description: "Your changes have been saved",
    })
  }

  if (!activeSnippet) {
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
          <Link href="/dashboard/editor">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Editor
          </Link>
        </Button>
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">{activeSnippet.title}</h1>
          <Badge>{activeSnippet.language}</Badge>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleSaveSnippet}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <p className="text-muted-foreground mb-6">{activeSnippet.description}</p>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Select value={language} onValueChange={updateLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
              ))}
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
              onChange={(e) => updateCode(e.target.value)}
              className="w-full h-full min-h-[400px] p-4 font-mono text-sm bg-background resize-none focus:outline-none border-0"
            />
          </CardContent>
          <CardFooter className="border-t">
            <Button onClick={handleRunCode} disabled={isRunning} className="ml-auto">
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
            <Button variant="outline" size="sm" onClick={clearOutput} className="ml-auto" disabled={!output}>
              Clear
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {activeSnippet.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t pt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Saved Snippets</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowSnippets(!showSnippets)}
          >
            {showSnippets ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Hide
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Show
              </>
            )}
          </Button>
        </div>
        
        {showSnippets && snippets.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {snippets.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet}
                isActive={activeSnippet?.id === snippet.id}
                onClick={() => {
                  router.push(`/dashboard/editor/snippet/${snippet.id}`)
                }}
              />
            ))}
          </div>
        ) : showSnippets && (
          <p className="text-muted-foreground">No other saved snippets.</p>
        )}
      </div>
    </div>
  )
}