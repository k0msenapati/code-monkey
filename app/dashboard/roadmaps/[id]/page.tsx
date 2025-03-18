"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, BookOpen, Clock, Target, LinkIcon, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useRoadmapStore } from "@/store/roadmapStore"
import { chatWithAI } from "@/lib/ai/roadmap-ai"

export default function RoadmapDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const id = resolvedParams.id
  
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const { 
    roadmaps, 
    activeRoadmap, 
    setActiveRoadmap, 
    toggleStepCompletion,
    chatHistory,
    addChatMessage
  } = useRoadmapStore()

  useEffect(() => {
    const roadmap = roadmaps.find(r => r.id === id)
    if (roadmap) {
      setActiveRoadmap(roadmap)
    } else {
      router.push("/dashboard/roadmaps")
    }
  }, [id, roadmaps, setActiveRoadmap, router])

  const handleToggleCompletion = (stepId: string) => {
    if (activeRoadmap) {
      toggleStepCompletion(activeRoadmap.id, stepId)
    }
  }

  const currentChatHistory = chatHistory.find(chat => chat.roadmapId === id)?.messages || []

  const handleSendMessage = async () => {
    if (!message.trim() || !activeRoadmap) return
    
    const userMessage = { role: 'user' as const, content: message }
    addChatMessage(id, userMessage)
    setMessage("")
    setIsLoading(true)
    
    try {
      // Add context about the roadmap to help the AI give better responses
      const roadmapContext = `This is regarding a roadmap titled "${activeRoadmap.title}" about "${activeRoadmap.description}". It has ${activeRoadmap.steps.length} steps: ${activeRoadmap.steps.map(s => s.title).join(", ")}.`
      
      const allMessages = [
        { role: 'system' as const, content: roadmapContext },
        ...currentChatHistory,
        userMessage
      ]
      
      const aiResponse = await chatWithAI(id, allMessages)
      addChatMessage(id, { role: 'assistant', content: aiResponse })
    } catch (error) {
      console.error("Error sending message:", error)
      addChatMessage(id, { 
        role: 'assistant', 
        content: "Sorry, I encountered an error while processing your request. Please try again." 
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!activeRoadmap) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/dashboard/roadmaps">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Roadmaps
        </Link>
      </Button>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold">{activeRoadmap.title}</h1>
            <p className="text-muted-foreground mt-1">{activeRoadmap.description}</p>
          </div>
          <Badge>{activeRoadmap.category}</Badge>
        </div>

        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="progress">Learning Path</TabsTrigger>
            <TabsTrigger value="ai-chat">AI Assistant</TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress">
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle>Progress Overview</CardTitle>
                <CardDescription>Track your learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm">{activeRoadmap.progress}%</span>
                </div>
                <Progress value={activeRoadmap.progress} className="h-2 mb-4" />

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                    <Target className="h-8 w-8 text-primary mb-2" />
                    <span className="text-lg font-bold">{activeRoadmap.steps.length}</span>
                    <span className="text-sm text-muted-foreground">Total Steps</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                    <Check className="h-8 w-8 text-green-500 mb-2" />
                    <span className="text-lg font-bold">{activeRoadmap.steps.filter((step) => step.completed).length}</span>
                    <span className="text-sm text-muted-foreground">Completed</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                    <Clock className="h-8 w-8 text-orange-500 mb-2" />
                    <span className="text-lg font-bold">
                      {activeRoadmap.steps.length - activeRoadmap.steps.filter((step) => step.completed).length}
                    </span>
                    <span className="text-sm text-muted-foreground">Remaining</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h2 className="text-xl font-bold">Learning Path</h2>
              {activeRoadmap.steps.map((step, index) => (
                <Card key={step.id} className={step.completed ? "border-green-500" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <Button
                          size="sm"
                          variant={step.completed ? "default" : "outline"}
                          className="h-6 w-6 rounded-full p-0 mr-3 mt-1"
                          onClick={() => handleToggleCompletion(step.id)}
                        >
                          {step.completed && <Check className="h-3 w-3" />}
                        </Button>
                        <div>
                          <CardTitle className="text-base">
                            {index + 1}. {step.title}
                          </CardTitle>
                          <CardDescription>{step.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={step.completed ? "default" : "outline"}>
                        {step.completed ? "Completed" : "In Progress"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-primary" />
                        <h4 className="text-sm font-medium">Learning Resources</h4>
                      </div>
                      <ul className="space-y-2 pl-6">
                        {step.resources.map((resource, i) => (
                          <li key={i} className="flex items-center">
                            <LinkIcon className="h-3 w-3 mr-2 text-muted-foreground" />
                            <a 
                              href={resource.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-sm text-primary hover:underline"
                            >
                              {resource.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="ai-chat">
            <Card>
              <CardHeader>
                <CardTitle>Chat with AI Assistant</CardTitle>
                <CardDescription>
                  Ask questions about your roadmap or get help with specific topics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col h-[500px]">
                  <div className="flex-1 overflow-y-auto mb-4 p-4 border rounded-lg">
                    {currentChatHistory.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <p>No messages yet. Start a conversation!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {currentChatHistory.map((msg, i) => (
                          <div 
                            key={i} 
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[80%] rounded-lg p-3 ${
                                msg.role === 'user' 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                              <div className="flex space-x-2">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75"></div>
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={isLoading || !message.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

