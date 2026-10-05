# The Living Showcase

## Intent and reference

Long Phi Nguyen's portfolio combines Swiss editorial typography and recruiter clarity with a cinematic, visual-first project collection. Charcoal, off-white and restrained cobalt belong to the portfolio chrome. Each project contributes its own material, color and atmosphere.

**Forma in this repository is the concrete visual reference.** Its architectural scene fills the viewport behind a floating product interface, the header, project title and selector. The scene and interface share the same visual world. Explore expands the same stage; it does not replace the surrounding page with a disconnected surface. Technical content enters through a gradual legibility layer.

Real projects must retain that presentation quality. Replacing a fictional product with approved app screens changes the content and project art, not the underlying Browse/Immerse design contract.

## Project presentation

- Mount project-dependent atmosphere in the fixed, viewport-wide `Backdrop`. Keep artwork separate from meaningful product screens. An asset may be a photograph, approved project art or a deliberate structural illustration; supply a useful CSS fallback.
- Compose the foreground as a product in that environment. App device surfaces and a web-product window may have backgrounds. A large opaque poster behind the entire brand, headline and screens breaks the composition.
- Let atmosphere reach the viewport edges and remain visible around the foreground. A colored rectangle constrained to the stage is not the page backdrop.
- Make visual motifs specific to the project. JadeWords uses broad folded ink forms in muted jade tones, derived from its character-writing context and palette. Its cream app screens float above those forms. The artwork is decorative, not a screenshot or a claim about the app interface.
- Avoid stars, cosmic speckles, grain overlays, excessive glows and unrelated scenic decoration. A request to remove an incongruous effect means remove that effect while preserving cinematic depth, composition and quality. Do not flatten the whole project without explicit direction.
- Keep shadows and lighting consistent, typography restrained and hierarchy legible. Use a directional overlay to protect text, rather than a uniform opaque slab that hides the atmosphere.
- Preserve the same environment from Browse into Immerse and into technical content. Keep the shared legibility overlay consistent across project selections; project-specific tints belong inside the crossfading project layer. Use approximately 0.55-second interruptible crossfades; reduced motion removes them. Never scrolljack, hijack global Space, trap iframe focus or rely on automatic playback.
- Keep the hero brief: title, one sentence and at most three metadata tags. Put complete feature coverage and architecture below the stage, in a compact editorial layout. Desktop may use a sticky build summary; mobile follows a natural single column.
- The selected project title replaces the generic intro heading at the top of Work, with its brief project sentence. It changes with project selection. Remove “A living showcase” and the “JadeWords, a chinese-learning app. / 3 interface concepts, clearly marked.” intro copy. Avoid repeating the same title below the visual; keep concise metadata/actions there. The personal navigation header remains Long Phi Nguyen / Work / About / Resume.
- Show the best product visuals immediately; immersion is enhancement, not a reveal gate. JadeWords screen selection works on first load. Its overview poster and native controls belong in the natural page flow; no “Explore preview” or “Open app preview” gate. Optional expansion enlarges the same composition and preserves screen selection.
- On mobile, expanded JadeWords prioritizes the preview, its four selection controls and the clear exit. The repeated project footer/website CTA remains in Browse; omitting it during expansion keeps the device larger and the controls clear within the viewport.
- Do not add self-authenticating labels such as “Real app screens”, “Actual app”, or “Verified project” to visible or accessible marketing copy. Describe the content directly: vocabulary, grammar, writing, preview. Keep provenance and validation in contributor documentation; authenticity badges make other content sound suspect. Fictional concepts still need accurate disclosure.

## JadeWords content evidence

The source of truth is the read-only `language-app` product repository and `apps/web/FEATURE_EVIDENCE.md`, checked against current mobile implementation on 2026-10-05. The audit document contains some older service descriptions; current reachable code takes precedence. This is implementation evidence, not proof of deployed content, adoption, role, measurable impact or store availability.

