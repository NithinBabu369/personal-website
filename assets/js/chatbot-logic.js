/**
 * Pure Verified Knowledge-Base Guardrails & Deterministic Preview Responder
 * Used as an offline/pre-deployment verified responder ONLY when workerUrl is not configured,
 * and shared with unit tests for strict off-topic/unavailable-info verification.
 */

export const BOT_NAME = 'N.I.C.K';
export const BOT_FULL_NAME = 'N.I.C.K — Nithin’s Intelligent Copilot & Knowledgebase';

export const GREETING_MESSAGE =
  "Greetings! I am N.I.C.K (Nithin’s Intelligent Copilot & Knowledgebase). I can assist you with Nithin's professional background, Generative AI & agentic systems, technical skills, work experience, education, and verified projects. What would you like to know?";

export const OFF_TOPIC_REFUSAL =
  "I am N.I.C.K, engineered specifically to answer questions about Nithin's professional background, skills, experience, and projects. Feel free to ask me something related to his portfolio.";

export const UNAVAILABLE_INFO_RESPONSE =
  "I don't have that information in Nithin's professional profile. Please contact him directly for further details.";

const DISALLOWED_PATTERNS = [
  /\b(system prompt|ignore previous|ignore instructions|reveal your prompt|api key|secret key|groq_api_key|jailbreak|act as|pretend to be|dan mode)\b/i,
  /\b(girlfriend|boyfriend|wife|husband|married|religion|politics|political|election|caste|horoscope|zodiac|favorite movie|favorite food|pizza|cricket|football|weather today|capital of|recipe for|joke|poem|sing a song)\b/i,
  /\b(write me a python script|debug my code|solve this leetcode|homework|medical advice|legal advice|financial advice|stock tip|crypto)\b/i,
];

const UNAVAILABLE_PROFESSIONAL_PATTERNS = [
  /\b(salary|compensation|expected ctc|current ctc|notice period|visa status|passport|date of birth|age|references|gpa breakdown|10th marks|12th marks)\b/i,
];

const PROFESSIONAL_ALLOW_KEYWORDS = [
  'nithin', 'babu', 'nick', 'N.I.C.K', 'copilot', 'assistant', 'about', 'who is', 'profile', 'summary', 'background', 'bio',
  'skill', 'tech', 'stack', 'language', 'python', 'sql', 'django', 'fastapi', 'react', 'javascript', 'typescript',
  'gen ai', 'generative ai', 'genai', 'llm', 'rag', 'retrieval', 'agentic', 'agent', 'langchain', 'langgraph', 'mcp', 'a2a', 'bleu', 'rouge',
  'experience', 'work', 'job', 'career', 'role', 'wadi', 'dubai', 'ladder7', 'trivandrum', 'first quadrant', 'london', 'intern',
  'project', 'portfolio', 'resume', 'cv', 'extraction', 'arc', 'report creator', 'documint', 'erp', 'churn', 'gig', 'grant', 'review',
  'education', 'degree', 'mca', 'kerala university', 'cgpa', 'college', 'study',
  'certif', 'udemy', 'ihrd', 'devtown', 'bootcamp', 'icgaife',
  'contact', 'email', 'phone', 'linkedin', 'github', 'reach', 'hire', 'consider', 'suitable', 'fit', 'strength', 'spoken', 'malayalam', 'hindi', 'english',
];

/**
 * Resolves the N.I.C.K. chatbot orb state based on panel open and busy status.
 */
export function getNickHologramState(isOpen, isBusy) {
  if (isBusy) return 'processing';
  if (isOpen) return 'active';
  return 'standby';
}

export function classifyQuestionIntent(question) {
  const text = String(question || '').trim();
  if (!text) return 'empty';

  if (DISALLOWED_PATTERNS.some((pattern) => pattern.test(text))) {
    return 'off_topic';
  }

  if (UNAVAILABLE_PROFESSIONAL_PATTERNS.some((pattern) => pattern.test(text))) {
    return 'unavailable';
  }

  const lower = text.toLowerCase();
  const hasProfessionalSignal = PROFESSIONAL_ALLOW_KEYWORDS.some((kw) => lower.includes(kw));

  // Treat short conversational greetings as portfolio-scoped onboarding
  if (/^(hi|hello|hey|good morning|good afternoon|good evening)[!.\s]*$/i.test(text)) {
    return 'greeting';
  }

  if (!hasProfessionalSignal) {
    return 'off_topic';
  }

  return 'professional';
}

