import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, CornersOut, X } from '@phosphor-icons/react';
import { Demo } from './Demo';
import { getProject, projects } from './projects';
import type { Project } from './projects';

function useRoute() {
  const [route, setRoute] = useState(() => window.location.hash.slice(1) || '/');
  useEffect(() => {
    const update = () => setRoute(window.location.hash.slice(1) || '/');
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  return route;
}

function Scene({ project, interactive }: { project: Project; interactive: boolean }) {
  const present = useIsPresent();
  const reducedMotion = useReducedMotion();
  return <motion.div className="stage-scene" aria-hidden={!present} inert={!present || !interactive}
    initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
    transition={{ duration: reducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}>
    <Demo kind={project.kind} interactive={interactive && present} />
  </motion.div>;
}

function Stage({ project, caseStudy = false, immersed, setImmersed }: {
  project: Project; caseStudy?: boolean; immersed: boolean; setImmersed: (value: boolean) => void;
}) {
  const stageRef = useRef<HTMLElement>(null);
  const exploreRef = useRef<HTMLButtonElement>(null);
  const exitRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  const exit = () => {
    setImmersed(false);
    exploreRef.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
    if (!immersed) return;
    exitRef.current?.focus({ preventScroll: true });
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape' && !document.querySelector('dialog[open]')) {
        setImmersed(false);
        exploreRef.current?.focus({ preventScroll: true });
      }
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [immersed, setImmersed]);

  const explore = () => {
    setImmersed(true);
    stageRef.current?.scrollIntoView?.({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
  };

  return (
    <section ref={stageRef} className={`showcase-stage${immersed ? ' is-immersed' : ''}`} aria-label={`${project.title} project showcase`}>
      {immersed && <div className="immerse-toolbar">
        <span><span className="live-indicator" /> Interactive concept <span className="toolbar-hint">{project.demoHint}</span></span>
        <button ref={exitRef} className="exit-button" onClick={exit}>Exit demo <X size={17} /></button>
      </div>}
      <div className={`stage-visual stage-${project.kind}`}>
        <AnimatePresence initial={false}>
          <Scene key={project.id} project={project} interactive={immersed} />
        </AnimatePresence>
        {!immersed && <div className="visual-caption"><span>Concept preview</span><span>Fictional placeholder <ArrowUpRight size={13} /></span></div>}
      </div>
      <div className="stage-info">
        <div className="stage-copy">
          <span className="project-category">{project.number} <span>/</span> {project.category}</span>
          <h2>{project.title}<span className="title-period">.</span></h2>
          <p>{project.oneLiner}</p>
          <div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        </div>
        <div className="stage-actions">
          <button ref={exploreRef} className="button-primary" onClick={immersed ? exit : explore} aria-expanded={immersed}>
            {immersed ? 'Exit demo' : 'Explore demo'} {immersed ? <X size={17} /> : <CornersOut size={18} />}
          </button>
          {!caseStudy && <a className="button-text" href={`#/work/${project.id}`}>Read case study <ArrowUpRight size={18} /></a>}
        </div>
      </div>
    </section>
  );
}

function ProjectSelector({ selected, select }: { selected: string; select: (id: string) => void }) {
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const handleKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % projects.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + projects.length) % projects.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = projects.length - 1;
    else return;
    event.preventDefault();
    select(projects[next].id);
    tabs.current[next]?.focus({ preventScroll: true });
  };

  return <div className="project-strip" role="tablist" aria-label="Project selection">
    {projects.map((project, index) => <button key={project.id} ref={el => { tabs.current[index] = el; }}
      id={`tab-${project.id}`} className={`project-tab${selected === project.id ? ' is-selected' : ''}`}
      role="tab" aria-selected={selected === project.id} aria-controls="project-panel" tabIndex={selected === project.id ? 0 : -1}
      onClick={() => select(project.id)} onKeyDown={event => handleKey(event, index)}>
      <div className={`project-thumbnail thumb-${project.kind}`} aria-hidden="true"><Demo kind={project.kind} compact /></div>
      <div className="tab-copy"><span>{project.title}</span><small>{project.category}</small></div>
      <span className="tab-number">{project.number}</span>
      <ArrowUpRight size={18} className="tab-arrow" />
    </button>)}
  </div>;
}

function ProjectDetails({ project }: { project: Project }) {
  return <section className="details-section" aria-labelledby="details-heading">
    <div className="details-heading"><h2 id="details-heading">Under the surface<span>.</span></h2><p>A closer look at the {project.title} concept.</p></div>
    <div className="details-grid">
      <aside className="architecture-visual" aria-label={`${project.title} conceptual architecture`}>
        <div className="architecture-caption"><span>Conceptual architecture</span><ArrowDown size={18} /></div>
        <div className="architecture-path">{project.architecture.map((item, index) => <div className="architecture-node" key={item.title}>
          <span className="node-number">0{index + 1}</span><span>{item.title}</span><ArrowDown size={16} />
        </div>)}</div>
        <div className="architecture-footnote">An illustrative model, ready for a real project.</div>
        <div className="concept-note"><span>Placeholder concept</span><p>{project.description}</p></div>
      </aside>
      <div className="project-details">
        <article><h3>Role & contribution</h3><p>{project.role}</p><span className="placeholder-label">Author input needed</span></article>
        <article><h3>Problem & context</h3><p>{project.context}</p><h4>Concept constraints</h4><ul>{project.constraints.map(item => <li key={item}>{item}</li>)}</ul></article>
        <article><h3>Architecture</h3>{project.architecture.map(item => <div className="detail-item" key={item.title}><h4>{item.title}</h4><p>{item.detail}</p></div>)}</article>
        <article><h3>Decisions & tradeoffs</h3>{project.tradeoffs.map(item => <div className="detail-item" key={item.decision}><h4>{item.decision}</h4><p>{item.reasoning}</p></div>)}</article>
        <article><h3>Impact & evidence</h3><p className="evidence-intro">No results are claimed for this fictional concept.</p><dl className="evidence-list">{project.evidence.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></article>
      </div>
    </div>
  </section>;
}

function About() {
  return <section className="about-page">
    <span className="about-kicker">About</span>
    <h1 tabIndex={-1} aria-label="Long Phi Nguyen">Long Phi<br />Nguyen<span>.</span></h1>
    <div className="about-content"><p className="about-lead">The story goes here.</p><p>This space is reserved for a personal introduction, background, and interests. Biography content has not been provided yet.</p><span className="placeholder-label">Biography placeholder</span><a className="button-text" href="#/">Back to work <ArrowUpRight size={18} /></a></div>
  </section>;
}

export default function App() {
  const route = useRoute();
  const [selected, setSelected] = useState(projects[0].id);
  const [immersed, setImmersed] = useState(false);
  const resumeRef = useRef<HTMLDialogElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const caseSlug = route.startsWith('/work/') ? route.slice(6) : undefined;
  const caseProject = caseSlug ? getProject(caseSlug) : undefined;
  const browse = route === '/' || route === '';
  const about = route === '/about';
  const activeProject = getProject(selected) || projects[0];

  useEffect(() => {
    document.title = caseProject ? `${caseProject.title} concept · Long Phi Nguyen` : about ? 'About · Long Phi Nguyen' : 'Long Phi Nguyen · Living Showcase';
    mainRef.current?.querySelector('h1')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [route, caseProject, about]);

  useEffect(() => {
    const closeDemo = () => setImmersed(false);
    window.addEventListener('hashchange', closeDemo);
    return () => window.removeEventListener('hashchange', closeDemo);
  }, []);

  const select = (id: string) => {
    if (id !== selected) setImmersed(false);
    setSelected(id);
  };

  return <>
    <a href="#main-content" className="skip-link" onClick={event => {
      event.preventDefault();
      document.getElementById('main-content')?.focus();
    }}>Skip to content</a>
    <header className="site-header">
      <a href="#/" className="wordmark" aria-label="Long Phi Nguyen, home">Long Phi Nguyen<span className="wordmark-mark" aria-hidden="true">↗</span></a>
      <nav aria-label="Main navigation">
        <a href="#/" aria-current={browse || caseProject ? 'page' : undefined}>Work</a>
        <a href="#/about" aria-current={about ? 'page' : undefined}>About</a>
        <button onClick={() => resumeRef.current?.showModal()}>Resume <ArrowUpRight size={14} /></button>
      </nav>
    </header>
    <main ref={mainRef} id="main-content" tabIndex={-1}>
      {browse ? <>
        <div className="intro"><h1 tabIndex={-1}>A living showcase<span>.</span></h1><p>A portfolio in progress. Three fictional concepts,<br className="desktop-break" /> ready for real work.</p></div>
        <div id="project-panel" role="tabpanel" aria-labelledby={`tab-${selected}`}>
          <Stage project={activeProject} immersed={immersed} setImmersed={setImmersed} />
        </div>
        <ProjectSelector selected={selected} select={select} />
        <div className="collection-note"><span>03 concepts <span className="note-divider">/</span> All projects are placeholders</span><span>Browse. Explore. Look closer.</span></div>
        <ProjectDetails project={activeProject} />
      </> : caseProject ? <>
        <div className="case-header"><a href="#/" className="back-link" onClick={() => setSelected(caseProject.id)}><ArrowLeft size={17} /> All projects</a><span>Fictional case study · Placeholder content</span></div>
        <h1 tabIndex={-1} className="case-heading">{caseProject.title} <span>Concept study</span></h1>
        <Stage key={caseProject.id} project={caseProject} caseStudy immersed={immersed} setImmersed={setImmersed} />
        <ProjectDetails project={caseProject} />
        <div className="case-next"><p>Keep exploring</p>{projects.filter(p => p.id !== caseProject.id).map(p => <a key={p.id} href={`#/work/${p.id}`}>{p.title} <ArrowRight size={22} /></a>)}</div>
      </> : about ? <About /> : <section className="not-found"><h1 tabIndex={-1}>Nothing here. Yet.</h1><p>This project could not be found.</p><a href="#/" className="button-primary">All projects <ArrowRight size={18} /></a></section>}
    </main>
    <footer className="site-footer"><span>Long Phi Nguyen</span><span>A portfolio in progress.</span><a href="#/about">About this portfolio <ArrowUpRight size={15} /></a></footer>
    <dialog ref={resumeRef} className="resume-dialog" aria-label="Resume">
      <div className="dialog-heading"><span>Resume</span><button className="icon-button" aria-label="Close resume" onClick={() => resumeRef.current?.close()}><X size={22} /></button></div>
      <h2 id="resume-title">A little more<br />to come<span>.</span></h2><p>A resume has not been provided yet. This space will hold the real document when it is ready.</p><span className="placeholder-label">Resume unavailable</span>
      <button className="button-primary" onClick={() => resumeRef.current?.close()}>Back to portfolio <ArrowRight size={18} /></button>
    </dialog>
  </>;
}
