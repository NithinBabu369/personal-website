/**
 * Pure frontend domain logic for project filtering and contact form validation.
 * Decoupled from DOM manipulation for clean unit testing.
 */

export function filterProjectsList(projects, activeCategory) {
  if (!Array.isArray(projects)) return [];
  if (!activeCategory || activeCategory === 'all') {
    return projects;
  }
  return projects.filter(
    (project) =>
      Array.isArray(project.categories) &&
      project.categories.includes(activeCategory)
  );
}

export function searchAndFilterProjects(projects, activeCategory, searchQuery) {
  const byCategory = filterProjectsList(projects, activeCategory);
  const query = String(searchQuery || '').trim().toLowerCase();
  if (!query) return byCategory;

  return byCategory.filter((project) => {
    const haystack = String(project.searchText || project.id || '').toLowerCase();
    return haystack.includes(query);
  });
}

export function validateContactForm(fields) {
  const errors = {};
  const name = String(fields?.name || '').trim();
  const email = String(fields?.email || '').trim();
  const subject = String(fields?.subject || '').trim();
  const message = String(fields?.message || '').trim();

  if (name.length < 2) {
    errors.name = 'Please enter your full name (at least 2 characters).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (subject.length < 3) {
    errors.subject = 'Please provide a brief subject (at least 3 characters).';
  }

  if (message.length < 10) {
    errors.message = 'Please include a message of at least 10 characters.';
  } else if (message.length > 2000) {
    errors.message = 'Message must be 2,000 characters or fewer.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized: { name, email, subject, message },
  };
}

export function buildMailtoHref(recipientEmail, { name, email, subject, message }) {
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    '',
    message,
  ].join('\n');

  const params = new URLSearchParams({
    subject: `[Portfolio Inquiry] ${subject}`,
    body,
  });

  return `mailto:${recipientEmail}?${params.toString()}`;
}

const KNOWN_PAGES = new Set([
  'index',
  'about',
  'experience',
  'projects',
  'skills',
  'education',
  'contact',
]);

export function getActivePageSlug(pathname) {
  const clean = String(pathname || '')
    .split('?')[0]
    .split('#')[0]
    .replace(/\/+$/, '');

  if (!clean || clean === '/' || clean.endsWith('/personal-website')) {
    return 'index';
  }

  const lastSegment = clean.split('/').pop() || 'index';
  const slug = lastSegment.replace(/\.html?$/i, '').toLowerCase() || 'index';
  return KNOWN_PAGES.has(slug) ? slug : 'index';
}

