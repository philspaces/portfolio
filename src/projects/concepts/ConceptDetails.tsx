import type { PlaceholderProject } from '../types';

export function ConceptDetails({ project }: { project: PlaceholderProject }) {
  return <section className="details-section" aria-labelledby="details-heading">
    <div className="details-heading"><h2 id="details-heading">Under the surface<span>.</span></h2><p>A closer look at the {project.title} concept.</p></div>
    <div className="details-grid">
      <aside className="architecture-visual" aria-label={`${project.title} conceptual architecture`}>
        <div className="architecture-caption"><span>Conceptual architecture</span></div>
        <div className="architecture-path">{project.architecture.map((item, index) => <div className="architecture-node" key={item.title}>
          <span className="node-number">0{index + 1}</span><span>{item.title}</span>
        </div>)}</div>
        <div className="architecture-footnote">Conceptual structure for this interface.</div>
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
