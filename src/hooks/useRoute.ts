import { useEffect, useState } from 'react';
import { readBrowserRoute, syncLegacyRoute } from '../lib/routing';

export function useRoute(initialRoute?: string) {
  const [route, setRoute] = useState(() => initialRoute ?? readBrowserRoute());
  useEffect(() => {
    const update = () => {
      syncLegacyRoute();
      setRoute(readBrowserRoute());
    };
    update();
    window.addEventListener('popstate', update);
    window.addEventListener('hashchange', update);
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener('hashchange', update);
    };
  }, []);
  return route;
}
