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

## JadeWords content evidence

The source of truth is the read-only `language-app` product repository and `apps/web/FEATURE_EVIDENCE.md`, checked against current mobile implementation on 2026-10-05. The audit document contains some older service descriptions; current reachable code takes precedence. This is implementation evidence, not proof of deployed content, adoption, role, measurable impact or store availability.

| Area | Supported capability | Source in `language-app` |
| --- | --- | --- |
| Vocabulary | HSK levels and topic sets, pinyin, meanings, device audio and examples | `apps/mobile/src/screens/VocabularyScreen.tsx:108`, `:125`, `:221`; `TodayWordsScreen.tsx:1219` |
| Flashcards | Reveal cards, mark remembered/missed, retry missed words | `apps/mobile/src/screens/LearningSessionScreen.tsx:974`, `:1040`, `:710` |
| Grammar | Explanations and exercises, example audio, matched-term word lookup and audio | `apps/mobile/src/screens/GrammarPointScreen.tsx:814`, `:900`, `:915`, `:943`, `:982`; `GrammarExerciseScreen.tsx:658` |
| Character writing | Animated stroke order, guided tracing and memory writing | `apps/mobile/src/screens/HandwritingPracticeScreen.tsx:36`, `:339`; `components/WritingBoard.tsx:357`, `:436` |
| Speaking | Hear a target phrase, use native microphone recognition, inspect the recognized text | `apps/mobile/src/screens/SpeakingExerciseScreen.tsx:420`, `:426`, `:737`, `:753`; `services/speechRecognitionService.ts:145` |
| Vocab Songs | Select words and a sound preset carrying style/mood; pinyin, translations and timed line replay | `apps/mobile/src/screens/AIMusicBuilderScreen.tsx:154`, `:205`, `:382`; `utils/musicExperience.ts:9`; `components/MusicLyrics.tsx:50`, `:53`, `:69` |

Speaking is reachable through the Practice tab: `navigation/AppNavigator.tsx:183`, `data/practiceModules.ts:33`, `screens/PracticeScreen.tsx:102`. The authenticated stack registers the speaking routes at `navigation/AppNavigator.tsx:239`; lesson practice opens the exercise at `screens/SpeakingLessonScreen.tsx:176`. Recognition depends on native module availability, permissions and device speech services. Development transcript mocks are restricted to `__DEV__`. Normalized transcript comparison provides no acoustic pronunciation or tone scoring; see `services/speechRecognitionService.ts:187` and `supabase/migrations/20260519120000_add_speaking_pinyin_lessons.sql:230`.

The mobile client uses Expo, React Native and TypeScript, with Supabase Auth, PostgreSQL and Edge Functions. `apps/api` does not establish NestJS as the runtime mobile backend. Do not claim scheduled spaced repetition, pronunciation scoring, released store downloads or production AI capabilities from implementation alone. Sound presets convey song style/mood; avoid inventing separate controls or promising that every selected word occurs in every generated song.

CTA: **View Jade Words → https://jadewords.com/**. Keep coming-soon availability until verified release evidence changes it. The portfolio's owned vocabulary/grammar/writing captures are actual app screens. Its optional feature film is a composed overview, starts paused, and does not represent a live interactive app. Features without owned screenshots can be documented accurately without fabricated UI.

## Acceptance checklist

Before considering a project addition or visual revision complete:

- View supplied reference pixels and the actual current render before deciding the design. Record the mismatch and intended correction.
- Capture comparable before/after views of the project and Forma at the same desktop and mobile viewport sizes: Browse, Immerse and technical content. Align scroll framing and wait for images and transitions to settle.
- Confirm atmosphere spans the viewport, shares the foreground palette/material, remains visible around the product, and survives immersion and natural scrolling without a hard section seam.
- Confirm the hero is concise, the owned screens stay readable, the project does not become a giant opaque poster, and verified feature coverage is complete below it.
- Exercise repeated and rapid selection, scoped arrow keys, visible focus, Escape/exit, Back/Forward and direct routes. No inactive controls may receive focus.
- Check reduced motion, missing atmosphere/screens/video, accessible media controls, text contrast and overflow at mobile widths.
- Run `npm run lint`, `npm test`, `npm run build` and appropriate existing browser checks. Inspect the screenshots in addition to automation results; state browser/device limits.
- Keep fictional concepts labeled and real claims evidence-based. Preserve the supplied name, unknown biography/resume fields and approved external CTA.
- Write a concise local commit when verified. Treat push, merge and deployment as separate authorized actions.
