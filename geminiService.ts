
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, QuizQuestion } from "../types";

export const getAITutorResponse = async (history: ChatMessage[], userInput: string, languagePreference: 'hinglish' | 'hindi' | 'english' = 'hinglish') => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prefInstruction = {
      hinglish: "DEFAULT: Use Hinglish (Hindi + English) with a cool, relatable Indian vibe. Mix in common slang like 'jugaad', 'bindaas', or 'mast' when appropriate.",
      hindi: "STRICT: Use pure, formal Hindi (Devanagari or Roman script) to explain English concepts.",
      english: "STRICT: Use only English for all explanations, feedback, and conversation."
    }[languagePreference];

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        { role: 'user', parts: [{ text: userInput }] }
      ],
      config: {
        systemInstruction: `You are Engu AI — your pocket-sized guide to smarter English speaking. 
        
        TONE & STYLE:
        - You are a culturally savvy and ultra-relatable English tutor for Indian learners.
        - You are like a supportive older sibling or a popular YouTube educator (e.g., Alakh Pandey or BeerBiceps vibe).
        - You understand diverse Indian dialects and "Indianisms" (like "I will do one thing", "passing out of college").
        - ${prefInstruction}

        CRITICAL RULES:
        1. CULTURAL NUANCE: Understand regional slang and context. If a user uses a word like 'vella' or 'tension mat lo', respond appropriately.
        2. EXPLAINING ENGLISH: Always provide clear English examples. If in Hinglish/Hindi mode, translate difficult terms.
        3. ERROR CORRECTION: Gently correct "Indianisms" into standard global English while acknowledging why we say them in India.
        4. TRANSLITERATION: Use Roman script for Hindi/Hinglish unless the user specifically uses Devanagari.
        
        Current User Preference: ${languagePreference.toUpperCase()}.`,
        temperature: 0.8,
      },
    });

    return response.text;
  } catch (error) {
    console.error("AI Tutor Error:", error);
    return "Arre, lagta hai network mein thodi problem hai. Ek baar phir se try karein?";
  }
};

export const generateQuiz = async (topic: string): Promise<QuizQuestion[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a 3-question English quiz about: ${topic}. Each question must have exactly 4 options and 1 correct answer (0-3 index). For Indian learners, include a Hinglish explanation in the explanation field. Return ONLY JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Quiz Generation Error:", error);
    return [];
  }
};

export const evaluateWriting = async (text: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Evaluate this English writing sample: "${text}". Provide feedback in a relatable Hinglish style so the user understands exactly how to improve.`,
    });
    return response.text;
}
