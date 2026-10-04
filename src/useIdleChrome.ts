import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

const IDLE_DELAY = 2500;
const focusableControl = 'a[href], button, input, select, textarea, [tabindex], [contenteditable="true"]';

export function useIdleChrome({ enabled, reducedMotion, surfaceRef }: {
  enabled: boolean;
  reducedMotion: boolean;
  surfaceRef: RefObject<HTMLElement | null>;
}) {
  const [status, setStatus] = useState({ enabled, reducedMotion, quiet: false });
  if (status.enabled !== enabled || status.reducedMotion !== reducedMotion) {
    setStatus({ enabled, reducedMotion, quiet: false });
  }

  useEffect(() => {
    const surface = surfaceRef.current;
    if (!enabled || reducedMotion || !surface) return;

    const document = surface.ownerDocument;
    const heldPointers = new Set<number>();
    let heldTouch = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const hasProtectedFocus = () => {
      const focused = document.activeElement;
      if (!(focused instanceof Element) || !surface.contains(focused)) return false;
      if (focused.closest('.exit-button')) return false;
      return Boolean(focused.closest('.demo-interactive') || focused.matches(focusableControl));
    };

    const clearTimer = () => {
      if (timer !== undefined) clearTimeout(timer);
      timer = undefined;
    };

    const restartTimer = () => {
      clearTimer();
      timer = setTimeout(() => {
        timer = undefined;
        if (!heldPointers.size && !heldTouch && !hasProtectedFocus()) {
          setStatus(current => current.quiet ? current : { ...current, quiet: true });
        }
      }, IDLE_DELAY);
    };

    const reveal = () => {
      setStatus(current => current.quiet ? { ...current, quiet: false } : current);
      restartTimer();
    };

    const startsInDemo = (event: Event) => event.target instanceof Element
      && Boolean(event.target.closest('.demo-interactive'));

    const pointerDown = (event: PointerEvent) => {
      if (startsInDemo(event)) heldPointers.add(event.pointerId);
      reveal();
    };

    const pointerEnd = (event: PointerEvent) => {
      if (heldPointers.delete(event.pointerId)) reveal();
    };

    const touchStart = (event: TouchEvent) => {
      if (startsInDemo(event)) heldTouch = true;
      reveal();
    };

    const touchEnd = (event: TouchEvent) => {
      if (heldTouch && event.touches.length === 0) {
        heldTouch = false;
        reveal();
      }
    };

    surface.addEventListener('pointermove', reveal, { passive: true });
    surface.addEventListener('pointerdown', pointerDown, { passive: true });
    surface.addEventListener('touchstart', touchStart, { passive: true });
    surface.addEventListener('keydown', reveal);
    surface.addEventListener('focusin', reveal);
    surface.addEventListener('focusout', reveal);
    // Release can land outside the stage after a drag or a touch gesture.
    document.addEventListener('pointerup', pointerEnd, { passive: true });
    document.addEventListener('pointercancel', pointerEnd, { passive: true });
    document.addEventListener('touchend', touchEnd, { passive: true });
    document.addEventListener('touchcancel', touchEnd, { passive: true });
    restartTimer();

    return () => {
      clearTimer();
      surface.removeEventListener('pointermove', reveal);
      surface.removeEventListener('pointerdown', pointerDown);
      surface.removeEventListener('touchstart', touchStart);
      surface.removeEventListener('keydown', reveal);
      surface.removeEventListener('focusin', reveal);
      surface.removeEventListener('focusout', reveal);
      document.removeEventListener('pointerup', pointerEnd);
      document.removeEventListener('pointercancel', pointerEnd);
      document.removeEventListener('touchend', touchEnd);
      document.removeEventListener('touchcancel', touchEnd);
    };
  }, [enabled, reducedMotion, surfaceRef]);

  return { quiet: enabled && !reducedMotion && status.quiet };
}
