"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { generateRoadmap } from "@/lib/ai/roadmap-ai"
import { useRoadmapStore } from "@/store/roadmapStore"

export default function CreateRoadmapPage() {
  const router = useRouter()
  const [topic, setTopic] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { addRoadmap } = useRoadmapStore()

  const handleGenerate = async () => {
    if (!topic.trim()) return
    
    setIsGenerating(true)
    setError(null)
    
    try {
      const roadmap = await generateRoadmap(topic)
      addRoadmap(roadmap)
      router.push(`/dashboard/roadmaps/${roadmap.id}`)
    } catch (err) {
      console.error("Error generating roadmap:", err)
      setError("Failed to generate roadmap. Please try again with a different topic.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/dashboard/roadmaps">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Roadmaps
        </Link>
      </Button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Learning Roadmap</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Generate with AI</CardTitle>
            <CardDescription>
              Enter a topic to generate a personalized learning roadmap using AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g., React Native Development, Machine Learning with Python"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Be specific to get better results. Include skill level if relevant.
                </p>
              </div>
              
              {error && <p className="text-sm text-red-500">{error}</p>}
              
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !topic.trim()} 
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    Generating Roadmap...
                  </>
                ) : (
                  "Generate Roadmap"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Tips for better roadmaps:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Specify the technology or skill area (e.g., "Flutter app development")</li>
            <li>Include your experience level (e.g., "beginner Python machine learning")</li>
            <li>Mention specific goals (e.g., "building a fullstack web application")</li>
          </ul>
        </div>
      </div>
    </div>
  )
}