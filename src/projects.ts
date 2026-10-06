export type DemoKind = 'web' | 'mobile' | 'system' | 'jade';

export interface ProjectBackdrop {
  theme: 'architecture' | 'coast' | 'network' | 'jade';
  /** Public asset path. Omit for a structural CSS backdrop. */
  asset?: string;
}

interface ProjectBase {
  /** Stable URL slug. Replace this together with the corresponding project content. */
  id: string;
  number: string;
  title: string;
  category: string;
  oneLiner: string;
  tags: string[];
  kind: DemoKind;
  backdrop: ProjectBackdrop;
  description: string;
}

export interface ProjectMedia {
  video: string;
  poster: string;
  captions: string;
  label: string;
  description: string;
}

export interface AppScreenPreview {
  id: string;
  label: string;
  file: string;
  accent: 'jade' | 'blue' | 'cinnabar';
  number: string;
}

export interface SongsFeature {
  title: string;
  headline: string;
  introduction: string;
  stack: string[];
  boundaries: { title: string; detail: string }[];
  steps: { title: string; detail: string; source: string }[];
  media: ProjectMedia;
}

export interface RealProject extends ProjectBase {
  status: 'real';
  kind: 'jade';
  website: { url: string; label: string };
  stack: string[];
  architectureNote: string;
  screenPreviews: AppScreenPreview[];
  overviewMedia: ProjectMedia;
  engineering: {
    introduction: string;
    headline: string;
    boundaries: { title: string; detail: string }[];
    sections: { title: string; detail: string; source: string }[];
  };
  songs: SongsFeature;
  availability: string;
}

export interface PlaceholderProject extends ProjectBase {
  status: 'placeholder';
  kind: Exclude<DemoKind, 'jade'>;
  role: string;
  context: string;
  constraints: string[];
  architecture: { title: string; detail: string }[];
  tradeoffs: { decision: string; reasoning: string }[];
  evidence: { label: string; value: string }[];
  demoHint: string;
}

export type Project = RealProject | PlaceholderProject;

