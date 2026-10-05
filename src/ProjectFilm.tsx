import { useEffect, useId, useRef, useState } from 'react';
import { ImageSquareIcon } from '@phosphor-icons/react';
import type { ProjectMedia } from './projects';
import './project-film.css';

export function ProjectFilm({ media, immersed, unavailableMessage }: { media: ProjectMedia; immersed: boolean; unavailableMessage: string }) {
  const descriptionId = useId();
  const videoRef = useRef<HTMLVideoElement>(null);
  const retryRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  const [unavailable, setUnavailable] = useState(false);
  const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

  useEffect(() => {
    const video = videoRef.current;
    if (restoreFocus.current) {
      if (unavailable) retryRef.current?.focus({ preventScroll: true });
      else video?.focus({ preventScroll: true });
      restoreFocus.current = false;
    }
    return () => { if (video && !video.paused) video.pause(); };
  }, [unavailable, immersed]);

  const handleMediaError = () => {
    restoreFocus.current ||= document.activeElement === videoRef.current;
    setUnavailable(true);
  };

  return <figure className="project-film" aria-describedby={descriptionId}>
    {unavailable ? <div className="project-film-fallback"><ImageSquareIcon size={28} aria-hidden="true" /><p role="status">{unavailableMessage}</p><button ref={retryRef} className="button-text" type="button" onClick={() => { restoreFocus.current = true; setUnavailable(false); }}>Retry preview</button></div> : <video ref={videoRef} tabIndex={0} controls playsInline muted preload="none" poster={asset(media.poster)} aria-label={media.label} aria-describedby={descriptionId} onError={handleMediaError}>
      <source src={asset(media.video)} type="video/mp4" onError={handleMediaError} />
      <track kind="captions" src={asset(media.captions)} srcLang="en" label="English" default />
      Your browser cannot play this preview. The project description remains available on this page.
    </video>}
    <figcaption id={descriptionId} className="sr-only">{media.description}</figcaption>
  </figure>;
}
