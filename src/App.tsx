import { useEffect, useRef, useState } from 'react';
import { LazyMotion } from 'motion/react';
import { ArrowLeftIcon, XIcon } from '@phosphor-icons/react';
import { Backdrop } from './components/Backdrop';
import { Stage } from './components/Stage';
import { ProjectSelector } from './components/ProjectSelector';
import { ProjectDetails } from './projects/ProjectPresentation';
import { useRoute } from './hooks/useRoute';
import { getProject, projects } from './projects';
import { getPageMetadata } from './lib/metadata';
import { handleAppNavigation, routeHref } from './lib/routing';

const loadMotionFeatures = () => import('./lib/motionFeatures').then(module => module.default);
const realProjects = projects.filter(project => project.status === 'real');
const conceptCount = projects.filter(project => project.status === 'placeholder').length;

function About() {
  return <section className="about-page">
    <span className="about-kicker">About</span>
    <h1 tabIndex={-1} aria-label="Long Phi Nguyen">Long Phi<br />Nguyen<span>.</span></h1>
    <div className="about-content"><p className="about-lead">The story goes here.</p><p>This space is reserved for a personal introduction, background, and interests. Biography content has not been provided yet.</p><span className="placeholder-label">Biography placeholder</span><a className="button-text" href={routeHref('/')}>Back to work</a></div>
  </section>;
}

export default function App({ initialRoute }: { initialRoute?: string } = {}) {
  const route = useRoute(initialRoute);
  const [selected, setSelected] = useState(projects[0].id);
  const [immersed, setImmersed] = useState(false);
  const resumeRef = useRef<HTMLDialogElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const caseSlug = route.startsWith('/work/') ? route.slice(6) : undefined;
  const caseProject = caseSlug ? getProject(caseSlug) : undefined;
  const browse = route === '/' || route === '';
  const about = route === '/about';
  const activeProject = getProject(selected) || projects[0];
  const displayProject = caseProject || activeProject;

  useEffect(() => {
    const metadata = getPageMetadata(route);
    document.title = metadata.title;
    for (const [selector, content] of [
      ['meta[name="description"]', metadata.description],
      ['meta[name="robots"]', metadata.robots],
      ['meta[property="og:title"]', metadata.title],
      ['meta[property="og:description"]', metadata.description],
      ['meta[name="twitter:title"]', metadata.title],
      ['meta[name="twitter:description"]', metadata.description],
    ]) document.querySelector(selector)?.setAttribute('content', content);
    mainRef.current?.querySelector('h1')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [route, caseProject, about]);

  useEffect(() => {
    const closeDemo = () => setImmersed(false);
    window.addEventListener('popstate', closeDemo);
    window.addEventListener('hashchange', closeDemo);
    return () => {
      window.removeEventListener('popstate', closeDemo);
      window.removeEventListener('hashchange', closeDemo);
    };
  }, []);

  const select = (id: string) => {
    if (id !== selected) setImmersed(false);
    setSelected(id);
  };

  return <LazyMotion features={loadMotionFeatures} strict><div onClick={handleAppNavigation} className={`portfolio${immersed ? ' has-immersion' : ''}`} data-project={displayProject.id} data-view={about ? 'about' : 'work'}>
    <Backdrop project={displayProject} immersed={immersed} />
    <a href="#main-content" className="skip-link" onClick={event => {
      event.preventDefault();
      document.getElementById('main-content')?.focus();
    }}>Skip to content</a>
    <header className="site-header">
      <a href={routeHref('/')} className="wordmark" aria-label="Long Phi Nguyen, home">Long Phi Nguyen<span className="wordmark-mark" aria-hidden="true">L</span></a>
      <nav aria-label="Main navigation">
        <a href={routeHref('/')} aria-current={browse || caseProject ? 'page' : undefined}>Work</a>
        <a href={routeHref('/about')} aria-current={about ? 'page' : undefined}>About</a>
        <button onClick={() => resumeRef.current?.showModal()}>Resume</button>
      </nav>
    </header>
    <main ref={mainRef} id="main-content" tabIndex={-1}>
      {browse ? <>
        <h1 className="sr-only" tabIndex={-1}>{activeProject.title}</h1>
        <div id="project-panel" role="tabpanel" aria-labelledby={`tab-${selected}`}>
          <Stage project={activeProject} immersed={immersed} setImmersed={setImmersed} />
        </div>
        <ProjectSelector selected={selected} select={select} />
        <div className="collection-note"><span>{String(realProjects.length).padStart(2, '0')} {realProjects.length === 1 ? 'project' : 'projects'} <span className="note-divider">/</span> {String(conceptCount).padStart(2, '0')} placeholder concepts</span><span>Browse. Explore. Look closer.</span></div>
        <ProjectDetails project={activeProject} immersed={immersed} />
      </> : caseProject ? <>
        <div className="case-header"><a href={routeHref('/')} className="back-link" onClick={() => setSelected(caseProject.id)}><ArrowLeftIcon size={17} /> All projects</a><span>{caseProject.status === 'real' ? caseProject.availability : 'Fictional case study · Placeholder content'}</span></div>
        <h1 tabIndex={-1} className="case-heading">{caseProject.title} <span>{caseProject.status === 'real' ? 'Project overview' : 'Concept study'}</span></h1>
        <Stage key={caseProject.id} project={caseProject} caseStudy immersed={immersed} setImmersed={setImmersed} />
        <ProjectDetails project={caseProject} immersed={immersed} />
        <div className="case-next"><p>Keep exploring</p>{projects.filter(p => p.id !== caseProject.id).map(p => <a key={p.id} href={routeHref(`/work/${p.id}`)}>{p.title}</a>)}</div>
      </> : about ? <About /> : <section className="not-found"><h1 tabIndex={-1}>Nothing here. Yet.</h1><p>This project could not be found.</p><a href={routeHref('/')} className="button-primary">All projects</a></section>}
    </main>
    <footer className="site-footer"><span>Long Phi Nguyen</span><span>A portfolio in progress.</span><a href={routeHref('/about')}>About this portfolio</a></footer>
    <dialog ref={resumeRef} className="resume-dialog" aria-label="Resume">
      <div className="dialog-heading"><span>Resume</span><button className="icon-button" aria-label="Close resume" onClick={() => resumeRef.current?.close()}><XIcon size={22} /></button></div>
      <h2 id="resume-title">A little more<br />to come<span>.</span></h2><p>A resume has not been provided yet. This space will hold the real document when it is ready.</p><span className="placeholder-label">Resume unavailable</span>
      <button className="button-primary" onClick={() => resumeRef.current?.close()}>Back to portfolio</button>
    </dialog>
  </div></LazyMotion>;
}
