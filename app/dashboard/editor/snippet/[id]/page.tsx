"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, Play, Copy, Save, FileCode, 
  Terminal, RefreshCw, ChevronUp, ChevronDown, 
  Code
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useSnippetStore } from "@/store/snippetStore"
import { SnippetCard } from "@/components/snippet-card"
import { languages } from "@/lib/supported-languages"
import { executeCode } from "@/lib/code-execution"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useFeatureFlags } from "@/providers/FeatureFlagProvider"

export default function SnippetEditorPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const unwrappedParams = params instanceof Promise ? use(params) : params;
  const snippetId = unwrappedParams.id;
  
  const router = useRouter()
  const { toast } = useToast()
  const { saveSnippetsInEditor } = useFeatureFlags()
  const [showSnippets, setShowSnippets] = useState(true)
  const [searchFilter, setSearchFilter] = useState("")
  const [langFilter, setLangFilter] = useState<string>("all")
  
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

  const handleSaveSnippet = () => {
    saveSnippet()
    toast({
      title: "Snippet updated",
      description: "Your changes have been saved",
    })
  }

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchFilter.toLowerCase()) || 
                          snippet.description?.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesLang = langFilter === "all" || snippet.language === langFilter;
    return matchesSearch && matchesLang;
  });

  const languages = ["all", ...new Set(snippets.map(s => s.language))].filter(Boolean);

  if (!activeSnippet) {
    return (
      <div className="container mx-auto p-3 sm:p-6 flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
        <Button variant="ghost" asChild className="w-fit">
          <Link href="/dashboard/editor">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Editor
          </Link>
        </Button>
        
        <div className="flex items-center space-x-2 order-first sm:order-none">
          <h1 className="text-xl sm:text-2xl font-bold">{activeSnippet.title}</h1>
          <Badge>{activeSnippet.language}</Badge>
        </div>
        
        {saveSnippetsInEditor && (
          <Button variant="outline" onClick={handleSaveSnippet} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>

      <p className="text-muted-foreground mb-4 sm:mb-6">{activeSnippet.description}</p>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <Select value={language} onValueChange={updateLanguage}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
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
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 flex-1">
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
              className="w-full h-full min-h-[300px] sm:min-h-[400px] p-4 font-mono text-sm bg-background resize-none focus:outline-none border-0"
            />
          </CardContent>
          <CardFooter className="border-t pt-6">
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
            <pre className="w-full h-full min-h-[300px] sm:min-h-[400px] p-4 font-mono text-sm bg-black text-green-400 overflow-auto">
              {output || "> Code output will appear here..."}
            </pre>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button variant="outline" size="sm" onClick={clearOutput} className="ml-auto" disabled={!output}>
              Clear
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-4 sm:mt-6">
        <h3 className="text-lg font-medium mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {activeSnippet.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-6 sm:mt-8 border-t pt-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <h3 className="text-lg font-medium">Saved Snippets</h3>
            <Button 
              variant="ghost" 
              size="sm"
              className="sm:hidden"
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
          
          {showSnippets && snippets.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Input
                  placeholder="Search snippets..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full"
                />
              </div>
              
              {languages.length > 1 && (
                <Select value={langFilter} onValueChange={setLangFilter}>
                  <SelectTrigger className="w-full sm:w-36">
                    <SelectValue placeholder="Filter by language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang} value={lang}>
                        {lang === "all" ? "All Languages" : lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              <Button 
                variant="ghost" 
                size="sm"
                className="hidden sm:flex"
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
          )}
        </div>
        
        {showSnippets && filteredSnippets.length > 0 ? (
          <ScrollArea className="pb-4">
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {filteredSnippets.map((snippet) => (
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
          </ScrollArea>
        ) : showSnippets && searchFilter ? (
          <div className="text-center py-8">
            <Code className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-2" />
            <p className="text-muted-foreground">No snippets match your search.</p>
            <Button variant="link" onClick={() => setSearchFilter("")}>Clear filters</Button>
          </div>
        ) : showSnippets && (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No other saved snippets.</p>
          </div>
        )}
      </div>
    </div>
  )
}