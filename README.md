# The Living Showcase

A static portfolio for **Long Phi Nguyen**. The previous application has been replaced while preserving the repository's Git history.

**JadeWords** is the featured project: a Chinese-learning app built with Expo, React Native, TypeScript, and Supabase. Its concise technical overview links to [the product website](https://jadewords.com/). The site currently describes app availability as coming soon; the portfolio does not claim an available store download, professional role, adoption, or measured impact.

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

- The selected project has a semantic, visually hidden heading; its accepted logo/editorial composition and larger product screens lead Work. Click a project card to change the visual and backdrop together; the selection stays synchronized with case routes and history. With a project tab focused, arrow keys change projects; Home and End select the first and last.
- **Explore demo** expands the stage inline and enables its local sample controls. **Exit demo** or Escape returns to browsing and restores entry focus.
- JadeWords starts selected with **Vocabulary / Grammar / Writing / Songs** preview controls already available. Songs opens the existing silent feature illustration with native playback, alongside the three captured app screens. Left/Right and Home/End work while a preview button has focus. The full composition is available immediately, with no expansion control. The removed action has no replacement; engineering details remain available through normal scrolling and the direct project route. **View Jade Words** opens the product website in a new tab. The build follows the collection directly with normal section spacing; the former standalone core overview video is removed. Songs media explains the feature rather than providing a functioning mobile app.
- Secondary immersive labels fade after 2.5 seconds of inactivity. Pointer, touch, or keyboard input reveals them. Exit stays available; focused or active controls keep labels visible. Reduced motion keeps labels visible and disables transitions.
- Scroll naturally into the architecture and details. The architecture is sticky on desktop and part of the normal column on mobile.
- JadeWords Details explains the direct Supabase runtime, resumable JSONB learning drafts, local geometric stroke validation and database completion RPC. Inferred engineering trade-offs are identified separately. A dedicated Vocab Songs section uses the same engineering layout to explain Gemini function calling on Vertex AI, Lyria through Gemini Interactions, Cloud Translation, pinyin-pro and expo-audio, with source captions and the silent illustration. Native films start paused, support captions and pause when leaving the project or navigating between collection and project routes. Selecting another preview also pauses and removes the Songs tab's film.
- **Resume** opens an availability dialog without an invented document link.

Demo state is local and is not persisted. Missing artwork has a useful fallback. There is no global Space shortcut, scroll interception, iframe focus, or custom cursor.

## Replace the placeholders

Read the durable [design context and acceptance checklist](docs/DESIGN.md) before adding or changing a project. [AGENTS.md](AGENTS.md) makes this part of the contributor workflow. Forma is the visual reference for full-viewport atmosphere and Browse/Immerse continuity; real content must preserve the same presentation quality.

[`src/projects.ts`](src/projects.ts) remains the typed content layer. `RealProject` and `PlaceholderProject` are distinct records, identified by `status`; real projects do not require invented placeholder role or evidence fields. Replace concept records with approved project material. A project's stable `id` determines its generated URL.

[`src/JadeShowcase.tsx`](src/JadeShowcase.tsx) uses owned JadeWords media copied from `language-app/apps/web/assets/` into `public/jade-words/`. The vocabulary, grammar, and writing images are product captures. `features.mp4` remains an approved local asset, but its former standalone overview section before The build is no longer displayed. [`src/VocabSongs.tsx`](src/VocabSongs.tsx) uses the existing `songs.mp4`, poster and English captions in a supporting feature section. This silent promo is an illustrative composition based on a saved internal sample, not recorded Songs UI or playable music. Product sources were checked against the feature audit, package files, current mobile services, and the public website on 2026-10-05. NestJS is an optional service in the product repository, not the primary mobile backend.

JadeWords places these screens directly above a full-viewport ink landscape in muted jade tones. `ink-landscape.svg` is small decorative project artwork, not app UI. Details is an engineering case study, with source-grounded runtime, persistence, validation and orchestration mechanisms. New song generation produces untimed lyrics; timed line navigation is conditional on valid timestamps. Exact source references and implementation limits are recorded in the design document.

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
