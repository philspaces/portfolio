import { describe, expect, it } from 'vitest';
import { getProject, projects } from './projects';

const concepts = projects.filter(project => project.status === 'placeholder');

describe('verified and placeholder project content', () => {
  it('features JadeWords as the sole real project without inventing release or role claims', () => {
    const realProjects = projects.filter(project => project.status === 'real');
    expect(realProjects).toHaveLength(1);
    const jade = realProjects[0];
    expect(projects[0]).toBe(jade);
    expect(jade.id).toBe('jade-words');
    expect(jade.title).toBe('JadeWords');
    expect(jade.number).toBe('01');
    expect(jade.kind).toBe('jade');
    expect(jade.backdrop.theme).toBe('jade');
    expect(jade.website).toEqual({ url: 'https://jadewords.com/', label: 'View Jade Words' });
    expect(jade.stack).toEqual(['Expo', 'React Native', 'TypeScript', 'Supabase']);
    expect(jade.availability).toBe('Coming soon to iOS & Android');
    expect(jade.architectureNote).toBeTruthy();
    expect(jade).not.toHaveProperty('role');
    expect(jade).not.toHaveProperty('evidence');
    expect(jade).not.toHaveProperty('tradeoffs');
    expect(`${jade.oneLiner}\n${jade.description}`).toMatch(/Chinese/i);
    expect(`${jade.oneLiner}\n${jade.description}`).not.toMatch(/fictional|download now|available now|shipped|\d+\s*(?:users|customers|%)/i);
    expect(concepts).toHaveLength(3);
    expect(projects.map(project => project.number)).toEqual(['01', '02', '03', '04']);
  });

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
    expect(new Set(concepts.map((project) => project.kind))).toEqual(
      new Set(['web', 'mobile', 'system']),
    );
    for (const project of concepts) {
      expect(project.tags.length).toBeGreaterThan(0);
      expect(project.tags.length).toBeLessThanOrEqual(3);
      expect(project.tags).toContain('Placeholder');
      expect(project.category).toMatch(/concept/i);
    }
  });

  it('gives each concept a distinct atmospheric theme with local optional artwork', () => {
    expect(new Set(concepts.map(({ backdrop }) => backdrop.theme))).toEqual(
      new Set(['architecture', 'coast', 'network']),
    );
    for (const { backdrop } of concepts) {
      if (backdrop.asset) expect(backdrop.asset).toMatch(/^[a-z0-9-]+\.webp$/);
    }
  });

  it('labels every concept, role, constraint set, and evidence field as placeholder content', () => {
    for (const project of concepts) {
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

    for (const project of concepts) {
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
