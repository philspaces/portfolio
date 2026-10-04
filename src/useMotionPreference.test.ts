import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useMotionPreference } from './useMotionPreference';

let preference = false;
let listeners: Set<(event: MediaQueryListEvent) => void>;

function mockQuery(legacy = false) {
  const query = {
    get matches() { return preference; },
    media: '(prefers-reduced-motion: reduce)',
    addEventListener: legacy ? undefined : vi.fn((_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.add(listener)),
    removeEventListener: legacy ? undefined : vi.fn((_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener)),
    addListener: vi.fn((listener: (event: MediaQueryListEvent) => void) => listeners.add(listener)),
    removeListener: vi.fn((listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener)),
  };
  vi.stubGlobal('matchMedia', vi.fn(() => query));
  return query;
}

function changePreference(value: boolean) {
  preference = value;
  const event = Object.assign(new Event('change'), {
    matches: value,
    media: '(prefers-reduced-motion: reduce)',
  }) as MediaQueryListEvent;
  act(() => listeners.forEach(listener => listener(event)));
}

beforeEach(() => {
  preference = false;
  listeners = new Set();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('useMotionPreference', () => {
  it.each([false, true])('reads the initial reduced-motion preference: %s', value => {
    preference = value;
    mockQuery();
    const { result } = renderHook(useMotionPreference);
    expect(result.current).toBe(value);
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
  });

  it('updates in both directions without remounting', () => {
    mockQuery();
    const { result } = renderHook(useMotionPreference);
    changePreference(true);
    expect(result.current).toBe(true);
    changePreference(false);
    expect(result.current).toBe(false);
  });

  it('keeps one modern subscription across renders and removes it on unmount', () => {
    const query = mockQuery();
    const { rerender, unmount } = renderHook(useMotionPreference);
    rerender();
    expect(query.addEventListener).toHaveBeenCalledTimes(1);
    expect(query.addListener).not.toHaveBeenCalled();
    expect(listeners.size).toBe(1);
    const listener = query.addEventListener!.mock.calls[0][1];
    unmount();
    expect(query.removeEventListener).toHaveBeenCalledWith('change', listener);
    expect(listeners.size).toBe(0);
  });

  it('supports legacy media-query listeners and removes the same callback', () => {
    const query = mockQuery(true);
    const { result, unmount } = renderHook(useMotionPreference);
    expect(query.addListener).toHaveBeenCalledTimes(1);
    changePreference(true);
    expect(result.current).toBe(true);
    changePreference(false);
    expect(result.current).toBe(false);
    const listener = query.addListener.mock.calls[0][0];
    unmount();
    expect(query.removeListener).toHaveBeenCalledWith(listener);
    expect(listeners.size).toBe(0);
  });

  it('uses a stable false snapshot if matchMedia is unavailable', () => {
    vi.stubGlobal('matchMedia', undefined);
    const { result, rerender } = renderHook(useMotionPreference);
    expect(result.current).toBe(false);
    rerender();
    expect(result.current).toBe(false);
    expect(listeners.size).toBe(0);
  });
});
