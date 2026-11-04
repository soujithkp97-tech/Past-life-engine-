# PAST LIFE — THE UNKNOWN

A dark, cinematic web app starter for an AI-generated symbolic past-life reading.

## Requirements
- Node.js 18+
- An OpenAI API key with API billing/access enabled

## Run locally
1. Extract this project.
2. In this folder, run `npm install`.
3. Copy `.env.example` to `.env`.
4. Put your API key in `.env` as `OPENAI_API_KEY=...`.
5. Run `npm start`.
6. Open `http://localhost:3000`.

Never put your API key in `public/`, browser JavaScript, or a public repository.

## Deploy
Deploy this folder to a Node.js hosting service (for example Render or Railway). Set these environment variables in the host dashboard:
- `OPENAI_API_KEY` = your secret API key
- `OPENAI_MODEL` = a model available to your API project (default: `gpt-6-astra`)
- `NODE_ENV` = `production`

The host should run `npm install` and `npm start`. Use the HTTPS URL provided by the host to share the app.

## Important
- This is a starter project, not yet deployed to a public URL.
- API usage may incur charges. Set usage limits in your API provider dashboard.
- The reading is fictional/symbolic entertainment. Names and birth dates cannot establish a real past life.
- This starter does not save readings to a database. The server sends the submitted name and date of birth to the AI API to generate the response.
- Before public launch, add rate limiting, abuse protection, a privacy policy, and appropriate data retention controls.
- The hidden server prompt is not sent to the browser, but no software system can promise absolute secrecy against a determined operator or server compromise.
