import type { ProjectMedia, RealProjectBase } from '../types';

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

export interface JadeWordsProject extends RealProjectBase {
  kind: 'jade';
  screenPreviews: AppScreenPreview[];
  overviewMedia: ProjectMedia;
  showcase: {
    eyebrow: string;
    headline: [string, string];
    supportingCopy: [string, string];
  };
  songs: SongsFeature;
}
