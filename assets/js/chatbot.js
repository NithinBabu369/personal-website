import {
  GREETING_MESSAGE,
  generateLocalVerifiedResponse,
  BOT_NAME,
  BOT_FULL_NAME,
  getNickHologramState,
} from './chatbot-logic.js';

/**
 * Frontend Configuration for N.I.C.K (Nithin's Intelligent Copilot & Knowledgebase)
 *
 * SECURITY NOTICE:
 * Never place your Groq API key in this file or any frontend script.
 * Deploy `chatbot-backend/worker.js` to Cloudflare Workers with `GROQ_API_KEY`
 * saved as a Cloudflare Secret, then paste your Worker URL below.
 *
 * Example:
 * workerUrl: 'https://nithin-portfolio-chatbot.<your-subdomain>.workers.dev'
 */
const CHATBOT_CONFIG = {
  workerUrl: 'https://nithin-portfolio-chatbot.nithin69br.workers.dev',
  requestTimeoutMs: 15000,
  maxMessageLength: 600,
  maxHistoryMessages: 8,
};

const SUGGESTED_QUESTIONS = [
  'Who is N.I.C.K?',
  'Tell me about Nithin.',
  'What are his technical skills?',
  'What is his experience in Generative AI?',
  'Tell me about his AI projects.',
  'What is his educational background?',
  'What programming languages does he know?',
  'What experience does he have with Agentic AI?',
  'Why should we consider him for an AI Engineer role?',
  'How can I contact him?',
];

