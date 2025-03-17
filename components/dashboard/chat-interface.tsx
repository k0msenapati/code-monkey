"use client"

import type React from "react"

import { useState } from "react"
import { Send, Code, User, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "👋 Hi! I'm your CodeMonkey AI assistant. I can help with coding questions, explain concepts, review your code, and more. What can I help you with today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [codeInput, setCodeInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const generateAIResponse = (message: string, code?: string): string => {
    if (code) {
      return `I've analyzed your code. Here's what I found:

This appears to be a ${code.includes("function") ? "function" : "code snippet"} that ${code.includes("return") ? "returns a value" : "performs some operations"}.

Some suggestions for improvement:
- Consider adding more descriptive variable names
- Add comments to explain complex logic
- You could optimize the ${code.includes("loop") || code.includes("for") || code.includes("while") ? "loop structure" : "algorithm"}

Would you like me to explain any specific part in more detail?`
    }

    if (message.toLowerCase().includes("react")) {
      return "React is a JavaScript library for building user interfaces. It uses a component-based approach and a virtual DOM to efficiently update the UI. Some key concepts in React include components, props, state, and hooks. What specific aspect of React would you like to know more about?"
    }

    if (message.toLowerCase().includes("typescript")) {
      return "TypeScript is a statically typed superset of JavaScript that adds optional types, interfaces, and other features to help catch errors early and make your code more robust. It compiles down to regular JavaScript, so it can run in any JavaScript environment."
    }

    return "I'm here to help with your coding questions. Could you provide more details about what you're working on or what you'd like to learn?"
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && !codeInput.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input + (codeInput ? "\n\n```\n" + codeInput + "\n```" : ""),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateAIResponse(input, codeInput),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)

    setInput("")
    setCodeInput("")
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 rounded-lg border">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <Avatar className={message.role === "user" ? "ml-2" : "mr-2"}>
                <AvatarFallback className={message.role === "user" ? "bg-primary" : "bg-muted"}>
                  {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <Card>
                <CardContent className="p-3 whitespace-pre-wrap">{message.content}</CardContent>
              </Card>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex flex-row">
              <Avatar className="mr-2">
                <AvatarFallback className="bg-muted">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <Card>
                <CardContent className="p-3">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"></div>
                    <div
                      className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="message">
        <TabsList className="grid grid-cols-2 mb-2">
          <TabsTrigger value="message">Message</TabsTrigger>
          <TabsTrigger value="code">Code Input</TabsTrigger>
        </TabsList>
        <TabsContent value="message">
          <form onSubmit={handleSubmit} className="flex items-end space-x-2">
            <Textarea
              placeholder="Ask me anything about programming..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="resize-none min-h-[100px]"
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </TabsContent>
        <TabsContent value="code">
          <div className="space-y-2">
            <Textarea
              placeholder="// Paste your code here for analysis, explanation, or improvement"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              className="resize-none font-mono min-h-[150px]"
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={isLoading}>
                <Code className="h-4 w-4 mr-2" />
                Submit Code
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

