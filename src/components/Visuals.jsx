// Two signature hero visuals: a video timeline (social) and a workflow graph (automation)

export function Timeline() {
  return (
    <div className="panel tl" aria-hidden="true">
      <div className="dots"><i /><i /><i /></div>
      <div className="track"><div className="clip c1" style={{ flex: 3 }}>Hook</div><div className="clip c2" style={{ flex: 4 }}>Package details</div><div className="clip c3" style={{ flex: 2 }}>Reviews</div><div className="clip c4" style={{ flex: 2 }}>CTA</div></div>
      <div className="track"><div className="clip c3" style={{ flex: 5 }}>Captions</div><div className="clip c1" style={{ flex: 6 }}>Voiceover</div></div>
      <div className="track"><div className="clip c4" style={{ flex: 2 }}>Music</div><div className="clip c2" style={{ flex: 9 }}>Beat sync</div></div>
      <div className="playhead" />
      <small>One reel, edited start to finish in CapCut Pro.</small>
    </div>
  )
}

const nodes = [
  { x: 10, y: 20, a: 'Google Sheet', b: 'edit a row' },
  { x: 150, y: 20, a: 'Fetch', b: 'CSV request' },
  { x: 290, y: 20, a: 'React site', b: 'renders' },
  { x: 290, y: 150, a: 'Live page', b: 'visitors see' },
  { x: 10, y: 150, a: 'Cache', b: 'fast reloads' },
]
const edges = ['M110 42H150', 'M250 42H290', 'M340 64V150', 'M200 64V107H60V150']

export function Flow() {
  return (
    <div className="panel flow" aria-hidden="true">
      <div className="dots"><i /><i /><i /></div>
      <svg viewBox="0 0 400 214" role="img">
        {edges.map((d, i) => <path key={i} d={d} className="edge" style={{ animationDelay: `${i * 0.4}s` }} />)}
        {nodes.map((n, i) => (
          <g key={i} className="node" style={{ animationDelay: `${i * 0.25}s` }}>
            <rect x={n.x} y={n.y} width="100" height="44" rx="10" />
            <text x={n.x + 50} y={n.y + 19} textAnchor="middle" className="n1">{n.a}</text>
            <text x={n.x + 50} y={n.y + 34} textAnchor="middle" className="n2">{n.b}</text>
          </g>
        ))}
      </svg>
      <small>How this portfolio updates itself from a sheet.</small>
    </div>
  )
}
