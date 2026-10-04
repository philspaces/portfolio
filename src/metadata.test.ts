import { describe, expect, it } from 'vitest';
import { getPageMetadata } from './metadata';
import { projects } from './projects';

describe('page metadata', () => {
  it('identifies the portfolio without inventing a professional role', () => {
    const metadata = getPageMetadata('/');
    expect(metadata.title).toContain('Long Phi Nguyen');
    expect(metadata.description).toMatch(/portfolio in progress/i);
    expect(metadata.description).toMatch(/fictional/i);
    expect(metadata.description).not.toMatch(/engineer|designer|award|client/i);
  });

  it('describes the About page as an unfinished biography', () => {
    const metadata = getPageMetadata('/about');
    expect(metadata.title).toMatch(/^About/);
    expect(metadata.description).toMatch(/biography content is a placeholder/i);
  });

  it('gives each generated case study distinct metadata that labels its fictional content', () => {
    const metadata = projects.map(project => getPageMetadata(`/work/${project.id}`));
    expect(new Set(metadata.map(page => page.title)).size).toBe(projects.length);
    expect(new Set(metadata.map(page => page.description)).size).toBe(projects.length);
    projects.forEach((project, index) => {
      expect(metadata[index].title).toContain(project.title);
      expect(metadata[index].description).toContain(project.title);
      expect(metadata[index].description).toMatch(/fictional.*placeholder case study/i);
    });
  });

  it('keeps placeholder content out of the search index while allowing ordinary link traversal', () => {
    for (const route of ['/', '/about', ...projects.map(project => `/work/${project.id}`)]) {
      expect(getPageMetadata(route).robots).toBe('noindex, follow');
    }
  });

  it('uses missing-page metadata for unknown or malformed case-study paths', () => {
    for (const route of ['/404', '/unknown', '/work/missing', '/work/forma/extra']) {
      const metadata = getPageMetadata(route);
      expect(metadata.title).toMatch(/page not found/i);
      expect(metadata.robots).toBe('noindex, nofollow');
    }
  });

  it('resolves trailing slashes and navigation decorations without changing page identity', () => {
    expect(getPageMetadata('/about/?source=nav#intro')).toEqual(getPageMetadata('/about'));
    expect(getPageMetadata('/work/roam/')).toEqual(getPageMetadata('/work/roam'));
  });
});
