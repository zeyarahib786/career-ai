"use strict";
require("../config/env");
const { connectDB, disconnectDB } = require("../config/database");
const Certification = require("../models/Certification");
const Track = require("../models/Track");
const logger = require("../services/logger");

// ══ Source data — extracted from v11 production HTML ══════════════════════════
// All EN and AR content is verbatim from the live site

var CERTS = [
  {
    n: "01",
    lb: "Foundations",
    ic: "⬡",
    pr: 1495,
    track: 0,
    en: {
      ti: "AI/ML & Generative AI Foundations",
      tg: "All Levels · Entry to Advanced",
      su: "The authoritative starting point for any professional AI journey. Build a rigorous, modern understanding of AI, machine learning, deep learning, and generative AI — accessible, applied, and immediately relevant.",
      mo: [
        {
          n: "M1",
          t: "Introduction to AI, ML, Deep Learning & Generative AI — the complete conceptual landscape",
        },
        {
          n: "M2",
          t: "Data, Models & Machine Learning Fundamentals — how data becomes actionable insight",
        },
        {
          n: "M3",
          t: "How Generative AI Works in Practice — architectures, tokens, embeddings, transformers",
        },
        {
          n: "M4",
          t: "Real-World Enterprise Applications — deployment patterns across industries",
        },
        {
          n: "M5",
          t: "Prompting, Retrieval & AI Interaction — from basic prompting to RAG and context engineering",
        },
        {
          n: "M6",
          t: "Responsible AI, Risks & Future Trends — bias, hallucination, safety, governance frameworks",
        },
      ],
      wh: "Gives learners genuine confidence — not just familiarity. Ideal before moving into applied or advanced certifications.",
      ga: "Participants leave with clear AI literacy and the ability to contribute meaningfully to professional AI conversations.",
      me: [
        "2-Day Intensive",
        "6 Core Modules",
        "Professional Certificate",
        "All Backgrounds",
      ],
    },
    ar: {
      ti: "أساسيات الذكاء الاصطناعي والتعلم الآلي والذكاء التوليدي",
      tg: "جميع المستويات",
      su: "نقطة البداية المرجعية لأي رحلة مهنية في الذكاء الاصطناعي. ابنِ فهماً حديثاً وصارماً للذكاء الاصطناعي والتعلم الآلي والذكاء التوليدي.",
      mo: [
        { n: "م١", t: "مقدمة شاملة في الذكاء الاصطناعي" },
        { n: "م٢", t: "البيانات والنماذج وأساسيات التعلم الآلي" },
        { n: "م٣", t: "كيف يعمل الذكاء الاصطناعي التوليدي عملياً" },
        { n: "م٤", t: "التطبيقات المؤسسية في العالم الحقيقي" },
        { n: "م٥", t: "الإيجاز والاسترجاع وتطور التفاعل مع الذكاء الاصطناعي" },
        { n: "م٦", t: "الذكاء الاصطناعي المسؤول والمخاطر والاتجاهات" },
      ],
      wh: "يمنح المتعلمين ثقة حقيقية. مثالي قبل الانتقال إلى الشهادات التطبيقية.",
      ga: "يغادر المشاركون بفهم واضح وقدرة على المساهمة في المحادثات المهنية.",
      me: [
        "برنامج مكثف يومان",
        "٦ وحدات أساسية",
        "شهادة مهنية",
        "جميع الخلفيات",
      ],
    },
  },
  {
    n: "02",
    lb: "Engineering",
    ic: "◈",
    pr: 1795,
    track: 1,
    en: {
      ti: "AI-Driven Development Professional",
      tg: "Technical · Software Engineering",
      su: "For software engineers, developers, and technical leads building in AI-augmented environments. Covers how engineering is changing through code assistants, AI-enabled design, and intelligent testing.",
      mo: [
        {
          n: "M1",
          t: "AI-Augmented Software Engineering — how AI changes development processes",
        },
        {
          n: "M2",
          t: "Developer Copilots, Code Generation & Refactoring — leveraging AI tooling",
        },
        {
          n: "M3",
          t: "Designing & Building AI-Enabled Applications — LLM-first architecture",
        },
        {
          n: "M4",
          t: "APIs, RAG Patterns & LLM Integration — connecting models to real workflows",
        },
        {
          n: "M5",
          t: "Testing, Evaluation & Quality — assessing AI outputs and managing regressions",
        },
        {
          n: "M6",
          t: "Secure & Responsible AI Engineering — prompt injection, privacy, security",
        },
        {
          n: "M7",
          t: "Applied Workshop: Building an AI-Enabled Solution end-to-end",
        },
      ],
      wh: "Software development is changing permanently. Teams need engineers who leverage AI effectively while maintaining quality.",
      ga: "Participants emerge able to design and build AI-enabled applications with professional confidence.",
      me: [
        "2-Day Intensive",
        "7 Modules + Workshop",
        "Applied Build",
        "Engineers & Developers",
      ],
    },
    ar: {
      ti: "محترف التطوير المدعوم بالذكاء الاصطناعي",
      tg: "تقني · هندسة البرمجيات",
      su: "للمهندسين والمطورين والقادة التقنيين في البيئات المعززة بالذكاء الاصطناعي.",
      mo: [
        { n: "م١", t: "هندسة البرمجيات المعززة" },
        { n: "م٢", t: "مساعدو المطورين وتوليد الكود" },
        { n: "م٣", t: "تصميم وبناء التطبيقات" },
        { n: "م٤", t: "APIs وأنماط RAG" },
        { n: "م٥", t: "الاختبار والتقييم والجودة" },
        { n: "م٦", t: "الأمان والهندسة المسؤولة" },
        { n: "م٧", t: "ورشة عمل تطبيقية" },
      ],
      wh: "التطوير البرمجي يتغير بصورة دائمة.",
      ga: "يكتسب المشاركون القدرة على تصميم وبناء التطبيقات الممكّنة بالذكاء الاصطناعي.",
      me: [
        "برنامج مكثف يومان",
        "٧ وحدات + ورشة",
        "تطبيق عملي",
        "مهندسون ومطورون",
      ],
    },
  },
  {
    n: "03",
    lb: "Architecture",
    ic: "◎",
    pr: 1895,
    track: 1,
    en: {
      ti: "Contextual Engineering Professional",
      tg: "Advanced · AI Architecture",
      su: "Beyond prompting — design context architectures that make AI systems reliable, relevant, and production-ready. Explores retrieval, memory, knowledge sources, tools, and runtime state as the real levers of AI performance.",
      mo: [
        {
          n: "M1",
          t: "From Prompting to Contextual Engineering — why context is the new prompt",
        },
        {
          n: "M2",
          t: "Retrieval, Memory & Knowledge Context Design — vector databases, semantic search",
        },
        {
          n: "M3",
          t: "Tool Access, Runtime State & Context Flow — how agents access tools",
        },
        {
          n: "M4",
          t: "Improving Relevance, Accuracy & Reliability — evaluation frameworks",
        },
        {
          n: "M5",
          t: "Enterprise Patterns for Context-Aware AI — proven architectural patterns",
        },
        {
          n: "M6",
          t: "Applied Design Lab: Structuring Context for AI Performance",
        },
      ],
      wh: "For AI builders and architects who understand that high-performing AI depends on far more than better prompts.",
      ga: "Participants learn to think structurally about AI performance and design context-aware enterprise systems.",
      me: [
        "2-Day Intensive",
        "6 Modules + Design Lab",
        "Architecture Focused",
        "AI Builders & Architects",
      ],
    },
    ar: {
      ti: "محترف الهندسة السياقية",
      tg: "متقدم · بنية الذكاء الاصطناعي",
      su: "يتجاوز الإيجاز إلى تصميم بنى السياق التي تجعل أنظمة الذكاء الاصطناعي موثوقة وجاهزة للإنتاج.",
      mo: [
        { n: "م١", t: "من الإيجاز إلى الهندسة السياقية" },
        { n: "م٢", t: "تصميم الاسترجاع والذاكرة والسياق" },
        { n: "م٣", t: "وصول الأدوات وحالة التشغيل" },
        { n: "م٤", t: "تحسين الصلة والدقة والموثوقية" },
        { n: "م٥", t: "أنماط الذكاء الاصطناعي السياقي المؤسسي" },
        { n: "م٦", t: "مختبر التصميم التطبيقي" },
      ],
      wh: "قيّم للمعماريين الذين يفهمون أن الأداء العالي يعتمد على أكثر من إيجاز أفضل.",
      ga: "يتعلم المشاركون التفكير المنظم في أداء الذكاء الاصطناعي.",
      me: [
        "برنامج مكثف يومان",
        "٦ وحدات + مختبر",
        "تركيز معماري",
        "المعماريون",
      ],
    },
  },
  {
    n: "04",
    lb: "Implementation",
    ic: "◇",
    pr: 1695,
    track: 2,
    en: {
      ti: "AI Use Cases Implementation",
      tg: "Business · Strategy · Delivery",
      su: "For professionals responsible for turning AI opportunity into measurable business outcomes. Focuses on identifying, shaping, prioritising, and delivering AI use cases that are both feasible and genuinely valuable.",
      mo: [
        {
          n: "M1",
          t: "Identifying the Right AI Opportunities — frameworks for scanning and validating",
        },
        {
          n: "M2",
          t: "Business Value, Framing & Prioritisation — scoring and comparing by impact",
        },
        {
          n: "M3",
          t: "Readiness Assessment: Data, Process, Technology & Risk",
        },
        {
          n: "M4",
          t: "Designing an Implementation Approach — solution blueprinting and governance",
        },
        {
          n: "M5",
          t: "Governance, Stakeholder Alignment & Adoption — change management",
        },
        {
          n: "M6",
          t: "Measuring Outcomes, ROI & Scale Potential — KPI frameworks",
        },
      ],
      wh: "Many organisations are enthusiastic about AI but few know how to choose the right use cases and implement them with discipline.",
      ga: "Participants gain structured opportunity evaluation frameworks and sharper business judgement.",
      me: [
        "2-Day Intensive",
        "6 Core Modules",
        "Value Framework Tools",
        "Business & Strategy Leaders",
      ],
    },
    ar: {
      ti: "تطبيق حالات استخدام الذكاء الاصطناعي",
      tg: "أعمال · استراتيجية · تسليم",
      su: "للمحترفين المسؤولين عن تحويل فرص الذكاء الاصطناعي إلى نتائج أعمال قابلة للقياس.",
      mo: [
        { n: "م١", t: "تحديد فرص الذكاء الاصطناعي الصحيحة" },
        { n: "م٢", t: "قيمة الأعمال والتأطير وتحديد الأولويات" },
        { n: "م٣", t: "تقييم الاستعداد" },
        { n: "م٤", t: "تصميم نهج التطبيق وحوكمة التسليم" },
        { n: "م٥", t: "الحوكمة ومواءمة أصحاب المصلحة" },
        { n: "م٦", t: "قياس النتائج والعائد على الاستثمار" },
      ],
      wh: "كثير من المنظمات متحمسة للذكاء الاصطناعي لكن قلة تعرف كيف تختار حالات الاستخدام الصحيحة.",
      ga: "يكتسب المشاركون أطراً منظمة لتقييم الفرص وحكماً تجارياً أكثر حدة.",
      me: [
        "برنامج مكثف يومان",
        "٦ وحدات أساسية",
        "أدوات إطار القيمة",
        "قادة الأعمال",
      ],
    },
  },
  {
    n: "05",
    lb: "Agentic AI",
    ic: "◉",
    pr: 1995,
    track: 3,
    en: {
      ti: "Agentic AI & AI-Native Professional",
      tg: "Flagship · Advanced",
      su: "Flagship advanced certificate for professionals who want to lead the next wave of AI-enabled work. AI agents, autonomous task execution, orchestration, human oversight, and the shift toward AI-native operating models.",
      mo: [
        {
          n: "M1",
          t: "Foundations of Agentic AI & the AI-Native Mindset — what agents are and why they change work",
        },
        {
          n: "M2",
          t: "Assistants, Agents & Multi-Agent Workflows — architectural patterns for enterprise",
        },
        {
          n: "M3",
          t: "Planning, Tool Use, Memory & Task Execution — how agents orchestrate complex tasks",
        },
        {
          n: "M4",
          t: "Human-in-the-Loop Oversight & Governance — maintaining human judgement",
        },
        {
          n: "M5",
          t: "Designing AI-Native Workflows & Operating Models — redesigning processes around AI",
        },
        {
          n: "M6",
          t: "Applied Workshop: Agentic Workflow Design for a real enterprise scenario",
        },
      ],
      wh: "For professionals who want to stay credibly ahead of where AI is heading — architects, enterprise leaders, and innovation teams.",
      ga: "Participants develop an advanced understanding of agentic systems and AI-native operating model design.",
      me: [
        "2-Day Intensive",
        "6 Modules + Workshop",
        "Flagship Certificate",
        "Architects & Leaders",
      ],
    },
    ar: {
      ti: "محترف الذكاء الاصطناعي الفاعل والأصيل",
      tg: "رائد · متقدم",
      su: "شهادة متقدمة رائدة للمحترفين الذين يريدون قيادة الموجة القادمة من العمل الممكّن بالذكاء الاصطناعي.",
      mo: [
        { n: "م١", t: "أسس الذكاء الاصطناعي الفاعل والعقلية الأصيلة" },
        { n: "م٢", t: "المساعدون والوكلاء وسير العمل متعدد الوكلاء" },
        { n: "م٣", t: "التخطيط واستخدام الأدوات والذاكرة وتنفيذ المهام" },
        { n: "م٤", t: "الإشراف البشري في الحلقة والحوكمة" },
        { n: "م٥", t: "تصميم سير العمل الأصيل ونماذج التشغيل" },
        { n: "م٦", t: "ورشة عمل تطبيقية" },
      ],
      wh: "للمحترفين الذين يريدون البقاء متقدمين على مسار الذكاء الاصطناعي.",
      ga: "يطور المشاركون فهماً متقدماً للأنظمة الفاعلة وتصميم نماذج التشغيل الأصيلة.",
      me: [
        "برنامج مكثف يومان",
        "٦ وحدات + ورشة",
        "شهادة رائدة",
        "المعماريون والقادة",
      ],
    },
  },
  {
    n: "06",
    lb: "Operations",
    ic: "⬢",
    pr: 1795,
    track: 3,
    en: {
      ti: "DevAIOps Professional",
      tg: "Operations · DevOps · Platform",
      su: "Built for professionals moving AI from experimentation into stable, governed, scalable production operations. Connects DevOps, MLOps, LLMOps, observability, governance, security, and performance management.",
      mo: [
        {
          n: "M1",
          t: "The Evolution from DevOps to DevAIOps — how AI workloads change operations",
        },
        {
          n: "M2",
          t: "MLOps, LLMOps & AI Delivery Pipelines — model versioning, deployment, LLM operations",
        },
        {
          n: "M3",
          t: "Monitoring, Observability & Runtime Reliability — drift detection, incident response",
        },
        {
          n: "M4",
          t: "Security, Governance & Responsible AI Operations — access control, audit, ethics",
        },
        {
          n: "M5",
          t: "Performance, Cost & Operational Efficiency — token economics, inference optimization",
        },
        {
          n: "M6",
          t: "Applied Transformation Clinic: Operationalising AI in the Enterprise",
        },
      ],
      wh: "Urgently practical for organisations running AI in live delivery environments at scale.",
      ga: "Participants gain a rigorous view of governing, monitoring, and improving AI systems in production.",
      me: [
        "2-Day Intensive",
        "6 Modules + Clinic",
        "Transformation Clinic",
        "DevOps & Platform Teams",
      ],
    },
    ar: {
      ti: "محترف DevAIOps",
      tg: "عمليات · DevOps · هندسة المنصات",
      su: "مبني للمحترفين الذين يحتاجون نقل الذكاء الاصطناعي من التجريب إلى عمليات إنتاج مستقرة ومحكومة.",
      mo: [
        { n: "م١", t: "التطور من DevOps إلى DevAIOps" },
        { n: "م٢", t: "MLOps وLLMOps وخطوط تسليم الذكاء الاصطناعي" },
        { n: "م٣", t: "المراقبة وقابلية الملاحظة وموثوقية التشغيل" },
        { n: "م٤", t: "الأمان والحوكمة والذكاء الاصطناعي المسؤول" },
        { n: "م٥", t: "الأداء والتكلفة والكفاءة التشغيلية" },
        { n: "م٦", t: "عيادة التحول التطبيقية" },
      ],
      wh: "عملي بشكل عاجل للمنظمات التي تشغّل الذكاء الاصطناعي في بيئات تسليم حية.",
      ga: "يكتسب المشاركون رؤية صارمة لحوكمة ومراقبة وتحسين أنظمة الذكاء الاصطناعي.",
      me: [
        "برنامج مكثف يومان",
        "٦ وحدات + عيادة",
        "عيادة التحول",
        "فرق DevOps والمنصات",
      ],
    },
  },
];

