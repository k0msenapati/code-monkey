import { RoadmapManager } from "@/components/dashboard/roadmap-manager"

export default function RoadmapsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Learning Roadmaps</h1>
      <p className="text-muted-foreground mb-6">
        Create, edit and track your learning pathways. Generate AI-powered roadmaps based on your goals.
      </p>

      <RoadmapManager />
    </div>
  )
}

