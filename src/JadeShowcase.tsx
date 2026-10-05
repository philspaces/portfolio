import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { ImageSquareIcon } from '@phosphor-icons/react'
import { ProjectFilm } from './ProjectFilm'
import type { RealProject } from './projects'
import './jade-showcase.css'

type JadeShowcaseProps = { project: RealProject; interactive?: boolean; compact?: boolean; immersed?: boolean }
const asset = (path: string) => `${import.meta.env.BASE_URL}jade-words/${path}`

function AppScreen({ file, label, decorative = false }: { file: string; label: string; decorative?: boolean }) {
  const imageRef = useRef<HTMLImageElement>(null)
  const [unavailable, setUnavailable] = useState(false)
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const image = imageRef.current
      if (image?.complete && image.naturalWidth === 0) setUnavailable(true)
    })
    return () => cancelAnimationFrame(frame)
  }, [])
  if (unavailable) return <div className="jade-screen-fallback"><ImageSquareIcon size={24} aria-hidden="true" /><span>{label}</span><small>App screen unavailable</small></div>
  return <img ref={imageRef} src={asset(`screens/${file}`)} alt={decorative ? '' : `JadeWords ${label.toLowerCase()} app screen`} width="600" height="1304" decoding="async" onError={() => setUnavailable(true)} />
}

function BrandMark() {
  const imageRef = useRef<HTMLImageElement>(null)
  const [unavailable, setUnavailable] = useState(false)
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (imageRef.current?.complete && imageRef.current.naturalWidth === 0) setUnavailable(true)
    })
    return () => cancelAnimationFrame(frame)
  }, [])
  return <div className="jade-brand">{!unavailable && <img ref={imageRef} src={asset('icon.png')} alt="" width="48" height="48" onError={() => setUnavailable(true)} />}<span>JadeWords</span></div>
}

function JadeComposition({ project, interactive, immersed }: { project: RealProject; interactive: boolean; immersed: boolean }) {
  const screens = project.screenPreviews
  const previews = [...screens, { id: 'songs', label: 'Songs', accent: 'jade', number: '04' }]
  const [selected, setSelected] = useState(screens[0].id)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const viewerId = useId()
  const current = previews.find((preview) => preview.id === selected) ?? previews[0]
  const songsSelected = selected === 'songs'

  const handlePreviewKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number
    if (event.key === 'ArrowRight') next = (index + 1) % previews.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + previews.length) % previews.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = previews.length - 1
    else return
    event.preventDefault()
    setSelected(previews[next].id)
    buttons.current[next]?.focus({ preventScroll: true })
  }

  return <div className={`jade-showcase${interactive ? ' jade-showcase--interactive' : ''}`} role={interactive ? 'region' : 'img'} aria-label={interactive ? 'JadeWords screen viewer' : 'JadeWords Chinese learning app: vocabulary, grammar, writing and Songs preview'}>
    <div className={`jade-board${songsSelected ? ' jade-board--songs' : ''}`}>
      <div className="jade-editorial" aria-hidden={!interactive}>
        <BrandMark />
        <div className="jade-editorial-copy"><span className="jade-eyebrow">CHINESE LEARNING</span><h3>Mandarin,<br />in practice.</h3><p>Study words. Write characters.<br />Learn through songs.</p></div>
      </div>

        <div className={`jade-primary-screen${songsSelected ? ' jade-primary-screen--film' : ''}`} id={viewerId} aria-label={`${current.label} preview`}>
          {songsSelected ? <div className="jade-songs-preview"><ProjectFilm media={project.songs.media} immersed={immersed} unavailableMessage="Vocab Songs preview unavailable." /></div> : <div className="jade-device">{screens.map((screen) => <div key={screen.id} className={`jade-screen-layer${screen.id === selected ? ' is-current' : ''}`} aria-hidden={screen.id !== selected}><AppScreen file={screen.file} label={screen.label} decorative={!interactive || screen.id !== selected} /></div>)}</div>}
          <div className="jade-screen-caption" aria-live={interactive ? 'polite' : undefined}><span className={`jade-dot jade-dot--${current.accent}`} />{current.number} <span>/</span> {current.label}</div>
        </div>
        {!songsSelected && <div className="jade-secondary-screens" aria-hidden="true"><div className="jade-secondary-screen jade-secondary-screen--grammar"><AppScreen file="grammar.webp" label="Grammar" decorative /></div><div className="jade-secondary-screen jade-secondary-screen--writing"><AppScreen file="writing.webp" label="Writing" decorative /></div></div>}

      {interactive && <div className="jade-viewer-controls">
        <div className="jade-screen-buttons" role="group" aria-label="Choose a preview">{previews.map((preview, index) => <button key={preview.id} ref={element => { buttons.current[index] = element }} type="button" aria-pressed={selected === preview.id} aria-controls={viewerId} onClick={() => setSelected(preview.id)} onKeyDown={event => handlePreviewKey(event, index)}>{preview.label}</button>)}</div>
      </div>}
    </div>
  </div>
}

export function JadeShowcase({ project, interactive = false, compact = false, immersed = false }: JadeShowcaseProps) {
  if (compact) return <div className="jade-mini" role="img" aria-label="JadeWords vocabulary preview"><div className="jade-mini-wordmark" aria-hidden="true">JadeWords<span>中文</span></div><div className="jade-mini-screen" aria-hidden="true"><AppScreen file="word.webp" label="Vocabulary" decorative /></div></div>
  return <JadeComposition key={interactive ? 'interactive' : 'static'} project={project} interactive={interactive} immersed={immersed} />
}
