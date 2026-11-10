import { useState, useLayoutEffect, useEffect, useCallback, useRef } from 'react'
import { flushSync } from 'react-dom'
import { profile as pf, social as sc, auto as au } from './data.js'
import { SHEET_ID } from './sheet.config.js'
import { loadSheetContent, cachedContent } from './sheet.js'
import { Timeline, Flow } from './components/Visuals.jsx'
import {
  ArrowRight,
  Code2,
  Palette,
  Scissors,
  BriefcaseBusiness,
  Clapperboard,
  CalendarDays,
  Globe,
  Workflow,
  Database,
  FileSpreadsheet,
  ChartNoAxesCombined
} from 'lucide-react'
import {
  SiFigma,
  SiTiktok,
  SiFacebook,
  SiGoogle,
  SiZapier,
  SiMake,
  SiAirtable,
  SiNotion,
  SiGooglesheets,
  SiReact,
  SiHtml5,
  SiJavascript
} from 'react-icons/si'
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaEnvelope
} from 'react-icons/fa'

const SERVICE_ICONS = {
  'short-form video editing': Clapperboard,
  'social media management': CalendarDays,
  'graphic design': Palette,
  'social media reporting': ChartNoAxesCombined,
  'website building and upkeep': Globe,
  'workflow automation': Workflow,
  'airtable and notion systems': Database,
  'sheets and apps script': FileSpreadsheet
}

const TOOL_ICONS_MAP = [
  { match: 'capcut', icon: Scissors },
  { match: 'canva', icon: Palette },
  { match: 'figma', icon: SiFigma },
  { match: 'tiktok', icon: SiTiktok },
  { match: 'facebook', icon: SiFacebook },
  { match: 'google sheets', icon: SiGooglesheets },
  { match: 'google', icon: SiGoogle },
  { match: 'microsoft', icon: BriefcaseBusiness },
  { match: 'zapier', icon: SiZapier },
  { match: 'make', icon: SiMake },
  { match: 'airtable', icon: SiAirtable },
  { match: 'notion', icon: SiNotion },
  { match: 'react', icon: SiReact },
  { match: 'html', icon: SiHtml5 },
  { match: 'css', icon: Code2 },
  { match: 'javascript', icon: SiJavascript }
]

const BASE = import.meta.env.BASE_URL

// Roadmap steps: "Using" comes first, then "Learning"; any other level from the sheet follows in sheet order
const ROAD_LABEL = { using: 'Using now', learning: 'Learning next' }
const ROAD_ORDER = ['using', 'learning']
const groupRoadmap = (items) => {
  const groups = []
  items.forEach((t) => {
    const key = String(t.level || '').trim()
    let g = groups.find((x) => x.key.toLowerCase() === key.toLowerCase())
    if (!g) {
      g = { key, items: [] }
      groups.push(g)
    }
    g.items.push(t)
  })
  const rank = (k) => {
    const i = ROAD_ORDER.indexOf(k.toLowerCase())
    return i === -1 ? ROAD_ORDER.length : i
  }
  return groups.sort((a, b) => rank(a.key) - rank(b.key))
}

// Hero copy shared by both modes. Per-mode badge, headline, lede and stats still come from the sheet / data.js.
const HERO_TEXT =
  'I explore ideas, create digital experiences, and build practical solutions through design and technology.'
const KEY = 'portfolio-mode'

function initialMode() {
  try {
    const m = localStorage.getItem(KEY)
    if (m === 'light' || m === 'dark') return m
  } catch {}
  return 'light'
}

// "image" cells may hold several files separated by |, each a picture or a video (.mp4 / .webm)
const mediaItems = (value) =>
  String(value || '')
    .split('|')
    .map((x) => x.trim())
    .filter(Boolean)
    .map((src) => ({
      src: /^https?:/.test(src) ? src : BASE + src,
      video: /\.(mp4|webm|mov)(\?.*)?$/i.test(src),
    }))

