const navLinks = [
  { id: "hero", title: "Home" },
  { id: "projects", title: "Projects" },
  { id: "proof", title: "Proof" },
  { id: "focus", title: "Focus" },
  { id: "contact", title: "Contact" },
];

const featuredProjects = [
  {
    name: "Browser Agent",
    eyebrow: "AI automation",
    description:
      "An intelligent browser automation agent that learns page patterns, executes natural-language tasks, and records what it does.",
    stack: ["Python", "browser-use", "Playwright", "AI agents"],
    href: "https://github.com/philspaces/my-browser-agent",
    tone: "cyan",
  },
  {
    name: "Vite Component Library Template",
    eyebrow: "Frontend systems",
    description:
      "A reusable UI-library starter built around Vite, React, Tailwind, Storybook, and stronger frontend workflow defaults.",
    stack: ["TypeScript", "React", "Tailwind", "Storybook"],
    href: "https://github.com/philspaces/vite-component-library-template",
    tone: "blue",
  },
  {
    name: "Portfolio",
    eyebrow: "Personal site",
    description:
      "This site itself — rebuilt from a template-ish 3D shell into a clearer portfolio that explains the work and the builder behind it.",
    stack: ["React", "Vite", "Tailwind", "Three.js"],
    href: "https://github.com/philspaces/portfolio",
    tone: "violet",
  },
];

const proofStats = [
  { value: "54", label: "repos touched" },
  { value: "24", label: "private repos" },
  { value: "30", label: "public repos" },
  { value: "Full-stack", label: "ownership bias" },
];

const privateWorkSignals = [
  "A meaningful share of current work lives in private repositories, so public GitHub is only part of the picture.",
  "The strongest public signal is not polish alone — it is range: UI systems, browser agents, automation, and self-hosted infrastructure.",
  "I care more about shipping useful systems than farming shiny demo screenshots.",
];

const focusAreas = [
  {
    title: "Product UI",
    body: "Interfaces that feel deliberate, readable, and shippable instead of overdesigned demos.",
  },
  {
    title: "Automation",
    body: "Tools that remove repetitive work and make systems easier to operate day to day.",
  },
  {
    title: "AI tooling",
    body: "Practical agent-style systems, browser workflows, and local-first experiments that are actually useful.",
  },
  {
    title: "Self-hosted systems",
    body: "Home-lab and Raspberry Pi setups with a bias toward control, reliability, and pragmatic ops.",
  },
];

export { navLinks, featuredProjects, proofStats, privateWorkSignals, focusAreas };
