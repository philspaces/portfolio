import { jadeWords } from './projects/jade-words/project';
import { conceptProjects } from './projects/concepts/projects';
import type { JadeWordsProject } from './projects/jade-words/types';
import type { PlaceholderProject } from './projects/types';

export type { DemoKind, ProjectBackdrop, ProjectMedia, RealProjectBase, PlaceholderProject } from './projects/types';
export type { JadeWordsProject } from './projects/jade-words/types';

// Add concrete real-project variants here; keep project-specific fields in their module.
export type RealProject = JadeWordsProject;
export type Project = RealProject | PlaceholderProject;

/** Ordered typed collection shared by static routes, metadata and the showcase. */
export const projects: Project[] = [jadeWords, ...conceptProjects];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.id === slug);
}