export const BLUEPRINT_SYSTEMS = [
  {
    id: 'rag-assistant',
    label: 'Multi-Doc RAG Assistant',
    context: 'Ladder7 Nextstep Solutions LLP · R&D System',
    accent: 'cyan',
    summary:
      'Grounded research workflow turning multi-document corpora into cited answers tested for faithfulness and hallucination resistance.',
    stages: [
      {
        step: '01',
        name: 'Document Chunking',
        role: 'Ingestion & Tokenization',
        stack: ['Python', 'Tokenization', 'Document Parsing'],
        detail:
          'Splits multi-document research files into semantically coherent passages with controlled overlap and metadata tracking before indexing.',
        verification: 'Verified boundary preservation across multi-page source documents.',
      },
      {
        step: '02',
        name: 'Vector Retrieval',
        role: 'Embeddings & Similarity Search',
        stack: ['Embeddings', 'Vector Databases', 'Semantic Search'],
        detail:
          'Encodes queries and chunks into dense vector representations to retrieve top-k grounded passages relevant to the user question.',
        verification: 'Measured retrieval relevance and context coverage across evaluation queries.',
      },
      {
        step: '03',
        name: 'Grounded Generation',
        role: 'Prompting & Dockerized API',
        stack: ['LLMs', 'System Prompt Design', 'RESTful APIs', 'Docker'],
        detail:
          'Conditions the language model strictly on retrieved context slices via containerized REST services for deterministic deployment.',
        verification: 'Validated API request handling, response structure, and service interoperability.',
      },
      {
        step: '04',
        name: 'Quality Evaluation',
        role: 'LLM-as-a-Judge & N-gram Metrics',
        stack: ['LLM-as-a-Judge', 'BLEU', 'ROUGE', 'Embedding Similarity'],
        detail:
          'Scores generated outputs for correctness, faithfulness, consistency, and potential hallucinations against reference criteria.',
        verification: 'Combined automated lexical metrics with rubric-based judge evaluations.',
      },
    ],
  },
  {
    id: 'agentic-grant',
    label: 'Agentic Grant Monitor',
    context: 'Wadi Al Ain Documents Clearing Services · Production',
    accent: 'violet',
    summary:
      'Automated browser and backend pipeline collecting grant opportunities, monitoring deadlines, and verifying SQL state consistency.',
    stages: [
      {
        step: '01',
        name: 'Browser Discovery',
        role: 'Automated Web Collection',
        stack: ['Python', 'Browser Automation', 'Multi-Source Crawling'],
        detail:
          'Navigates 5+ external funding portals programmatically to gather active grant listings and structured deadline metadata.',
        verification: 'Tested across heterogeneous portal layouts and network timeout scenarios.',
      },
      {
        step: '02',
        name: 'Eligibility Reasoning',
        role: 'Agentic Criteria Assessment',
        stack: ['Agentic AI', 'Prompt Design', 'Structured Rules'],
        detail:
          'Evaluates collected opportunities against target eligibility parameters, filing windows, and organizational constraints.',
        verification: 'Cross-checked deadline calculations and eligibility classification outputs.',
      },
      {
        step: '03',
        name: 'Django & SQL Sync',
        role: 'Backend Persistence & APIs',
        stack: ['Django', 'SQL', 'RESTful APIs'],
        detail:
          'Persists vetted grant records and connects seamlessly with backend payment-tracking and 3-stage automated reminder workflows.',
        verification: 'Validated SQL transactions, input sanitization, and backend endpoint integrity.',
      },
      {
        step: '04',
        name: 'Workflow Reliability',
        role: 'Failure & Consistency Testing',
        stack: ['Test Automation', 'Failure Handling', 'Data Consistency'],
        detail:
          'Executes multi-step workflow verification to guard against partial writes, duplicate entries, and unhandled edge failures.',
        verification: 'Investigated edge-case defects and verified fixes before release.',
      },
    ],
  },
  {
    id: 'groq-extractor',
    label: 'Groq Schema Extractor',
    context: 'Open Source · Resume Extraction & ARC',
    accent: 'emerald',
    summary:
      'High-speed LLM extraction pipeline converting unstructured PDF/DOCX documents into strictly validated JSON payloads.',
    stages: [
      {
        step: '01',
        name: 'File Parsing',
        role: 'PDF & DOCX Text Extraction',
        stack: ['PyMuPDF', 'python-docx', 'Python'],
        detail:
          'Extracts clean reading-order text from binary PDF and Word documents while stripping formatting noise.',
        verification: 'Handles multi-column layouts and mixed document encodings cleanly.',
      },
      {
        step: '02',
        name: 'Groq Inference',
        role: 'Low-Latency LLM Extraction',
        stack: ['Groq API', 'System Prompt Design', 'Structured Output'],
        detail:
          'Streams extracted document context to Groq-hosted LLMs configured with explicit extraction instructions.',
        verification: 'Maintains fast turnaround for both single CVs and loan report drafts.',
      },
      {
        step: '03',
        name: 'Pydantic Contract',
        role: 'Schema Enforcement & Retries',
        stack: ['Instructor', 'Pydantic', 'JSON Schema'],
        detail:
          'Binds model outputs to strict typed Pydantic schemas so missing fields or malformed types trigger automatic structured correction.',
        verification: 'Guarantees ordered, strongly typed JSON for downstream consumers.',
      },
      {
        step: '04',
        name: 'Dual Delivery',
        role: 'FastAPI Service & Interactive UI',
        stack: ['FastAPI', 'Streamlit', 'REST APIs'],
        detail:
          'Exposes the validated extractor via production FastAPI endpoints and a live interactive Streamlit web application.',
        verification: 'Deployed publicly with live interactive demo and open GitHub source.',
      },
    ],
  },
];

export function getBlueprintSystem(systemId) {
  return (
    BLUEPRINT_SYSTEMS.find((sys) => sys.id === systemId) || BLUEPRINT_SYSTEMS[0]
  );
}

export function getBlueprintStage(systemId, stageStep) {
  const system = getBlueprintSystem(systemId);
  const stage =
    system.stages.find((s) => s.step === stageStep) || system.stages[0];
  return { system, stage };
}

export const MATRIX_GLYPHS = '01λΣΔ{}[]<>/=*+-AI';
export const MATRIX_DENSITY_GLYPHS = ' .:-=+*#%01λΔΣ{}[]AIMW';

