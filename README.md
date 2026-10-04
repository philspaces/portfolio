# The Living Showcase

A static portfolio for **Long Phi Nguyen**, built with React, TypeScript, and Vite. The previous application has been replaced; the repository's Git history is preserved.

The first version contains three explicitly fictional placeholder concepts: **Forma** (web workspace), **Roam** (mobile discovery), and **Relay** (system interface). Their content and demonstrations are sample material. They do not claim real clients, professional roles, shipped products, or verified outcomes. Biography and resume content remain unavailable until supplied.

## Run locally

```sh
npm ci
npm run dev
```

Open the local address printed by Vite, normally `http://127.0.0.1:5173`.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

The production build is written to `dist/`. There is no backend, CMS, authentication, required API key, or runtime environment configuration. Fonts are bundled locally through Fontsource.

## Browse and explore

- Select a project by clicking its card. Selection does not move the page.
- With a project tab focused, use arrow keys to change projects; Home and End select the first and last project.
- **Explore demo** expands the stage inline and enables its local sample interactions. **Exit demo** or Escape returns to browsing and restores focus to the entry control.
- **Read case study** opens a dedicated case view. Browser Back and Forward follow normal navigation.
- Scroll naturally into the architecture and project details. The architecture stays alongside the details on desktop and joins the normal column on mobile.
- **Resume** opens an honest availability dialog; it does not link to an invented document.

Motion follows the system's reduced-motion preference. No global Space shortcut, scroll interception, iframe focus, or custom cursor is used.

## Replace the placeholder content

`src/projects.ts` is the typed project data layer. Replace each complete `Project` record with approved material, including its stable `id`, title, category, one-line summary, tags, actual contribution, context, constraints, architecture, tradeoffs, and sourced evidence. Keep the summary tags concise. Changing an `id` changes the case-study URL.

`src/Demo.tsx` contains the three local demo surfaces. Its `kind` selects a web, mobile, or system presentation. Replace the corresponding demo with a real approved demonstration when available. Demo state lives in the browser and is not persisted.

`public/concept-art.webp` is fictional concept artwork, not a screenshot of an existing project. Replace it with approved media and preserve meaningful alternative text and a useful visual fallback. Add an actual biography and resume only after the owner provides them; do not treat the placeholder case fields as achievements.

## Routes and static hosting

Routes use the URL hash, so a normal static server can serve every view from the same built `index.html`:

| View | URL fragment |
| --- | --- |
| Project collection | `#/` |
| Forma case study | `#/work/forma` |
| Roam case study | `#/work/roam` |
| Relay case study | `#/work/relay` |
| About | `#/about` |

Unknown views provide a return to the collection. Hash routes do not require server rewrites. If clean pathname routes are introduced later, configure the host to return `index.html` for application routes. For hosting under a repository subdirectory, set Vite's `base` to that public subdirectory and rebuild so asset paths resolve correctly. This repository does not deploy itself.

## Verification

Vitest covers project data and user interactions: repeated and rapid selection, hover stability, skip-link and keyboard focus, inline demo exits, fresh demo entry after a project change, direct case routes, native history navigation, unknown views, biography and resume placeholders, Escape scope with an overlay open, and controls under reduced motion. The interaction suite uses jsdom and emulates dialog and scroll platform APIs; actual layout, native modal focus behavior, media fallbacks, and CSS motion require browser verification.
