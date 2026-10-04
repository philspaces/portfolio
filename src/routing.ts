import type { MouseEvent } from 'react';

const routeOrigin = 'https://portfolio.invalid';

/** Normalize a route independently of the host so it cannot escape the site's base. */
function routeUrl(route: string) {
  const path = route.trim().replace(/^\/+/, '');
  return new URL(`/${path}`, routeOrigin);
}

function basePath() {
  const base = new URL(import.meta.env.BASE_URL || '/', routeOrigin).pathname;
  return `${base.replace(/\/+$/, '')}/`;
}

function normalizedPath(path: string) {
  return routeUrl(path).pathname.replace(/\/+/g, '/').replace(/\/+$/, '') || '/';
}

function withinBase(path: string) {
  const base = basePath();
  return base === '/' || path === base.slice(0, -1) || path.startsWith(base);
}

function withoutBase(path: string) {
  const base = basePath();
  if (base === '/') return path;
  if (path === base.slice(0, -1)) return '/';
  return path.startsWith(base) ? `/${path.slice(base.length)}` : path;
}

/** Build a clean, trailing-slash URL, including the configured static-hosting base. */
export function routeHref(route: string): string {
  const url = routeUrl(route);
  const path = normalizedPath(url.pathname);
  return `${basePath()}${path === '/' ? '' : `${path.slice(1)}/`}${url.search}${url.hash}`;
}

/** Read the current view without requiring browser globals during static rendering. */
export function readBrowserRoute(): string {
  if (typeof window === 'undefined') return '/';
  if (window.location.hash.startsWith('#/') && withinBase(window.location.pathname)) {
    return normalizedPath(window.location.hash.slice(1));
  }
  return normalizedPath(withoutBase(window.location.pathname));
}

/** Upgrade bookmarked hash routes in place, keeping existing query parameters. */
export function syncLegacyRoute(): void {
  if (typeof window === 'undefined' || !window.location.hash.startsWith('#/') || !withinBase(window.location.pathname)) return;
  const legacy = routeUrl(window.location.hash.slice(1));
  const query = new URLSearchParams(window.location.search);
  // A query explicitly embedded in the legacy route takes precedence over its shell.
  for (const key of new Set(legacy.searchParams.keys())) {
    query.delete(key);
    for (const value of legacy.searchParams.getAll(key)) query.append(key, value);
  }
  const search = query.size ? `?${query}` : '';
  window.history.replaceState(window.history.state, '', routeHref(`${legacy.pathname}${search}${legacy.hash}`));
}

/** Keep native link behavior except for ordinary clicks on this site's app routes. */
export function handleAppNavigation(event: MouseEvent<HTMLDivElement>): void {
  if (typeof window === 'undefined' || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const target = event.target instanceof Element ? event.target : event.target instanceof Node ? event.target.parentElement : null;
  const anchor = target?.closest<HTMLAnchorElement>('a[href]');
  if (!anchor || !event.currentTarget.contains(anchor) || anchor.hasAttribute('download') || anchor.hasAttribute('target') || anchor.relList.contains('external')) return;
  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('#')) return;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin || url.hash || !withinBase(url.pathname)) return;
  const next = routeHref(`${withoutBase(url.pathname)}${url.search}`);
  event.preventDefault();
  if (`${window.location.pathname}${window.location.search}` === next) return;
  window.history.pushState(null, '', next);
  window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }));
}
