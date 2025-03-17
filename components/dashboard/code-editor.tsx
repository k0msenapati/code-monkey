"use client"

import { useState } from "react"
import { Play, Copy, Share2, Save, FileCode, Terminal, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

const sampleCode = {
  javascript: `// Fibonacci sequence generator
function fibonacci(n) {
  const result = [0, 1];
  
  for (let i = 2; i < n; i++) {
    result[i] = result[i - 1] + result[i - 2];
  }
  
  return result.slice(0, n);
}

// Test the function
console.log(fibonacci(10));`,

  python: `# Fibonacci sequence generator
def fibonacci(n):
    result = [0, 1]
    
    for i in range(2, n):
        result.append(result[i-1] + result[i-2])
    
    return result[:n]

# Test the function
print(fibonacci(10))`,

  typescript: `// Fibonacci sequence generator
function fibonacci(n: number): number[] {
  const result: number[] = [0, 1];
  
  for (let i = 2; i < n; i++) {
    result[i] = result[i - 1] + result[i - 2];
  }
  
  return result.slice(0, n);
}

// Test the function
console.log(fibonacci(10));`,
}

export function CodeEditor() {
  const [language, setLanguage] = useState<"javascript" | "python" | "typescript">("javascript")
  const [code, setCode] = useState(sampleCode[language])
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const { toast } = useToast()

  const handleLanguageChange = (value: "javascript" | "python" | "typescript") => {
    setLanguage(value)
    setCode(sampleCode[value])
    setOutput("")
  }

  const runCode = () => {
    setIsRunning(true)
    setOutput("")

    // Simulate code execution
    setTimeout(() => {
      let result = ""

      if (language === "javascript" || language === "typescript") {
        result = "[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]"
      } else if (language === "python") {
        result = "[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]"
      }

      setOutput(`> Running ${language} code...\n> Finished in 0.12s\n\n${result}`)
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

  const saveToSnippets = () => {
    // Simulate saving to snippets
    toast({
      title: "Code saved",
      description: "The code has been saved to your snippets",
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Select value={language} onValueChange={(value: any) => handleLanguageChange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
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

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={saveToSnippets}>
                  <Save className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save to snippets</p>
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
    </div>
  )
}