/**
 * Enhances grayscale pixel luminance [0..1] for high-contrast Matrix portrait clarity
 * while keeping a subtle rain floor in shadow regions.
 */
export function enhanceMatrixLuminance(rawLum) {
  const clamped = Math.max(0, Math.min(1, Number(rawLum) || 0));
  const contrasted = 1 / (1 + Math.exp(-7.2 * (clamped - 0.38)));
  const minFloor = 0.06;
  return Math.max(minFloor, Math.min(1, minFloor + contrasted * (1 - minFloor)));
}

/**
 * Selects a Matrix character weighted by local pixel luminance and seeded randomness.
 */
export function selectMatrixGlyph(luminance, jitter = 0.5, glyphs = MATRIX_DENSITY_GLYPHS) {
  const len = glyphs.length;
  if (!len) return '1';
  const norm = Math.max(0, Math.min(1, luminance * 0.82 + jitter * 0.18));
  const idx = Math.min(len - 1, Math.max(0, Math.floor(norm * (len - 1))));
  return glyphs[idx];
}

export function advanceMatrixColumn(col, frameHeight, fontSize, dtScale) {
  const step = col.speed * dtScale;
  let nextY = col.y + step;
  const maxTravel = frameHeight + col.trailLength * fontSize;
  let wrapped = false;
  if (nextY > maxTravel) {
    nextY = -fontSize * (1 + (col.resetOffset || 2));
    wrapped = true;
  }
  return {
    ...col,
    y: nextY,
    wrapped,
  };
}

export function wrapCarouselIndex(index, total) {
  if (!total || total <= 0) return 0;
  return ((index % total) + total) % total;
}

export function computeCarouselOffset(index, activeIndex, total) {
  if (!total || total <= 0) return 0;
  const half = Math.floor(total / 2);
  let diff = wrapCarouselIndex(index, total) - wrapCarouselIndex(activeIndex, total);
  if (diff > half) diff -= total;
  if (diff < -half) diff += total;
  return diff;
}

export function computeCarouselCardState(index, activeIndex, total, isCompact = false) {
  const offset = computeCarouselOffset(index, activeIndex, total);
  const absOffset = Math.abs(offset);
  const sign = offset < 0 ? -1 : offset > 0 ? 1 : 0;

  if (offset === 0) {
    return {
      offset: 0,
      txPercent: 0,
      tzPx: 0,
      rotateYDeg: 0,
      scale: 1,
      opacity: 1,
      zIndex: 6,
      isVisible: true,
      isActive: true,
    };
  }

  if (absOffset === 1) {
    return {
      offset,
      txPercent: sign * (isCompact ? 10 : 60),
      tzPx: isCompact ? -120 : -160,
      rotateYDeg: sign * (isCompact ? -10 : -26),
      scale: isCompact ? 0.89 : 0.87,
      opacity: isCompact ? 0.28 : 0.78,
      zIndex: 4,
      isVisible: true,
      isActive: false,
    };
  }

  if (absOffset === 2 && !isCompact) {
    return {
      offset,
      txPercent: sign * 102,
      tzPx: -280,
      rotateYDeg: sign * -40,
      scale: 0.74,
      opacity: 0.34,
      zIndex: 2,
      isVisible: true,
      isActive: false,
    };
  }

  return {
    offset,
    txPercent: sign * (isCompact ? 45 : 132),
    tzPx: -380,
    rotateYDeg: sign * -48,
    scale: 0.64,
    opacity: 0,
    zIndex: 1,
    isVisible: false,
    isActive: false,
  };
}

