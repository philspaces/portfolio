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

export interface RealProject extends ProjectBase {
  status: 'real';
  kind: 'jade';
  website: { url: string; label: string };
  stack: string[];
  architectureNote: string;
  features: { title: string; detail: string }[];
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
    architectureNote: 'A typed mobile client uses Supabase Auth and PostgreSQL for content and progress. Song generation runs in Edge Functions, outside the mobile UI.',
    features: [
      { title: 'Vocabulary', detail: 'HSK levels and topic sets, with pinyin, meanings, audio and examples.' },
      { title: 'Flashcards', detail: 'Reveal a card, mark remembered or missed, then retry missed words.' },
      { title: 'Grammar', detail: 'Explanations and exercises, example audio, and in-place word lookup with audio.' },
      { title: 'Character writing', detail: 'Watch stroke order, trace with guidance, then write from memory.' },
      { title: 'Speaking', detail: 'Hear a Mandarin phrase, speak it, and inspect the recognized text.' },
      { title: 'Vocab Songs', detail: 'Choose words and a sound preset for style and mood. Follow pinyin, translations and line replay.' },
    ],
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
