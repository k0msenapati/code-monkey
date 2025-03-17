"use client"

import { SnippetsManager } from "@/components/dashboard/snippets-manager"

export default function SnippetsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Snippets Manager</h1>
      <p className="text-muted-foreground mb-6">
        Store, organize, and reuse your code snippets. Send them to AI chat for analysis or generate quizzes.
      </p>

      <SnippetsManager />
    </div>
  )
}