export const SKILL_CONTEXT_MAP = {
  'Generative AI': {
    domain: 'Generative AI & LLMs',
    usage: 'Production-oriented LLM workflows, RAG assistants, and structured report generation.',
  },
  RAG: {
    domain: 'Generative AI & LLMs',
    usage: 'Multi-Document RAG Research Assistant built and evaluated at Ladder7 Nextstep Solutions LLP.',
  },
  'LLM Application Dev': {
    domain: 'Generative AI & LLMs',
    usage: 'Resume Extraction System, ARC — Automated Report Creator, and Ladder7 RAG pipelines.',
  },
  'System Prompt Design': {
    domain: 'Generative AI & LLMs',
    usage: 'Prompt refinement for grounded context adherence and structured extraction schemas.',
  },
  Tokenization: {
    domain: 'Generative AI & LLMs',
    usage: 'Document chunking boundaries and token-aware passage indexing for retrieval.',
  },
  Embeddings: {
    domain: 'Generative AI & LLMs',
    usage: 'Semantic vector encoding and embedding similarity scoring at Ladder7 Nextstep Solutions.',
  },
  'Vector Databases': {
    domain: 'Generative AI & LLMs',
    usage: 'Vector search retrieval pipelines grounding multi-document LLM answers.',
  },
  'Text-to-SQL': {
    domain: 'Generative AI & LLMs',
    usage: 'Natural language to structured SQL translation workflows.',
  },
  'Model Quantization': {
    domain: 'Generative AI & LLMs',
    usage: 'Applied model footprint optimization for constrained inference runtimes.',
  },
  BLEU: {
    domain: 'Generative AI & LLMs',
    usage: 'N-gram overlap evaluation alongside LLM-as-a-Judge in RAG QA benchmarking.',
  },
  ROUGE: {
    domain: 'Generative AI & LLMs',
    usage: 'Recall-oriented lexical scoring for multi-document RAG faithfulness checks.',
  },
  'Agentic AI': {
    domain: 'Agentic AI & Frameworks',
    usage: 'Agentic grant-monitoring workflow at Wadi Al Ain tracking 5+ funding portals.',
  },
  'Multi-Agent Systems': {
    domain: 'Agentic AI & Frameworks',
    usage: 'Coordinated task decomposition across discovery, deadline validation, and eligibility steps.',
  },
  LangChain: {
    domain: 'Agentic AI & Frameworks',
    usage: 'LLM chaining, retrieval integrations, and structured prompt orchestration.',
  },
  LangGraph: {
    domain: 'Agentic AI & Frameworks',
    usage: 'Stateful multi-step agent execution graphs and verification routing.',
  },
  MCP: {
    domain: 'Agentic AI & Frameworks',
    usage: 'Model Context Protocol tool-interface integration for structured agent capabilities.',
  },
  A2A: {
    domain: 'Agentic AI & Frameworks',
    usage: 'Agent-to-Agent interoperability patterns for multi-step workflows.',
  },
  'Scikit-Learn': {
    domain: 'Machine Learning & Vision',
    usage: '82.94% emotion classification baseline on 57,391 reviews and Telecom Churn stacking models.',
  },
  Pandas: {
    domain: 'Machine Learning & Vision',
    usage: 'CSV ingestion validation, duplicate detection, and tabular feature pipelines.',
  },
  NumPy: {
    domain: 'Machine Learning & Vision',
    usage: 'Vectorized numerical preprocessing and model evaluation metrics.',
  },
  EDA: {
    domain: 'Machine Learning & Vision',
    usage: 'Exploratory analysis across 57,391 software reviews and telecom customer churn datasets.',
  },
  OpenCV: {
    domain: 'Machine Learning & Vision',
    usage: 'Image preprocessing and computer vision pipelines.',
  },
  OCR: {
    domain: 'Machine Learning & Vision',
    usage: 'Optical text extraction for document processing workflows.',
  },
  'Computer Vision': {
    domain: 'Machine Learning & Vision',
    usage: 'Visual preprocessing and feature analysis with OpenCV and OCR.',
  },
  Python: {
    domain: 'Languages & Web Stack',
    usage: 'Core language across Wadi Al Ain automation, Ladder7 RAG, First Quadrant ML, and FastAPI services.',
  },
  SQL: {
    domain: 'Languages & Web Stack',
    usage: 'Backend database operations and SQL integrity verification at Wadi Al Ain.',
  },
  Django: {
    domain: 'Languages & Web Stack',
    usage: 'Backend REST API validation, input handling, and defect verification in Dubai.',
  },
  FastAPI: {
    domain: 'Languages & Web Stack',
    usage: 'Production REST backends powering Resume Extraction System and ARC.',
  },
  JavaScript: {
    domain: 'Languages & Web Stack',
    usage: 'Interactive frontend engineering including Transparent Gig Earnings Dashboard.',
  },
  TypeScript: {
    domain: 'Languages & Web Stack',
    usage: 'Type-safe multi-tenant portal architecture in Documint ERP.',
  },
  React: {
    domain: 'Languages & Web Stack',
    usage: 'Component-driven web interfaces and modern Next.js frontend builds.',
  },
  'Node.js': {
    domain: 'Languages & Web Stack',
    usage: 'Server-side JavaScript services and full-stack tooling.',
  },
  Express: {
    domain: 'Languages & Web Stack',
    usage: 'Lightweight REST API routing and middleware services.',
  },
  HTML5: {
    domain: 'Languages & Web Stack',
    usage: 'Semantic, accessible web markup and SEO-structured documents.',
  },
  CSS3: {
    domain: 'Languages & Web Stack',
    usage: 'Responsive grid/flex architectures, glassmorphism surfaces, and 3D transforms.',
  },
  'RESTful APIs': {
    domain: 'Languages & Web Stack',
    usage: 'AI service integration and endpoint contract validation across Dockerized workflows.',
  },
  PostgreSQL: {
    domain: 'Databases, Cloud & Tools',
    usage: 'Database-level multi-tenant Row Level Security (RLS) policies in Documint ERP.',
  },
  Supabase: {
    domain: 'Databases, Cloud & Tools',
    usage: 'Auth and PostgreSQL RLS enforcement inside Documint ERP.',
  },
  MongoDB: {
    domain: 'Databases, Cloud & Tools',
    usage: 'Document-oriented persistence for flexible JSON payloads.',
  },
  Docker: {
    domain: 'Databases, Cloud & Tools',
    usage: 'Containerized AI services integrated and tested via REST APIs at Ladder7.',
  },
  Kubernetes: {
    domain: 'Databases, Cloud & Tools',
    usage: 'Container orchestration and scalable workload concepts.',
  },
  AWS: {
    domain: 'Databases, Cloud & Tools',
    usage: 'Cloud deployment workflows and infrastructure tooling.',
  },
  Linux: {
    domain: 'Databases, Cloud & Tools',
    usage: 'CLI workflows, service environments, and deployment environments.',
  },
  Git: {
    domain: 'Databases, Cloud & Tools',
    usage: 'Version control across production deliverables and open-source builds.',
  },
  GitHub: {
    domain: 'Databases, Cloud & Tools',
    usage: 'Open-source repositories, CI collaboration, and static site hosting.',
  },
  Vite: {
    domain: 'Databases, Cloud & Tools',
    usage: 'Fast modern frontend bundling in Documint ERP.',
  },
  'VS Code': {
    domain: 'Databases, Cloud & Tools',
    usage: 'Primary development and debugging environment.',
  },
  'Test Automation': {
    domain: 'Databases, Cloud & Tools',
    usage: 'Multi-step workflow validation, failure-handling checks, and SQL consistency verification.',
  },
  'Problem-Solving': {
    domain: 'Engineering & Soft Skills',
    usage: 'Root-cause defect investigation and workflow reliability engineering.',
  },
  'Cross-Functional Collaboration': {
    domain: 'Engineering & Soft Skills',
    usage: 'Delivered issue-level product briefings for Product Managers at First Quadrant Labs.',
  },
  'Technical Documentation': {
    domain: 'Engineering & Soft Skills',
    usage: 'Clear architecture docs, defect reports, and RAG evaluation criteria.',
  },
  Leadership: {
    domain: 'Engineering & Soft Skills',
    usage: 'Coordinating engineering tasks and quality standards across deliverables.',
  },
  'Analytical Thinking': {
    domain: 'Engineering & Soft Skills',
    usage: 'Statistical feature pruning, 57k+ review analysis, and systematic evaluation.',
  },
  Communication: {
    domain: 'Engineering & Soft Skills',
    usage: 'Fluent in English and Hindi, native in Malayalam; clear stakeholder alignment.',
  },
};

