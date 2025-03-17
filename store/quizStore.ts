import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type QuestionOption = {
  id: string;
  text: string;
}

export type Question = {
  id: string;
  text: string;
  options: QuestionOption[];
  correctAnswer: string;
  explanation: string;
}

export type Quiz = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  questions: Question[];
  created: Date;
  lastPlayed?: Date;
  bestScore?: number;
  timesPlayed?: number;
}

export type QuizResult = {
  quizId: string;
  date: Date;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  answers: {
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
  }[];
}

interface QuizState {
  quizzes: Quiz[];
  results: QuizResult[];
  activeQuiz: Quiz | null;
  isGenerating: boolean;
  
  addQuiz: (quiz: Quiz) => void;
  updateQuiz: (quiz: Quiz) => void;
  removeQuiz: (id: string) => void;
  setActiveQuiz: (quiz: Quiz | null) => void;
  saveResult: (result: QuizResult) => void;
  setIsGenerating: (isGenerating: boolean) => void;
}

const customStorage = {
  getItem: (name: string) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    
    return JSON.parse(str, (key, value) => {
      if (key === 'created' || key === 'lastPlayed' || key === 'date') {
        return value ? new Date(value) : value;
      }
      return value;
    });
  },
  setItem: (name: string, value: any) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  }
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      quizzes: [],
      results: [],
      activeQuiz: null,
      isGenerating: false,
      
      addQuiz: (quiz) => set((state) => ({ 
        quizzes: [quiz, ...state.quizzes] 
      })),
      
      updateQuiz: (quiz) => set((state) => ({
        quizzes: state.quizzes.map((q) => q.id === quiz.id ? quiz : q)
      })),
      
      removeQuiz: (id) => set((state) => ({
        quizzes: state.quizzes.filter((q) => q.id !== id),
        activeQuiz: state.activeQuiz?.id === id ? null : state.activeQuiz
      })),
      
      setActiveQuiz: (quiz) => set({ activeQuiz: quiz }),
      
      saveResult: (result) => set((state) => {
        const updatedQuizzes = state.quizzes.map(quiz => {
          if (quiz.id === result.quizId) {
            const scorePercentage = Math.round((result.score / result.totalQuestions) * 100);
            return {
              ...quiz,
              lastPlayed: result.date,
              bestScore: quiz.bestScore ? Math.max(quiz.bestScore, scorePercentage) : scorePercentage,
              timesPlayed: (quiz.timesPlayed || 0) + 1
            };
          }
          return quiz;
        });
        
        return {
          results: [result, ...state.results],
          quizzes: updatedQuizzes
        };
      }),
      
      setIsGenerating: (isGenerating) => set({ isGenerating })
    }),
    {
      name: "quiz-storage",
      storage: {
        getItem: customStorage.getItem,
        setItem: customStorage.setItem,
        removeItem: customStorage.removeItem
      }
    }
  )
);