import { Demo } from './concepts/Demo';
import { JadeShowcase } from './jade-words/JadeShowcase';
import { JadeWordsDetails } from './jade-words/JadeWordsDetails';
import { ConceptDetails } from './concepts/ConceptDetails';
import type { Project } from '../projects';

/** Explicit presentation cases keep project-specific UI out of the shared shell. */
export function ProjectVisual({ project, interactive = false, compact = false }: { project: Project; interactive?: boolean; compact?: boolean }) {
  switch (project.kind) {
    case 'jade':
      return <JadeShowcase project={project} interactive={interactive} compact={compact} />;
    case 'web':
    case 'mobile':
    case 'system':
      return <Demo kind={project.kind} interactive={interactive} compact={compact} />;
    default:
      project satisfies never;
      throw new Error('Unsupported project visual');
  }
}

export function ProjectDetails({ project, immersed }: { project: Project; immersed: boolean }) {
  switch (project.kind) {
    case 'jade':
      return <JadeWordsDetails project={project} immersed={immersed} />;
    case 'web':
    case 'mobile':
    case 'system':
      return <ConceptDetails project={project} />;
    default:
      project satisfies never;
      throw new Error('Unsupported project details');
  }
}
