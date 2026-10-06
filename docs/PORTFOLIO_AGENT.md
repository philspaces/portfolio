# Portfolio agent playbook

Use this workflow when adding a real project, replacing a concept, or revising portfolio presentation or copy. It is repository guidance, not a requirement to redesign an already approved project.

## Read order and authority

1. Read the root [AGENTS.md](../AGENTS.md), then [DESIGN.md](DESIGN.md), then this playbook.
2. Read the files that render the affected region and its typed data. Use [README.md](../README.md) for setup and commands; check the current package scripts and configuration rather than assuming versions or ports.
3. Treat the user's latest explicit scope and approvals as controlling. DESIGN is the visual and editorial authority; this playbook describes how to gather evidence, implement and verify it. If a change updates an approved direction, reconcile these documents instead of leaving competing instructions.

The approved JadeWords baseline is commit `48030c3` (2026-10-06). It preserves the accepted left-hand brand/editorial composition, enlarges the immediately visible app presentation, removes the standalone Work title and JadeWords expansion interaction, and uses concise engineering Details. Intermediate experiments are not instructions to restore deleted content. See DESIGN for the current visual requirements and source evidence. This reference does not prohibit future explicitly requested changes.

## 1. Establish scope and preserve the baseline

Before editing, inspect the actual checkout:

```sh
git status --short
git log -8 --oneline
git diff
git diff --cached
```

- Record existing changes and their known ownership. Preserve them, `.git`, and product-source repositories. Do not reset, overwrite, stage or commit unrelated work. Use read-only product inspection unless product changes are separately authorized.
- Make a short scope map: requested region, intended result, protected approved regions, exact deletions, and verification needed. A deletion means removing that content/control and its dead behavior; it does not authorize a replacement CTA, paraphrase or neighboring redesign.
- Inspect the current rendered page before choosing a visual correction. For supplied screenshots, resolve and materialize the actual files through the supported file mechanism, verify they are readable on this executor, then view their pixels. A filename, cloud path or textual description is insufficient. Report materialization blockers and continue independent work.
- Capture comparable before views for visual changes. Keep the same viewport, project, selected feature and scroll framing for the after views. Preserve approved regions unless the request changes them.

## 2. Trace the real product before writing claims

Start with the reachable implementation, not a feature checklist or dependency list. Inspect entry points, navigation, callers, runtime services, provider requests, database functions/migrations and the output consumed by the client. Read package/configuration files to identify the actual stack, then prove how those components participate in the path being described.

Keep a compact internal claim ledger with the proposed claim, file/symbol, inspection date, evidence type and material boundary. Separate implemented behavior, observed runtime behavior, supplied author evidence and inference. Record exact references in DESIGN or project contributor notes; public source captions may stay short.

- A repository directory or installed library does not establish a runtime service. A migration does not establish a deployed database. A configured model does not establish successful live generation.
- Prefer current reachable code over older audit documents. Verify public availability separately before changing a coming-soon CTA. Do not infer role, authorship, motivation, users, scale, metrics, deployment or reliability guarantees from code alone.
- Do not log in, generate paid content, call providers, change permissions or alter the product runtime just to strengthen a portfolio claim without authorization. State untested runtime stages in the handoff; describe only supported capabilities.
- Keep fictional projects explicitly fictional. Do not invent screenshots, biographies, resumes, case-study evidence or real product content to satisfy a schema.

## 3. Choose an engineering story, then edit tightly

The collection identifies the product visually and briefly. Its external product-site link serves readers seeking the consumer deep dive. Portfolio Details serves engineers and recruiters: explain the challenging implementation, runtime boundaries and representative transformations.

Choose the few mechanisms that distinguish this product. For a cloud/LLM product, investigate context construction, tool protocols, orchestration, validation, provider roles and model-output transformation before falling back to generic persistence or retry/resume copy. For other products, choose their actual difficult work rather than imposing that story.

Write each passage around **input → mechanism and named technology → result**. For example, the verified JadeWords story connects vocabulary/style context to a bounded Gemini tool plan, then a Lyria prompt, audio and independent language layers. Naming Vertex AI, Gemini Interactions, Cloud Translation, pinyin-pro or expo-audio is useful when their role is explained, not as an unconnected stack list.

- Use concise, concrete language for technical readers. Explain a mechanism once; avoid generic hero slogans, consumer benefits repeated in Details and broad promises.
- Foreground substantive work such as local geometric stroke matching or transactional progress/awards when the code supports it. Routine token refresh, credentials kept server-side, ordinary validation and the absence of an unused backend are not showcase achievements.
- Keep evidence-audit caveats internal unless they materially affect public truth. Untimed generated lyrics versus timestamped line replay, an illustrative film versus recorded UI, release availability and fictional-concept disclosure do affect it and must remain honest.
- Discuss a consequential implementation choice only when evidence makes the explanation useful. An appropriate tool can be a strength. Do not invent motives, drawbacks or a Trade-offs section to complete a template. The rejected standalone JadeWords tradeoff block stays absent.
- Respect explicit copy deletions literally. Do not reintroduce rejected hygiene, unused-stack or generic assurances in synonyms. Preserve approved editorial language elsewhere.