export function getSkillContext(skillName) {
  const key = String(skillName || '').trim();
  if (SKILL_CONTEXT_MAP[key]) {
    return { name: key, ...SKILL_CONTEXT_MAP[key] };
  }
  return {
    name: key || 'Technical Capability',
    domain: 'Verified Portfolio Stack',
    usage: 'Applied across Nithin Babu B R’s verified engineering projects and production workflows.',
  };
}

export const SKILL_CONNECTIONS = {
  'Generative AI': ['RAG', 'LLM Application Dev', 'Agentic AI', 'System Prompt Design', 'Python'],
  RAG: ['Generative AI', 'Embeddings', 'Vector Databases', 'Tokenization', 'LangChain', 'BLEU', 'ROUGE', 'Docker'],
  'Agentic AI': ['Generative AI', 'LangGraph', 'Multi-Agent Systems', 'MCP', 'A2A', 'Python', 'Django', 'Test Automation'],
  'LLM Application Dev': ['Generative AI', 'Python', 'FastAPI', 'RESTful APIs', 'System Prompt Design', 'LangChain'],
  LangGraph: ['Agentic AI', 'Multi-Agent Systems', 'LangChain', 'Python', 'MCP', 'A2A'],
  LangChain: ['RAG', 'LangGraph', 'LLM Application Dev', 'Embeddings', 'Vector Databases', 'Python'],
  'Multi-Agent Systems': ['Agentic AI', 'LangGraph', 'MCP', 'A2A', 'Python'],
  MCP: ['Agentic AI', 'LangGraph', 'Multi-Agent Systems', 'A2A', 'RESTful APIs'],
  A2A: ['Agentic AI', 'LangGraph', 'Multi-Agent Systems', 'MCP'],
  Embeddings: ['RAG', 'Vector Databases', 'LangChain', 'Python', 'NumPy'],
  'Vector Databases': ['RAG', 'Embeddings', 'LangChain', 'Docker', 'PostgreSQL'],
  'System Prompt Design': ['Generative AI', 'LLM Application Dev', 'RAG', 'BLEU', 'ROUGE'],
  'Text-to-SQL': ['SQL', 'PostgreSQL', 'Generative AI', 'Python', 'System Prompt Design'],
  Tokenization: ['RAG', 'Embeddings', 'Python', 'LLM Application Dev'],
  'Model Quantization': ['Generative AI', 'Python', 'Docker', 'Linux'],
  BLEU: ['RAG', 'ROUGE', 'System Prompt Design', 'Python'],
  ROUGE: ['RAG', 'BLEU', 'System Prompt Design', 'Python'],
  Python: ['Django', 'FastAPI', 'Scikit-Learn', 'Pandas', 'NumPy', 'OpenCV', 'SQL', 'Generative AI', 'Agentic AI'],
  FastAPI: ['Python', 'RESTful APIs', 'Docker', 'LLM Application Dev'],
  Django: ['Python', 'SQL', 'RESTful APIs', 'Agentic AI', 'Test Automation'],
  'Scikit-Learn': ['Python', 'Pandas', 'NumPy', 'EDA'],
  Pandas: ['Python', 'Scikit-Learn', 'NumPy', 'EDA', 'SQL'],
  NumPy: ['Python', 'Scikit-Learn', 'Pandas', 'Embeddings'],
  EDA: ['Python', 'Pandas', 'Scikit-Learn', 'Analytical Thinking'],
  OpenCV: ['Computer Vision', 'OCR', 'Python', 'NumPy'],
  OCR: ['Computer Vision', 'OpenCV', 'Python'],
  'Computer Vision': ['OpenCV', 'OCR', 'Python', 'NumPy'],
  SQL: ['PostgreSQL', 'Django', 'Python', 'Text-to-SQL', 'Test Automation'],
  JavaScript: ['TypeScript', 'React', 'Node.js', 'HTML5', 'CSS3', 'RESTful APIs'],
  TypeScript: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'Supabase', 'Vite'],
  React: ['JavaScript', 'TypeScript', 'Vite', 'HTML5', 'CSS3'],
  'Node.js': ['JavaScript', 'TypeScript', 'Express', 'RESTful APIs'],
  Express: ['Node.js', 'JavaScript', 'RESTful APIs', 'MongoDB'],
  'RESTful APIs': ['FastAPI', 'Django', 'Express', 'Docker', 'LLM Application Dev'],
  HTML5: ['CSS3', 'JavaScript', 'React', 'Vite'],
  CSS3: ['HTML5', 'JavaScript', 'React'],
  PostgreSQL: ['SQL', 'Supabase', 'TypeScript', 'Vector Databases'],
  Supabase: ['PostgreSQL', 'TypeScript', 'Vite'],
  Docker: ['Kubernetes', 'AWS', 'Linux', 'FastAPI', 'RAG', 'RESTful APIs'],
  Kubernetes: ['Docker', 'AWS', 'Linux'],
  AWS: ['Docker', 'Kubernetes', 'Linux', 'PostgreSQL'],
  MongoDB: ['Express', 'Node.js', 'Python'],
  Linux: ['Docker', 'Kubernetes', 'AWS', 'Git', 'Python'],
  Git: ['GitHub', 'VS Code', 'Linux'],
  GitHub: ['Git', 'Test Automation'],
  Vite: ['TypeScript', 'React', 'Supabase', 'HTML5'],
  'Test Automation': ['Django', 'Agentic AI', 'SQL', 'GitHub'],
  'VS Code': ['Git', 'Python', 'TypeScript'],
  'Problem-Solving': ['Analytical Thinking', 'Test Automation', 'System Prompt Design'],
  'Cross-Functional Collaboration': ['Technical Documentation', 'Communication', 'Leadership'],
  'Technical Documentation': ['Cross-Functional Collaboration', 'Communication', 'RESTful APIs'],
  'Analytical Thinking': ['Problem-Solving', 'EDA', 'Scikit-Learn'],
  Leadership: ['Cross-Functional Collaboration', 'Communication'],
  Communication: ['Cross-Functional Collaboration', 'Technical Documentation', 'Leadership'],
};

