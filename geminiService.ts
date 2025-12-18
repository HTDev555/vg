
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const assessActionRisk = async (actionType: string, params: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a brief technical risk assessment for the following system action:
      Action: ${actionType}
      Parameters: ${JSON.stringify(params)}
      
      Respond in 3 short bullet points focusing on Security, Compliance, and Stability. No conversational filler.`,
      config: {
        systemInstruction: "You are a senior security architect for ATLAS CONTROL. Your tone is cold, professional, and precise."
      }
    });

    return response.text || "Assessment unavailable.";
  } catch (error) {
    console.error("Risk assessment failed:", error);
    return "External security layer offline. Proceed with manual verification.";
  }
};
