import { QuizManager } from "@/components/dashboard/quiz-manager"

export default function QuizzesPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-6">Quiz Bot</h1>
      <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
        Create, edit, and take coding quizzes. Generate new quizzes from any topic or code snippet.
      </p>

      <QuizManager />
    </div>
  )
}

