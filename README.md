# Nithin Babu B R — Portfolio

My personal portfolio site, built with plain HTML/CSS/JS and hosted on GitHub Pages.

**Live site:** https://nithinbabu369.github.io/personal-website/

## Tech

- HTML5, CSS3, Vanilla JS
- Python 3 (local dev server)
- Groq API + LLaMA 3 (chatbot)
- Cloudflare Workers (API proxy)

## Chatbot

The site includes **N.I.C.K.** (Nithin's Intelligent Copilot & Knowledgebase), a chat assistant that answers questions about my background and work. It calls a Cloudflare Worker, which forwards the request to the Groq API (LLaMA 3) with a system prompt built from my resume. If the Worker is unreachable, it falls back to a local knowledge base in the browser.

## Run locally

```bash
git clone https://github.com/nithinbabu369/personal-website.git
cd personal-website
python server.py
```

Open http://localhost:3000.

For AI-powered chatbot responses, create a `.env` file and set:

```
GROQ_API_KEY=your_key_here
```

Without it, the chatbot still works using the local fallback.

## Deploy

**Site:** Push to GitHub, then enable Pages under Settings → Pages (source: `main`, root `/`).

**Chatbot backend:** Follow `chatbot-backend/README.md` to deploy `worker.js` to Cloudflare Workers and add `GROQ_API_KEY` as a secret. Then update `CHATBOT_CONFIG.workerUrl` in `assets/js/chatbot.js` with your Worker URL.

## Project structure

```
personal-website/
├── index.html
├── about.html
├── experience.html
├── projects.html
├── skills.html
├── education.html
├── contact.html
├── 404.html
├── server.py
├── .env
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   └── chatbot.css
│   ├── js/
│   │   ├── script.js
│   │   ├── portfolio-logic.js
│   │   ├── chatbot.js
│   │   └── chatbot-logic.js
│   ├── images/
│   └── documents/
│       └── resume.pdf
└── chatbot-backend/
    ├── worker.js
    └── README.md
```
