import { ChatInterface } from "@/components/dashboard/chat-interface"

export default function ChatPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">AI Chat Assistant</h1>
      <p className="text-muted-foreground mb-6">
        Chat with your AI assistant about code, get explanations, or ask for help with problems.
      </p>

      <ChatInterface />
    </div>
  )
}

