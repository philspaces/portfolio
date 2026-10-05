import { useEffect, useId, useRef, useState } from 'react'
import { ArrowLeftIcon, ImageSquareIcon, PlayIcon } from '@phosphor-icons/react'
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
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewUnavailable, setPreviewUnavailable] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const previewTriggerRef = useRef<HTMLButtonElement>(null)
  const backToScreensRef = useRef<HTMLButtonElement>(null)
  const wasPreviewOpen = useRef(false)
  const viewerId = useId()
  const current = screens.find((screen) => screen.id === selected) ?? screens[0]

  useEffect(() => {
    const video = videoRef.current
    if (video?.error) setPreviewUnavailable(true)
    if (previewOpen) video?.focus({ preventScroll: true })
    else if (wasPreviewOpen.current) previewTriggerRef.current?.focus({ preventScroll: true })
    wasPreviewOpen.current = previewOpen
    return () => { video?.pause() }
  }, [previewOpen])

  useEffect(() => {
    if (previewOpen && previewUnavailable) backToScreensRef.current?.focus({ preventScroll: true })
  }, [previewOpen, previewUnavailable])

  return <div className={`jade-showcase${interactive ? ' jade-showcase--interactive' : ''}`} role={interactive ? 'region' : 'img'} aria-label={interactive ? 'JadeWords screen viewer' : 'JadeWords Chinese learning app: vocabulary, grammar and writing screens'}>
    <div className={`jade-board${previewOpen ? ' jade-board--film' : ''}`}>
      <div className="jade-editorial" aria-hidden={!interactive}>
        <BrandMark />
        <div className="jade-editorial-copy"><span className="jade-eyebrow">CHINESE LEARNING</span><h3>Chinese,<br />in practice.</h3><p>Vocabulary.<br />Grammar.<br />Writing.</p></div>
        <span className="jade-editorial-note">REAL APP SCREENS</span>
      </div>

      {previewOpen ? <div className="jade-film">
        {previewUnavailable ? <div className="jade-film-fallback" role="status"><ImageSquareIcon size={28} aria-hidden="true" /><p>App preview unavailable.</p><span>The app screens are still available in this viewer.</span></div> : <video ref={videoRef} tabIndex={0} controls playsInline muted preload="metadata" poster={asset('media/features-poster.webp')} aria-label="JadeWords app preview: vocabulary, grammar and guided writing" onError={() => setPreviewUnavailable(true)}>
          <source src={asset('media/features.mp4')} type="video/mp4" onError={() => setPreviewUnavailable(true)} />
          <track kind="captions" src={asset('media/features-en.vtt')} srcLang="en" label="English" default />
          Your browser cannot play this app preview. Use the app screen viewer instead.
        </video>}
        <span className="jade-film-note">App screen overview</span>
      </div> : <>
        <div className="jade-primary-screen" id={viewerId} aria-label={`${current.label} screen`}>
          <div className="jade-device">{screens.map((screen) => <div key={screen.id} className={`jade-screen-layer${screen.id === selected ? ' is-current' : ''}`} aria-hidden={screen.id !== selected}><AppScreen file={screen.file} label={screen.label} decorative={!interactive || screen.id !== selected} /></div>)}</div>
          <div className="jade-screen-caption" aria-live={interactive ? 'polite' : undefined}><span className={`jade-dot jade-dot--${current.accent}`} />{current.number} <span>/</span> {current.label}</div>
        </div>
        <div className="jade-secondary-screens" aria-hidden="true"><div className="jade-secondary-screen jade-secondary-screen--grammar"><AppScreen file="grammar.webp" label="Grammar" decorative /></div><div className="jade-secondary-screen jade-secondary-screen--writing"><AppScreen file="writing.webp" label="Writing" decorative /></div></div>
      </>}

      {interactive && <div className="jade-viewer-controls">
        {previewOpen ? <button ref={backToScreensRef} type="button" className="jade-preview-button" onClick={() => setPreviewOpen(false)}><ArrowLeftIcon size={15} weight="bold" aria-hidden="true" />Back to app screens</button> : <><div className="jade-screen-buttons" aria-label="Choose an app screen">{screens.map((screen) => <button key={screen.id} type="button" aria-pressed={selected === screen.id} aria-controls={viewerId} onClick={() => setSelected(screen.id)}>{screen.label}</button>)}</div><button ref={previewTriggerRef} type="button" className="jade-preview-button" onClick={() => { setPreviewUnavailable(false); setPreviewOpen(true) }}><PlayIcon size={15} weight="fill" aria-hidden="true" />Open app preview</button></>}
      </div>}
    </div>
  </div>
}

export function JadeShowcase({ interactive = false, compact = false }: JadeShowcaseProps) {
  if (compact) return <div className="jade-mini" role="img" aria-label="JadeWords actual app screen preview"><div className="jade-mini-wordmark" aria-hidden="true">JadeWords<span>中文</span></div><div className="jade-mini-screen" aria-hidden="true"><AppScreen file="word.webp" label="Vocabulary" decorative /></div></div>
  return <JadeComposition key={interactive ? 'interactive' : 'static'} interactive={interactive} />
}
