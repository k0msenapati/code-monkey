import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Snippet = {
  id: string
  title: string
  description: string
  language: string
  code: string
  tags: string[]
  created: Date
  favorite?: boolean
  folder?: string
}

interface SnippetState {
  snippets: Snippet[]
  activeSnippet: Snippet | null
  code: string
  language: string
  output: string
  isRunning: boolean
  
  setActiveSnippet: (snippet: Snippet) => void
  updateCode: (code: string) => void
  updateLanguage: (language: string) => void
  saveSnippet: () => void
  addSnippet: (snippet: Snippet) => void
  updateSnippet: (snippet: Snippet) => void
  removeSnippet: (id: string) => void
  setOutput: (output: string) => void
  setIsRunning: (isRunning: boolean) => void
  clearOutput: () => void
  reset: () => void
}

export const useSnippetStore = create<SnippetState>()(
  persist(
    (set, get) => ({
      snippets: [],
      activeSnippet: null,
      code: "// Write your code here\n\nconsole.log('Hello, world!');",
      language: "javascript",
      output: "",
      isRunning: false,
      
      setActiveSnippet: (snippet) => {
        set({ 
          activeSnippet: snippet,
          code: snippet.code,
          language: snippet.language
        })
      },
      
      updateCode: (code) => set({ code }),
      
      updateLanguage: (language) => set({ language }),
      
      saveSnippet: () => {
        const { activeSnippet, code, snippets } = get()
        
        if (!activeSnippet) return
        
        const updatedSnippets = snippets.map(s => 
          s.id === activeSnippet.id ? { ...s, code } : s
        )
        
        set({ 
          snippets: updatedSnippets,
          activeSnippet: { ...activeSnippet, code }
        })
      },
      
      addSnippet: (snippet) => {
        const { snippets } = get()
        set({ 
          snippets: [snippet, ...snippets]
        })
      },
      
      updateSnippet: (updatedSnippet) => {
        const { snippets } = get()
        const updatedSnippets = snippets.map(s => 
          s.id === updatedSnippet.id ? updatedSnippet : s
        )
        set({ snippets: updatedSnippets })
      },
      
      removeSnippet: (id) => {
        const { snippets, activeSnippet } = get()
        const updatedSnippets = snippets.filter(s => s.id !== id)
        
        set({ 
          snippets: updatedSnippets,
          ...(activeSnippet?.id === id ? { 
            activeSnippet: null,
            code: "// Write your code here\n\nconsole.log('Hello, world!');",
            language: "javascript" 
          } : {})
        })
      },
      
      setOutput: (output) => set({ output }),
      
      setIsRunning: (isRunning) => set({ isRunning }),
      
      clearOutput: () => set({ output: "" }),

      reset: () => set(() => ({
        snippets: [],
        activeSnippet: null,
        code: "// Write your code here\n\nconsole.log('Hello, world!');",
      }))
    }),
    {
      name: "snippet-storage",
    }
  )
)