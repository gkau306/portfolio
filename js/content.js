// All portfolio content lives here. Edit this file to update the site.

export const profile = {
  name: "Gurleen Kaur",
  handle: "gurleen",
  role: "Software Engineer · CS + Biology @ University of Auckland",
  location: "Auckland, New Zealand",
  // One entry per paragraph — no manual line breaks, let it wrap.
  blurb: [
    "I'm doing CS + Biology at the University of Auckland. I like tech and I like building cool things, especially the creative side of AI — right now I'm messing around with some very cool software :)",
    "Otherwise I'm probably out hiking, writing emo poetry, or claudemaxxing. If you need a matcha recommendation in Auckland, just shoot me an email ^_^",
    "I'm looking for <b>backend and AI / infra roles</b> — if you'd like to work together, please email me (・‿・)",
  ],
};

export const education = {
  school: "University of Auckland",
  degree: "BSc, Computer Science & Biology",
  years: "2022 – Present",
};

export const experience = [
  {
    id: "scopious",
    role: "Software Engineering Intern",
    org: "Scopious",
    where: "Auckland, NZ",
    when: "Nov 2025 – Feb 2026",
    stack: ["React", "TypeScript", "IoT", "LoRaWAN", "Mapping"],
    bullets: [
      "Owned a GPS asset-tracking feature end to end — requirements, design, backend, frontend, testing — and shipped it to production, where it tracks 50+ IoT devices over a LoRaWAN backend as a documented product capability.",
      "Eliminated redundant re-renders on the Live Map with an update queue over the polling layer, keeping it responsive as device count and polling frequency scaled; added marker clustering, per-device colouring and device toggling.",
      "Built Historic Playback (per-device trails, hover-to-focus dimming, 4-device concurrency cap) loading timeline data only for the focused device, plus fleet scoping by pool, tag, device or org.",
    ],
  },
  {
    id: "onchain",
    role: "Full-Stack Developer — OnChain",
    org: "Web Development & Consulting Club (WDCC)",
    where: "Auckland, NZ",
    when: "Mar 2026 – Present",
    stack: ["Next.js", "React", "TypeScript", "Supabase", "TanStack Query"],
    bullets: [
      "Expanding OnChain, WDCC's flagship product, from a chat forum into a DAO discussion space ahead of a live platform launch.",
      "Built comment CRUD REST endpoints, backend-backed read/unread state and image uploads for a live client — an edtech startup expanding across NZ, Australia and Asia — in Agile sprints with direct client feedback; added auth-gated access and soft-delete moderation with admin override to preserve audit trails.",
      "Diagnosed and fixed the forum's data layer: killed a 401 flicker and duplicate fetches by gating requests on resolved auth, then added a shared TanStack Query cache keyed by DAO, post and sort — removing the full reload on every Forum tab switch and keeping content visible during revalidation.",
    ],
  },
  {
    id: "ta",
    role: "Teaching Assistant, COMPSCI 101 (Python)",
    org: "University of Auckland",
    where: "Auckland, NZ",
    when: "Jul 2025 – Jul 2026",
    stack: ["Python", "Teaching", "Code review"],
    bullets: [
      "Mentor 100+ students weekly in Python fundamentals, debugging and logic tracing across labs and code review.",
    ],
  },
  {
    id: "pwc",
    role: "Data Analysis Intern — Insurance Division",
    org: "PwC",
    where: "Auckland, NZ",
    when: "Jan 2024 – Feb 2024",
    stack: ["Python", "pandas", "Excel", "ETL"],
    bullets: [
      "Automated ETL pipelines (Python, pandas) over 10,000+ records, replacing a manual process.",
      "Built Excel risk dashboards for consulting stakeholders.",
    ],
  },
];

