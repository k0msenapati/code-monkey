"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CodeEditor } from "@/components/dashboard/code-editor"
import { useSnippetStore } from "@/store/snippetStore"
import { SnippetCard } from "@/components/snippet-card"

export default function EditorPage() {
  const router = useRouter()
  const [showSnippets, setShowSnippets] = useState(true)
  const { snippets, activeSnippet } = useSnippetStore()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Code Editor</h1>
      <p className="text-muted-foreground mb-6">Write, run, and share code. Test your algorithms and ideas quickly.</p>

      <CodeEditor />
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
          <p className="text-muted-foreground">No saved snippets yet. Save your code to create a snippet.</p>
        )}
      </div>
    </div>
  )
}