function ensureChatbotMarkup() {
  if (document.getElementById('chatbot-launcher')) {
    return;
  }

  const root = document.createElement('div');
  root.className = 'chatbot-root';
  root.innerHTML = `
    <button
      type="button"
      id="chatbot-launcher"
      class="chatbot-launcher nick-launcher"
      aria-label="Open ${BOT_FULL_NAME}"
      aria-expanded="false"
      aria-controls="chatbot-panel"
      data-holo-state="standby"
    >
      <!-- Concentric sonar rings that radiate outward on hover -->
      <span class="nick-pulse-ring ring-1" aria-hidden="true"></span>
      <span class="nick-pulse-ring ring-2" aria-hidden="true"></span>
      <span class="nick-pulse-ring ring-3" aria-hidden="true"></span>

      <!-- Animated holographic orb — gyroscope rings with glowing core -->
      <div class="nick-orb-wrap" aria-hidden="true">
        <svg class="nick-holo-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="nick-core-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
              <stop offset="28%" stop-color="#56cfe1" stop-opacity="0.95" />
              <stop offset="62%" stop-color="#f59e0b" stop-opacity="0.85" />
              <stop offset="100%" stop-color="#d97706" stop-opacity="0.12" />
            </radialGradient>
            <linearGradient id="nick-gold-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#56cfe1" />
              <stop offset="50%" stop-color="#fbbf24" />
              <stop offset="100%" stop-color="#f59e0b" />
            </linearGradient>
            <filter id="nick-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <!-- Outer segmented gyroscope ring with cardinal nodes (spins clockwise) -->
          <g class="nick-ring-outer">
            <circle cx="50" cy="50" r="44" stroke="url(#nick-gold-cyan)" stroke-width="1.3" stroke-dasharray="16 8 3 8 28 8 3 8" stroke-opacity="0.8" />
            <circle cx="50" cy="6" r="2" fill="#56cfe1" />
            <circle cx="94" cy="50" r="2" fill="#f59e0b" />
            <circle cx="50" cy="94" r="2" fill="#56cfe1" />
            <circle cx="6" cy="50" r="2" fill="#f59e0b" />
          </g>

          <!-- Middle counter-rotating gyro ring with frequency ticks -->
          <g class="nick-ring-mid">
            <circle cx="50" cy="50" r="35" stroke="#56cfe1" stroke-width="1.5" stroke-dasharray="24 10 12 10" stroke-opacity="0.88" />
            <circle cx="50" cy="50" r="31" stroke="#fbbf24" stroke-width="0.8" stroke-dasharray="4 6" stroke-opacity="0.65" />
          </g>

          <!-- Inner tri-arc ring (high speed) -->
          <g class="nick-ring-inner">
            <circle cx="50" cy="50" r="22" stroke="url(#nick-gold-cyan)" stroke-width="2" stroke-dasharray="20 16 10 16" stroke-linecap="round" />
            <circle cx="50" cy="28" r="1.8" fill="#ffffff" filter="url(#nick-glow)" />
          </g>

          <!-- Glowing neural core orb -->
          <circle class="nick-core-pulse" cx="50" cy="50" r="15" fill="url(#nick-core-grad)" filter="url(#nick-glow)" />
          <circle class="nick-core-point" cx="50" cy="50" r="5" fill="#ffffff" />

          <!-- Audio waveform bars — animate when active -->
          <g class="nick-waveform-bars">
            <line x1="38" y1="44" x2="38" y2="56" stroke="#56cfe1" stroke-width="1.8" stroke-linecap="round" class="wbar wbar-1" />
            <line x1="44" y1="40" x2="44" y2="60" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round" class="wbar wbar-2" />
            <line x1="50" y1="36" x2="50" y2="64" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" class="wbar wbar-3" />
            <line x1="56" y1="40" x2="56" y2="60" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round" class="wbar wbar-4" />
            <line x1="62" y1="44" x2="62" y2="56" stroke="#56cfe1" stroke-width="1.8" stroke-linecap="round" class="wbar wbar-5" />
          </g>
        </svg>
      </div>

      <div class="nick-label-group">
        <div class="nick-label-title-row">
          <span class="nick-name">${BOT_NAME}</span>
          
        </div>
        <span class="nick-status">
          <span class="nick-status-beacon" aria-hidden="true">
            <span class="nick-status-pulse"></span>
            <span class="nick-status-dot"></span>
          </span>
          <span class="nick-status-text">Online</span>
        </span>
      </div>
    </button>

    <section
      id="chatbot-panel"
      class="chatbot-panel"
      role="dialog"
      aria-modal="false"
      aria-labelledby="chatbot-title"
      hidden
    >
      <header class="chatbot-header">
        <div class="chatbot-header-identity">
          <div class="nick-mini-avatar" aria-hidden="true">
            <span class="nick-mini-pulse"></span>
            <span class="nick-mini-core"></span>
            <span class="nick-mini-ring ring-1"></span>
            <span class="nick-mini-ring ring-2"></span>
          </div>
          <div class="chatbot-title-wrap">
            <h2 id="chatbot-title" class="chatbot-title">${BOT_NAME}</h2>
            <p class="chatbot-subtitle">Nithin’s Intelligent Copilot &amp; Knowledgebase</p>
          </div>
        </div>
        <div class="chatbot-header-actions">
          <button
            type="button"
            id="chatbot-clear"
            class="chatbot-icon-btn"
            aria-label="Clear conversation"
            title="Clear conversation"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
            </svg>
          </button>
          <button
            type="button"
            id="chatbot-close"
            class="chatbot-icon-btn"
            aria-label="Close chatbot"
            title="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      <div
        id="chatbot-messages"
        class="chatbot-messages"
        role="log"
        aria-live="polite"
        aria-label="Chat history"
      ></div>

      <div
        id="chatbot-suggestions"
        class="chatbot-suggestions"
        aria-label="Suggested questions"
      ></div>

      <form id="chatbot-form" class="chatbot-form">
        <label for="chatbot-input" class="sr-only">Ask a question about Nithin Babu B R</label>
        <textarea
          id="chatbot-input"
          class="chatbot-input"
          rows="1"
          maxlength="600"
          placeholder="Ask N.I.C.K a question"
        ></textarea>
        <button type="submit" id="chatbot-send" class="chatbot-send-btn">
          Send
        </button>
      </form>
    </section>
  `;

  document.body.appendChild(root);
}

