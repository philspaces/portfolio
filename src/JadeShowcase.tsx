import { useEffect, useId, useRef, useState } from 'react'
import { ImageSquareIcon } from '@phosphor-icons/react'
import './jade-showcase.css'

type JadeShowcaseProps = { interactive?: boolean; compact?: boolean }

const screens = [
  { id: 'vocabulary', label: 'Vocabulary', file: 'word.webp', accent: 'jade', number: '01' },
  { id: 'grammar', label: 'Grammar', file: 'grammar.webp', accent: 'blue', number: '02' },
  { id: 'writing', label: 'Writing', file: 'writing.webp', accent: 'cinnabar', number: '03' },
] as const
type ScreenId = (typeof screens)[number]['id']
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

function JadeComposition({ interactive }: { interactive: boolean }) {
  const [selected, setSelected] = useState<ScreenId>('vocabulary')
  const viewerId = useId()
  const current = screens.find((screen) => screen.id === selected) ?? screens[0]

  return <div className={`jade-showcase${interactive ? ' jade-showcase--interactive' : ''}`} role={interactive ? 'region' : 'img'} aria-label={interactive ? 'JadeWords screen viewer' : 'JadeWords Chinese learning app: vocabulary, grammar and writing screens'}>
    <div className="jade-board">
      <div className="jade-editorial" aria-hidden={!interactive}>
        <BrandMark />
        <div className="jade-editorial-copy"><span className="jade-eyebrow">CHINESE LEARNING</span><h3>Mandarin,<br />in practice.</h3><p>Study words. Write characters.<br />Learn through songs.</p></div>
      </div>

        <div className="jade-primary-screen" id={viewerId} aria-label={`${current.label} screen`}>
          <div className="jade-device">{screens.map((screen) => <div key={screen.id} className={`jade-screen-layer${screen.id === selected ? ' is-current' : ''}`} aria-hidden={screen.id !== selected}><AppScreen file={screen.file} label={screen.label} decorative={!interactive || screen.id !== selected} /></div>)}</div>
          <div className="jade-screen-caption" aria-live={interactive ? 'polite' : undefined}><span className={`jade-dot jade-dot--${current.accent}`} />{current.number} <span>/</span> {current.label}</div>
        </div>
        <div className="jade-secondary-screens" aria-hidden="true"><div className="jade-secondary-screen jade-secondary-screen--grammar"><AppScreen file="grammar.webp" label="Grammar" decorative /></div><div className="jade-secondary-screen jade-secondary-screen--writing"><AppScreen file="writing.webp" label="Writing" decorative /></div></div>

      {interactive && <div className="jade-viewer-controls">
        <div className="jade-screen-buttons" aria-label="Choose an app screen">{screens.map((screen) => <button key={screen.id} type="button" aria-pressed={selected === screen.id} aria-controls={viewerId} onClick={() => setSelected(screen.id)}>{screen.label}</button>)}</div>
      </div>}
    </div>
  </div>
}

export function JadeShowcase({ interactive = false, compact = false }: JadeShowcaseProps) {
  if (compact) return <div className="jade-mini" role="img" aria-label="JadeWords vocabulary preview"><div className="jade-mini-wordmark" aria-hidden="true">JadeWords<span>中文</span></div><div className="jade-mini-screen" aria-hidden="true"><AppScreen file="word.webp" label="Vocabulary" decorative /></div></div>
  return <JadeComposition key={interactive ? 'interactive' : 'static'} interactive={interactive} />
}