/* ── Track definitions ────────────────────────────────────────── */

var TRACKS = [
  {
    id: "t1",
    cls: "t1",
    color: "#00d68f",
    icon: "🧠",
    certIdxs: [0],
    enBadge: "Track 01",
    enName: "AI Foundations",
    enDesc:
      "The essential starting point. Build rigorous, modern AI literacy before specialising into any advanced track.",
    arBadge: "المسار ٠١",
    arName: "مسار أساسيات الذكاء الاصطناعي",
    arDesc:
      "نقطة البداية الأساسية. ابنِ الطلاقة المعرفية في الذكاء الاصطناعي قبل التخصص في أي مسار متقدم.",
  },
  {
    id: "t2",
    cls: "t2",
    color: "#93c5fd",
    icon: "⚙️",
    certIdxs: [1, 2],
    enBadge: "Track 02",
    enName: "AI Engineering & Architecture",
    enDesc:
      "For technical professionals building, designing, and architecting AI-enabled systems. Two certifications covering engineering practice and contextual system design.",
    arBadge: "المسار ٠٢",
    arName: "مسار هندسة وبنية الذكاء الاصطناعي",
    arDesc:
      "للمحترفين التقنيين الذين يبنون ويصممون ويعمارون أنظمة الذكاء الاصطناعي. شهادتان.",
  },
  {
    id: "t3",
    cls: "t3",
    color: "#c4b5fd",
    icon: "📊",
    certIdxs: [3],
    enBadge: "Track 03",
    enName: "AI Business & Implementation",
    enDesc:
      "For business leaders and consultants responsible for identifying AI opportunities and delivering measurable enterprise outcomes with discipline.",
    arBadge: "المسار ٠٣",
    arName: "مسار أعمال الذكاء الاصطناعي والتطبيق",
    arDesc:
      "لقادة الأعمال والاستشاريين المسؤولين عن تحديد فرص الذكاء الاصطناعي وتحقيق نتائج مؤسسية قابلة للقياس.",
  },
  {
    id: "t4",
    cls: "t4",
    color: "#fbbf24",
    icon: "🚀",
    certIdxs: [4, 5],
    enBadge: "Track 04",
    enName: "Advanced AI Systems",
    enDesc:
      "For architects and operations professionals ready to lead agentic AI deployment and govern AI in live enterprise production environments at scale.",
    arBadge: "المسار ٠٤",
    arName: "مسار أنظمة الذكاء الاصطناعي المتقدمة",
    arDesc:
      "للمعماريين ومتخصصي العمليات المستعدين لقيادة نشر الذكاء الاصطناعي الفاعل وحوكمة الذكاء الاصطناعي في بيئات الإنتاج.",
  },
];