export function getConnectedSkills(skillName) {
  const key = String(skillName || '').trim();
  if (!key) return [];
  const connected = new Set(SKILL_CONNECTIONS[key] || []);
  for (const [other, neighbors] of Object.entries(SKILL_CONNECTIONS)) {
    if (other !== key && neighbors.includes(key)) {
      connected.add(other);
    }
  }
  connected.delete(key);
  return Array.from(connected);
}

export const MATRIX_DECODE_GLYPHS = '01λΔΣ{}[]<>/=*+';

export function stepMatrixDecodeFrame(targetText, progressRatio, glyphs = MATRIX_DECODE_GLYPHS) {
  const source = String(targetText || '');
  const progress = Math.max(0, Math.min(1, Number(progressRatio) || 0));
  if (progress >= 1 || !source) return source;
  const charset = glyphs && glyphs.length ? glyphs : MATRIX_DECODE_GLYPHS;
  const resolvedCount = Math.floor(source.length * progress);
  let out = '';
  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === ' ' || ch === '·' || ch === '&' || ch === '-' || i < resolvedCount) {
      out += ch;
    } else {
      const seedIdx = Math.floor((i * 7 + progress * 43) % charset.length);
      out += charset[seedIdx];
    }
  }
  return out;
}

/**
 * Computes soft elliptical/edge alpha vignette [0..1] for borderless Matrix portraits
 * so glyphs fade smoothly to zero before reaching canvas edges.
 */
