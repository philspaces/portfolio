import { useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { projects } from '../projects';
import { ProjectVisual } from '../projects/ProjectPresentation';

export function ProjectSelector({ selected, select }: { selected: string; select: (id: string) => void }) {
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
      <div className={`project-thumbnail thumb-${project.kind}`} aria-hidden="true"><ProjectVisual project={project} compact /></div>
      <div className="tab-copy"><span>{project.title}</span><small>{project.status === 'real' ? project.category : 'Placeholder concept'}</small></div>
      <span className="tab-number">{project.number}</span>
    </button>)}
  </div>;
}
