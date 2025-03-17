"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, XCircle, HelpCircle, ArrowRight, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useQuizStore } from "@/store/quizStore"
import { Quiz, Question } from "@/store/quizStore"

export default function QuizPlayPage({ params }: {   params: Promise<{ id: string }> }) {
  const router = useRouter()
  const quizId = params.then((p) => p.id)
  
  const { quizzes } = useQuizStore()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)

  useEffect(() => {
    const fetchQuiz = async () => {
      const id = await quizId
      const foundQuiz = quizzes.find(q => q.id === id)
      if (foundQuiz) {
        setQuiz(foundQuiz)
      } else {
        router.push('/dashboard/quizzes')
      }
    }
    fetchQuiz()
  }, [quizId, quizzes, router])

  if (!quiz) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + (isAnswerSubmitted ? 1 : 0)) / quiz.questions.length) * 100

  const handleAnswerSelect = (value: string) => {
    if (isAnswerSubmitted) return

    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: value,
    })
  }

  const handleSubmitAnswer = () => {
    if (!selectedAnswers[currentQuestion.id] || isAnswerSubmitted) return
    setIsAnswerSubmitted(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setIsAnswerSubmitted(false)
    } else {
      setShowResults(true)
    }
  }

  const handleRestartQuiz = () => {
    setSelectedAnswers({})
    setCurrentQuestionIndex(0)
    setShowResults(false)
    setIsAnswerSubmitted(false)
  }

  const calculateScore = () => {
    let correctCount = 0
    quiz.questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctCount++
      }
    })
    return correctCount
  }

  const score = calculateScore()
  const percentage = Math.round((score / quiz.questions.length) * 100)

  if (showResults) {
    return (
      <div className="container mx-auto p-6">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/dashboard/quizzes">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quizzes
          </Link>
        </Button>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
            <CardDescription>{quiz.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-6">
              <div className="text-6xl font-bold mb-2">{percentage}%</div>
              <p className="text-muted-foreground">
                You got {score} out of {quiz.questions.length} questions correct
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Question Summary</h3>
              {quiz.questions.map((question, index) => {
                const isCorrect = selectedAnswers[question.id] === question.correctAnswer
                return (
                  <div key={question.id} className="p-4 rounded-lg border">
                    <div className="flex items-start">
                      <div className="mr-2 mt-0.5">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {index + 1}. {question.text}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your answer:{" "}
                          {question.options.find((opt) => opt.id === selectedAnswers[question.id])?.text ||
                            "Not answered"}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-600 mt-1">
                            Correct answer: {question.options.find((opt) => opt.id === question.correctAnswer)?.text}
                          </p>
                        )}
                        <p className="text-sm mt-2 p-2 bg-muted rounded-md">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/dashboard/quizzes">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Quizzes
              </Link>
            </Button>
            <Button onClick={handleRestartQuiz}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Restart Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/dashboard/quizzes">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Quizzes
        </Link>
      </Button>

      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-bold">{quiz.title}</h1>
          <div className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </div>
        </div>
        <Progress value={progress} className="h-2 mb-6" />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {currentQuestionIndex + 1}. {currentQuestion.text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedAnswers[currentQuestion.id] || ""}
              onValueChange={handleAnswerSelect}
              className="space-y-3"
            >
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswers[currentQuestion.id] === option.id
                const isCorrect = isAnswerSubmitted && option.id === currentQuestion.correctAnswer
                const isWrong = isAnswerSubmitted && isSelected && option.id !== currentQuestion.correctAnswer

                return (
                  <div
                    key={option.id}
                    className={`flex items-center space-x-2 rounded-md border p-3 ${
                      isAnswerSubmitted
                        ? isCorrect
                          ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                          : isWrong
                            ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                            : ""
                        : isSelected
                          ? "border-primary"
                          : ""
                    }`}
                  >
                    <RadioGroupItem
                      value={option.id}
                      id={`option-${option.id}`}
                      disabled={isAnswerSubmitted}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={`option-${option.id}`}
                      className="flex flex-1 items-center cursor-pointer text-base"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border mr-3">
                        {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>}
                      </div>
                      {option.text}
                    </Label>
                    {isAnswerSubmitted && (
                      <>
                        {isCorrect && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {isWrong && <XCircle className="h-5 w-5 text-red-500" />}
                      </>
                    )}
                  </div>
                )
              })}
            </RadioGroup>

            {isAnswerSubmitted && (
              <div className="mt-6 p-4 rounded-md bg-muted">
                <div className="flex items-start">
                  <HelpCircle className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                  <div>
                    <p className="font-medium">Explanation</p>
                    <p className="text-sm mt-1">{currentQuestion.explanation}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex(currentQuestionIndex - 1)
                  setIsAnswerSubmitted(!!selectedAnswers[quiz.questions[currentQuestionIndex - 1].id])
                }
              }}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            {isAnswerSubmitted ? (
              <Button onClick={handleNextQuestion}>
                {currentQuestionIndex < quiz.questions.length - 1 ? (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  "See Results"
                )}
              </Button>
            ) : (
              <Button onClick={handleSubmitAnswer} disabled={!selectedAnswers[currentQuestion.id]}>
                Submit Answer
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

