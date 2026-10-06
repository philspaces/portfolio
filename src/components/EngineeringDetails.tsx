import type { RealProjectBase } from '../projects/types';

export function EngineeringDetails({ project }: { project: RealProjectBase }) {
  return <section className="details-section real-project-details" aria-labelledby="details-heading">
    <div className="details-heading"><h2 id="details-heading">The build<span>.</span></h2><p>{project.engineering.introduction}</p></div>
    <div className="real-details-grid">
      <aside className="real-build-note"><span className="build-kicker">{project.engineering.kicker}</span><h3>{project.engineering.headline}</h3><ul className="stack-list" aria-label="Technology stack">{project.stack.map(item => <li key={item}>{item}</li>)}</ul><ol className="runtime-boundaries" aria-label="Runtime boundaries">{project.engineering.boundaries.map(boundary => <li key={boundary.title}><strong>{boundary.title}</strong><span>{boundary.detail}</span></li>)}</ol><p>{project.architectureNote}</p></aside>
      <div className="engineering-details">{project.engineering.sections.map((section, index) => <article key={section.title}><span className="feature-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{section.title}</h3><p>{section.detail}</p><span className="engineering-source">{section.source}</span></div></article>)}</div>
    </div>
  </section>;
}