export const projects = [
  {
    id: "scaffold",
    name: "Scaffold",
    tagline: "AI-native learning infrastructure for universities",
    role: "Co-Founder",
    when: "2026 – Present",
    badge: "Velocity Stage 2 · top 30 of 150+",
    stack: ["TypeScript", "React", "Node.js", "VS Code Extension API", "MCP", "SVG"],
    bullets: [
      "Building an EdTech platform — currently selected for Stage 2 of the Velocity Innovation Challenge (top 30 of 150+).",
    ],
    note: "More once Stage 2 wraps up. Stay tuned.",
    images: [],
    links: [],
  },
  {
    id: "erica",
    name: "Erica",
    tagline: "AI marketing intelligence platform",
    role: "Capstone · Tech Lead of 5 engineers",
    when: "2026",
    badge: "",
    stack: ["Python", "FastAPI", "AWS Bedrock", "React / Next.js", "PostgreSQL", "Docker"],
    bullets: [
      "Owned the system architecture for a multi-agent AI platform that detects ad fatigue in real time and recommends fixes.",
      "Replaced a rigid LangGraph pipeline with a 16-tool tool-calling agent on AWS Bedrock Converse, making the flow conversational and multi-step instead of fixed routing.",
      "Built a two-tier recommendation engine where one LLM reads the ad creative visually and a second grounds the fix in live research.",
      "Designed the LLM security layer — prompt-injection and jailbreak guards, rate limiting, PII scrubbing — validated against a 190+ prompt OWASP-aligned adversarial suite.",
    ],
    images: [
      { src: "assets/projects/erica/01-landing.png", alt: "Erica landing page — Your Data, Erica" },
      { src: "assets/projects/erica/02-dashboard.png", alt: "Executive summary dashboard with fatigue score and spend, ROAS and CTR trends" },
      { src: "assets/projects/erica/03-creatives.png", alt: "Per-client creative grid with health labels and fatigue sensitivity slider" },
      { src: "assets/projects/erica/04-chat-roas.png", alt: "Analyzer chat rendering a ROAS trend chart for the top 3 ads" },
      { src: "assets/projects/erica/05-chat-table.png", alt: "Analyzer chat rendering a week-over-week metric comparison table" },
    ],
    links: [],
  },
  {
    id: "agribuddy",
    name: "Agribuddy",
    tagline: "AI pre-visit briefing tool for agribusiness advisors",
    role: "Backend / AI lead",
    when: "2026",
    badge: "Winner · BNZ × AWS AI Innovate Hackathon 2026",
    stack: ["Python", "FastAPI", "AWS Bedrock", "Knowledge Bases", "S3", "Next.js"],
    bullets: [
      "Validated the problem with BNZ agribusiness advisors — hours of manual pre-visit prep, then no connectivity on-farm — and built the backend AI layer as a FastAPI service exposing a shared agent \"brain\" to multiple clients.",
      "Designed a multi-agent orchestration system: a supervisor plus five specialists (farm financials, market intelligence, credit, compliance, relationship), with deterministic ratio and lending-framework logic kept in code outside the LLM, so every number is calculated rather than generated.",
      "Built retrieval-augmented context over an industry-tagged Bedrock Knowledge Base on an S3 corpus with per-document metadata sidecars, assembling ratios, flags, market intel, ranked questions and inline citations behind one endpoint.",
    ],
    images: [],
    links: [
      { label: "The story on LinkedIn ↗", href: "https://www.linkedin.com/in/gurleen-kaur/" },
    ],
  },
  {
    id: "damage-capture",
    name: "Conversational Damage Capture",
    tagline: "Real-time voice agent for vehicle damage intake",
    role: "Hackathon build",
    when: "2025 – 2026",
    badge: "Winner, Partly Hackathon 2025 · Most Creative 2026",
    stack: ["React", "Vite", "TypeScript", "FastAPI", "WebSockets", "Deepgram", "Cartesia"],
    bullets: [
      "Real-time voice conversation over a WebSocket gateway — speech-to-text, an LLM with a find_part tool, and streamed speech back — so an assessor describes damage out loud instead of filling a form.",
      "FastAPI backend serving both the live voice gateway and a dataset-browsing REST API over the parts catalogue.",
    ],
    links: [],
  },
  {
    id: "vibe-edit",
    name: "Vibe Editing Agent",
    tagline: "Describe the cut, get the video",
    role: "Personal build",
    when: "2026",
    badge: "",
    stack: ["Python", "LangGraph", "FFmpeg"],
    bullets: [
      "End-to-end slice: an EDL (edit decision list) schema, a LangGraph pipeline that fills it from a natural-language brief, and an FFmpeg renderer that concatenates the result.",
      "Keeps the deterministic media work in code and the interpretation in the model — the agent decides what to cut, FFmpeg decides how.",
    ],
    links: [],
  },
];

export const skills = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "Java", "C", "SQL", "HTML", "CSS"] },
  { group: "Web & Backend", items: ["React", "Next.js", "SSR", "Node.js", "Express", "FastAPI", "REST APIs", "SSE", "TanStack Query", "SVG data viz"] },
  { group: "Data & Cloud", items: ["PostgreSQL", "Supabase", "MongoDB", "Firebase", "AWS (EC2, S3, Bedrock)", "Docker", "pandas"] },
  { group: "Tools & AI", items: ["Git", "GitHub Actions", "CI/CD", "Pytest", "Agile/Scrum", "LLM tool-calling", "RAG", "MCP", "LangChain", "OpenCV"] },
];

export const awards = [
  { what: "Winner — BNZ × AWS AI Innovate Hackathon 2026", detail: "Agribuddy" },
  { what: "Winner — WDCC × SESA Hackathon 2026", detail: "Scaffold prototype" },
  { what: "Winner — Partly Hackathon 2025", detail: "Most Creative, Partly 2026" },
  { what: "2nd — Fonterra AI Agents Challenge 2025", detail: "Fabric NL-to-SQL agent" },
  { what: "Best Presenter — Trade Me Thinkathon 2025", detail: "" },
  { what: "$560 Spark scholarship — We The Women Hackfest", detail: "from thousands of applicants" },
  { what: "Technical Executive — Google Developer Groups on Campus", detail: "Mar 2026 – Present · web, AI/ML and cloud workshops to 100+ students; hackathon coordination and judging for 50+ teams; Lead Organiser, Women in Tech panel" },
];

export const contact = {
  email: "admgurleen@gmail.com",
  phone: "+64 22 246 4290",
  github: "https://github.com/gkau306",
  linkedin: "https://www.linkedin.com/in/gurleen-kaur/",
};
