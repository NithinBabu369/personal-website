# Chatbot Backend — Cloudflare Worker + Groq API

This directory contains the serverless proxy (`worker.js`) that keeps your `GROQ_API_KEY` completely hidden from the public GitHub Pages frontend.

## Architecture

```text
Portfolio Website (GitHub Pages)
        │
        ▼  POST { message, history }
Cloudflare Worker (worker.js)
        │  - Validates origin (CORS)
        │  - Enforces rate limit (15 req/min per IP)
        │  - Validates input length & history
        │  - Injects verified resume knowledge base + strict system prompt
        ▼  Authorization: Bearer <GROQ_API_KEY secret>
Groq Chat Completions API
```

## Step-by-Step Deployment

### 1. Create a Groq API Key
1. Sign in to [console.groq.com](https://console.groq.com/).
2. Open **API Keys** and click **Create API Key**.
3. Copy the key once (never paste it into `index.html`, `chatbot.js`, or any GitHub repository).

### 2. Deploy to Cloudflare Workers

#### Option A: Cloudflare Dashboard (No CLI required)
1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com/) and go to **Workers & Pages** → **Create** → **Create Worker**.
2. Name the worker (for example: `nithin-portfolio-chatbot`) and click **Deploy**.
3. Click **Edit code**, replace the default script with the contents of `chatbot-backend/worker.js`, and click **Deploy**.
4. Go to **Settings** → **Variables and Secrets** → **Add**:
   - **Type**: `Secret` · **Name**: `GROQ_API_KEY` · **Value**: your Groq API key.
   - *(Optional)* **Type**: `Text` · **Name**: `GROQ_MODEL` · **Value**: `llama-3.3-70b-versatile`.
   - *(Optional)* **Type**: `Text` · **Name**: `ALLOWED_ORIGINS` · **Value**: `https://nithinbabu369.github.io`.
5. Copy your Worker URL (e.g. `https://nithin-portfolio-chatbot.<your-subdomain>.workers.dev`).

#### Option B: Wrangler CLI
```bash
npm install -g wrangler
wrangler login
wrangler init nithin-portfolio-chatbot --yes
# Copy chatbot-backend/worker.js to src/index.js
wrangler secret put GROQ_API_KEY
wrangler deploy
```

### 3. Connect the Frontend
Open `assets/js/chatbot.js` and set `CHATBOT_CONFIG.workerUrl` to your deployed Worker URL:
```js
const CHATBOT_CONFIG = {
  workerUrl: 'https://nithin-portfolio-chatbot.<your-subdomain>.workers.dev',
  ...
};
```
Commit and push to GitHub Pages.
