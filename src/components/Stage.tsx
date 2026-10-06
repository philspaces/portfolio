import { useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, useIsPresent } from 'motion/react';
import * as m from 'motion/react-m';
import { ArrowUpRightIcon, XIcon } from '@phosphor-icons/react';
import { ProjectVisual } from '../projects/ProjectPresentation';
import { useIdleChrome } from '../hooks/useIdleChrome';
import { useMotionPreference } from '../hooks/useMotionPreference';
import type { Project, RealProject } from '../projects';
import { routeHref } from '../lib/routing';

function WebsiteLink({ project, className }: { project: RealProject; className: string }) {
  return <a className={className} href={project.website.url} target="_blank" rel="noopener noreferrer">
    {project.website.label}<ArrowUpRightIcon size={16} aria-hidden="true" />
    <span className="sr-only"> (opens in a new tab)</span>
  </a>;
}

function Scene({ project, interactive }: { project: Project; interactive: boolean }) {
  const present = useIsPresent();
  const reducedMotion = useMotionPreference();
  return <m.div className="stage-scene" aria-hidden={!present} inert={!present || !interactive}
    initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
    transition={{ duration: reducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}>
    <ProjectVisual project={project} interactive={interactive && present} />
  </m.div>;
}

export function Stage({ project, caseStudy = false, immersed, setImmersed }: {
  project: Project; caseStudy?: boolean; immersed: boolean; setImmersed: (value: boolean) => void;
}) {
  const stageRef = useRef<HTMLElement>(null);
  const exploreRef = useRef<HTMLButtonElement>(null);
  const exitRef = useRef<HTMLButtonElement>(null);
  const browseScroll = useRef(0);
  const restoreFrame = useRef(0);
  const reducedMotion = useMotionPreference();
  const { quiet } = useIdleChrome({ enabled: immersed, reducedMotion: !!reducedMotion, surfaceRef: stageRef });

  const exit = useCallback(() => {
    setImmersed(false);
    restoreFrame.current = requestAnimationFrame(() => {
      if (!stageRef.current?.isConnected) return;
      exploreRef.current?.focus({ preventScroll: true });
      window.scrollTo({ top: browseScroll.current, behavior: 'instant' });
    });
  }, [setImmersed]);

  useEffect(() => () => cancelAnimationFrame(restoreFrame.current), [project.id]);

  useEffect(() => {
    if (!immersed) return;
    exitRef.current?.focus({ preventScroll: true });
    stageRef.current?.scrollIntoView?.({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape' && !document.querySelector('dialog[open]')) {
        exit();
      }
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [immersed, reducedMotion, exit]);

  const explore = () => {
    browseScroll.current = window.scrollY;
    setImmersed(true);
  };

  return (
    <section ref={stageRef} className={`showcase-stage${immersed ? ' is-immersed' : ''}${quiet ? ' chrome-quiet' : ''}`} data-chrome={quiet ? 'quiet' : 'visible'} aria-label={`${project.title} project showcase`}>
      {immersed && <div className="immerse-toolbar">
        <span className="immerse-label">{project.title} <span>/</span> Fictional concept</span>
        <button ref={exitRef} className="exit-button" onClick={exit}>Exit demo <XIcon size={17} /></button>
      </div>}
      <div className={`stage-visual stage-${project.kind}`}>
        <AnimatePresence initial={false}>
          <Scene key={project.id} project={project} interactive={immersed || project.status === 'real'} />
        </AnimatePresence>
      </div>
      <div className={`stage-info${!immersed && !caseStudy ? ' is-summary' : ''}`}>
        <div className="stage-copy">
          <span className="project-category">{project.number} <span>/</span> {project.category}</span>
          {(immersed || caseStudy) && <h2>{project.title}<span className="title-period">.</span></h2>}
          <p>{project.oneLiner}</p>
          {!immersed && <div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>}
        </div>
        <div className="stage-actions">
          {project.status === 'real' && <WebsiteLink project={project} className="button-primary" />}
          {project.status === 'placeholder' && <button ref={exploreRef} hidden={immersed} className="button-primary" onClick={explore} aria-expanded={immersed}>Explore demo</button>}
          {project.status === 'placeholder' && !caseStudy && <a className="button-text" href={routeHref(`/work/${project.id}`)}>Read case study</a>}
        </div>
      </div>
    </section>
  );
}