### Context engineering: distinguish three layers

When describing an agent feature, trace these separately:

| Layer | Verify | JadeWords example |
| --- | --- | --- |
| Bundled context | Build inputs, generated bundle, preload and retrieval behavior | SKILL.md sources compile into hashed `skills.generated.ts`; `music-direction` is preloaded and available through `read_skill`. This is embedded context, not dynamic filesystem discovery. |
| Runtime model tools | Provider tool declarations, real call/response handling, schemas and validation | Gemini on Vertex AI receives `read_skill`, `read_style_profile` and `submit_music_direction`; the runner replays complete content parts and tool results across bounded turns. |
| Host orchestration | What application code gates, transforms and executes | Style-read gating precedes submission; host validation precedes acceptance. The accepted direction augments the base Lyria prompt. Edge stages handle generation and language enrichment. Other bundled skills supply host contracts/version receipts rather than separate model-driven loading. |

Do not call a prompt template an autonomous tool loop, claim arbitrary skill discovery from a bundled reader, or attribute host-controlled operations to the model. JadeWords source paths and provider boundaries are recorded in DESIGN; recheck current code before extending those claims.

## 4. Use the actual repository extension seams

The current site is Astro with a hydrated React showcase, TypeScript, Motion and local fonts/assets. Reuse this stack. The content layer is typed, but the real-project presenter is currently Jade-specific; adding a different real product requires a deliberate presentation/type extension, not just a copied record.

| Location | Responsibility and extension constraint |
| --- | --- |
| [src/projects.ts](../src/projects.ts) | Project copy, technology roles, engineering sections, media and backdrop data. `status` distinguishes real work from concepts. `RealProject` currently fixes `kind: 'jade'` and requires Jade screens, `overviewMedia` and Songs. Introduce honest real-project presentation variants/shared fields when needed; never add fictional Songs/media to satisfy the type. |
| [src/App.tsx](../src/App.tsx) | Stage, visual dispatch, project selection, routing and Details. `jade` selects `JadeShowcase`; other kinds select fictional `Demo`. First-load interactivity is Jade-specific. `RealProjectDetails` has a mobile kicker and unconditional Songs section: adapt these for a new real project. The concept immersion toolbar also declares “Fictional concept”. |
| [src/JadeShowcase.tsx](../src/JadeShowcase.tsx), [src/jade-showcase.css](../src/jade-showcase.css) | Jade brand/editorial copy, asset root, three captured screens, appended Songs tab, full/compact views and layout. Screen filenames resolve beneath `public/jade-words/screens/`. Preserve this accepted composition; a new presenter needs its own truthful full and thumbnail views. New project copy belongs in the typed layer rather than another hardcoded brand branch. |
| [src/Demo.tsx](../src/Demo.tsx) | Hardcoded Forma/Roam/Relay concept surfaces. `web`, `mobile` and `system` are these fictional demos, not generic real-product renderers. |
| [src/Backdrop.tsx](../src/Backdrop.tsx), [src/backdrop.css](../src/backdrop.css) | Viewport-wide project layers, decorative art, crossfades and fallbacks. A new theme needs both a typed theme and matching CSS. Keep its tint inside the project layer. |
| [src/styles.css](../src/styles.css) | Shared chrome, gutters, selector and engineering layout. Check the fixed four-column selector when changing project count. Some Jade sizing/technical styles are project-specific; do not assume a new ID inherits them. |
| [src/VocabSongs.tsx](../src/VocabSongs.tsx), [src/vocab-songs.css](../src/vocab-songs.css) | Jade's supporting cloud/LLM section, using the core engineering hierarchy. Reuse visual primitives for compatible sections; do not force Songs content onto another project. |
| [src/ProjectFilm.tsx](../src/ProjectFilm.tsx) | Paused native media, cleanup, accessible description, retry and focus recovery. The current contract assumes MP4, English captions and muted playback. Use matching approved assets or extend the contract truthfully. `overviewMedia` data alone does not render a section; do not restore Jade's removed overview film. |
| [src/pages/work/[slug].astro](../src/pages/work/[slug].astro), [src/routing.ts](../src/routing.ts), [src/metadata.ts](../src/metadata.ts) | Records generate static direct routes; IDs are stable slugs. Preserve base-path handling, history and static/hydrated metadata parity. Array order controls initial selection and navigation; homepage metadata features the first real record. Preserve indexing policy unless changing it is authorized. |
| [public/](../public/) | Approved, small local assets. Prefer `public/<project-id>/` for new project assets and public-relative paths resolved with `import.meta.env.BASE_URL`. Meaningful screens need accurate alt text; decorative atmosphere stays hidden from assistive technology. Do not copy private source trees, secrets or unsupported media into the portfolio. |

