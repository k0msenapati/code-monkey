"use client"

import { useEffect, useState } from "react"
import { Play, Copy, Save, FileCode, Terminal, RefreshCw, ArrowDown, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { useSnippetStore, Snippet } from "@/store/snippetStore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { languages } from "@/lib/supported-languages"
import { executeCode } from "@/lib/code-execution"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const getDefaultCode = (language: string): string => {
  switch (language) {
    case "javascript":
      return "// JavaScript playground\n\nconsole.log('Hello, world!');\n";
    case "python":
      return "# Python playground\n\nprint('Hello, world!')\n";
    case "typescript":
      return "// TypeScript playground\n\nconst greet = (name: string): string => {\n  return `Hello, ${name}!`;\n};\n\nconsole.log(greet('world'));\n";
    case "java":
      return "// Java playground\n\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, world!\");\n  }\n}\n";
    case "cpp":
      return "// C++ playground\n\n#include <iostream>\n\nint main() {\n  std::cout << \"Hello, world!\" << std::endl;\n  return 0;\n}\n";
    default:
      return `// ${language} playground\n`;
  }
};

export function CodeEditor() {
  const { toast } = useToast()
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [snippetTitle, setSnippetTitle] = useState("")
  const [snippetDescription, setSnippetDescription] = useState("")
  const [snippetTags, setSnippetTags] = useState("")
  const [activeTab, setActiveTab] = useState<"editor" | "output">("editor")
  const [height, setHeight] = useState("400px")
  
  const { 
    code, 
    language, 
    output, 
    isRunning,
    updateCode,
    updateLanguage,
    setOutput,
    setIsRunning,
    clearOutput,
    addSnippet 
  } = useSnippetStore()

  useEffect(() => {
    if (!code || code === "// Write your code here\n\nconsole.log('Hello, world!');") {
      updateCode(getDefaultCode(language))
    }
    
    const updateHeight = () => {
      const viewportHeight = window.innerHeight;
      if (viewportHeight < 768) {
        setHeight(`${viewportHeight * 0.4}px`);
      } else {
        setHeight("400px");
      }
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [language, updateCode, code])

  const handleLanguageChange = (value: string) => {
    updateLanguage(value)
    updateCode(getDefaultCode(value))
  }

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

  const openSaveDialog = () => {
    setSnippetTitle("")
    setSnippetDescription("")
    setSnippetTags("")
    setShowSaveDialog(true)
  }

  const handleSaveSnippet = () => {
    if (!snippetTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your snippet",
        variant: "destructive"
      })
      return
    }

    const newId = Date.now().toString()
    
    const newSnippet: Snippet = {
      id: newId,
      title: snippetTitle,
      description: snippetDescription,
      language: language,
      code: code,
      tags: snippetTags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      created: new Date()
    }
    
    addSnippet(newSnippet)
    
    setShowSaveDialog(false)
    toast({
      title: "Snippet saved",
      description: "The code has been saved to your snippets",
    })
  }

  return (
    <>
      <div className="flex flex-col min-h-[calc(100vh-16rem)]">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <div className="flex w-full sm:w-auto">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
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
                  <Button variant="outline" size="icon" onClick={openSaveDialog}>
                    <Save className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save as snippet</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="md:hidden mb-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "editor" | "output")}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="editor">
                <FileCode className="h-4 w-4 mr-2" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="output">
                <Terminal className="h-4 w-4 mr-2" />
                Output
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="p-0 border rounded-md mt-2">
              <div className="flex flex-col">
                <div className="p-0">
                  <textarea
                    value={code}
                    onChange={(e) => updateCode(e.target.value)}
                    className={`w-full h-[${height}] font-mono text-sm bg-background resize-none focus:outline-none border-0 p-4`}
                    style={{ height }}
                  />
                </div>
                <div className="border-t p-3 flex justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setActiveTab("output")}
                  >
                    Output
                    <ArrowDown className="ml-2 h-4 w-4" />
                  </Button>
                  <Button onClick={handleRunCode} disabled={isRunning}>
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
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="output" className="p-0 border rounded-md mt-2">
              <div className="flex flex-col">
                <div className="p-0">
                  <pre 
                    className={`w-full h-[${height}] font-mono text-sm bg-black text-green-400 overflow-auto p-4`}
                    style={{ height }}
                  >
                    {output || "> Code output will appear here..."}
                  </pre>
                </div>
                <div className="border-t p-3 flex justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setActiveTab("editor")}
                  >
                    Editor
                    <ArrowUp className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearOutput} 
                    disabled={!output}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="hidden md:grid gap-4 md:grid-cols-2 flex-1">
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
            <CardFooter className="border-t pt-3 pb-3">
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
            <CardFooter className="border-t pt-3 pb-3">
              <Button variant="outline" size="sm" onClick={clearOutput} className="ml-auto" disabled={!output}>
                Clear
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-[500px] max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Save Code Snippet</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={snippetTitle}
                onChange={(e) => setSnippetTitle(e.target.value)}
                placeholder="Enter a title for your snippet"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={snippetDescription}
                onChange={(e) => setSnippetDescription(e.target.value)}
                placeholder="Describe what this code does"
                className="resize-none"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={snippetTags}
                onChange={(e) => setSnippetTags(e.target.value)}
                placeholder="javascript, function, algorithm"
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowSaveDialog(false)}
              className="sm:order-1 order-2"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveSnippet}
              className="sm:order-2 order-1"
            >
              Save Snippet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}