export function computeEdgeVignette(u, v) {
  const cu = Math.max(0, Math.min(1, Number(u) || 0));
  const cv = Math.max(0, Math.min(1, Number(v) || 0));
  const nu = (cu - 0.5) * 2;
  const nv = (cv - 0.5) * 2;

  // Wide elliptical feather so core subject is 100% clear and outer edges merge seamlessly
  const radialDist = Math.hypot(nu * 0.90, nv * 0.90);
  const rT = Math.max(0, Math.min(1, (1.02 - radialDist) / 0.50));
  const radialSmooth = rT * rT * (3 - 2 * rT);

  // Smoothstep margin taper over outer 20% on all 4 sides to eliminate any rectangular border
  const mx = Math.min(cu, 1 - cu);
  const my = Math.min(cv, 1 - cv);
  const ex = Math.max(0, Math.min(1, mx / 0.20));
  const ey = Math.max(0, Math.min(1, my / 0.20));
  const edgeSmoothX = ex * ex * (3 - 2 * ex);
  const edgeSmoothY = ey * ey * (3 - 2 * ey);

  return Math.max(0, Math.min(1, radialSmooth * edgeSmoothX * edgeSmoothY));
}

/**
 * Returns global portrait materialization progress [0..1] across the infinite loop:
 * [0.00..0.12) Pure Matrix digital rain
 * [0.12..0.40) Organic Matrix-to-Portrait formation
 * [0.40..0.76) Crisp portrait hold with subtle live Matrix streams
 * [0.76..0.96) Organic Portrait-to-Matrix dissolve back into falling rain
 * [0.96..1.00) Pure Matrix digital rain
 */
export function computeMatrixLoopProgress(loopPhase) {
  const phase = ((Number(loopPhase) || 0) % 1 + 1) % 1;
  if (phase < 0.12 || phase >= 0.96) return 0;
  if (phase < 0.40) {
    const t = (phase - 0.12) / 0.28;
    return t * t * (3 - 2 * t);
  }
  if (phase <= 0.76) return 1;
  const t = 1 - (phase - 0.76) / 0.20;
  return t * t * (3 - 2 * t);
}

