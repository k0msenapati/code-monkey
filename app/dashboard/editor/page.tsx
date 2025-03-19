"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronUp, ChevronDown, Code, PlusCircle, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CodeEditor } from "@/components/dashboard/code-editor"
import { useSnippetStore } from "@/store/snippetStore"
import { SnippetCard } from "@/components/snippet-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

export default function EditorPage() {
  const router = useRouter()
  const [showSnippets, setShowSnippets] = useState(true)
  const { snippets, activeSnippet } = useSnippetStore()
  const [searchFilter, setSearchFilter] = useState("")
  const [langFilter, setLangFilter] = useState<string>("all")

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchFilter.toLowerCase()) || 
                          snippet.description?.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesLang = langFilter === "all" || snippet.language === langFilter;
    return matchesSearch && matchesLang;
  });

  const languages = ["all", ...new Set(snippets.map(s => s.language))].filter(Boolean);

  return (
    <div className="p-3 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Code Editor</h1>
        <Button 
          variant="outline"
          size="sm" 
          className="w-full sm:w-auto"
          onClick={() => router.push('/dashboard/editor/new')}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          New Snippet
        </Button>
      </div>

      <div className="overflow-hidden">
        <CodeEditor />
      </div>

      <div className="border-t pt-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <h3 className="text-lg font-medium">Saved Snippets</h3>
            <Button 
              variant="ghost" 
              size="sm"
              className="sm:hidden"
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
          
          {showSnippets && snippets.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Input
                  placeholder="Search snippets..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full"
                />
              </div>
              
              {languages.length > 1 && (
                <Select value={langFilter} onValueChange={setLangFilter}>
                  <SelectTrigger className="w-full sm:w-36">
                    <SelectValue placeholder="Filter by language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang} value={lang}>
                        {lang === "all" ? "All Languages" : lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              <Button 
                variant="ghost" 
                size="sm"
                className="hidden sm:flex"
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
          )}
        </div>
        
        {showSnippets && filteredSnippets.length > 0 ? (
          <ScrollArea className="pb-4">
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {filteredSnippets.map((snippet) => (
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
          </ScrollArea>
        ) : showSnippets && searchFilter ? (
          <div className="text-center py-8">
            <Code className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-2" />
            <p className="text-muted-foreground">No snippets match your search.</p>
            <Button variant="link" onClick={() => setSearchFilter("")}>Clear filters</Button>
          </div>
        ) : showSnippets && (
          <div className="text-center py-8">
            <Code className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-2" />
            <p className="text-muted-foreground">No saved snippets yet.</p>
            <p className="text-sm text-muted-foreground">Save your code to create a snippet.</p>
          </div>
        )}
      </div>
    </div>
  )
}