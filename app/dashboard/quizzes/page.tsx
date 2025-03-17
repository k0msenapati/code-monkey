import { QuizManager } from "@/components/dashboard/quiz-manager"

export default function QuizzesPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Quiz Bot</h1>
      <p className="text-muted-foreground mb-6">
        Create, edit, and take coding quizzes. Generate new quizzes from any topic or code snippet.
      </p>

      <QuizManager />
    </div>
  )
}

