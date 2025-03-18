import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export async function generateRoadmap(topic: string): Promise<any> {
  try {
    const prompt = `Create a learning roadmap for "${topic}". 
    Structure your response as a JSON object with the following format:
    {
      "title": "Title of the roadmap",
      "description": "Brief description of what this roadmap covers",
      "category": "Category this roadmap belongs to (e.g., 'Web Development', 'Data Science')",
      "steps": [
        {
          "title": "Step title",
          "description": "Brief description of this step",
          "resources": [
            { "title": "Resource name", "url": "Resource URL" }
          ]
        }
      ]
    }
    Provide 3-6 steps with 2-3 resources each. Make URLs realistic and helpful.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                     text.match(/```\n([\s\S]*?)\n```/) || 
                     text.match(/\{[\s\S]*\}/);
                     
    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      const roadmapData = JSON.parse(jsonStr);
      
      // Process the response to match our data structure
      const formattedRoadmap = {
        id: Date.now().toString(),
        title: roadmapData.title,
        description: roadmapData.description,
        category: roadmapData.category,
        created: new Date(),
        progress: 0,
        steps: roadmapData.steps.map((step: any, index: number) => ({
          id: `step-${index + 1}`,
          title: step.title,
          description: step.description,
          resources: step.resources || [],
          completed: false
        }))
      };
      
      return formattedRoadmap;
    } else {
      throw new Error("Failed to parse AI response");
    }
  } catch (error) {
    console.error("Error generating roadmap:", error);
    throw error;
  }
}

export async function chatWithAI(roadmapId: string, messages: { role: string, content: string }[]): Promise<string> {
  try {
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: formattedMessages.slice(0, -1),
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const lastMessage = formattedMessages[formattedMessages.length - 1];
    const result = await chat.sendMessage(lastMessage.parts[0].text);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error chatting with AI:", error);
    throw error;
  }
}