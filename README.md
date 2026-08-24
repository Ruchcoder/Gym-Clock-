# Gym Clock — Firebase + personalised tracking app

This version keeps the approved UI while adding Firebase-backed authentication, visits, weight history, BMI labels, feedback, profile photos and theme settings.

## Firebase
1. Enable Authentication → Email/Password.
2. Create Firestore.
3. Create Storage.
4. Publish `firestore.rules` and `storage.rules`.

Developer feedback is saved under each signed-in user's `users/{uid}/feedback` collection in Firestore. The developer can review it in Firebase Console → Firestore Database.

## Exercise-tutorials
The goal plans now embed real YouTube exercise tutorials inside the app using YouTube's embeddable player. The app does not download or re-upload the videos. Video source/title metadata is intentionally hidden; only the exercise name, explanation and embedded 16:9 player are shown.

##  Shop
The Shop area is intentionally a clean **Coming Soon** section. No products or payment UI is displayed until a secure checkout/subscription system is ready.

## Ask the Coach + Gemini
The app calls `/api/gemini` through the Cloudflare Worker. The Coach UI includes quick suggestion chips and uses the `Ask` button. The Gemini backend is configured to use Google Search grounding when appropriate.

### If using Netlify
Set a server-side environment variable named `GEMINI_API_KEY` in Netlify's site settings, then redeploy. Never paste the key into `index.html` or any public JavaScript file.

### If using Cloudflare Workers
Use `cloudflare-worker.js` together with `wrangler.toml`. In Cloudflare Dashboard → Workers & Pages → your Worker → Settings → Variables and Secrets → Add a Secret, create:
`GEMINI_API_KEY`
with your Google AI Studio API key as the secret value, then deploy the Worker. Cloudflare's documentation recommends Secrets for API keys rather than public variables.

The Worker uses Gemini 2.5 Flash with the `google_search` tool for current information.

## BMI
Adult BMI categories are shown as Underweight, Within normal range, Overweight, or Obesity range. For anyone under 18, the app should not apply adult BMI categories; interpretation should use age- and sex-specific growth information with a qualified health professional.

## Where developer suggestions are stored
User feedback is saved in Firestore in two places: `users/{userId}/feedback` and the easier-to-review top-level `developerSuggestions` collection. In Firebase Console, open Firestore Database and select `developerSuggestions` to see suggestions from all users.
