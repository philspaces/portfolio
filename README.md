# The Living Showcase

A static portfolio for **Long Phi Nguyen**. The previous application has been replaced while preserving the repository's Git history.

**JadeWords** is the first real, featured project: a Chinese-learning app built with Expo, React Native, TypeScript, and Supabase. Its concise technical overview links to [the product website](https://jadewords.com/). The site currently describes app availability as coming soon; the portfolio does not claim an available store download, professional role, adoption, or measured impact.

**Forma** (web workspace), **Roam** (mobile discovery), and **Relay** (system interface) are fictional placeholder concepts. Their demos and case studies are sample material, with no claims about clients, professional roles, shipped products, or verified outcomes. Biography and resume content remain unavailable until supplied.

## Stack

- **Astro 7** builds complete HTML for each page, using **Vite 8** underneath.
- **React 19.3** supplies the interactive showcase and demos through the official Astro React integration. Astro prerenders the whole React app into HTML during the build, then hydrates it on load; it still ships React JavaScript for the full app.
- **TypeScript 6** uses strict checks through `@astrojs/check` and `typescript-eslint`. Version 6 is retained for compatibility with these tools.
- **Motion** handles transitions; **Geist** and **Geist Mono** fonts are bundled locally through Fontsource.
- **Vitest**, Testing Library, **Playwright**, and axe cover data, interaction, browser behavior, and accessibility checks.

The pinned development runtime is **Node 24.21.0** in `.nvmrc`, with **npm 11.12.1** in `packageManager`. There is no backend, CMS, authentication, required API key, or server runtime for the built site.

## Run locally

```sh
nvm use
npm ci
npm run dev
```

Development normally opens at `http://127.0.0.1:5173/`; use the address printed by Astro. `nvm use` is optional if the correct Node version is already active.

```sh
npm run build
npm run preview -- --port 4173
```

The build is written to `dist/`. This preview command serves it at `http://127.0.0.1:4173/`; without the port override, preview uses the configured port 5173. Astro telemetry is disabled by the npm scripts.

## Routes and hosting

The build produces seven static pages:

| View | Route | Output |
| --- | --- | --- |
| Project collection | `/` | `index.html` |
| About | `/about/` | `about/index.html` |
| JadeWords overview | `/work/jade-words/` | `work/jade-words/index.html` |
| Forma case study | `/work/forma/` | `work/forma/index.html` |
| Roam case study | `/work/roam/` | `work/roam/index.html` |
| Relay case study | `/work/relay/` | `work/relay/index.html` |
| Missing page | `/404.html` | `404.html` |

Direct links have meaningful HTML before JavaScript loads. Hydrated navigation updates the view and page title, description, robots, and social metadata together; browser Back and Forward work normally. Existing `#/work/roam` and similar hash bookmarks are upgraded to pathname URLs on load.

Serve directory index files and configure the host's missing-page response to use `404.html`. These generated routes do not need a single-page-app fallback. No production domain or canonical URL is assumed. Pages still use `noindex, follow` while the personal introduction and concept content remain unfinished; missing pages use `noindex, nofollow`. Update `src/metadata.ts` when the portfolio is ready for indexing.

For a subdirectory such as `/portfolio/`, use the same base for build and preview:

```sh
BASE_PATH=/portfolio/ npm run build
BASE_PATH=/portfolio/ npm run preview -- --port 4173
```

Open `http://127.0.0.1:4173/portfolio/`. Assets and internal links include the configured prefix. This repository does not deploy itself.

## Browse and explore

- Click a project card to select it. Its full-page backdrop crossfades with the selection and stays synchronized with case routes and history. With a project tab focused, arrow keys change projects; Home and End select the first and last.
- **Explore demo** expands the stage inline and enables its local sample controls. **Exit demo** or Escape returns to browsing and restores entry focus.
- JadeWords starts selected. **View Jade Words** opens the verified product website in a new tab; **Explore preview** opens an inline viewer of actual vocabulary, grammar, and handwriting screenshots. The optional app-preview film starts paused with native controls. The screenshot viewer demonstrates the screens, not a functioning mobile app.
- Secondary immersive labels fade after 2.5 seconds of inactivity. Pointer, touch, or keyboard input reveals them. Exit stays available; focused or active controls keep labels visible. Reduced motion keeps labels visible and disables transitions.
- Scroll naturally into the architecture and details. The architecture is sticky on desktop and part of the normal column on mobile.
- JadeWords has a brief stack and architecture snapshot rather than the long placeholder case-study structure.
- **Resume** opens an availability dialog without an invented document link.

Demo state is local and is not persisted. Missing artwork has a useful fallback. There is no global Space shortcut, scroll interception, iframe focus, or custom cursor.

## Replace the placeholders

[`src/projects.ts`](src/projects.ts) remains the typed content layer. `RealProject` and `PlaceholderProject` are distinct records, identified by `status`; real projects do not require invented placeholder role or evidence fields. Replace concept records with approved project material. A project's stable `id` determines its generated URL.

[`src/JadeShowcase.tsx`](src/JadeShowcase.tsx) uses owned JadeWords media copied from `language-app/apps/web/assets/` into `public/jade-words/`. The vocabulary, grammar, and writing images are actual app captures. `features.mp4` is a silent overview composed from those captures; it is not a live app recording. The illustrative Songs film is not used in this portfolio. Product sources were checked against the feature audit, package files, current mobile services, and the public website on 2026-10-05. NestJS is an optional service in the product repository, not the primary mobile backend.

[`src/Demo.tsx`](src/Demo.tsx) contains the three local demo surfaces. Replace the corresponding presentation with an approved real demonstration. The typed `backdrop` field selects a theme and optional asset under `public/`; [`src/Backdrop.tsx`](src/Backdrop.tsx) retains decorative layers for interruptible crossfades and supplies CSS fallbacks.

`public/concept-art.webp` and `public/roam-atmosphere.webp` are generated fictional artwork, not screenshots of existing projects. Replace them with approved media, retain meaningful alternative text for content images, and supply the actual biography and resume before presenting them as personal information.

## Verify

Install Chromium once for the committed browser suite:

```sh
npx playwright install chromium
npm run verify
```

`verify` runs lint, unit tests, strict type checks, the production build, and desktop/mobile Chromium tests. Individual commands are `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `npm run test:e2e`. Build first when running browser tests separately; Playwright starts a production preview on port **4174**. Browser reports and failure evidence are written to `playwright-report/` and `test-results/`.

Unit tests cover typed content, metadata, navigation, demo controls, focus, motion preferences, and idle timers. [`e2e/portfolio.spec.ts`](e2e/portfolio.spec.ts) covers static HTML without JavaScript, hydration, repeated and rapid selection, history and reload, keyboard/touch controls, immersive exits, idle/reveal behavior, live reduced motion, missing media, natural scrolling, native resume dialogs, and accessibility scans.

The GitHub Actions workflow runs the same verification on pull requests and pushes to `main`, and uploads browser failure evidence. It has no deployment step.