| Area | Supported capability | Source in `language-app` |
| --- | --- | --- |
| Vocabulary | HSK levels and topic sets, pinyin, meanings, device audio and examples | `apps/mobile/src/screens/VocabularyScreen.tsx:108`, `:125`, `:221`; `TodayWordsScreen.tsx:1219` |
| Flashcards | Reveal cards, mark remembered/missed, retry missed words | `apps/mobile/src/screens/LearningSessionScreen.tsx:974`, `:1040`, `:710` |
| Grammar | Explanations and exercises, example audio, matched-term word lookup and audio | `apps/mobile/src/screens/GrammarPointScreen.tsx:814`, `:900`, `:915`, `:943`, `:982`; `GrammarExerciseScreen.tsx:658` |
| Character writing | Animated stroke order, guided tracing and memory writing | `apps/mobile/src/screens/HandwritingPracticeScreen.tsx:36`, `:339`; `components/WritingBoard.tsx:357`, `:436` |
| Speaking | Hear a target phrase, use native microphone recognition, inspect the recognized text | `apps/mobile/src/screens/SpeakingExerciseScreen.tsx:420`, `:426`, `:737`, `:753`; `services/speechRecognitionService.ts:145` |
| Vocab Songs | Select words and a sound preset carrying style/mood; pinyin and translations. Timed player controls require timestamped tracks; new Lyria generation is untimed. | `apps/mobile/src/screens/AIMusicBuilderScreen.tsx:154`, `:205`, `:382`; `screens/AIMusicPlayerScreen.tsx:399`; `utils/lrc.ts:15`, `:47`; `supabase/functions/_shared/ai-music.ts:733` |

Speaking is reachable through the Practice tab: `navigation/AppNavigator.tsx:183`, `data/practiceModules.ts:33`, `screens/PracticeScreen.tsx:102`. The authenticated stack registers the speaking routes at `navigation/AppNavigator.tsx:239`; lesson practice opens the exercise at `screens/SpeakingLessonScreen.tsx:176`. Recognition depends on native module availability, permissions and device speech services. Development transcript mocks are restricted to `__DEV__`. Normalized transcript comparison provides no acoustic pronunciation or tone scoring; see `services/speechRecognitionService.ts:187` and `supabase/migrations/20260519120000_add_speaking_pinyin_lessons.sql:230`.

The mobile client uses Expo, React Native and TypeScript, with Supabase Auth, PostgreSQL and Edge Functions. `apps/api` does not establish NestJS as the runtime mobile backend. Do not claim scheduled spaced repetition, pronunciation scoring, released store downloads or production AI capabilities from implementation alone. Sound presets convey song style/mood; avoid inventing separate controls or promising that every selected word occurs in every generated song.

CTA: **View Jade Words → https://jadewords.com/**. Keep coming-soon availability until verified release evidence changes it. The portfolio's vocabulary/grammar/writing media comes from product captures. Its optional feature film is a composed overview, starts paused, and does not represent a live interactive app. Features without owned screenshots can be documented accurately without fabricated UI.

## Technical Details audience

Details is an engineering case study for technical readers. The short overview identifies the product; Details explains how it is implemented. Do not repeat consumer benefits, a product-website feature list or a generic stack laundry list. Show runtime boundaries, a representative request/data flow, a difficult feature's mechanism, state and persistence, failure handling, and meaningful trade-offs supported by the code. Keep implementation content in the typed project layer and use readable, restrained source captions.

Separate implementation facts from inferred engineering implications. An architecture can imply a trade-off without proving the author's original motivation. Do not invent personal contribution, scale, adoption, performance measurements, production deployment or security guarantees. A checked-in migration establishes intended database behavior; it does not verify a deployed database.

### JadeWords engineering evidence

All paths below are relative to the read-only `language-app` repository, inspected on 2026-10-05.

