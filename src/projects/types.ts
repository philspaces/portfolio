export type DemoKind = 'web' | 'mobile' | 'system';

export interface ProjectBackdrop {
  theme: 'architecture' | 'coast' | 'network' | 'jade';
  /** Public asset path. Omit for a structural CSS backdrop. */
  asset?: string;
}

export interface ProjectBase {
  /** Stable URL slug. Replace this together with the corresponding project content. */
  id: string;
  number: string;
  title: string;
  category: string;
  oneLiner: string;
  tags: string[];
  kind: string;
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

export interface RealProjectBase extends ProjectBase {
  status: 'real';
  website: { url: string; label: string };
  stack: string[];
  architectureNote: string;
  engineering: {
    kicker: string;
    introduction: string;
    headline: string;
    boundaries: { title: string; detail: string }[];
    sections: { title: string; detail: string; source: string }[];
  };
  availability: string;
}

export interface PlaceholderProject extends ProjectBase {
  status: 'placeholder';
  kind: DemoKind;
  role: string;
  context: string;
  constraints: string[];
  architecture: { title: string; detail: string }[];
  tradeoffs: { decision: string; reasoning: string }[];
  evidence: { label: string; value: string }[];
  demoHint: string;
}
