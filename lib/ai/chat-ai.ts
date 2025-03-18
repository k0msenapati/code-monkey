import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export async function chatWithAI(messages: { role: string, content: string }[]): Promise<string> {
  try {
    const nonSystemMessages = messages.filter(msg => msg.role !== 'system');
    
    if (nonSystemMessages.length === 0 || nonSystemMessages[0].role !== 'user') {
      throw new Error("First message must be from user");
    }
    
    const historyMessages = [];
    
    for (let i = 0; i < nonSystemMessages.length - 1; i += 2) {
      if (i + 1 < nonSystemMessages.length) {
        const userMsg = nonSystemMessages[i];
        const assistantMsg = nonSystemMessages[i + 1];
        
        if (userMsg.role === 'user' && assistantMsg.role === 'assistant') {
          historyMessages.push({
            role: 'user',
            parts: [{ text: userMsg.content }]
          });
          historyMessages.push({
            role: 'model',
            parts: [{ text: assistantMsg.content }]
          });
        }
      }
    }
    
    const chat = model.startChat({
      history: historyMessages,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });
    
    const lastUserMessage = nonSystemMessages.find((msg, idx) => 
      msg.role === 'user' && (nonSystemMessages.length === idx + 1 || nonSystemMessages[idx + 1].role !== 'assistant')
    );
    
    if (!lastUserMessage) {
      throw new Error("Could not find last user message");
    }
    
    let userQuery = lastUserMessage.content;
    const systemMsg = messages.find(msg => msg.role === 'system');
    if (systemMsg) {
      userQuery = `[Context: ${systemMsg.content}]\n\n${userQuery}`;
    }
    
    const result = await chat.sendMessage(userQuery);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error chatting with AI:", error);
    throw error;
  }
}