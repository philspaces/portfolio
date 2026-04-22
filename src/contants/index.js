const navLinks = [
  { id: "hero", title: "Home" },
  { id: "projects", title: "Projects" },
  { id: "focus", title: "Focus" },
  { id: "contact", title: "Contact" },
];

const featuredProjects = [
  {
    name: "Browser Agent",
    description:
      "An intelligent browser automation agent that learns page patterns, executes natural-language tasks, and records what it does.",
    stack: ["Python", "browser-use", "Playwright", "AI agents"],
    href: "https://github.com/philspaces/my-browser-agent",
    tone: "cyan",
  },
  {
    name: "Vite Component Library Template",
    description:
      "A reusable UI-library starter built around Vite, React, Tailwind, Storybook, and strong frontend workflow defaults.",
    stack: ["TypeScript", "React", "Tailwind", "Storybook"],
    href: "https://github.com/philspaces/vite-component-library-template",
    tone: "blue",
  },
  {
    name: "Portfolio",
    description:
      "This site itself — rebuilt from a template-ish 3D shell into a clearer portfolio that actually explains the work and the builder behind it.",
    stack: ["React", "Vite", "Tailwind", "Three.js"],
    href: "https://github.com/philspaces/portfolio",
    tone: "violet",
  },
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

export { navLinks, featuredProjects, focusAreas };
