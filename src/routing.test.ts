// @vitest-environment jsdom
import type { MouseEvent as ReactMouseEvent } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handleAppNavigation, readBrowserRoute, routeHref, syncLegacyRoute } from './routing';

beforeEach(() => {
  vi.stubEnv('BASE_URL', '/');
  window.history.replaceState(null, '', '/');
});

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

function clickLink(href: string, options: MouseEventInit = {}, attributes: Record<string, string> = {}, nestedSvg = false) {
  const root = document.createElement('div');
  const anchor = document.createElement('a');
  anchor.setAttribute('href', href);
  for (const [name, value] of Object.entries(attributes)) anchor.setAttribute(name, value);
  if (nestedSvg) anchor.innerHTML = '<svg><path /></svg>';
  else anchor.innerHTML = '<span>Follow route</span>';
  root.append(anchor);
  document.body.append(root);
  let intercepted = false;
  root.addEventListener('click', event => {
    handleAppNavigation(event as unknown as ReactMouseEvent<HTMLDivElement>);
    intercepted = event.defaultPrevented;
    // Suppress jsdom's unimplemented document navigation after observing the handler.
    event.preventDefault();
  });
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, ...options });
  const target = anchor.querySelector('path') ?? anchor.firstElementChild ?? anchor;
  target.dispatchEvent(event);
  return intercepted;
}

function traverseHistory(direction: 'back' | 'forward') {
  return new Promise<void>(resolve => {
    window.addEventListener('popstate', () => resolve(), { once: true });
    window.history[direction]();
  });
}

describe('clean route URLs', () => {
  it.each([
    ['/', '/'],
    ['/about', '/about/'],
    ['work/forma/', '/work/forma/'],
    ['/work/jade-words', '/work/jade-words/'],
    ['/work//forma///', '/work/forma/'],
    ['/work/../about', '/about/'],
    ['/about?language=vi#introduction', '/about/?language=vi#introduction'],
  ])('formats %s as %s', (route, href) => {
    expect(routeHref(route)).toBe(href);
  });

  it('includes a repository hosting base without duplicating slashes', () => {
    vi.stubEnv('BASE_URL', '/portfolio/');
    expect(routeHref('/')).toBe('/portfolio/');
    expect(routeHref('/work/roam/')).toBe('/portfolio/work/roam/');
    expect(routeHref('/../about')).toBe('/portfolio/about/');
  });

  it.each(['/portfolio', '/portfolio/', '/portfolio/work/relay/', '/portfolio/work/relay?preview=1'])('reads a route under the configured base: %s', path => {
    vi.stubEnv('BASE_URL', '/portfolio/');
    window.history.replaceState(null, '', path);
    expect(readBrowserRoute()).toBe(path.includes('/work/') ? '/work/relay' : '/');
  });

  it('keeps a similarly named path outside the base distinct', () => {
    vi.stubEnv('BASE_URL', '/portfolio/');
    window.history.replaceState(null, '', '/portfolio-archive/');
    expect(readBrowserRoute()).toBe('/portfolio-archive');
  });

  it('reads legacy routes and replaces them without adding a history entry', () => {
    vi.stubEnv('BASE_URL', '/portfolio/');
    window.history.replaceState({ retained: true }, '', '/portfolio/?language=vi&preview=old#/work/roam?preview=new&tag=a&tag=b');
    const length = window.history.length;
    expect(readBrowserRoute()).toBe('/work/roam');
    syncLegacyRoute();
    expect(window.location.pathname).toBe('/portfolio/work/roam/');
    expect(window.location.hash).toBe('');
    expect(window.location.search).toBe('?language=vi&preview=new&tag=a&tag=b');
    expect(window.history.length).toBe(length);
    expect(window.history.state).toEqual({ retained: true });
    expect(readBrowserRoute()).toBe('/work/roam');
  });

  it('leaves ordinary section fragments and links outside the base untouched', () => {
    vi.stubEnv('BASE_URL', '/portfolio/');
    window.history.replaceState(null, '', '/portfolio/about/#introduction');
    syncLegacyRoute();
    expect(readBrowserRoute()).toBe('/about');
    expect(window.location.hash).toBe('#introduction');
    window.history.replaceState(null, '', '/elsewhere/#/work/roam');
    syncLegacyRoute();
    expect(window.location.pathname).toBe('/elsewhere/');
    expect(readBrowserRoute()).toBe('/elsewhere');
  });

  it('is safe to import and call while rendering without a window', () => {
    vi.stubGlobal('window', undefined);
    expect(readBrowserRoute()).toBe('/');
    expect(routeHref('/about')).toBe('/about/');
    expect(() => syncLegacyRoute()).not.toThrow();
    expect(() => handleAppNavigation({} as ReactMouseEvent<HTMLDivElement>)).not.toThrow();
  });
});