const splitList = (value) =>
  String(value || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

function CaseTile({ p, onOpen }) {
  const cover = mediaItems(p.image)[0]
  const tools = splitList(p.tools)
  const play = (e) => {
    const v = e.currentTarget.querySelector('video')
    if (v) v.play().catch(() => {})
  }
  const stop = (e) => {
    const v = e.currentTarget.querySelector('video')
    if (v) {
      v.pause()
      v.currentTime = 0
    }
  }
  return (
    <article className={`tile${cover ? ' has-media' : ''}`} onMouseEnter={play} onMouseLeave={stop}>
      {cover &&
        (cover.video ? (
          <video className="tile-media" src={cover.src} muted loop playsInline preload="metadata" aria-hidden="true" />
        ) : (
          <img className="tile-media" src={cover.src} alt="" loading="lazy" />
        ))}
      <span className="tile-go" aria-hidden="true">
        →
      </span>
      <p className="t-client">{p.client}</p>
      <h3>
        <button type="button" className="tile-open" aria-haspopup="dialog" onClick={() => onOpen(p)}>
          {p.title}
        </button>
      </h3>
      <p className="t-result">{p.result}</p>
      {tools.length > 0 && (
        <ul className="t-tools">
          {tools.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
    </article>
  )
}

function CaseDialog({ p, onClose }) {
  const ref = useRef(null)
  useEffect(() => {
    const d = ref.current
    if (p && d && !d.open) d.showModal()
    document.body.style.overflow = p ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [p])
  if (!p) return null
  // Close the dialog and tell the page right away (the native "close" event only covers Esc)
  const requestClose = () => {
    if (ref.current?.open) ref.current.close()
    onClose()
  }
  const items = mediaItems(p.image)
  const tools = splitList(p.tools)
  return (
    <dialog
      ref={ref}
      className="case-dialog"
      aria-labelledby="case-dialog-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose()
      }}
    >
      <div className="dlg-inner">
        <button type="button" className="dlg-close" aria-label="Close" onClick={requestClose}>
          ✕
        </button>
        <p className="case-client">{p.client}</p>
        <h3 id="case-dialog-title">{p.title}</h3>
        {items.length > 0 && (
          <div className={`dlg-media${items.length > 1 ? ' multi' : ''}`}>
            {items.map((m, i) =>
              m.video ? (
                <video key={m.src} src={m.src} controls playsInline preload="metadata" />
              ) : (
                <img key={m.src} src={m.src} alt={`${p.title} (${i + 1} of ${items.length})`} loading="lazy" />
              ),
            )}
          </div>
        )}
        <div className="dlg-cols">
          <div>
            <h4>The need</h4>
            <p>{p.need}</p>
          </div>
          <div>
            <h4>What I did</h4>
            <p>{p.did}</p>
          </div>
        </div>
        <p className="dlg-result">{p.result}</p>
        <div className="dlg-foot">
          {tools.length > 0 && (
            <ul className="dlg-tools">
              {tools.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
          {p.link && (
            <a className="btn primary" href={p.link} target="_blank" rel="noopener noreferrer">
              View the work
            </a>
          )}
        </div>
      </div>
    </dialog>
  )
}

// Portrait photos: drop public/images/about-studio.jpg (Studio) and about-lab.jpg (Lab).
// .png and .webp also work. The first file found is used; until then a monogram placeholder shows.
const portraitProbe = {}
const probePortrait = (mode) => {
  if (!portraitProbe[mode]) {
    const base = `${BASE}images/about-${mode === 'light' ? 'studio' : 'lab'}`
    portraitProbe[mode] = (async () => {
      for (const ext of ['jpg', 'png', 'webp']) {
        const src = `${base}.${ext}`
        const ok = await new Promise((resolve) => {
          const im = new Image()
          im.onload = () => resolve(true)
          im.onerror = () => resolve(false)
          im.src = src
        })
        if (ok) return src
      }
      return null
    })()
  }
  return portraitProbe[mode]
}

function usePortrait(mode) {
  const [src, setSrc] = useState(null)
  useEffect(() => {
    let live = true
    setSrc(null)
    probePortrait(mode).then((s) => {
      if (live) setSrc(s)
    })
    return () => {
      live = false
    }
  }, [mode])
  return src
}

function Portrait({ mode, name, initials, small }) {
  const src = usePortrait(mode)
  return (
    <div className={`portrait${small ? ' is-small' : ''}`}>
      <span className="portrait-mark" aria-hidden="true">
        {initials}
      </span>
      {src && <img className="portrait-img" src={src} alt={small ? '' : `Portrait of ${name}`} />}
    </div>
  )
}

function CopyButton({ text }) {
  const [state, setState] = useState('idle') // idle | done | failed
  const flash = (next) => {
    setState(next)
    setTimeout(() => setState('idle'), 1800)
  }
  // Modern clipboard API first; an old-style fallback if the browser blocks it
  const legacyCopy = () => {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    document.body.removeChild(ta)
    return ok
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      flash('done')
    } catch {
      flash(legacyCopy() ? 'done' : 'failed')
    }
  }
  return (
    <button type="button" className={`copy-btn${state === 'done' ? ' is-done' : ''}`} onClick={copy} aria-live="polite">
      {state === 'done' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy'}
    </button>
  )
}

function Portfolio({ content }) {
  const { profile, social, auto } = content
  const [mode, setMode] = useState(initialMode)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openCase, setOpenCase] = useState(null)

  const isSocial = mode === 'light'
  const d = isSocial ? social : auto
  const initials = profile.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = mode
    try {
      localStorage.setItem(KEY, mode)
    } catch {}
  }, [mode])

  // Circular reveal transition
  const switchMode = useCallback(
    (next, e) => {
      if (next === mode) return
      const apply = () => flushSync(() => setMode(next))
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (!document.startViewTransition || reduced) return apply()

      const x = e.clientX
      const y = e.clientY
      const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

      const t = document.startViewTransition(apply)
      t.ready.then(() =>
        document.documentElement.animate(
          { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          { duration: 650, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
        )
      )
    },
    [mode]
  )

  const getToolIcon = useCallback((tool) => {
    const name = tool.toLowerCase()
    const found = TOOL_ICONS_MAP.find((item) => name.includes(item.match))
    return found ? found.icon : null
  }, [])

  return (
    <>
      {isSocial && <div className="nuda-gradient-aurora" aria-hidden="true" />}

      <nav aria-label="Primary">
        <div className="wrap navin">
          <a className="brand" href="#" aria-label={`${profile.name} - back to top`}>
            <span className="brand-mark" aria-hidden="true">{initials}</span>
            <span className="brand-text">
              <b>{profile.name}</b>
              <small>Creative Technologist</small>
            </span>
          </a>

          <div className="nav-actions">
            <div
              className="mode-switch"
              role="group"
              aria-label="Choose portfolio focus"
              data-mode={mode}
            >
              <span className="mode-thumb" aria-hidden="true" />
              <button
                className="mode-btn"
                type="button"
                aria-pressed={isSocial}
                onClick={(e) => switchMode('light', e)}
              >
                <Palette size={15} aria-hidden="true" />
                <span className="mode-full">Creative Studio</span>
                <span className="mode-short">Studio</span>
              </button>
              <button
                className="mode-btn"
                type="button"
                aria-pressed={!isSocial}
                onClick={(e) => switchMode('dark', e)}
              >
                <Code2 size={15} aria-hidden="true" />
                <span className="mode-full">Technology Lab</span>
                <span className="mode-short">Lab</span>
              </button>
            </div>

            <button
              className="menu-toggle"
              type="button"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>

          <ul className={menuOpen ? 'mobile-menu open' : 'mobile-menu'}>
            <li>
              <a href="#services" onClick={() => setMenuOpen(false)}>
                Services
              </a>
            </li>
            <li>
              <a href="#work" onClick={() => setMenuOpen(false)}>
                {isSocial ? 'Work' : 'Projects'}
              </a>
            </li>
            <li>
              <a href="#about" onClick={() => setMenuOpen(false)}>
                About
              </a>
            </li>
            <li>
              <a href="#contact" onClick={() => setMenuOpen(false)}>
                Contact
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <header className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="badge">
                <i /> {d.badge}
              </span>
              <h1>
                I bring <span className="hl-creative">creativity</span> and{' '}
                <span className="hl-tech">technology</span> together.
              </h1>
              <p className="lede">{HERO_TEXT}</p>
              <div className="btns">
                <a className="btn primary" href="#contact">
                  Work with me <ArrowRight size={16} aria-hidden="true" />
                </a>
                <a className="btn" href="#work">
                  {isSocial ? 'See my work' : 'See my projects'}
                </a>
              </div>
            </div>

            <div className="hero-stage">
              <div className="stage-frame" aria-hidden="true" />
              <div className="stage-visual">{isSocial ? <Timeline /> : <Flow />}</div>
              <p className="stage-caption">{d.headline}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="stats-strip">
        <div className="wrap">
          <div className="stats">
            {d.stats.map((s) => (
              <div key={s.l}>
                <b>{s.n}</b>
                <span>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section id="services">
        <div className="wrap">
          <div className="sec-head">
            <p className="eyebrow">Services</p>
            <h2>{isSocial ? 'What I do for you' : 'What I can build for you'}</h2>
            <p className="sec-intro">{d.lede}</p>
          </div>
          <div className="cards">
            {d.services.map((s) => {
              const Icon = SERVICE_ICONS[s.title.trim().toLowerCase()] || Workflow

              return (
                <div className="card service-card" key={s.title}>
                  <div className="service-icon">
                    <Icon className="service-icon-svg" size={24} strokeWidth={1.8} />
                  </div>

                  <h3>{s.title}</h3>
                  <p>{s.text}</p>

                  {s.status && (
                    <span className={`chip ${s.status === 'Available' ? 'ok' : ''}`}>
                      {s.status}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="work">
        <div className="wrap">
          {isSocial ? (
            <>
              <div className="sec-head">
                <p className="eyebrow">Work</p>
                <h2>Selected work</h2>
              </div>
              <div className="tiles">
                {social.projects.map((p) => (
                  <CaseTile key={p.title} p={p} onOpen={setOpenCase} />
                ))}
              </div>
              <CaseDialog p={openCase} onClose={() => setOpenCase(null)} />
            </>
          ) : (
            <>
              <div className="sec-head">
                <p className="eyebrow">Projects</p>
                <h2>Websites I've built</h2>
              </div>
              <div className="cards">
                {auto.webProjects.map((p) => (
                  <div className="card" key={p.title}>
                    <span className="chip ok">{p.status}</span>
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                    <p className="stack">{p.stack}</p>
                    {p.link && (
                      <a
                        className="btn"
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit site
                      </a>
                    )}
                  </div>
                ))}
              </div>
              <div className="sec-head sub-head">
                <p className="eyebrow">Automation</p>
                <h2>Automation projects</h2>
                <p className="sec-intro">
                  These proof-of-concept workflows demonstrate how I approach automation, streamline
                repetitive tasks, and connect everyday tools. Created as portfolio projects,
                they showcase my workflow design and problem-solving skills.
                </p>
              </div>
              {auto.demos.slice(0, 1).map((p) => (
                <article className="lab-feature" key={p.title}>
                  <div>
                    <div className="lab-top lab-top-start">
                      <span className={`chip ${p.status === 'Live' ? 'ok' : ''}`}>{p.status}</span>
                      <span className="lab-idx">01 / featured</span>
                    </div>
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                    {splitList(p.tools).length > 0 && (
                      <ul className="dtools">
                        {splitList(p.tools).map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    )}
                    {p.link && (
                      <div className="lab-actions">
                        <a className="btn primary" href={p.link} target="_blank" rel="noopener noreferrer">
                          View demo
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="ld" role="img" aria-label={`Workflow: ${p.steps.join(', then ')}`}>
                    {p.steps.map((s, i) => (
                      <div key={s} style={{ display: 'contents' }}>
                        {i > 0 && <div className="ld-link" style={{ '--i': i - 1 }} />}
                        <div className="ld-node" style={{ '--i': i }}>
                          {s}
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
              {auto.demos.length > 1 && (
                <div className="lab-cards">
                  {auto.demos.slice(1).map((p, n) => (
                    <article className="lab-card" key={p.title}>
                      <div className="lab-top">
                        <span className={`chip ${p.status === 'Live' ? 'ok' : ''}`}>{p.status}</span>
                        <span className="lab-idx">{String(n + 2).padStart(2, '0')}</span>
                      </div>
                      <h3>{p.title}</h3>
                      <div className="lab-strip">
                        {p.steps.map((s, i) => (
                          <span className="ls-step" key={s}>
                            <span className="ls-node">{s}</span>
                            {i < p.steps.length - 1 && <span className="ls-arrow" aria-hidden="true" />}
                          </span>
                        ))}
                      </div>
                      <p>{p.text}</p>
                      {(splitList(p.tools).length > 0 || p.link) && (
                        <div className="lab-foot">
                          {splitList(p.tools).length > 0 && (
                            <ul className="dtools">
                              {splitList(p.tools).map((t) => (
                                <li key={t}>{t}</li>
                              ))}
                            </ul>
                          )}
                          {p.link && (
                            <a className="lab-link" href={p.link} target="_blank" rel="noopener noreferrer">
                              View demo →
                            </a>
                          )}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section id="tools">
        <div className="wrap">
          <div className="sec-head">
            <p className="eyebrow">{isSocial ? 'Tools' : 'Skills'}</p>
            <h2>{isSocial ? 'Tools I use' : 'My skills roadmap'}</h2>
          </div>
          {isSocial ? (
            <ul className="tool-grid">
              {social.tools.map((t) => {
                const Icon = getToolIcon(t)
                return (
                  <li className="tool-tile" key={t}>
                    <span className="tool-badge" aria-hidden="true">
                      {Icon ? <Icon /> : t.charAt(0)}
                    </span>
                    <span className="tool-name">{t}</span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="road">
              {groupRoadmap(auto.roadmap).map((g, i) => (
                <div className={`road-col${g.key.toLowerCase() === 'using' ? '' : ' is-next'}`} key={g.key || 'skills'}>
                  <div className="road-head">
                    <span className="road-step">{String(i + 1).padStart(2, '0')}</span>
                    <h3>{ROAD_LABEL[g.key.toLowerCase()] || g.key || 'Skills'}</h3>
                    <span className="road-count" aria-label={`${g.items.length} skills`}>
                      {g.items.length}
                    </span>
                  </div>
                  <ul className="road-list">
                    {g.items.map((t) => {
                      const Icon = getToolIcon(t.tool)
                      return (
                        <li className="road-item" key={t.tool}>
                          <span className="road-icon" aria-hidden="true">
                            {Icon ? <Icon /> : t.tool.charAt(0)}
                          </span>
                          <span>{t.tool}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="about">
        <div className="wrap">
          <div className="about-grid">
            <figure className="about-figure">
              <div className="portrait-wrap">
                <Portrait mode={mode} name={profile.name} initials={initials} />
              </div>
              {profile.location && <figcaption>{profile.location}</figcaption>}
            </figure>
            <div className="about-copy">
              <div className="sec-head">
                <p className="eyebrow">About</p>
                <h2>About me</h2>
              </div>
              <div className="about-body">
                {d.about.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <a className="about-link" href="#contact">
                Let's talk <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="wrap">
          <div className="contact-card">
            <div className="contact-top">
              <p className="eyebrow">Contact</p>
              <div className="contact-who">
                <Portrait mode={mode} name={profile.name} initials={initials} small />
                <div className="contact-id">
                  <b>{profile.name}</b>
                  <span>{d.badge}</span>
                </div>
              </div>
            </div>
            <h2>
              Let's work <span className="accent-word">together</span>
            </h2>
            <p className="muted">
              Tell me about your brand and what you need. I'll reply with how I can help.
            </p>
            <ul className="contact-list">
              <li>
                <span className="cl-label">Email</span>
                <a className="mail" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
                <CopyButton text={profile.email} />
              </li>
              {profile.github && (
                <li>
                  <span className="cl-label">GitHub</span>
                  <a className="cl-link" href={profile.github} target="_blank" rel="noopener noreferrer">
                    {profile.github.replace(/^https?:\/\//, '')}
                  </a>
                  <span className="cl-go" aria-hidden="true">
                    ↗
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap footer-content">
          <div className="footer-social-card">
            <h3>Let's Connect</h3>
            <p>Have a project in mind? Let's create something useful together!</p>
            <div className="footer-social-links">
              <a href={`mailto:${profile.email}`} aria-label="Email">
                <FaEnvelope size={20} />
              </a>
              <a
                href="https://www.facebook.com/atheeeens"
                aria-label="Facebook"
                target="_blank"
                rel="noreferrer"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="https://www.instagram.com/athenelytical/"
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/athena-picones-7554aa286/"
                aria-label="LinkedIn"
                target="_blank"
                rel="noreferrer"
              >
                <FaLinkedinIn size={20} />
              </a>
              <a
                href={profile.github}
                aria-label="GitHub"
                target="_blank"
                rel="noreferrer"
              >
                <FaGithub size={20} />
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} {profile.name}</span>
            <span>Built with React &amp; Google Sheets</span>
          </div>
        </div>
      </footer>
    </>
  )
}

const DEFAULTS = { profile: pf, social: sc, auto: au }

export default function App() {
  const [content, setContent] = useState(() => (SHEET_ID && cachedContent()) || DEFAULTS)

  useEffect(() => {
    let active = true

    const refreshContent = async () => {
      try {
        const updatedContent = await loadSheetContent(DEFAULTS)
        if (active && updatedContent) {
          setContent(updatedContent)
        }
      } catch (error) {
        console.error('Failed to refresh portfolio content:', error)
      }
    }

    refreshContent()
    const interval = setInterval(refreshContent, 15000)

    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  return <Portfolio content={content} />
}