export function generateLocalVerifiedResponse(question) {
  const intent = classifyQuestionIntent(question);

  if (intent === 'empty') {
    return 'Please enter a question about Nithin Babu B R’s professional profile.';
  }
  if (intent === 'off_topic') {
    return OFF_TOPIC_REFUSAL;
  }
  if (intent === 'unavailable') {
    return UNAVAILABLE_INFO_RESPONSE;
  }
  if (intent === 'greeting') {
    return GREETING_MESSAGE;
  }

  const q = question.toLowerCase();

  if (q.includes('who is nick') || q.includes('who is n.i.c.k') || q.includes('what is nick') || q.includes('what is n.i.c.k') || q.includes('about nick') || q.includes('about n.i.c.k')) {
    return 'I am N.I.C.K — Nithin’s Intelligent Copilot & Knowledgebase. I am an interactive AI copilot built to help engineering leads and recruiters explore Nithin Babu B R’s verified portfolio, Generative AI & agentic systems, technical skills, production projects, and work experience across Dubai, Trivandrum, and London.';
  }

  if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('reach') || q.includes('linkedin') || q.includes('github')) {
    return 'You can reach Nithin Babu B R via email at nithinbabuofficialid@gmail.com or phone at +91 8075271705. His profiles are on LinkedIn (linkedin.com/in/nithin-babu369) and GitHub (github.com/NithinBabu369).';
  }

  if (q.includes('generative ai') || q.includes('rag') || q.includes('llm')) {
    return 'Nithin has hands-on Generative AI experience building and evaluating a multi-document RAG research assistant at Ladder7 Nextstep Solutions LLP (using LLMs, embeddings, vector search, retrieved-context grounding, prompt refinement, LLM-as-a-Judge, BLEU, and ROUGE) as well as public projects like Resume Extraction System (Groq LLM + Pydantic + Instructor) and ARC — Automated Report Creator (FastAPI + Groq).';
  }

  if (q.includes('agentic') || q.includes('multi-agent') || q.includes('langgraph') || q.includes('mcp') || q.includes('a2a')) {
    return 'At Wadi Al Ain Documents Clearing Services in Dubai, Nithin developed components of an agentic grant-monitoring system using Python and browser automation to collect opportunities, track deadlines, and assess eligibility across 5+ funding sources. His documented agentic toolkit includes Agentic AI, Multi-Agent Systems, LangChain, LangGraph, MCP, and A2A.';
  }

  if (q.includes('programming language') || (q.includes('language') && !q.includes('spoken'))) {
    return 'Nithin’s documented programming and query languages are Python, SQL, JavaScript, TypeScript, HTML5, and CSS3.';
  }

  if (q.includes('spoken') || q.includes('malayalam') || q.includes('hindi')) {
    return 'Nithin is fluent in English and Hindi, and is a native speaker of Malayalam.';
  }

  if (q.includes('skill') || q.includes('tech') || q.includes('stack')) {
    return 'Nithin’s technical stack spans Generative AI & LLMs (RAG, LangChain, LangGraph, Embeddings, Tokenization, Vector Databases, System Prompt Design, Text-to-SQL, Model Quantization, MCP, A2A, BLEU, ROUGE), ML & Data Science (Scikit-Learn, Pandas, NumPy, EDA, OpenCV, OCR), Backend & Web (Python, SQL, Django, FastAPI, JavaScript, TypeScript, React, Node.js, Express, RESTful APIs), and Cloud/DevOps (PostgreSQL, Supabase, MongoDB, Docker, Kubernetes, AWS, Linux, Git).';
  }

  if (q.includes('education') || q.includes('degree') || q.includes('mca') || q.includes('university') || q.includes('cgpa')) {
    return 'Nithin holds a Master of Computer Applications (MCA) from Kerala University (2022 – 2024) with a CGPA of 7.68.';
  }

  if (q.includes('certif') || q.includes('udemy') || q.includes('ihrd') || q.includes('devtown')) {
    return 'Nithin’s documented certifications are: ICGAIFE2.0 offline (IHRD, Dec 2024), 100 Days of Code: The Complete Python Pro Bootcamp (Udemy, Aug 2024), Python and Machine Learning Bootcamp (DevTown, May 2023), and Complete 2023 Web Development Bootcamp by Angela Yu (Udemy, Mar 2023).';
  }

  if (q.includes('project')) {
    return 'Nithin’s documented AI and software projects include: (1) Multi-Document RAG Research Assistant with LLM-as-a-Judge, BLEU, and ROUGE evaluation; (2) Agentic Grant-Monitoring System across 5+ funding sources; (3) Resume Extraction System using Groq LLM, Pydantic, and Instructor; (4) ARC — Automated Report Creator with FastAPI & Groq; (5) Software Review Sentiment & Topic Analytics on 57,391 reviews (82.94% baseline accuracy); (6) Documint ERP with Supabase PostgreSQL RLS; and (7) Telecom Customer Churn Prediction.';
  }

  if (q.includes('experience') || q.includes('work') || q.includes('wadi') || q.includes('ladder7') || q.includes('first quadrant')) {
    return 'Nithin has experience as a Software Developer at Wadi Al Ain Documents Clearing Services in Dubai (Jul 2025 – Jun 2026, building automated invoice/payment-reminder workflows targeting 40% manual effort reduction and an agentic grant-monitoring system), Data Science Associate at Ladder7 Nextstep Solutions LLP in Trivandrum (Mar 2025 – Jun 2025, building and evaluating a multi-document RAG research assistant), and Data Science Intern at First Quadrant Labs in London (Dec 2024 – Feb 2025, analyzing 57,391 reviews with 82.94% emotion-classification baseline accuracy).';
  }

  if (q.includes('consider') || q.includes('why') || q.includes('hire') || q.includes('fit') || q.includes('role')) {
    return 'Based on his documented background, Nithin combines an MCA (7.68 CGPA) with practical delivery across Generative AI, RAG evaluation (LLM-as-a-Judge, BLEU, ROUGE), agentic automation across 5+ funding sources, ML text classification on 57,391 reviews (82.94% baseline accuracy), and Python/Django/FastAPI/Docker backend engineering.';
  }

  return 'Nithin Babu B R is a Generative AI Engineer and LLM & Agentic AI Developer based in Kollam, Kerala, with an MCA from Kerala University (7.68 CGPA). His experience spans Wadi Al Ain Documents Clearing Services (Dubai), Ladder7 Nextstep Solutions LLP (Trivandrum), and First Quadrant Labs (London), focusing on RAG systems, agentic workflows, ML text analytics, and Python/Django/FastAPI backend services.';
}
