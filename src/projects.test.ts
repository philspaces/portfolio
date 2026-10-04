import { describe, expect, it } from 'vitest';
import { getProject, projects } from './projects';

describe('placeholder project content', () => {
  it('has unique URL-safe slugs and resolves each case-study record', () => {
    expect(new Set(projects.map((project) => project.id)).size).toBe(projects.length);
    for (const project of projects) {
      expect(project.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(getProject(project.id)).toBe(project);
    }
  });

  it('returns no invented fallback project for an unknown route', () => {
    expect(getProject('unknown-project')).toBeUndefined();
    expect(getProject('')).toBeUndefined();
    expect(getProject('Forma')).toBeUndefined();
  });

  it('covers three distinct demo formats with concise placeholder metadata', () => {
    expect(new Set(projects.map((project) => project.kind))).toEqual(
      new Set(['web', 'mobile', 'system']),
    );
    for (const project of projects) {
      expect(project.tags.length).toBeGreaterThan(0);
      expect(project.tags.length).toBeLessThanOrEqual(3);
      expect(project.tags).toContain('Placeholder');
      expect(project.category).toMatch(/concept/i);
    }
  });

  it('labels every concept, role, constraint set, and evidence field as placeholder content', () => {
    for (const project of projects) {
      expect(project.description).toMatch(/fictional placeholder/i);
      expect(project.context).toMatch(/^fictional placeholder scenario:/i);
      expect(project.role).toMatch(/^placeholder: add your actual role/i);
      expect(project.constraints[0]).toMatch(/^placeholder constraints/i);
      expect(project.evidence.length).toBeGreaterThan(0);
      for (const evidence of project.evidence) {
        expect(evidence.value).toMatch(/^placeholder: add /i);
      }
    }
  });

  it('does not present invented achievements, client names, or quantitative results', () => {
    const achievementClaims =
      /\b(?:increased|improved|reduced|grew|achieved|launched|led)\b|\b\d+(?:\.\d+)?\s*(?:%|users|customers)\b|\b(?:for|with)\s+(?:Google|Apple|Airbnb|Meta|Microsoft)\b/i;

    for (const project of projects) {
      const publicContent = [
        project.title,
        project.category,
        project.oneLiner,
        project.description,
        project.role,
        project.context,
        ...project.constraints,
        ...project.architecture.flatMap(({ title, detail }) => [title, detail]),
        ...project.tradeoffs.flatMap(({ decision, reasoning }) => [decision, reasoning]),
        ...project.evidence.flatMap(({ label, value }) => [label, value]),
      ].join('\n');

      expect(publicContent).not.toMatch(achievementClaims);
    }
  });
});
