import { useReducer, useState } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import {
  ArrowClockwise,
  ArrowRight,
  BookmarkSimple,
  CaretDown,
  Check,
  CheckCircle,
  Circle,
  Compass,
  Cube,
  DotsThree,
  ImageSquare,
  Lightning,
  MagnifyingGlass,
  MapPin,
  Pause,
  Play,
  Plus,
  Queue,
  SlidersHorizontal,
  SquaresFour,
  Stack,
  WarningCircle,
} from '@phosphor-icons/react'
import './demo.css'

type DemoProps = {
  kind: 'web' | 'mobile' | 'system'
  interactive?: boolean
  compact?: boolean
}

const demoNames = { web: 'Forma', mobile: 'Roam', system: 'Relay' }

function DemoControl({ interactive, children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { interactive: boolean }) {
  if (!interactive) return <div className={`demo-control ${className}`}>{children}</div>
  return <button className={`demo-control ${className}`} {...props}>{children}</button>
}

function ConceptImage({ position = 'center', className = '' }: { position?: string; className?: string }) {
  const [unavailable, setUnavailable] = useState(false)
  if (unavailable) {
    return <div className={`demo-art-fallback ${className}`}><ImageSquare size={32} /><span>Concept image unavailable</span></div>
  }
  return <img className={className} src={`${import.meta.env.BASE_URL}concept-art.webp`} alt="Fictional concrete pavilion with a sculptural cobalt staircase" style={{ objectPosition: position }} onError={() => setUnavailable(true)} decoding="async" />
}

const collection = [
  { id: 'pavilion', title: 'Coastal pavilion', category: 'Spaces', position: 'center', description: 'A study in light, form, and open space.' },
  { id: 'contour', title: 'The blue contour', category: 'Objects', position: '12% 42%', description: 'One continuous line, many perspectives.' },
  { id: 'reflection', title: 'Still reflections', category: 'Spaces', position: '88% 90%', description: 'A quiet composition of water and concrete.' },
  { id: 'material', title: 'Material & shadow', category: 'Objects', position: '97% 12%', description: 'Finding texture in the smallest details.' },
] as const

function Forma({ interactive }: { interactive: boolean }) {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState<string>('pavilion')
  const [saved, setSaved] = useState(false)
  const current = collection.find((item) => item.id === selected) ?? collection[0]
  const filtered = collection.filter((item) => filter === 'All' || item.category === filter)

  function chooseFilter(value: string) {
    setFilter(value)
    setSaved(false)
    const next = collection.find((item) => value === 'All' || item.category === value)
    if (next) setSelected(next.id)
  }

  return (
    <div className="demo-forma-window demo-frame">
      <div className="demo-window-bar"><span className="demo-window-mark" /><span>forma / personal workspace</span><span>Fictional demo</span></div>
      <div className="demo-forma-layout">
        <div className="demo-forma-sidebar">
          <div className="demo-forma-logo"><span>f</span>forma<Circle size={7} weight="fill" /></div>
          <div className="demo-sidebar-heading">WORKSPACE</div>
          <div className="demo-sidebar-item demo-sidebar-active"><SquaresFour size={17} /> Collections <span>04</span></div>
          <div className="demo-sidebar-item"><BookmarkSimple size={17} /> Saved <span>{saved ? '01' : '00'}</span></div>
          <div className="demo-sidebar-item"><Stack size={17} /> Library</div>
          <div className="demo-sidebar-heading demo-sidebar-lower">YOUR COLLECTIONS</div>
          <div className="demo-sidebar-collection"><span className="demo-collection-square" /> Spatial studies</div>
          <div className="demo-sidebar-collection"><span className="demo-collection-square demo-collection-square-light" /> Everyday objects</div>
          <div className="demo-sidebar-footer"><span className="demo-avatar">S</span><div>Sample workspace<small>Local demo only</small></div><CaretDown size={13} /></div>
        </div>
        <div className="demo-forma-main">
          <div className="demo-forma-toolbar"><span>Collections <span aria-hidden="true">/</span> Spatial studies</span><span><MagnifyingGlass size={16} /><DotsThree size={20} /></span></div>
          <div className="demo-forma-heading"><div><p>YOUR REFERENCE LIBRARY</p><h3>Room for ideas.</h3></div><span className="demo-forma-count">{filtered.length.toString().padStart(2, '0')} <span>sample studies</span></span></div>
          <div className="demo-forma-filters" aria-label="Filter sample collection">
            <div>{['All', 'Spaces', 'Objects'].map((item) => <DemoControl interactive={interactive} key={item} type="button" disabled={!interactive} aria-pressed={filter === item} onClick={() => chooseFilter(item)} className={filter === item ? 'demo-chip demo-chip-active' : 'demo-chip'}>{item}</DemoControl>)}</div>
            <span><SlidersHorizontal size={15} /><span>Curated view</span></span>
          </div>
          <div className="demo-forma-feature">
            <ConceptImage key={current.id} position={current.position} />
            <div className="demo-forma-feature-detail"><div><span>GENERATED CONCEPT ART</span><h4>{current.title}</h4><p>{current.description}</p></div><DemoControl interactive={interactive} type="button" className={`demo-save ${saved ? 'demo-save-active' : ''}`} disabled={!interactive} onClick={() => setSaved((value) => !value)} aria-label={saved ? 'Remove sample study from saved' : 'Save sample study'} aria-pressed={saved}>{saved ? <Check size={18} /> : <BookmarkSimple size={18} />}</DemoControl></div>
          </div>
          <div className="demo-forma-grid" aria-label="Sample studies">{filtered.map((item) => <DemoControl interactive={interactive} className={`demo-study ${selected === item.id ? 'demo-study-selected' : ''}`} type="button" key={item.id} disabled={!interactive} aria-pressed={selected === item.id} onClick={() => { setSelected(item.id); setSaved(false) }}><div><ConceptImage position={item.position} /></div><span>{item.title}</span><small>{item.category} / sample</small></DemoControl>)}</div>
          <div className="demo-forma-note" aria-live={interactive ? 'polite' : undefined}>{interactive ? `Showing ${filter.toLowerCase()} sample studies. ${current.title} selected${saved ? ' and saved' : ''}.` : 'A fictional product concept. All content is sample material.'}</div>
        </div>
      </div>
    </div>
  )
}

const destinations = {
  coast: { name: 'North coast', subtitle: 'Take the scenic route.', place: 'A day by the water', stops: ['The lookout', 'A little café', 'The shoreline'], extra: 'Sunset point', names: ['LOOKOUT', 'CAFÉ', 'SHORE'], distance: '4.2' },
  quarter: { name: 'Old quarter', subtitle: 'Follow your curiosity.', place: 'A day in the city', stops: ['The courtyard', 'A bookshop', 'The market'], extra: 'Garden square', names: ['COURTYARD', 'BOOKS', 'MARKET'], distance: '2.8' },
} as const

function Roam({ interactive }: { interactive: boolean }) {
  const [destination, setDestination] = useState<'coast' | 'quarter'>('coast')
  const [extraStop, setExtraStop] = useState(false)
  const [activeStop, setActiveStop] = useState(0)
  const current = destinations[destination]
  const stops = extraStop ? [...current.stops, current.extra] : [...current.stops]

  function chooseDestination(next: 'coast' | 'quarter') {
    setDestination(next)
    setExtraStop(false)
    setActiveStop(0)
  }

  return (
    <div className="demo-roam-composition demo-frame">
      <div className="demo-phone demo-phone-map">
        <div className="demo-phone-status"><span>9:41</span><div /><span className="demo-phone-signal">••• ▰</span></div>
        <div className="demo-phone-brand"><span><Compass size={19} weight="fill" />roam</span><span className="demo-phone-avatar">S</span></div>
        <div className="demo-roam-intro"><span>A LITTLE FURTHER</span><h3>{current.subtitle}</h3></div>
        <div className="demo-destination-tabs" aria-label="Choose sample destination"><DemoControl interactive={interactive} type="button" disabled={!interactive} aria-pressed={destination === 'coast'} onClick={() => chooseDestination('coast')} className={destination === 'coast' ? 'demo-destination-active' : ''}>North coast</DemoControl><DemoControl interactive={interactive} type="button" disabled={!interactive} aria-pressed={destination === 'quarter'} onClick={() => chooseDestination('quarter')} className={destination === 'quarter' ? 'demo-destination-active' : ''}>Old quarter</DemoControl></div>
        <div className={`demo-map demo-map-${destination}`} aria-label={`Fictional map of ${current.name}`}>
          <div className="demo-map-water" /><div className="demo-map-park demo-map-park-one" /><div className="demo-map-park demo-map-park-two" />
          <div className="demo-map-street demo-map-street-one" /><div className="demo-map-street demo-map-street-two" /><div className="demo-map-street demo-map-street-three" /><div className="demo-map-street demo-map-street-four" />
          <div className="demo-map-route demo-map-route-one" /><div className="demo-map-route demo-map-route-two" />
          {current.names.map((name, i) => <DemoControl interactive={interactive} key={name} type="button" className={`demo-map-marker demo-map-marker-${i} ${activeStop === i ? 'demo-map-marker-active' : ''}`} disabled={!interactive} onClick={() => setActiveStop(i)} aria-label={`View sample stop ${stops[i]}`} aria-pressed={activeStop === i}><MapPin size={15} weight="fill" /><span>{name}</span></DemoControl>)}
          <span className="demo-map-label">SAMPLE MAP</span>
        </div>
        <div className="demo-roam-current"><div><small>YOUR NEXT LITTLE DETOUR</small><strong>{stops[activeStop]}</strong></div></div>
        <div className="demo-phone-nav"><span><Compass size={19} weight="fill" />Explore</span><span><MapPin size={19} />Your route</span><span><BookmarkSimple size={19} />Saved</span></div>
      </div>
      <div className="demo-phone demo-phone-route">
        <div className="demo-phone-status"><span>9:41</span><div /><span className="demo-phone-signal">••• ▰</span></div>
        <div className="demo-roam-route-top"><Compass size={20} /><span>YOUR DAY, YOUR WAY</span><DotsThree size={22} /></div>
        <div className="demo-route-destinations" aria-label="Choose itinerary destination"><DemoControl interactive={interactive} type="button" disabled={!interactive} aria-pressed={destination === "coast"} onClick={() => chooseDestination("coast")} className={destination === "coast" ? "demo-destination-active" : ""}>North coast</DemoControl><DemoControl interactive={interactive} type="button" disabled={!interactive} aria-pressed={destination === "quarter"} onClick={() => chooseDestination("quarter")} className={destination === "quarter" ? "demo-destination-active" : ""}>Old quarter</DemoControl></div><h3>{current.place}</h3><p className="demo-route-sub">A sample itinerary with room to wander.</p>
        <div className="demo-route-summary"><div><strong>{stops.length}</strong><span>sample stops</span></div><div><strong>{current.distance}<small> km</small></strong><span>illustrative route</span></div></div>
        <div className="demo-route-list" aria-label="Sample itinerary">{stops.map((stop, i) => <DemoControl interactive={interactive} key={stop} type="button" disabled={!interactive} className={activeStop === i ? 'demo-route-stop demo-route-stop-active' : 'demo-route-stop'} aria-pressed={activeStop === i} onClick={() => setActiveStop(i)}><span className="demo-stop-number">{i + 1}</span><div><small>{['09:00', '10:30', '13:00', '16:00'][i]} / SAMPLE</small><strong>{stop}</strong><span>{['Start with a new perspective', 'Something slow, something local', 'See where the day takes you', 'One more moment outside'][i]}</span></div></DemoControl>)}</div>
        <DemoControl interactive={interactive} type="button" className="demo-roam-add" disabled={!interactive} onClick={() => { setExtraStop((value) => !value); if (extraStop && activeStop === 3) setActiveStop(0) }}>{extraStop ? <Check size={16} /> : <Plus size={16} />}{extraStop ? 'Remove optional stop' : 'Add a little detour'}</DemoControl>
        <p className="demo-roam-disclaimer" aria-live={interactive ? 'polite' : undefined}>{interactive ? `${current.name}: ${stops.length} sample stops. ${stops[activeStop]} selected.` : 'Fictional places. Sample itinerary.'}</p>
      </div>
    </div>
  )
}

type LogEntry = { id: string; message: string; status: 'complete' | 'failed' | 'queued' | 'info' }
type RelayState = { paused: boolean; failureArmed: boolean; queued: number; processed: number; failed: number; nextId: number; logs: LogEntry[] }
type RelayAction = { type: 'send' | 'pause' | 'arm' | 'retry' }
const relayInitial: RelayState = {
  paused: false, failureArmed: false, queued: 0, processed: 128, failed: 0, nextId: 129,
  logs: [
    { id: 'evt_0128', message: 'Delivered to sample worker', status: 'complete' },
    { id: 'evt_0127', message: 'Delivered to sample worker', status: 'complete' },
    { id: 'evt_0126', message: 'Delivered to sample worker', status: 'complete' },
  ],
}
function relayLogs(entry: LogEntry, logs: LogEntry[]): LogEntry[] {
  return [entry, ...logs].slice(0, 6)
}
function relayReducer(state: RelayState, action: RelayAction): RelayState {
  if (action.type === 'arm') return { ...state, failureArmed: !state.failureArmed }
  if (action.type === 'retry') {
    if (state.failed === 0) return state
    if (state.paused) return { ...state, failed: 0, queued: state.queued + state.failed, logs: relayLogs({ id: 'retry', message: `${state.failed} failed sample event${state.failed > 1 ? 's' : ''} requeued while workers are paused`, status: 'queued' }, state.logs) }
    return { ...state, failed: 0, processed: state.processed + state.failed, logs: relayLogs({ id: 'retry', message: `${state.failed} failed sample event${state.failed > 1 ? 's' : ''} delivered`, status: 'complete' }, state.logs) }
  }
  if (action.type === 'pause') {
    if (!state.paused) return { ...state, paused: true }
    const failures = state.failureArmed && state.queued > 0 ? 1 : 0
    return { ...state, paused: false, queued: 0, processed: state.processed + state.queued - failures, failed: state.failed + failures, failureArmed: state.queued > 0 ? false : state.failureArmed, logs: relayLogs({ id: 'workers', message: state.queued > 0 ? `${state.queued} queued sample event${state.queued > 1 ? 's' : ''} processed${failures ? '; 1 failed' : ''}` : 'Sample workers resumed', status: failures ? 'failed' : 'info' }, state.logs) }
  }
  const id = `evt_${state.nextId.toString().padStart(4, '0')}`
  const status = state.paused ? 'queued' : state.failureArmed ? 'failed' : 'complete'
  const message = status === 'queued' ? 'Queued while sample workers are paused' : status === 'failed' ? 'Simulated timeout; available to retry' : 'Delivered to sample worker'
  return { ...state, nextId: state.nextId + 1, queued: state.queued + Number(status === 'queued'), processed: state.processed + Number(status === 'complete'), failed: state.failed + Number(status === 'failed'), failureArmed: state.paused ? state.failureArmed : false, logs: relayLogs({ id, message, status }, state.logs) }
}

function Relay({ interactive }: { interactive: boolean }) {
  const [state, dispatch] = useReducer(relayReducer, relayInitial)
  return (
    <div className="demo-relay-window demo-frame">
      <div className="demo-relay-header"><span className="demo-relay-brand"><Stack size={21} weight="duotone" />relay</span><span>local / event-workspace <CaretDown size={12} /></span><span className="demo-simulation-badge">FICTIONAL SIMULATION</span></div>
      <div className="demo-relay-body">
        <div className="demo-relay-sidebar"><span className="demo-relay-sidebar-active"><SquaresFour size={17} /><span>Overview</span></span><span><Queue size={17} /><span>Queues</span></span><span><Lightning size={17} /><span>Workers</span></span><span><Stack size={17} /><span>Events</span></span><div className="demo-relay-local"><Circle size={7} weight="fill" /><span>Runs in your browser</span></div></div>
        <div className="demo-relay-main">
          <div className="demo-relay-title"><div><p>EVENT PIPELINE</p><h3>A clear path for every event.</h3></div><span className={`demo-worker-status ${state.paused ? 'demo-worker-paused' : ''}`}><Circle size={6} weight="fill" />{state.paused ? 'Workers paused' : 'Workers ready'}</span></div>
          <div className="demo-relay-topology">
            <div className="demo-system-node"><div><Cube size={20} /><span>Source</span></div><strong>sample.events</strong><small>Manual input</small><span className="demo-node-port" /></div>
            <div className="demo-node-link"><ArrowRight size={16} /></div>
            <div className="demo-system-node demo-system-node-queue"><div><Queue size={20} /><span>Queue</span></div><strong>delivery.queue</strong><small>{state.queued} awaiting delivery</small><span className="demo-node-port" /></div>
            <div className="demo-node-link"><ArrowRight size={16} /></div>
            <div className={`demo-system-node ${state.paused ? 'demo-system-node-paused' : ''}`}><div><Lightning size={20} /><span>Workers</span></div><strong>worker.pool</strong><small>{state.paused ? 'Paused by you' : '3 sample workers'}</small></div>
          </div>
          <div className="demo-sample-metrics"><div><span>PROCESSED / SAMPLE</span><strong>{state.processed}<small>events</small></strong></div><div><span>QUEUED / SAMPLE</span><strong>{state.queued}<small>events</small></strong></div><div><span>FAILED / SAMPLE</span><strong className={state.failed ? 'demo-failed-metric' : ''}>{state.failed}<small>events</small></strong></div></div>
          <div className="demo-relay-controls"><DemoControl interactive={interactive} type="button" className="demo-send" disabled={!interactive} onClick={() => dispatch({ type: 'send' })}><Plus size={15} />Send sample event</DemoControl><DemoControl interactive={interactive} type="button" disabled={!interactive} onClick={() => dispatch({ type: 'pause' })}>{state.paused ? <Play size={14} /> : <Pause size={14} />}{state.paused ? 'Resume workers' : 'Pause workers'}</DemoControl><DemoControl interactive={interactive} type="button" disabled={!interactive} aria-pressed={state.failureArmed} className={state.failureArmed ? 'demo-failure-armed' : ''} onClick={() => dispatch({ type: 'arm' })}><WarningCircle size={14} />{state.failureArmed ? 'Failure armed' : 'Fail next event'}</DemoControl><DemoControl interactive={interactive} type="button" disabled={!interactive || state.failed === 0} onClick={() => dispatch({ type: 'retry' })}><ArrowClockwise size={14} />Retry failed</DemoControl></div>
          <div className="demo-event-inspector"><div className="demo-event-inspector-head"><span>Event inspector</span><span>Latest sample activity</span></div><div className="demo-event-log" role={interactive ? 'log' : undefined} aria-live={interactive ? 'polite' : undefined} aria-label="Sample event activity">{state.logs.map((entry, i) => <div key={`${entry.id}-${i}`} className={`demo-log-row demo-log-${entry.status}`}><span>{entry.status === 'complete' ? <CheckCircle size={15} /> : entry.status === 'failed' ? <WarningCircle size={15} /> : entry.status === 'queued' ? <Pause size={15} /> : <Play size={15} />}</span><code>{entry.id}</code><span>{entry.message}</span><small>{entry.status}</small></div>)}</div></div>
          <div className="demo-relay-note"><Circle size={5} weight="fill" />All counters and events are fictional. This simulation has no backend.</div>
        </div>
      </div>
    </div>
  )
}

function CompactPreview({ kind }: { kind: DemoProps['kind'] }) {
  if (kind === 'web') return <div className="demo-mini-web"><span className="demo-mini-web-sidebar" /><div><span className="demo-mini-web-title" /><ConceptImage /><div className="demo-mini-web-grid"><span /><span /><span /></div></div></div>
  if (kind === 'mobile') return <div className="demo-mini-mobile"><div className="demo-mini-phone"><span className="demo-mini-phone-notch" /><span className="demo-mini-phone-title" /><div className="demo-mini-map"><MapPin size={10} weight="fill" /></div><span className="demo-mini-phone-line" /></div><div className="demo-mini-phone"><span className="demo-mini-phone-notch" /><span className="demo-mini-phone-title" /><div className="demo-mini-route"><span /><span /><span /></div><span className="demo-mini-phone-button" /></div></div>
  return <div className="demo-mini-system"><div className="demo-mini-system-header"><Stack size={8} /><span>relay</span></div><div className="demo-mini-nodes"><span><Cube size={8} /></span><i /><span><Queue size={8} /></span><i /><span><Lightning size={8} /></span></div><div className="demo-mini-log"><span /><span /><span /></div></div>
}

export function Demo({ kind, interactive = false, compact = false }: DemoProps) {
  return (
    <div className={`demo demo-${kind} ${interactive ? 'demo-interactive' : 'demo-static'} ${compact ? 'demo-compact' : ''}`} role={interactive ? 'region' : 'img'} aria-label={`${demoNames[kind]} fictional ${interactive ? 'interactive demo' : 'project preview'}`}>
      <div className="demo-surface" inert={!interactive}>
        {compact ? <CompactPreview kind={kind} /> : kind === 'web' ? <Forma interactive={interactive} /> : kind === 'mobile' ? <Roam interactive={interactive} /> : <Relay interactive={interactive} />}
      </div>
    </div>
  )
}
