import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CodeSquare } from "lucide-react"
import { Snippet } from "@/store/snippetStore"
import { cn } from "@/lib/utils"

interface SnippetCardProps {
  snippet: Snippet
  isActive: boolean
  onClick: () => void
}

export function SnippetCard({ snippet, isActive, onClick }: SnippetCardProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:border-primary",
        isActive && "border-primary bg-secondary/20"
      )} 
      onClick={onClick}
    >
      <CardHeader className="p-3">
        <CardTitle className="text-sm flex items-center">
          <CodeSquare className="h-3.5 w-3.5 mr-2" />
          {snippet.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
          {snippet.description}
        </p>
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs px-1 py-0">
            {snippet.language}
          </Badge>
          {snippet.tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
              {tag}
            </Badge>
          ))}
          {snippet.tags.length > 2 && (
            <Badge variant="secondary" className="text-xs px-1 py-0">
              +{snippet.tags.length - 2}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}