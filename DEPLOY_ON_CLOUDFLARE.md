# Gym Clock — Cloudflare Workers deployment

## What this build changes
- Tutorial cards use a responsive 16:9 YouTube player.
- Exercise name, sets/reps and explanation stay above the video.
- YouTube source/title metadata is hidden from the app UI.
- Ask the Coach uses the Cloudflare Worker `/api/gemini` endpoint, with quick suggestions and an `Ask` button.
- Gemini 2.5 Flash-Lite is used for a faster/leaner Coach response, with Google Search grounding enabled.
- Dark theme explicitly styles the Coach chat, inputs, textarea, messages and placeholders.
- Shop is clearly marked Coming Soon; no products or payment flow is active.

## Cloudflare setup
1. Put this project in a GitHub repository with `wrangler.toml` and `cloudflare-worker.js` at the repository root.
2. `public/` contains the browser files.
3. Deploy the repository as a Cloudflare Worker.
4. Add a Worker Secret named `GEMINI_API_KEY` with your Gemini API key.
5. Redeploy.

Do not put the Gemini key in `index.html` or `firebase-config.js`.