| Mechanism | Source and boundary |
| --- | --- |
| Direct mobile runtime | `apps/mobile/src/lib/supabase.ts:15` persists Auth in AsyncStorage and refreshes tokens; `hooks/useAuth.ts:22`, `:73`, `:103` uses Auth. Mobile services call Supabase Data API/RPC/Edge Functions. `apps/api/README.md:3` states the optional NestJS service is outside the current Expo runtime. |
| Vocabulary draft restoration | `apps/mobile/src/screens/LearningSessionScreen.tsx:171`, `:192`, `:239` loads the draft, fetches vocabulary by IDs, restores ordering/index/answer sets and persists changes. `services/learningSessionAPI.ts:89`, `:158` reads/writes Supabase. |
| Draft persistence rules | `supabase/migrations/20260521100000_add_user_learning_sessions.sql:8`, `:32`, `:40` defines JSONB state, a partial unique active-draft index and owner read/insert/update policies. |
| Local character validation | `apps/mobile/src/services/writingAPI.ts:83`, `:117` loads stroke paths/medians and caches Promises, evicting failures. `components/WritingBoard.tsx:114`, `:124`, `:357`, `:444` normalizes to 1024 coordinates, resamples 20 points, checks geometric tolerances, advances/hints and hides unfinished outlines in memory mode. No remote handwriting model. |
| Completion mutation | `apps/mobile/src/services/writingProgressAPI.ts:87` calls `record_writing_completion`; `supabase/migrations/20260518110000_rebuild_progression.sql:749`, `:769`, `:796`, `:810` derives identity, validates inputs, locks progress, updates attempts/first awards and progression. No claim of comprehensive cheat prevention or exactly-once completion. |
| Song request and ownership | `apps/mobile/src/screens/AIMusicBuilderScreen.tsx:204`; `services/aiMusicAPI.ts:150`, `:243`; `supabase/functions/_shared/ai-music.ts:322`; `ai-music-create/index.ts:29`, `:42` authenticate and persist the owned queued track. |
| Song orchestration | `apps/mobile/src/screens/AIMusicGeneratingScreen.tsx:45`, `:66`, `:93`, `:103` polls while focused, prevents overlapping local polls and invokes the next Edge stage. `supabase/functions/ai-music-generate-audio/index.ts:47`, `:63`, `:67` claims queued state, plans, calls Lyria and uploads audio. It is client-driven orchestration, not evidence of a background worker. |
| Conflict and retry boundaries | `supabase/functions/_shared/ai-music.ts:1526` conditions writes on owner/status, with optional updated-at conflict detection. `ai-music-retry-step/index.ts:33` resets the failed stage. Lyric retry reuses saved audio; this does not prove exactly-once provider execution. |
| Provider planning | `supabase/functions/_shared/music-agent/runner.ts:168`, `:170`, `:187`, `:233` bounds optional Gemini planning to five turns/default 20 seconds with a base-plan fallback. `_shared/ai-music.ts:629` calls Lyria server-side. These limits are not performance measurements. |
| Private audio and lyrics | `supabase/migrations/20260630121545_add_ai_music_state_machine_schema.sql:13`, `:27`, `:59`, `:106`, `:135` defines private audio and owner-scoped track/lyric access. `_shared/ai-music.ts:1590`, `:1631`, `:1694` uploads, signs URLs for an hour and saves independent lyric layers. |
| Player timing | `apps/mobile/src/screens/AIMusicPlayerScreen.tsx:37`, `:70`, `:103`, `:113`, `:140`, `:399` uses expo-audio, pauses on blur, bounds seeks and branches timed replay/ordinary rewind. `utils/lrc.ts:15`, `:47` handles plain lyrics separately and requires finite, nonnegative, increasing timestamps. |
| Current generation limit | `supabase/functions/_shared/ai-music.ts:733`, `:738`, `:1705`, `:2105` marks new lyrics timing:none, with no acoustic verification or Speech-to-Text alignment. Do not present current generation as synchronized karaoke. |

The local-geometry and direct-Supabase trade-offs shown in Details are explicitly inferred implications. Production provider availability, deployment and live end-to-end generation were not tested.

### Dedicated Vocab Songs section