/** Real records use verified product sources; concepts remain explicitly fictional. */
export const projects: Project[] = [
  {
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
    engineering: {
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
  },
  {
    id: 'forma',
    number: '02',
    status: 'placeholder',
    title: 'Forma',
    category: 'Web product concept',
    oneLiner: 'A considered workspace for collecting visual ideas and seeing them in context.',
    tags: ['Web interface', 'Product thinking', 'Placeholder'],
    kind: 'web',
    backdrop: { theme: 'architecture', asset: 'concept-art.webp' },
    description:
      'Forma is a fictional placeholder: an interactive workspace concept made to demonstrate this portfolio’s presentation. It is not a shipped product or an example of Long’s professional work.',
    role: 'Placeholder: add your actual role, contributions, and collaborators.',
    context:
      'Fictional placeholder scenario: someone building a visual collection wants to browse spaces and objects, then inspect an individual idea. The concept explores how a calm workspace can support both scanning and closer attention.',
    constraints: [
      'Placeholder constraints: replace with the conditions of the real project.',
      'This concept uses sample content and local interface state.',
      'The demo has no accounts, persistence, or connected team data.',
    ],
    architecture: [
      {
        title: 'Presentation',
        detail:
          'A client-side workspace groups sample spaces and objects into a visual collection. The hierarchy keeps browsing, selection, and item details distinct.',
      },
      {
        title: 'Interaction',
        detail:
          'Collection filters and artwork selection update local browser state. Sample collection data stays separate from the portfolio’s project records.',
      },
      {
        title: 'A real implementation',
        detail:
          'Placeholder: document the actual data model, persistence, permissions, and integration boundaries when verified project material is available.',
      },
    ],
    tradeoffs: [
      {
        decision: 'Keep the concept focused',
        reasoning:
          'A small sample collection makes browsing and selection legible. A complete workspace would need a broader set of workflows and failure states.',
      },
      {
        decision: 'Make state local',
        reasoning:
          'Browser state makes the placeholder usable without services or credentials. It does not represent production persistence or multi-user collaboration.',
      },
    ],
    evidence: [
      { label: 'Outcome', value: 'Placeholder: add a verified outcome and its source.' },
      { label: 'Validation', value: 'Placeholder: add research, test results, or review evidence.' },
      { label: 'Project source', value: 'Placeholder: add an approved project link or artifact.' },
    ],
    demoHint: 'Filter the collection, then select an artwork to inspect its sample details.',
  },
  {
    id: 'roam',
    number: '03',
    status: 'placeholder',
    title: 'Roam',
    category: 'Mobile product concept',
    oneLiner: 'A pocket-sized way to discover a place and shape an afternoon.',
    tags: ['Mobile interface', 'Discovery', 'Placeholder'],
    kind: 'mobile',
    backdrop: { theme: 'coast', asset: 'roam-atmosphere.webp' },
    description:
      'Roam is a fictional placeholder: a mobile discovery concept with a working browser demo. Its places and plans are sample content, not client work or Long’s professional achievements.',
    role: 'Placeholder: add your actual role, contributions, and collaborators.',
    context:
      'Fictional placeholder scenario: someone exploring an unfamiliar place wants a short list of possibilities and an easy way to save a plan. The concept considers discovery within a compact mobile layout.',
    constraints: [
      'Placeholder constraints: replace with the conditions of the real project.',
      'Sample destinations are illustrative and do not provide travel guidance.',
      'The browser demo does not request location access or connect to booking services.',
    ],
    architecture: [
      {
        title: 'Mobile composition',
        detail:
          'A phone-shaped presentation organizes fictional destinations into a compact discovery flow, with deliberate spacing and touch-sized controls.',
      },
      {
        title: 'Local exploration',
        detail:
          'Destination selection, a sample route, and an optional itinerary stop use local browser state. There is no location service, booking engine, or remote destination feed.',
      },
      {
        title: 'A real implementation',
        detail:
          'Placeholder: describe the actual navigation model, accessibility decisions, offline behavior, and service boundaries once the real project is supplied.',
      },
    ],
    tradeoffs: [
      {
        decision: 'Show a compact discovery flow',
        reasoning:
          'A few curated sample destinations keep the interaction easy to understand. A real product would need content quality, freshness, and availability checks.',
      },
      {
        decision: 'Use a browser-native preview',
        reasoning:
          'The concept is available directly in the portfolio. It is a web demo of a mobile interface and makes no claim about a native application.',
      },
    ],
    evidence: [
      { label: 'Outcome', value: 'Placeholder: add a verified outcome and its source.' },
      { label: 'Validation', value: 'Placeholder: add usability findings or test evidence.' },
      { label: 'Project source', value: 'Placeholder: add an approved project link or artifact.' },
    ],
    demoHint: 'Choose a destination and add a sample stop to the day’s itinerary.',
  },
  {
    id: 'relay',
    number: '04',
    status: 'placeholder',
    title: 'Relay',
    category: 'System interface concept',
    oneLiner: 'An observable path from incoming event to completed work.',
    tags: ['System design', 'Observability', 'Placeholder'],
    kind: 'system',
    backdrop: { theme: 'network' },
    description:
      'Relay is a fictional placeholder: a visual system concept that simulates an event pipeline in the browser. It is not a running backend or evidence of Long’s production engineering work.',
    role: 'Placeholder: add your actual role, contributions, and collaborators.',
    context:
      'Fictional placeholder scenario: a team wants to understand how events move through a processing pipeline and where attention is needed. The concept makes system state visible through a compact operational interface.',
    constraints: [
      'Placeholder constraints: replace with the conditions of the real project.',
      'Events, statuses, and timings are simulated sample data.',
      'No requests are sent to an actual queue, worker, database, or monitoring service.',
    ],
    architecture: [
      {
        title: 'Conceptual pipeline',
        detail:
          'The visual model separates event ingress, queued work, processing, and delivery. These boundaries illustrate a possible system rather than document a deployed architecture.',
      },
      {
        title: 'Browser simulation',
        detail:
          'Sending an event, pausing workers, and simulating a retry change local state and sample logs. These explicit steps do not run timers or background infrastructure.',
      },
      {
        title: 'A real implementation',
        detail:
          'Placeholder: provide the actual delivery guarantees, retry policy, idempotency strategy, monitoring signals, and failure recovery behavior for a verified project.',
      },
    ],
    tradeoffs: [
      {
        decision: 'Make the system inspectable',
        reasoning:
          'A compact pipeline view exposes the conceptual boundaries. Production operations would need deeper logs, tracing, alerting, and access controls.',
      },
      {
        decision: 'Simulate infrastructure locally',
        reasoning:
          'Local sample state keeps the portfolio independent of services. It cannot establish throughput, reliability, or production performance.',
      },
    ],
    evidence: [
      { label: 'Outcome', value: 'Placeholder: add a verified outcome and its source.' },
      { label: 'Validation', value: 'Placeholder: add measured system or reliability evidence.' },
      { label: 'Project source', value: 'Placeholder: add an approved repository or architecture artifact.' },
    ],
    demoHint: 'Send a sample event, pause a worker, or simulate a failure and retry.',
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.id === slug);
}
