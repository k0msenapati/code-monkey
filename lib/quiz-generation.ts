import { GoogleGenerativeAI } from '@google/generative-ai';
import { Quiz, Question } from '@/store/quizStore';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

const generateQuizPrompt = (
  topic: string, 
  codeSnippet: string | null,
  difficulty: string, 
  numQuestions: number
) => {
  let prompt = `Generate a ${difficulty} level coding quiz about ${topic} with ${numQuestions} multiple-choice questions.`;

  if (codeSnippet) {
    prompt += `\n\nAnalyze the following code snippet to create relevant questions:\n\`\`\`\n${codeSnippet}\n\`\`\``;
  }

  prompt += `\n\nEach question should include:
  1. A clear question text
  2. Exactly 4 options labeled a, b, c, and d
  3. The correct answer (one of: a, b, c, or d)
  4. A brief explanation of why the answer is correct

⚠️ IMPORTANT: Return ONLY a valid JSON object with no additional text, explanations, or markdown (\`\`\`json). Ensure:
- **All strings are correctly quoted**
- **No extra commas or missing commas**
- **No missing or extra brackets**
- **Use standard double quotes (\") for strings**

Format:
{
  "title": "Quiz title",
  "description": "Brief description of the quiz",
  "category": "Programming category (e.g., JavaScript, React, etc.)",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "text": "Question text goes here?",
      "options": [
        {"id": "a", "text": "First option"},
        {"id": "b", "text": "Second option"},
        {"id": "c", "text": "Third option"},
        {"id": "d", "text": "Fourth option"}
      ],
      "correctAnswer": "a",
      "explanation": "Explanation of why the answer is correct"
    }
  ]
}`;

  return prompt;
};

export async function generateQuizWithAI(
  topic: string,
  codeSnippet: string | null = null,
  difficulty: string = "intermediate",
  numQuestions: number = 10
): Promise<Quiz> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = generateQuizPrompt(topic, codeSnippet, difficulty, numQuestions);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log("Raw AI response:", text.substring(0, 200) + "...");

    text = text.trim();
    
    text = text.replace(/```json|```javascript|```/g, '');
    
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    text = text
      .replace(/"|"|„|"/g, '"')
      .replace(/\n/g, ' ')
      .replace(/\\(?!["\\/bfnrtu])/g, '\\\\')
      .replace(/([^\\])'/g, '$1\\"')
      .replace(/},\s*]/g, '}]')
      .replace(/,\s*}/g, '}');

    console.log("Cleaned JSON:", text.substring(0, 200) + "...");

    let quizData: any;
    try {
      quizData = JSON.parse(text);
    } catch (e) {
      console.error("JSON parsing error:", e);
      console.error("Full problematic text:", text);

      const jsonRegex = /{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*}/g;
      const matches = text.match(jsonRegex);
      
      if (matches && matches.length > 0) {
        try {
          quizData = JSON.parse(matches[0]);
          console.log("Extracted JSON with regex");
        } catch (regexError) {
          throw new Error(`Could not parse the AI response as valid JSON. Please try again.`);
        }
      } else {
        throw new Error(`The AI returned an invalid response. Please try again with a different topic.`);
      }
    }

    if (!quizData || !quizData.questions || !Array.isArray(quizData.questions)) {
      throw new Error("Invalid quiz data format received from AI.");
    }

    quizData.questions = quizData.questions
      .map((question: any, index: number) => {
        if (!question.text || !question.options || !Array.isArray(question.options) ||
            !question.correctAnswer || !question.explanation) {
          console.warn("Invalid question format:", question);
          return null;
        }

        question.options = question.options.map((opt: any) => 
          typeof opt === 'string' ? { id: 'unknown', text: opt } : opt
        );

        return {
          id: `q${index + 1}`,
          text: question.text,
          options: question.options.length === 4 ? question.options : [
            { id: 'a', text: 'Option A' },
            { id: 'b', text: 'Option B' },
            { id: 'c', text: 'Option C' },
            { id: 'd', text: 'Option D' }
          ],
          correctAnswer: question.correctAnswer,
          explanation: question.explanation || "No explanation provided."
        };
      })
      .filter(Boolean);

    const quiz: Quiz = {
      id: Date.now().toString(),
      title: quizData.title || `Quiz on ${topic}`,
      description: quizData.description || `A ${difficulty} level quiz about ${topic}`,
      category: quizData.category || topic,
      difficulty: (quizData.difficulty as "beginner" | "intermediate" | "advanced") || difficulty as "beginner" | "intermediate" | "advanced",
      questions: quizData.questions,
      created: new Date()
    };

    return quiz;
  } catch (error) {
    console.error("Quiz generation error:", error);
    throw new Error(`Failed to generate quiz: ${(error as Error).message}`);
  }
}