// Convert from v11 format to MongoDB documents
const CERT_DOCS = CERTS.map((c, i) => ({
  code: "SGA-" + c.n,
  trackId: TRACKS[c.track].id,
  displayLabel: c.lb,
  icon: c.ic,
  priceUSD: c.pr,
  displayOrder: i + 1,
  isActive: true,
  en: {
    title: c.en.ti,
    tagline: c.en.tg,
    summary: c.en.su,
    whyChoose: c.en.wh,
    whatGain: c.en.ga,
    modules: c.en.mo.map((m) => ({ code: m.n, title: m.t })),
    chips: c.en.me,
  },
  ar: {
    title: c.ar.ti,
    tagline: c.ar.tg || "",
    summary: c.ar.su || "",
    whyChoose: c.ar.wh || "",
    whatGain: c.ar.ga || "",
    modules: c.ar.mo.map((m) => ({ code: m.n, title: m.t })),
    chips: c.ar.me || [],
  },
}));

const TRACK_DOCS = TRACKS.map((t, i) => ({
  trackId: t.id,
  displayOrder: i + 1,
  accentColor: t.color,
  icon: t.icon,
  certificationCodes: t.certIdxs.map((ci) => "SGA-" + CERTS[ci].n),
  isActive: true,
  en: {
    badge: t.enBadge,
    name: t.enName,
    description: t.enDesc,
    cta: "Explore Track",
  },
  ar: {
    badge: t.arBadge,
    name: t.arName,
    description: t.arDesc,
    cta: "استعرض المسار",
  },
}));

const seed = async () => {
  const reset = process.argv.includes("--reset");
  await connectDB();
  if (reset) {
    await Promise.all([Track.deleteMany({}), Certification.deleteMany({})]);
    logger.info("Collections cleared");
  }
  for (const doc of TRACK_DOCS) {
    await Track.findOneAndUpdate({ trackId: doc.trackId }, doc, {
      upsert: true,
      new: true,
      runValidators: true,
    });
  }
  logger.info(`Seeded ${TRACK_DOCS.length} tracks`);
  for (const doc of CERT_DOCS) {
    await Certification.findOneAndUpdate({ code: doc.code }, doc, {
      upsert: true,
      new: true,
      runValidators: true,
    });
  }
  logger.info(`Seeded ${CERT_DOCS.length} certifications`);
  await disconnectDB();
  process.exit(0);
};

seed().catch((err) => {
  logger.error("Seed failed", { error: err.message });
  process.exit(1);
});
