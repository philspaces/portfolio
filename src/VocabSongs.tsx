import { ProjectFilm } from './ProjectFilm';
import type { SongsFeature } from './projects';
import './vocab-songs.css';

export function VocabSongs({ feature, immersed }: { feature: SongsFeature; immersed: boolean }) {
  return <section className="vocab-songs" aria-label={feature.title}>
    <div className="songs-editorial">
      <aside className="songs-copy"><span className="songs-kicker">{feature.title}</span><h2>{feature.headline}</h2><ul className="stack-list" aria-label="Vocab Songs technology stack">{feature.stack.map(item => <li key={item}>{item}</li>)}</ul><ol className="runtime-boundaries" aria-label="Vocab Songs cloud and client boundaries">{feature.boundaries.map(boundary => <li key={boundary.title}><strong>{boundary.title}</strong><span>{boundary.detail}</span></li>)}</ol><p>{feature.introduction}</p></aside>
      <ol className="songs-flow">{feature.steps.map((step, index) => <li key={step.title}><span className="songs-step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.detail}</p><span className="engineering-source">{step.source}</span></div></li>)}</ol>
    </div>
    <ProjectFilm media={feature.media} immersed={immersed} unavailableMessage="Vocab Songs preview unavailable." />
  </section>;
}
