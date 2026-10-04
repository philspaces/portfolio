import { useMemo, useSyncExternalStore } from 'react';

const motionQuery = '(prefers-reduced-motion: reduce)';
const serverSnapshot = () => false;

function createMotionStore() {
  const query = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(motionQuery) : undefined;

  return {
    getSnapshot: () => query?.matches ?? false,
    subscribe: (onChange: () => void) => {
      if (!query) return () => undefined;
      if (typeof query.addEventListener === 'function') {
        query.addEventListener('change', onChange);
        return () => query.removeEventListener('change', onChange);
      }
      query.addListener(onChange);
      return () => query.removeListener(onChange);
    },
  };
}

export function useMotionPreference() {
  const store = useMemo(() => createMotionStore(), []);
  return useSyncExternalStore(store.subscribe, store.getSnapshot, serverSnapshot);
}
