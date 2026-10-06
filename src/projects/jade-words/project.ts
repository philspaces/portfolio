import type { JadeWordsProject } from './types';

export const jadeWords: JadeWordsProject = {
  id: 'jade-words',
  number: '01',
  status: 'real',
  title: 'JadeWords',
  category: 'Chinese-learning app',
  oneLiner: 'Chinese learning, from HSK vocabulary to Vocab Songs.',
  tags: ['Expo', 'React Native', 'TypeScript'],
  kind: 'jade',
  backdrop: { theme: 'jade', asset: 'jade-words/ink-landscape.svg' },
  description: 'A Mandarin learning app combining vocabulary, recall, grammar, speaking and character writing. Vocab Songs brings selected words into music, with pinyin and translations.',
  website: { url: 'https://jadewords.com/', label: 'View Jade Words' },
  stack: ['Expo', 'React Native', 'TypeScript', 'Supabase'],
  architectureNote: 'The Expo client calls Supabase directly. Database RPCs couple learning progress and awards; Edge Functions coordinate music planning and generation.',
  screenPreviews: [
    { id: 'vocabulary', label: 'Vocabulary', file: 'word.webp', accent: 'jade', number: '01' },
    { id: 'grammar', label: 'Grammar', file: 'grammar.webp', accent: 'blue', number: '02' },
    { id: 'writing', label: 'Writing', file: 'writing.webp', accent: 'cinnabar', number: '03' },
  ],
  overviewMedia: {
    video: 'jade-words/media/features.mp4',
    poster: 'jade-words/media/features-poster.webp',
    captions: 'jade-words/media/features-en.vtt',
    label: 'JadeWords screen overview',
    description: 'A silent overview composed from vocabulary, grammar and guided-writing captures. It shows app screens rather than live, interactive app controls.',
  },
  showcase: {
    eyebrow: 'CHINESE LEARNING',
    headline: ['Mandarin,', 'in practice.'],
    supportingCopy: ['Study words. Write characters.', 'Learn through songs.'],
  },
  engineering: {
    kicker: 'Mobile / runtime architecture',
    introduction: 'Resumable learning state, local stroke validation and server-side generation across a typed mobile client and Supabase.',
    headline: 'Client interaction.\nServer boundaries.',
    boundaries: [
      { title: 'Expo client', detail: 'Navigation, gestures, session drafts, audio playback' },
      { title: 'Supabase', detail: 'Auth · PostgreSQL + RLS · completion RPCs' },
      { title: 'Edge Functions', detail: 'Generation orchestration · providers · private audio' },
    ],
    sections: [
      { title: 'Resume a vocabulary session', detail: 'Load the active draft, fetch vocabulary by its stored IDs, then restore order, index and answer sets. Changes persist as JSONB. A partial unique index limits active drafts per user, module, content and mode.', source: 'LearningSessionScreen.tsx · learningSessionAPI.ts' },
      { title: 'Validate strokes on the device', detail: 'Stroke paths and medians come from Supabase through a per-character Promise cache. Gestures normalize to a 1024-coordinate SVG space. Each stroke is resampled to 20 points and checked against endpoints, mean distance and length; accepted strokes advance, rejected strokes trigger hints and haptics.', source: 'WritingBoard.tsx · writingAPI.ts' },
      { title: 'Commit completion in PostgreSQL', detail: 'Writing completion invokes record_writing_completion. The RPC locks existing progress, updates attempts and first-completion awards, then returns practice progress and progression in one database mutation.', source: 'writingProgressAPI.ts · record_writing_completion' },
    ],
  },
  songs: {
    title: 'Vocab Songs',
    headline: 'Context engineering.\nLyria generation.',
    introduction: 'Supabase’s Deno Edge Functions run a custom TypeScript planner that calls Gemini on Vertex AI, then Lyria through Gemini Interactions.',
    stack: ['TypeScript', 'Deno', 'Supabase Edge Functions', 'Vertex AI', 'Gemini API', 'expo-audio'],
    boundaries: [
      { title: 'Vertex AI · Gemini', detail: 'Skill + style context → validated musical direction' },
      { title: 'Gemini Interactions · Lyria', detail: 'Music prompt → audio and model-generated lyric text' },
      { title: 'Cloud Translation · pinyin-pro', detail: 'Mandarin lines → translations and pronunciation' },
      { title: 'Expo · expo-audio', detail: 'Signed Supabase Storage URL → native playback' },
    ],
    steps: [
      { title: 'Context engineering on Vertex AI', detail: 'Gemini receives a bundled music-direction skill plus vocabulary, HSK level, learner intent and sound-preset context. The TypeScript runner exposes read_skill and read_style_profile, then unlocks submit_music_direction after the style is read. Validation checks exact word coverage and verse/chorus structure; feedback supports revision within five turns. Accepted direction augments the base Lyria prompt, with a base-plan fallback.', source: 'music-agent/runner.ts · music-agent/skills.generated.ts · music-agent/google.ts' },
      { title: 'Lyria through Gemini Interactions', detail: 'A Deno Edge Function calls Lyria through the Gemini Interactions REST API. One response supplies generated audio and lyric text; decoded audio goes into Supabase Storage. The Expo client advances generation stages through focused polling.', source: 'ai-music-generate-audio/index.ts · _shared/ai-music.ts · AIMusicGeneratingScreen.tsx' },
      { title: 'Model output into a learning interface', detail: 'A dedicated parser extracts Mandarin lines from Lyria’s output. pinyin-pro builds phrase-level pinyin with polyphone overrides; Cloud Translation v3 supplies meanings in the same line order. Signed Storage URLs feed expo-audio. New generation is untimed; line seeking remains conditional on valid timestamps.', source: 'music-agent/lyria-lyrics.ts · _shared/ai-music.ts · AIMusicPlayerScreen.tsx' },
    ],
    media: {
      video: 'jade-words/media/songs.mp4',
      poster: 'jade-words/media/songs-poster.webp',
      captions: 'jade-words/media/songs-en.vtt',
      label: 'Vocab Songs feature illustration',
      description: 'A silent, 15-second feature illustration of selecting Chinese words, choosing a sound preset, and following lyrics with pinyin and translation. Illustrated graphics explain line replay; this is not recorded app interaction or a playable song.',
    },
  },
  availability: 'Coming soon to iOS & Android',
};
