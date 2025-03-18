"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Trash2, Plus, Edit2, Save, Code } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ChatMessage, useChatStore } from "@/store/chatStore"
import { chatWithAI } from "@/lib/ai/chat-ai"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const PROGRAMMING_LANGUAGES = [
  "javascript", "typescript", "python", "java", "c", "cpp", "csharp", 
  "ruby", "go", "rust", "php", "html", "css", "sql", "bash", "json", "yaml"
];

export function ChatInterface() {
  const { 
    sessions, 
    activeSessionId, 
    createSession, 
    setActiveSession, 
    renameSession, 
    deleteSession, 
    addMessage, 
    isLoading,
    setIsLoading,
    initializeStore
  } = useChatStore()

  const [message, setMessage] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [codeDialogOpen, setCodeDialogOpen] = useState(false)
  const [codeInput, setCodeInput] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const messageEndRef = useRef<HTMLDivElement>(null)

  // Initialize the store once when the component mounts
  useEffect(() => {
    initializeStore()
  }, [initializeStore])

  const activeSession = sessions.find(s => s.id === activeSessionId)
  const currentMessages = activeSession?.messages || []

  const handleSendMessage = async () => {
    if (!message.trim()) return
    
    // Ensure we have an active session
    const sessionId = activeSessionId || createSession()
    
    const userMessage: ChatMessage = { role: 'user', content: message }
    addMessage(sessionId, userMessage)
    setMessage("")
    setIsLoading(true)
    
    // Scroll to bottom
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
    
    try {
      // For system context/instructions
      const systemContext = "You are a helpful AI assistant specialized in programming and software development."
      
      const allMessages = [
        { role: 'system' as const, content: systemContext },
        ...currentMessages,
        userMessage
      ]
      
      const aiResponse = await chatWithAI(allMessages)
      addMessage(sessionId, { role: 'assistant', content: aiResponse })
      
      // Scroll to bottom after response
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (error) {
      console.error("Error sending message:", error)
      addMessage(sessionId, { 
        role: 'assistant', 
        content: "Sorry, I encountered an error while processing your request. Please try again." 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartEdit = (id: string, title: string) => {
    setEditingId(id)
    setEditTitle(title)
  }

  const handleSaveEdit = (id: string) => {
    renameSession(id, editTitle)
    setEditingId(null)
  }

  const handleDeleteSession = (id: string) => {
    deleteSession(id)
  }

  const handleInsertCode = () => {
    if (!codeInput.trim()) {
      setCodeDialogOpen(false)
      return
    }

    const formattedCode = `\`\`\`${selectedLanguage}\n${codeInput}\n\`\`\``;
    
    // If there is existing message content, add the code with proper spacing
    if (message.trim()) {
      setMessage(prev => `${prev}\n\n${formattedCode}`)
    } else {
      setMessage(formattedCode)
    }
    
    setCodeInput("")
    setCodeDialogOpen(false)
  }

  // Function to render message content with code blocks properly formatted
  const renderMessageContent = (content: string) => {
    // Regular expression to match markdown code blocks
    const codeBlockRegex = /```([a-z]*)\n([\s\S]*?)```/g;
    
    // Split the content by code blocks
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before the code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.substring(lastIndex, match.index)
        });
      }
      
      // Add the code block
      const language = match[1] || 'plaintext';
      const code = match[2];
      parts.push({
        type: 'code',
        language,
        content: code
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add any remaining text after the last code block
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex)
      });
    }
    
    // If no code blocks were found, just return the content as is
    if (parts.length === 0) {
      return <p className="whitespace-pre-wrap">{content}</p>;
    }
    
    // Render the parts
    return (
      <div className="space-y-3">
        {parts.map((part, index) => {
          if (part.type === 'text') {
            return <p key={index} className="whitespace-pre-wrap">{part.content}</p>;
          } else {
            return (
              <div key={index} className="relative">
                <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                  {part.language}
                </div>
                <pre className="p-4 rounded-md bg-muted overflow-x-auto">
                  <code>{part.content}</code>
                </pre>
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Chat Sessions Sidebar */}
      <div className="md:col-span-1 space-y-4">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => createSession()}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
        
        <ScrollArea className="h-[600px]">
          <div className="space-y-2 pr-4">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center">
                <Button 
                  variant={activeSessionId === session.id ? "secondary" : "ghost"}
                  className="flex-1 justify-start overflow-hidden text-ellipsis whitespace-nowrap"
                  onClick={() => setActiveSession(session.id)}
                >
                  {editingId === session.id ? (
                    <Input 
                      value={editTitle} 
                      onChange={(e) => setEditTitle(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveEdit(session.id)
                        }
                      }}
                      className="h-6"
                      autoFocus
                    />
                  ) : (
                    <span className="truncate">{session.title}</span>
                  )}
                </Button>
                
                {activeSessionId === session.id && (
                  <div className="flex space-x-1">
                    {editingId === session.id ? (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleSaveEdit(session.id)}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleStartEdit(session.id, session.title)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteSession(session.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {/* Chat Interface */}
      <div className="md:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Chat with AI Assistant</CardTitle>
            <CardDescription>
              Ask questions about programming, coding concepts, or get help with problems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col h-[500px]">
              <div className="flex-1 overflow-y-auto mb-4 p-4 border rounded-lg">
                {currentMessages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <p>No messages yet. Start a conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentMessages.map((msg, i) => (
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
                          {renderMessageContent(msg.content)}
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
                    <div ref={messageEndRef} />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
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
                  <div className="flex flex-col gap-2">
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={isLoading || !message.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setCodeDialogOpen(true)}
                      title="Insert code block"
                    >
                      <Code className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Code Input Dialog */}
      <Dialog open={codeDialogOpen} onOpenChange={setCodeDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Insert Code</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  {PROGRAMMING_LANGUAGES.map(lang => (
                    <SelectItem key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Textarea
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="Paste your code here..."
              className="min-h-[200px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCodeDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleInsertCode}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