describe('delegated app navigation', () => {
  it('follows an internal link from a nested SVG, preserving its query', () => {
    vi.stubEnv('BASE_URL', '/portfolio/');
    window.history.replaceState(null, '', '/portfolio/');
    const popstate = vi.fn();
    window.addEventListener('popstate', popstate);
    expect(clickLink('/portfolio/work/forma?preview=1', {}, {}, true)).toBe(true);
    expect(window.location.pathname).toBe('/portfolio/work/forma/');
    expect(window.location.search).toBe('?preview=1');
    expect(readBrowserRoute()).toBe('/work/forma');
    expect(popstate).toHaveBeenCalledOnce();
    window.removeEventListener('popstate', popstate);
  });

  it('does not add duplicate entries or dispatch a route change for the current URL', () => {
    window.history.replaceState(null, '', '/about/');
    const push = vi.spyOn(window.history, 'pushState');
    const popstate = vi.fn();
    window.addEventListener('popstate', popstate);
    expect(clickLink('/about/')).toBe(true);
    expect(push).not.toHaveBeenCalled();
    expect(popstate).not.toHaveBeenCalled();
    window.removeEventListener('popstate', popstate);
  });

  it.each([
    { ctrlKey: true },
    { metaKey: true },
    { shiftKey: true },
    { altKey: true },
    { button: 1 },
    { button: 2 },
  ])('keeps native behavior for a modified or non-primary click: %o', options => {
    expect(clickLink('/about/', options)).toBe(false);
    expect(window.location.pathname).toBe('/');
  });

  it.each([
    ['#main-content', {}],
    ['/about/#introduction', {}],
    ['https://elsewhere.example/about/', {}],
    ['https://jadewords.com/', { target: '_blank', rel: 'noopener noreferrer' }],
    ['mailto:person@example.com', {}],
    ['/about/', { download: '' }],
    ['/about/', { target: '_blank' }],
    ['/about/', { target: '_self' }],
    ['/about/', { rel: 'external' }],
  ] satisfies [string, Record<string, string>][])('leaves %s %o to the browser', (href, attributes) => {
    expect(clickLink(href, {}, attributes)).toBe(false);
    expect(window.location.pathname).toBe('/');
  });

  it('does not intercept same-origin links outside the hosting base', () => {
    vi.stubEnv('BASE_URL', '/portfolio/');
    window.history.replaceState(null, '', '/portfolio/');
    expect(clickLink('/about/')).toBe(false);
    expect(clickLink('/portfolio-archive/about/')).toBe(false);
    expect(window.location.pathname).toBe('/portfolio/');
  });

  it('respects an already handled click', () => {
    const event = { defaultPrevented: true, button: 0, preventDefault: vi.fn() } as unknown as ReactMouseEvent<HTMLDivElement>;
    handleAppNavigation(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('supports real repeated Back and Forward traversal after client navigation', async () => {
    expect(clickLink('/work/forma/')).toBe(true);
    expect(clickLink('/work/roam/')).toBe(true);
    expect(readBrowserRoute()).toBe('/work/roam');
    await traverseHistory('back');
    expect(readBrowserRoute()).toBe('/work/forma');
    await traverseHistory('back');
    expect(readBrowserRoute()).toBe('/');
    await traverseHistory('forward');
    expect(readBrowserRoute()).toBe('/work/forma');
    await traverseHistory('forward');
    expect(readBrowserRoute()).toBe('/work/roam');
  });
});