function initChatbot() {
  ensureChatbotMarkup();

  const launcher = document.getElementById('chatbot-launcher');
  const panel = document.getElementById('chatbot-panel');
  const closeBtn = document.getElementById('chatbot-close');
  const clearBtn = document.getElementById('chatbot-clear');
  const messagesEl = document.getElementById('chatbot-messages');
  const suggestionsEl = document.getElementById('chatbot-suggestions');
  const form = document.getElementById('chatbot-form');
  const input = document.getElementById('chatbot-input');
  const sendBtn = document.getElementById('chatbot-send');

  if (
    !launcher ||
    !panel ||
    !closeBtn ||
    !clearBtn ||
    !messagesEl ||
    !suggestionsEl ||
    !form ||
    !input ||
    !sendBtn
  ) {
    return;
  }

  let isOpen = false;
  let isBusy = false;
  let sessionHistory = [];

  const scrollToBottom = () => {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  };

  const appendMessage = (role, text, isError = false) => {
    const bubble = document.createElement('div');
    bubble.className = isError
      ? 'chat-msg chat-msg-error'
      : `chat-msg chat-msg-${role}`;
    bubble.textContent = text;
    messagesEl.appendChild(bubble);
    scrollToBottom();
    return bubble;
  };

  const showTypingIndicator = () => {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.setAttribute('aria-label', 'Assistant is typing');
    indicator.innerHTML =
      '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    messagesEl.appendChild(indicator);
    scrollToBottom();
    return indicator;
  };

  const resetConversation = () => {
    sessionHistory = [];
    messagesEl.innerHTML = '';
    appendMessage('assistant', GREETING_MESSAGE);
  };

  const renderSuggestions = () => {
    suggestionsEl.innerHTML = '';
    SUGGESTED_QUESTIONS.forEach((questionText) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'suggestion-btn';
      btn.textContent = questionText;
      btn.addEventListener('click', () => {
        if (!isOpen) setOpen(true);
        handleUserSubmit(questionText);
      });
      suggestionsEl.appendChild(btn);
    });
  };

  const setOpen = (open) => {
    isOpen = open;
    launcher.setAttribute('aria-expanded', String(open));
    launcher.dataset.holoState = getNickHologramState(open, isBusy);
    if (open) {
      panel.hidden = false;
      requestAnimationFrame(() => panel.classList.add('is-open'));
      setTimeout(() => input.focus(), 120);
    } else {
      panel.classList.remove('is-open');
      setTimeout(() => {
        if (!isOpen) panel.hidden = true;
      }, 200);
      launcher.focus();
    }
  };

  const setBusy = (busy) => {
    isBusy = busy;
    sendBtn.disabled = busy;
    input.disabled = busy;
    launcher.dataset.holoState = getNickHologramState(isOpen, busy);
  };

  const requestWorkerReply = async (messageText, historySnapshot) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CHATBOT_CONFIG.requestTimeoutMs);

    try {
      const response = await fetch(CHATBOT_CONFIG.workerUrl, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          history: historySnapshot.slice(-CHATBOT_CONFIG.maxHistoryMessages),
        }),
      });

      clearTimeout(timer);

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (response.status === 429) {
        throw new Error(
          data?.error || 'Too many requests. Please wait a moment and try again.'
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error || 'Unable to get a response from the AI service right now.'
        );
      }

      if (!data || typeof data.reply !== 'string' || !data.reply.trim()) {
        throw new Error('The assistant returned an empty response.');
      }

      return data.reply.trim();
    } catch (err) {
      clearTimeout(timer);
      if (err && err.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw err;
    }
  };

  const handleUserSubmit = async (rawText) => {
    if (isBusy) return;
    const text = String(rawText ?? input.value).trim();

    if (!text) return;

    if (text.length > CHATBOT_CONFIG.maxMessageLength) {
      appendMessage(
        'assistant',
        `Please shorten your question to ${CHATBOT_CONFIG.maxMessageLength} characters or fewer.`,
        true
      );
      return;
    }

    input.value = '';
    input.style.height = 'auto';
    appendMessage('user', text);

    const historyBeforeTurn = [...sessionHistory];
    setBusy(true);
    const typingEl = showTypingIndicator();

    try {
      let replyText;

      if (CHATBOT_CONFIG.workerUrl && CHATBOT_CONFIG.workerUrl.trim() !== '') {
        try {
          replyText = await requestWorkerReply(text, historyBeforeTurn);
        } catch (apiErr) {
          console.warn('[N.I.C.K.] Live API unreachable or failed; using verified local knowledge base.', apiErr);
          await new Promise((resolve) => setTimeout(resolve, 200));
          replyText = generateLocalVerifiedResponse(text);
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 260));
        replyText = generateLocalVerifiedResponse(text);
      }

      typingEl.remove();
      appendMessage('assistant', replyText);
      sessionHistory.push(
        { role: 'user', content: text },
        { role: 'assistant', content: replyText }
      );
      if (sessionHistory.length > CHATBOT_CONFIG.maxHistoryMessages) {
        sessionHistory = sessionHistory.slice(-CHATBOT_CONFIG.maxHistoryMessages);
      }
    } catch (err) {
      typingEl.remove();
      try {
        const fallback = generateLocalVerifiedResponse(text);
        appendMessage('assistant', fallback);
      } catch {
        appendMessage('assistant', 'I am currently unable to answer. Please reach out to Nithin directly.', true);
      }
    } finally {
      setBusy(false);
      if (isOpen) input.focus();
    }
  };

  launcher.addEventListener('click', () => setOpen(!isOpen));
  closeBtn.addEventListener('click', () => setOpen(false));
  clearBtn.addEventListener('click', () => {
    resetConversation();
    input.focus();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    handleUserSubmit();
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleUserSubmit();
    }
  });

  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 110)}px`;
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen) {
      setOpen(false);
    }
  });

  renderSuggestions();
  resetConversation();
}

document.addEventListener('DOMContentLoaded', initChatbot);