The product preview controls include **Vocabulary / Grammar / Writing / Songs**. Songs belongs in this existing row, in addition to its dedicated engineering section. Keep the selected preview through expansion and exit. Left/Right and Home/End act only while a preview button has focus; ordinary Tab, Enter and Space remain native. Songs may use the approved landscape illustration when no genuine app capture is available; never frame that illustration as a phone screenshot or imply that its lyrics are live controls. It starts paused and is unmounted/paused when another preview is selected. All four controls must fit mobile widths without clipping.

The bounded local capture attempt on 2026-10-05 launched the installed iPhone 18 development client and successfully started the documented Expo Metro workflow from an unchanged temporary runtime mirror. The deep link reached iOS's “Open in Jade Words?” confirmation. This executor had headless `simctl` but no simulator tap tool or Simulator GUI, so navigation and authentication were not reached. No Songs capture was fabricated, no native build/install, login, permission change or generation was performed, and the owned Metro process was stopped. The current Songs tab therefore reuses the approved illustration; replace it with an owned capture when a supported interactive runtime is available.

Core learning remains the primary JadeWords story. Present Vocab Songs as a supporting section after core engineering Details on both the collection and direct project route. A single feature-list row is insufficient. The illustration explains Words → Sound → Lyrics; surrounding copy explains the request boundary, persisted generation stages and playback/timing implementation. Sound is a preset carrying style and mood, rather than two independently evidenced controls. Keep all copy in the typed project layer.

Reuse `songs.mp4`, `songs-poster.webp`, and `songs-en.vtt` from `language-app/apps/web/assets/media/`. This small, silent 15-second promo is an illustrative composition based on a saved internal Music Lab sample. It is not recorded app interaction, functioning lyric controls, or a playable song. Explain this in the accessible media description. “Feature illustration” is already embedded in the asset; avoid another visible provenance badge around it.

Use a paused poster, native controls, captions and explicit playback, including with reduced motion. Pause playback when leaving JadeWords or changing immersion. Missing media needs an accessible fallback and an explicit retry, preserving focus when the focused video is replaced. Do not call music providers or render new media. Keep the portfolio atmosphere behind the section; the promo itself may retain its paper surface.

Observed Chromium boundary: focused native media controls can consume Escape without dispatching a DOM key event. Keep the explicit showcase exit available; it pauses playback and restores entry focus. Verify Escape from application controls separately, and do not steal native-control focus to mask a browser limitation.

## Acceptance checklist

Before considering a project addition or visual revision complete:

- View supplied reference pixels and the actual current render before deciding the design. Record the mismatch and intended correction.
- Capture comparable before/after views of the project and Forma at the same desktop and mobile viewport sizes: Browse, Immerse and technical content. Align scroll framing and wait for images and transitions to settle.
- Confirm atmosphere spans the viewport, shares the foreground palette/material, remains visible around the product, and survives immersion and natural scrolling without a hard section seam.
- Confirm the hero is concise, the owned screens stay readable, the project does not become a giant opaque poster, and verified feature coverage is complete below it.
- Confirm first-load desktop/mobile exposes the rich screen composition and usable screen controls without opening a preview. Overview media is already in the page, paused; expansion preserves selection and restores entry focus.
- Confirm Details explains engineering mechanisms and sources, with factual runtime boundaries and explicitly inferred trade-offs. Songs must document client-driven stages and untimed lyric handling rather than repeat consumer benefits.
- Check Browse, Immerse, thumbnails and accessible names for redundant authenticity labels. Confirm Vocab Songs has its own supporting section and explicit native playback on collection and direct routes.
- Exercise repeated and rapid selection, scoped arrow keys, visible focus, Escape/exit, Back/Forward and direct routes. No inactive controls may receive focus.
- Check reduced motion, missing atmosphere/screens/video, accessible media controls, text contrast and overflow at mobile widths.
- Run `npm run lint`, `npm test`, `npm run build` and appropriate existing browser checks. Inspect the screenshots in addition to automation results; state browser/device limits.
- Keep fictional concepts labeled and real claims evidence-based. Preserve the supplied name, unknown biography/resume fields and approved external CTA.
- Write a concise local commit when verified. Treat push, merge and deployment as separate authorized actions.