Existing tests contain current-collection assumptions, not a universal four-project model. When adding a project, review [projects.test.ts](../src/projects.test.ts), [metadata.test.ts](../src/metadata.test.ts), [App.test.tsx](../src/App.test.tsx) and [portfolio.spec.ts](../e2e/portfolio.spec.ts): counts/order, Jade-first homepage text, title helpers, guessed slugs, static-route lists and accessibility view lists. Update those assumptions deliberately and add coverage for the new real presentation. Keep Jade's screen/Songs regressions scoped to Jade rather than weakening truth checks to make a new record fit.

## 5. Preserve the accepted visual system

Apply [DESIGN's project presentation rules](DESIGN.md#project-presentation) and [visual acceptance checklist](DESIGN.md#visual-acceptance). Forma is the atmosphere/composition reference; JadeWords is the approved real-project reference. Use consistent editorial hierarchy, gutters and legibility, while letting each project have its own art, features and engineering story.

For JadeWords, preserve the viewport-wide ink-green environment and floating screens, the accepted logo/editorial region, first-load Vocabulary / Grammar / Writing / Songs controls, and compatible core/Songs technical sections. The standalone Work title reserves no space; project identification remains semantic. No expansion/exit or replacement Details CTA belongs to JadeWords. Direct route headings and the external product link remain. Concept Explore/Exit behavior remains where applicable. No boxed cream poster, stars/grain or “Real app screens” authenticity badge belongs in the shared composition.

Honor responsive alignment at the shared header/summary gutters: 48px desktop, 28px tablet and 18px mobile within the 1440px content width. Protect readable screens and usable preview controls at 320px and 390px, rather than retaining an empty heading band. Feature tabs and supporting sections should represent actual project strengths; consistent presentation does not require identical content or invented features.

Use genuine captures where available. An approved illustration must remain accurately described; do not disguise it as app interaction. Media starts paused with explicit playback, captions where supplied, accessible fallback/retry and cleanup on selection/navigation. Reuse approved local media unless new media is requested; do not call a provider to fill a portfolio illustration. Jade's removed core overview section stays absent; the approved Songs illustration remains in its tab and supporting section.

## 6. Execute acceptance checks before committing

Use this checklist for project additions and implementation revisions. For an instruction-only change, validate document links, factual code references and consistency; do not manufacture a UI task or claim fresh visual checks.

- [ ] Reconcile the scope map with the diff. Requested deletions and dead behavior are gone; protected regions and unrelated working-tree changes are preserved. Recheck all real claims against the evidence ledger and review public copy sentence by sentence.
- [ ] View supplied reference pixels and actual before/after renders. Compare the affected project and Forma at matching desktop/mobile frames: Browse, technical content and Immerse only where supported. Check first load at 1440px, 390px and 320px; use DESIGN's visual acceptance checklist. Wait for fonts, images, hydration and transitions; verify the intended heading/section is actually visible in each capture.
- [ ] Exercise every feature tab and media state, repeated/rapid project selection, keyboard focus and scoped arrow/Home/End behavior. Check Escape/exit and focus restoration where applicable; Jade has no expansion exit. Check direct routes, reload, Back/Forward, natural scrolling and static HTML without JavaScript.
- [ ] Check reduced motion, missing backdrop/screens/video, accessible names and native controls, contrast and horizontal overflow. Inactive or outgoing scenes must not receive focus. Preserve explicit native playback and do not steal media-control focus to work around browser Escape behavior.
- [ ] Run repository checks against the final implementation. Do not treat passing unit tests as visual approval.

```sh
npm run lint
npm test
npm run build
npm run test:e2e
```

`build` includes `typecheck`; `npm run verify` runs this same sequence. Follow README for the pinned Node/npm runtime and browser setup. [playwright.config.ts](../playwright.config.ts) uses production preview port 4174, desktop Chromium at 1440×1000 and mobile Chromium emulation. It is not native-device coverage. Check the actual preview URL/process and current build instead of assuming a previous port or allowing a stale reused preview. Do not rebuild while browser checks are reading the output.

If the expected browser/tool is unavailable, use a supported available browser when feasible and report the exact fallback and untested stages. Keep temporary executor configuration out of the repository unless a repository change is requested. Read-only docs changes need no repeated browser suite when the UI is unchanged; distinguish prior UI verification from checks run for this revision.

- [ ] Inspect actual screenshots as well as automation results. Store comparison evidence in ignored local output; do not upload private assets/source. Record viewport, route/project/tab and any browser/device limitation.
- [ ] Review and stage only task-owned files, inspect the staged diff, then create a concise local commit when requested. Preserve pre-existing edits and all unpublished commits. Push, merge and deployment need current authorization for that action.

```sh
git diff --check
git diff --stat
git status --short
# Stage explicit reviewed paths, then:
git diff --cached
git commit -m "docs: describe the verified change"
git status --short
```

The commit message above is an example; name the actual implementation or documentation outcome. In the handoff, report changed files, exact commit, remaining uncommitted changes and known ownership, checks actually run, preview URL if relevant, before/after evidence and any blockers or untested stages. Never imply a push or deployment occurred from a local commit.
