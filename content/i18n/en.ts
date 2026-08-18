import type { Dict } from "./id";

/**
 * Versi Inggris DITULIS ULANG, bukan diterjemahkan mentah. Beberapa kalimat
 * Indonesia mengandalkan nuansa yang hilang kalau dipaksakan kata per kata --
 * yang dipertahankan maknanya dan suaranya, bukan susunan katanya.
 */
export const en: Dict = {
  meta: {
    title: "Ali Torihin — Android & Web Application Developer",
    description:
      "An emergency-room clinician who builds Android and web applications. Flutter, Kotlin, Rust, TypeScript. Built carefully and tested before it reaches users.",
    ogAlt: "Ali Torihin — Android & web application developer",
  },

  nav: {
    work: "Work",
    services: "Services",
    process: "Process",
    about: "About",
    contact: "Contact",
    menu: "Menu",
    close: "Close",
    theme: "Toggle theme",
    language: "Change language",
    commandHint: "Search",
  },

  hero: {
    status: "Available for new work",
    headline: ["Built carefully.", "Tested before it ships."],
    lead: "I'm Ali Torihin — an emergency-room clinician who builds Android and web applications. That background isn't incidental: in an ER, double-checking is never wasted time, and being honest about what you don't yet know beats sounding certain.",
    ctaPrimary: "See the work",
    ctaSecondary: "Start a project",
    scrollHint: "Scroll",
  },

  work: {
    eyebrow: "Work",
    title: "What I've built",
    lead: "Six projects, taken from idea to something people can actually use. Several repositories are private — so instead of handing you a code link, I explain the engineering decisions behind them.",
    featuredLabel: "Featured",
    tryDemo: "Play it",
    demoNote: "Runs right in your browser",
    viewSource: "View source",
    sourcePrivate: "Private repository",
    status: {
      live: "Running",
      development: "In development",
      prerelease: "Pre-release",
    },
  },

  services: {
    eyebrow: "Services",
    title: "What I can build for you",
    lead: "All of it grounded in things I have actually shipped myself, not a list of capabilities that reads well.",
    items: [
      {
        title: "Android apps",
        body: "Flutter or native Kotlin, from design through to a release build ready for the store.",
      },
      {
        title: "Web apps",
        body: "Fast, accessible modern interfaces that stay comfortable on a small screen.",
      },
      {
        title: "Backend & automation",
        body: "APIs, long-running services, integrations, and the repetitive work a machine should be doing.",
      },
      {
        title: "MVP development",
        body: "Narrow the idea down to what genuinely matters, then build it so real users can try it soon.",
      },
    ],
  },

  process: {
    eyebrow: "Process",
    title: "Four steps, and none of them get skipped",
    lead: "This isn't a methodology invented for this page — it's what I actually run on every project above.",
    steps: [
      {
        n: "01",
        title: "Understand first",
        body: "I read the existing code and context before proposing anything. Guessing costs more than reading.",
      },
      {
        n: "02",
        title: "Plan",
        body: "Scope gets written down up front — including what will NOT be built, so nothing surprises you halfway.",
      },
      {
        n: "03",
        title: "Build",
        body: "Delivered in stages you can try early, rather than disappearing for weeks and returning with one large pile.",
      },
      {
        n: "04",
        title: "Prove it",
        body: "Tested, measured, and where something can't be verified yet I say so plainly. I don't write claims I can't back.",
      },
    ],
  },

  about: {
    eyebrow: "About",
    title: "Two worlds that reinforce each other",
    body: [
      "By day I work in an emergency department. In the gaps between shifts, I build applications — from idea and design through code to something people can use.",
      "The ER taught me that small things carry weight, that double-checking is never wasted, and that admitting uncertainty matters. Those values follow me into every line of code I write.",
      "I would rather finish one thing properly than start ten things half-heartedly.",
    ],
    quote: "Not merely fast — accountable.",
    facts: {
      studio: "Studio",
      focus: "Focus",
      base: "Based in",
      focusValue: "Android & web applications",
    },
  },

  stack: {
    eyebrow: "Stack",
    title: "What I actually use",
    lead: "Only what I genuinely reach for on real projects. A long list makes nobody more capable.",
  },

  contact: {
    eyebrow: "Contact",
    title: "Got something you want built?",
    lead: "Just tell me the idea — it doesn't need to be tidy yet. If I'm not the right person for it, I'll tell you that too.",
    whatsapp: "Chat on WhatsApp",
    whatsappNote: "Fastest reply",
    email: "Send an email",
    emailNote: "Usually answered within a day or two",
    waMessage:
      "Hi Ali, I came across your portfolio and would like to discuss a project.",
  },

  footer: {
    built: "Built with Next.js. Served as static files.",
    rights: "Ali Torihin",
  },

  palette: {
    placeholder: "Search pages, projects, or commands…",
    empty: "Nothing matches.",
    groupNav: "Navigation",
    groupProjects: "Projects",
    groupActions: "Actions",
    toggleTheme: "Toggle light/dark theme",
    switchLang: "Ganti ke Bahasa Indonesia",
    openWa: "Chat on WhatsApp",
    openEmail: "Send an email",
    hint: "to open",
  },

  demo: {
    back: "Back to portfolio",
    title: "Jagoan Medis — live demo",
    lead: "This is the real game, running in your browser. Nothing to install.",
    load: "Load the demo",
    loadNote:
      "The build is large (~42 MB) — it loads only after you press the button, so the rest of the site stays fast.",
    loading: "Loading…",
    openNewTab: "Open in a new tab",
  },
};
