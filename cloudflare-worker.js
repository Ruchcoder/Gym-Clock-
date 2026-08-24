/**
 * Optional Cloudflare Worker backend for Ask the Coach.
 * Keep GEMINI_API_KEY as a Cloudflare Secret; never put it in index.html.
 * The frontend calls /api/gemini first and falls back to the Netlify function.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/gemini" && request.method === "POST") {
      try {
        const { message, name = "Member", appContext = {} } = await request.json();
        if (!message?.trim()) return Response.json({ error: "Message is required" }, { status: 400 });
        if (!env.GEMINI_API_KEY) return Response.json({ error: "GEMINI_API_KEY is not configured" }, { status: 503 });

        const prompt = `You are "Ask the Coach" inside the Gym Clock tracking and recommendation app.\n\nApp options: Lose fat, Build muscle, Tone up, Get stronger, General fitness; target areas: Full body, Upper body, Legs & glutes, Core & abs, Arms; experience: Beginner, Intermediate, Advanced; food budgets: Under ₦1,000, Under ₦2,000, No strict budget.\n\nGive concise, practical, safety-conscious fitness and general nutrition guidance. Do not diagnose medical conditions or encourage extreme dieting or unsafe training. Use this user's selected context when relevant: ${JSON.stringify(appContext)}. If the question needs current facts, local prices, current products or other changing information, use Google Search grounding.\n\nUser: ${name}\nQuestion: ${message}`;

        const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent";
        const r = await fetch(endpoint, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-goog-api-key": env.GEMINI_API_KEY
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            tools: [{ google_search: {} }]
          })
        });
        const data = await r.json();
        if (!r.ok) return Response.json({ error: data?.error?.message || "Gemini request failed" }, { status: r.status });
        const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || "I couldn\'t generate an answer.";
        const chunks = data?.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = chunks.map(c => c.web).filter(Boolean).map(x => ({ title: x.title, url: x.uri }));
        return Response.json({ text, sources });
      } catch (e) {
        return Response.json({ error: e.message || "Gemini request failed" }, { status: 500 });
      }
    }
    return env.ASSETS.fetch(request);
  }
};
