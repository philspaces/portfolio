import { ProjectFilm } from './ProjectFilm';
import type { SongsFeature } from './projects';
import './vocab-songs.css';

export function VocabSongs({ feature, immersed }: { feature: SongsFeature; immersed: boolean }) {
  return <section className="vocab-songs" aria-label={feature.title}>
    <div className="songs-editorial">
      <div className="songs-copy"><span className="songs-kicker">{feature.title}</span><h2>{feature.headline}</h2><p>{feature.introduction}</p></div>
      <ol className="songs-flow">{feature.steps.map((step, index) => <li key={step.title}><span className="songs-step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.detail}</p></div></li>)}</ol>
    </div>
    <ProjectFilm media={feature.media} immersed={immersed} unavailableMessage="Vocab Songs preview unavailable." />
  </section>;
}
