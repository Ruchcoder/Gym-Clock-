import { GoogleGenAI } from "@google/genai";

export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", {status:405});
  try {
    const {message, name="Member", appContext={}} = JSON.parse(req.body || "{}");
    if (!message?.trim()) return Response.json({error:"Message is required"},{status:400});
    if (!process.env.GEMINI_API_KEY) return Response.json({error:"GEMINI_API_KEY is not configured"},{status:503});
    const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are "Ask the Coach" inside the Gym Clock tracking and recommendation app. The user's name is ${name}. App options include focus: Lose fat, Build muscle, Tone up, Get stronger, General fitness; target areas: Full body, Upper body, Legs & glutes, Core & abs, Arms; experience: Beginner, Intermediate, Advanced; food budgets: Under ₦1,000, Under ₦2,000, No strict budget. Give concise, practical, safety-conscious fitness and general nutrition guidance. Do not diagnose medical conditions or encourage extreme dieting or unsafe training. Use the user's selected app context when relevant: ${JSON.stringify(appContext)}. If the question needs current facts, local prices, current products or other changing information, use Google Search grounding. User question: ${message}`,
      config: {tools:[{googleSearch:{}}]}
    });
    const grounding = response.candidates?.[0]?.groundingMetadata;
    const chunks = grounding?.groundingChunks || [];
    const sources = chunks.map(c=>c.web).filter(Boolean).map(x=>({title:x.title,url:x.uri}));
    return Response.json({text:response.text || "I couldn't generate an answer.",sources});
  } catch (e) {
    return Response.json({error:e.message||"Gemini request failed"},{status:500});
  }
};
