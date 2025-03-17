import { CodeEditor } from "@/components/dashboard/code-editor"

export default function EditorPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Code Editor</h1>
      <p className="text-muted-foreground mb-6">Write, run, and share code. Test your algorithms and ideas quickly.</p>

      <CodeEditor />
    </div>
  )
}

