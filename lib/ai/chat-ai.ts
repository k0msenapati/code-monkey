import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export async function chatWithAI(messages: { role: string, content: string }[]): Promise<string> {
  try {
    // Filter out system messages as Gemini doesn't support them directly
    const nonSystemMessages = messages.filter(msg => msg.role !== 'system');
    
    // Make sure we have at least one user message
    if (nonSystemMessages.length === 0 || nonSystemMessages[0].role !== 'user') {
      throw new Error("First message must be from user");
    }
    
    // Convert messages to Gemini format - only include history pairs
    const historyMessages = [];
    
    // Process messages in pairs (user -> assistant)
    for (let i = 0; i < nonSystemMessages.length - 1; i += 2) {
      if (i + 1 < nonSystemMessages.length) {
        const userMsg = nonSystemMessages[i];
        const assistantMsg = nonSystemMessages[i + 1];
        
        // Only add complete pairs to history
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
    
    // Start chat with history
    const chat = model.startChat({
      history: historyMessages,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });
    
    // Get the last user message (the one we're responding to now)
    const lastUserMessage = nonSystemMessages.find((msg, idx) => 
      msg.role === 'user' && (nonSystemMessages.length === idx + 1 || nonSystemMessages[idx + 1].role !== 'assistant')
    );
    
    if (!lastUserMessage) {
      throw new Error("Could not find last user message");
    }
    
    // Include system message context in the user's message if present
    let userQuery = lastUserMessage.content;
    const systemMsg = messages.find(msg => msg.role === 'system');
    if (systemMsg) {
      userQuery = `[Context: ${systemMsg.content}]\n\n${userQuery}`;
    }
    
    // Send the message and get response
    const result = await chat.sendMessage(userQuery);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error chatting with AI:", error);
    throw error;
  }
}