/**
 * Computes deterministic organic per-cell Matrix materialization state without any sweeping wave:
 * bright features and scattered digital-rain columns crystallize into the portrait and dissolve back into code.
 */
export function computeMatrixFormationState(colNorm, rowNorm, loopPhase, lum = 0.5) {
  const col = Math.max(0, Math.min(1, Number(colNorm) || 0));
  const row = Math.max(0, Math.min(1, Number(rowNorm) || 0));
  const lumNorm = Math.max(0, Math.min(1, Number(lum) || 0));

  const hashRaw = Math.sin(col * 127.1 + row * 311.7) * 43758.5453;
  const cellHash = hashRaw - Math.floor(hashRaw);
  const colRaw = Math.sin(col * 73.9) * 1931.7;
  const colHash = colRaw - Math.floor(colRaw);

  const threshold = Math.max(
    0.04,
    Math.min(0.94, 0.50 * cellHash + 0.26 * colHash + 0.24 * (1 - lumNorm))
  );

  const globalForm = computeMatrixLoopProgress(loopPhase);
  const span = 0.24;
  const cellT =
    globalForm <= 0
      ? 0
      : globalForm >= 1
        ? 1
        : Math.max(0, Math.min(1, (globalForm * (1 + span) - threshold) / span));
  const photoAlpha = cellT * cellT * (3 - 2 * cellT);
  const transitionPulse = 4 * cellT * (1 - cellT);
  const formedWeight = Math.max(0.20, Math.min(1, 0.24 + photoAlpha * 0.76));

  return {
    formedWeight,
    photoAlpha,
    transitionPulse,
    waveGlow: 0,
  };
}

/**
 * Computes square mosaic tile dimensions and highlight intensity for About photo hover blocks.
 */
export function computeAboutBlockCell(dx, dy, hoverProgress, baseSize = 10, hoverRadius = 115) {
  const progress = Math.max(0, Math.min(1, Number(hoverProgress) || 0));
  const dist = Math.hypot(Number(dx) || 0, Number(dy) || 0);
  const proximity = hoverRadius > 0 ? Math.max(0, 1 - dist / hoverRadius) : 0;
  const gapPx = progress * (1.5 + proximity * 0.7);
  const subdivide = progress > 0.35 && proximity > 0.32 ? 2 : 1;
  const innerSize = Math.max(2, baseSize - gapPx);
  const accentAlpha = progress * proximity * 0.42;

  return {
    gapPx,
    innerSize,
    subdivide,
    proximity,
    accentAlpha,
  };
}

/**
 * Computes cube split gap, radial cursor displacement, 3D extrusion depth, and rotation
 * for the interactive About portrait cube grid on hover.
 */
export function computeAboutCubeTransform(
  dx,
  dy,
  hoverProgress,
  cellSeed = 0,
  cubeSize = 24,
  hoverRadius = 175
) {
  const progress = Math.max(0, Math.min(1, Number(hoverProgress) || 0));
  const dist = Math.hypot(Number(dx) || 0, Number(dy) || 0);
  const proximity = hoverRadius > 0 ? Math.max(0, 1 - dist / hoverRadius) : 0;
  const easedProx = proximity * proximity * (3 - 2 * proximity);

  // Wide gap for scattering blocks
  const gapPx = progress * (5.0 + easedProx * 10.0);
  const drawSize = Math.max(6, cubeSize - gapPx);

  // Strong radial scatter outward from pointer
  const safeDist = Math.max(1, dist);
  const dirX = (Number(dx) || 0) / safeDist;
  const dirY = (Number(dy) || 0) / safeDist;
  const pushMagnitude = progress * (easedProx * 52 + (cellSeed - 0.5) * 6);
  const displaceX = dirX * pushMagnitude + progress * Math.cos(cellSeed * 6.28) * 4;
  const displaceY = dirY * pushMagnitude + progress * Math.sin(cellSeed * 6.28) * 4;

  // Natural 3D cube rotation and perspective tilt when scattering
  const polarity = cellSeed >= 0.5 ? 1 : -1;
  const angleRad = progress * (polarity * (0.10 + easedProx * 0.40) + (cellSeed - 0.5) * 0.22);

  const depthPx = progress * (5 + easedProx * 12);
  const scale = 1 + progress * (0.04 + easedProx * 0.14);

  return {
    gapPx,
    drawSize,
    displaceX,
    displaceY,
    angleRad,
    depthPx,
    scale,
    proximity: easedProx,
  };
}



