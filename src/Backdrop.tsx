import { useEffect, useRef } from 'react';
import type { SyntheticEvent } from 'react';
import { projects } from './projects';
import type { Project } from './projects';
import './backdrop.css';

/** Ambient concept art is decorative; every layer stays mounted for interruptible crossfades. */
export function Backdrop({ project, immersed = false }: { project: Project; immersed?: boolean }) {
  const backdropRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    for (const image of backdropRef.current?.querySelectorAll<HTMLImageElement>('.backdrop-art') ?? []) {
      if (image.complete && image.naturalWidth === 0) image.hidden = true;
    }
  }, []);
  const hideMissingImage = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.hidden = true;
  };

  return (
    <div ref={backdropRef} className={`portfolio-backdrop${immersed ? ' is-immersed' : ''}`} data-project={project.id} aria-hidden="true">
      {projects.map(({ id, backdrop }) => (
        <div key={id} className={`backdrop-layer backdrop-${backdrop.theme}${id === project.id ? ' is-active' : ''}`}
          data-backdrop-project={id}>
          <div className="backdrop-fallback" />
          {backdrop.asset && <img className="backdrop-art" src={`${import.meta.env.BASE_URL}${backdrop.asset}`}
            alt="" decoding="async" draggable="false" onError={hideMissingImage} />}
          {backdrop.theme === 'network' && <div className="backdrop-network-art">
            <div className="backdrop-network-grid" />
            <div className="backdrop-network-plane plane-primary" />
            <div className="backdrop-network-plane plane-secondary" />
            <div className="backdrop-network-plane plane-tertiary" />
            <div className="backdrop-network-trace trace-one" />
            <div className="backdrop-network-trace trace-two" />
            <div className="backdrop-network-trace trace-three" />
            <div className="backdrop-network-trace trace-four" />
          </div>}
          <div className="backdrop-tint" />
        </div>
      ))}
      <div className="backdrop-legibility" />
      <div className="backdrop-grain" />
    </div>
  );
}
