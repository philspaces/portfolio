import { createElement, createRef, StrictMode } from 'react';
import type { ReactNode } from 'react';
import { act, cleanup, fireEvent, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useIdleChrome } from './useIdleChrome';

let surface: HTMLElement;
let surfaceRef: ReturnType<typeof createRef<HTMLElement>>;

beforeEach(() => {
  vi.useFakeTimers();
  surface = document.createElement('section');
  surface.innerHTML = '<button class="exit-button">Exit</button><a href="#case">Case study</a><div class="demo-interactive"><button>Demo action</button><div data-drag>Drag surface</div></div>';
  document.body.append(surface);
  surfaceRef = createRef<HTMLElement>();
  surfaceRef.current = surface;
});

afterEach(() => {
  cleanup();
  surface.remove();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function mount(enabled = true, reducedMotion = false) {
  return renderHook(({ enabled, reducedMotion }) => useIdleChrome({ enabled, reducedMotion, surfaceRef }), {
    initialProps: { enabled, reducedMotion },
  });
}

const advance = (ms = 2500) => act(() => vi.advanceTimersByTime(ms));

function pointerEvent(type: string, target: EventTarget, pointerId = 1) {
  const event = Object.assign(new Event(type, { bubbles: true, cancelable: true }), { pointerId });
  act(() => target.dispatchEvent(event));
  return event;
}

describe('useIdleChrome', () => {
  it('waits a full 2500ms before making the preview chrome quiet', () => {
    const { result } = mount();
    expect(result.current.quiet).toBe(false);
    advance(2499);
    expect(result.current.quiet).toBe(false);
    advance(1);
    expect(result.current.quiet).toBe(true);
  });

  it('reveals on stage pointer, keyboard and touch activity and restarts the idle window', () => {
    const { result } = mount();
    for (const type of ['pointermove', 'pointerdown', 'keydown', 'touchstart']) {
      advance();
      expect(result.current.quiet).toBe(true);
      act(() => surface.dispatchEvent(new Event(type, { bubbles: true, cancelable: true })));
      expect(result.current.quiet).toBe(false);
      advance(2400);
      expect(result.current.quiet).toBe(false);
      advance(100);
      expect(result.current.quiet).toBe(true);
    }
  });

  it('keeps chrome visible while a demo control owns focus, then resumes idle after blur', () => {
    const { result } = mount();
    advance();
    act(() => surface.querySelector<HTMLButtonElement>('.demo-interactive button')?.focus());
    expect(result.current.quiet).toBe(false);
    advance(10000);
    expect(result.current.quiet).toBe(false);
    act(() => surface.querySelector<HTMLButtonElement>('.demo-interactive button')?.blur());
    advance(2499);
    expect(result.current.quiet).toBe(false);
    advance(1);
    expect(result.current.quiet).toBe(true);
  });

  it('protects focused chrome links while allowing the persistent Exit button to idle', () => {
    const { result } = mount();
    act(() => surface.querySelector<HTMLAnchorElement>('a')?.focus());
    advance(10000);
    expect(result.current.quiet).toBe(false);
    act(() => surface.querySelector<HTMLButtonElement>('.exit-button')?.focus());
    advance();
    expect(result.current.quiet).toBe(true);
    act(() => fireEvent.keyDown(surface.querySelector('.exit-button')!, { key: 'Tab' }));
    expect(result.current.quiet).toBe(false);
  });

  it('never hides during held demo pointers, including release outside the stage', () => {
    const { result } = mount();
    const drag = surface.querySelector('[data-drag]')!;
    pointerEvent('pointerdown', drag, 1);
    pointerEvent('pointerdown', drag, 2);
    advance(10000);
    expect(result.current.quiet).toBe(false);
    pointerEvent('pointerup', document.body, 1);
    advance();
    expect(result.current.quiet).toBe(false);
    pointerEvent('pointercancel', document.body, 2);
    advance(2499);
    expect(result.current.quiet).toBe(false);
    advance(1);
    expect(result.current.quiet).toBe(true);
  });

  it('protects held touch gestures and restarts idle after touch ends', () => {
    const { result } = mount();
    act(() => fireEvent.touchStart(surface.querySelector('[data-drag]')!, { touches: [{ identifier: 1 }] }));
    advance(10000);
    expect(result.current.quiet).toBe(false);
    act(() => fireEvent.touchEnd(document.body, { touches: [] }));
    advance();
    expect(result.current.quiet).toBe(true);
  });

  it('reveals immediately when disabled or reduced motion is enabled and starts fresh when re-enabled', () => {
    const { result, rerender } = mount();
    advance();
    expect(result.current.quiet).toBe(true);
    rerender({ enabled: false, reducedMotion: false });
    advance(10000);
    expect(result.current.quiet).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
    rerender({ enabled: true, reducedMotion: false });
    expect(result.current.quiet).toBe(false);
    advance();
    expect(result.current.quiet).toBe(true);
    rerender({ enabled: true, reducedMotion: true });
    advance(10000);
    expect(result.current.quiet).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('never schedules a fade when initially disabled or reduced motion is requested', () => {
    const { result, rerender } = mount(false);
    advance(10000);
    expect(result.current.quiet).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
    rerender({ enabled: true, reducedMotion: true });
    advance(10000);
    expect(result.current.quiet).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not respond to activity outside its surface or prevent native keyboard/touch behavior', () => {
    const { result } = mount();
    advance();
    const external = pointerEvent('pointermove', document.body);
    expect(result.current.quiet).toBe(true);
    expect(external.defaultPrevented).toBe(false);
    const key = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
    act(() => surface.dispatchEvent(key));
    expect(result.current.quiet).toBe(false);
    expect(key.defaultPrevented).toBe(false);
    const touch = new Event('touchstart', { bubbles: true, cancelable: true });
    act(() => surface.dispatchEvent(touch));
    expect(touch.defaultPrevented).toBe(false);
  });

  it('clears timers and removes surface and release listeners on unmount', () => {
    const surfaceRemoval = vi.spyOn(surface, 'removeEventListener');
    const documentRemoval = vi.spyOn(document, 'removeEventListener');
    const { unmount } = mount();
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
    const removed = surfaceRemoval.mock.calls.map(([name]) => name);
    expect(removed).toEqual(expect.arrayContaining(['pointermove', 'pointerdown', 'touchstart', 'keydown', 'focusin', 'focusout']));
    expect(documentRemoval.mock.calls.map(([name]) => name)).toEqual(expect.arrayContaining(['pointerup', 'pointercancel', 'touchend', 'touchcancel']));
    pointerEvent('pointerdown', surface.querySelector('[data-drag]')!);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('keeps only one timer through Strict Mode setup and cleanup', () => {
    const { result, unmount } = renderHook(() => useIdleChrome({ enabled: true, reducedMotion: false, surfaceRef }), {
      wrapper: ({ children }: { children: ReactNode }) => createElement(StrictMode, null, children),
    });
    expect(vi.getTimerCount()).toBe(1);
    advance();
    expect(result.current.quiet).toBe(true);
    pointerEvent('pointermove', surface);
    expect(result.current.quiet).toBe(false);
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
