import { useState, useLayoutEffect, useEffect, useCallback, useRef } from 'react'
import { safeHref, safeMailto } from './safe.js'
import { analyticsOn } from './stats.js'
import { flushSync } from 'react-dom'
import { profile as pf, social as sc, auto as au, experience as ex, leadershipEvents as le } from './data.js'
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
  ChartNoAxesCombined,
  Users,
  MapPin,
  ArrowUpRight
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
const OPTIMIZED_IMAGE_NAMES = new Set([
  'nhfc-screenshot',
  'verses-screenshot',
  'social-media-intelligence',
  'about-studio',
  'photobooth-screenshot',
  'timer-screenshot',
  'about-lab',
  'awsscd-screenshot',
])

const mediaItems = (value) =>
  String(value || '')
    .split('|')
    .map((x) => x.trim())
    .filter(Boolean)
    .map((raw) => {
      // the site serves the public/ folder from its root, so a leading "public/" is dropped
      const src = /^https?:/.test(raw) ? raw : raw.replace(/^\.?\/?public\//i, '')
      const video = /\.(mp4|webm|mov)(\?.*)?$/i.test(src)
      const originalSrc = /^https?:/.test(src) ? src : BASE + src
      const match = !video && !/^https?:/.test(src) && src.match(/(?:^|\/)images\/([^/]+)\.(jpg|jpeg|png)(\?.*)?$/i)
      const webpSrc = match && OPTIMIZED_IMAGE_NAMES.has(match[1].toLowerCase())
        ? BASE + src.replace(/\.(jpg|jpeg|png)(\?.*)?$/i, '.webp')
        : null
      return { src: originalSrc, webpSrc, video }
    })

const splitList = (value) =>
  String(value || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

function CaseTile({ p, onOpen }) {
  // Keep project screenshots inside the case study dialog; cards remain clean and text-first.
  const tools = splitList(p.tools)
  return (
    <article className="tile" data-reveal>
      <button className="tile-go" type="button" aria-label={`Open case study: ${p.title}`} onClick={() => onOpen(p)}>↗</button>
      <div className="t-body">
        <p className="t-client">{p.client}</p>
        <h3>
          <button
            type="button"
            className="tile-open"
            aria-haspopup="dialog"
            data-track={`project: ${p.title}`}
            onClick={() => onOpen(p)}
          >
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
      </div>
    </article>
  )
}

function CaseDialog({ p, onClose }) {
  const ref = useRef(null)
  const [badSrcs, setBadSrcs] = useState([])
  const [closing, setClosing] = useState(false)
  const closeTimer = useRef(null)
  const markBad = (src) => setBadSrcs((b) => (b.includes(src) ? b : [...b, src]))
  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    },
    []
  )
  useEffect(() => {
    const d = ref.current
    if (p) setClosing(false)
    if (p && d && !d.open) d.showModal()
    document.body.style.overflow = p ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [p])
  if (!p) return null
  // Let the panel animate out before the native dialog (and the page state) closes.
  // With reduced motion the panel closes immediately.
  const requestClose = () => {
    if (closing) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      if (ref.current?.open) ref.current.close()
      onClose()
      return
    }
    setClosing(true)
    closeTimer.current = setTimeout(() => {
      if (ref.current?.open) ref.current.close()
      onClose()
    }, 180)
  }
  const items = mediaItems(p.image).filter((m) => !badSrcs.includes(m.src))
  const tools = splitList(p.tools)
  return (
    <dialog
      ref={ref}
      className={`case-dialog${closing ? ' is-closing' : ''}`}
      aria-labelledby="case-dialog-title"
      onClose={onClose}
      onCancel={(e) => {
        // Esc: run the same exit animation instead of the browser's instant close
        e.preventDefault()
        requestClose()
      }}
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
                <video key={m.src} src={m.src} controls playsInline preload="metadata" onError={() => markBad(m.src)} />
              ) : (
                <img
                  key={m.src}
                  src={m.webpSrc || m.src}
                  alt={`${p.title} (${i + 1} of ${items.length})`}
                  loading="lazy"
                  onError={(e) => {
                    if (m.webpSrc && e.currentTarget.src.endsWith('.webp')) e.currentTarget.src = m.src
                    else markBad(m.src)
                  }}
                />
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
          {safeHref(p.link) && (
            <a data-track={`project link: ${p.title}`} className="btn primary" href={safeHref(p.link)} target="_blank" rel="noopener noreferrer">
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
      for (const ext of ['webp', 'jpg', 'png']) {
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

function CopyButton({ text, track }) {
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
    <button type="button" className={`copy-btn${state === 'done' ? ' is-done' : ''}`} data-track={track} onClick={copy} aria-live="polite">
      {state === 'done' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy'}
    </button>
  )
}

function Portfolio({ content }) {
  const { profile, social, auto } = content
  const [mode, setMode] = useState(initialMode)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openCase, setOpenCase] = useState(null)
  const [activeSection, setActiveSection] = useState('')
  const [activeExperience, setActiveExperience] = useState(0)
  const [activeEvent, setActiveEvent] = useState(0)

  const experienceItems = (Array.isArray(content.experience) ? content.experience : []).filter((item) => !['no','false','0','hide'].includes(String(item.show || '').toLowerCase()))
  const eventItems = (Array.isArray(content.leadershipEvents) ? content.leadershipEvents : []).filter((item) => !['no','false','0','hide'].includes(String(item.show || '').toLowerCase()))
  const currentExperience = experienceItems[activeExperience] || experienceItems[0]
  const currentEvent = eventItems[activeEvent] || eventItems[0]

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

  // Scroll reveal: panels marked data-reveal rise in once, as they enter the viewport.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-reveal]:not(.is-revealed)'))
    if (!els.length) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-revealed'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            io.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [mode, content])

  // Scroll spy: mark the chapter the reader is currently in.
  useEffect(() => {
    const sections = ['work', 'experience', 'leadership', 'tools', 'about', 'contact']
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (!sections.length || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (hit) setActiveSection(hit.target.id)
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.2, 0.6] }
    )
    sections.forEach((el) => io.observe(el))
    return () => io.disconnect()
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
      <a className="skip-link" href="#main-content">Skip to main content</a>
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
                data-track="mode: creative studio"
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
                data-track="mode: technology lab"
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
            {[
              { id: 'work', label: isSocial ? 'Work' : 'Projects' },
              { id: 'experience', label: 'Experience' },
              { id: 'leadership', label: 'Events' },
              { id: 'tools', label: isSocial ? 'Tools' : 'Skills' },
              { id: 'about', label: 'About' },
              { id: 'contact', label: 'Connect' },
            ].map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={activeSection === link.id ? 'is-current' : undefined}
                  aria-current={activeSection === link.id ? 'location' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <main id="main-content">
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
                <a className="btn primary" href="#contact" data-track="cta: work with me">
                  Work with me <ArrowRight size={16} aria-hidden="true" />
                </a>
                <a className="btn" href="#work" data-track="cta: see work">
                  {isSocial ? 'See my work' : 'See my projects'}
                </a>
              </div>
            </div>

            <div className="hero-stage" data-reveal>
              <div className="stage-frame" aria-hidden="true" />
              <div className="stage-visual">{isSocial ? <Timeline /> : <Flow />}</div>
              <p className="stage-caption">{d.headline}</p>
            </div>
          </div>
          {Array.isArray(d.stats) && d.stats.length > 0 && (
            <div className="stats-strip" data-reveal>
              <div className="stats">
                {d.stats.map((s, i) => (
                  <div key={s.l || i}>
                    <b>{s.n}</b>
                    <span>{s.l}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="hero-proof" data-reveal aria-label="Selected experience highlights">
            <div><strong>7 pages</strong><span>Company website built</span></div>
            <div><strong>500+ attendees</strong><span>Conference logistics led</span></div>
            <div><strong>40K interactions</strong><span>One TikTok Live session</span></div>
          </div>
        </div>
      </header>

      <section id="work">
        <div className="wrap">
          {isSocial ? (
            <>
              <div className="sec-head" data-reveal>
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
              <div className="sec-head" data-reveal>
                <p className="eyebrow">Projects</p>
                <h2>Websites I've built</h2>
              </div>
              <div className="lab-shots">
                {auto.webProjects.map((p, i) => {
                  const shot = mediaItems(p.image)[0]
                  const stack = splitList(p.stack)
                  return (
                    <article
                      className="shot"
                      key={p.title}
                      data-reveal
                      style={{ '--d': `${(i % 2) * 90}ms` }}
                    >
                      <div className="shot-media">
                        <span className="shot-plate" aria-hidden="true">
                          <span className="shot-plate-index">{String(i + 1).padStart(2, '0')}</span>
                          <span className="shot-plate-name">{p.title}</span>
                          {stack.length > 0 && <span className="shot-plate-stack">{stack.join(' / ')}</span>}
                        </span>
                        {shot && (
                          <img
                            className="shot-img"
                            src={shot.webpSrc || shot.src}
                            alt={`Screenshot of ${p.title}`}
                            loading="lazy"
                            onError={(e) => {
                              if (shot.webpSrc && e.currentTarget.src.endsWith('.webp')) e.currentTarget.src = shot.src
                              else e.currentTarget.remove()
                            }}
                          />
                        )}
                      </div>
                      <div className="shot-copy">
                        <div className="shot-meta">
                          <span className="shot-index">
                            {String(i + 1).padStart(2, '0')} / {String(auto.webProjects.length).padStart(2, '0')}
                          </span>
                          <span className={`chip ${p.status === 'Live' ? 'ok' : ''}`}>{p.status}</span>
                        </div>
                        <h3>{p.title}</h3>
                        <p>{p.text}</p>
                        {stack.length > 0 && (
                          <ul className="shot-tools">
                            {stack.map((t) => (
                              <li key={t}>{t}</li>
                            ))}
                          </ul>
                        )}
                        {safeHref(p.link) && (
                          <a
                            data-track={`site: ${p.title}`}
                            className="shot-link"
                            href={safeHref(p.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Visit site <ArrowUpRight size={16} aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
              <div className="sec-head sub-head" data-reveal>
                <p className="eyebrow">Automation</p>
                <h2>Automation projects</h2>
                <p className="sec-intro">
                  These proof-of-concept workflows demonstrate how I approach automation, streamline
                repetitive tasks, and connect everyday tools. Created as portfolio projects,
                they showcase my workflow design and problem-solving skills.
                </p>
              </div>
              {auto.demos.slice(0, 1).map((p) => (
                <article className="lab-feature" key={p.title} data-reveal>
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
                    {safeHref(p.link) && (
                      <div className="lab-actions">
                        <a data-track={`demo: ${p.title}`} className="btn primary" href={safeHref(p.link)} target="_blank" rel="noopener noreferrer">
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
                <div className="lab-cards" data-reveal>
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
                      {(splitList(p.tools).length > 0 || safeHref(p.link)) && (
                        <div className="lab-foot">
                          {splitList(p.tools).length > 0 && (
                            <ul className="dtools">
                              {splitList(p.tools).map((t) => (
                                <li key={t}>{t}</li>
                              ))}
                            </ul>
                          )}
                          {safeHref(p.link) && (
                            <a data-track={`demo: ${p.title}`} className="lab-link" href={safeHref(p.link)} target="_blank" rel="noopener noreferrer">
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

      <section id="experience" className="journey-section">
    <div className="wrap">
      <div className="sec-head journey-head" data-reveal>
        <p className="eyebrow">Experience · {experienceItems.length} chapters</p>
        <h2>My professional journey</h2>
        <p className="sec-intro">Select a milestone to explore what I worked on and learned along the way.</p>
      </div>
      {experienceItems.length > 0 && (
        <div className="journey-shell" data-reveal>
          <div className="journey-track" role="tablist" aria-label="Professional experience timeline">
            {experienceItems.map((item, i) => (
              <button type="button" className={i === activeExperience ? 'journey-point is-active' : 'journey-point'} role="tab" aria-selected={i === activeExperience} aria-controls="journey-details" key={item.title + i} onClick={() => setActiveExperience(i)}>
                <span className="journey-date">{item.date || `Chapter ${String(i + 1).padStart(2, '0')}`}</span>
                <span className="journey-dot" aria-hidden="true"><BriefcaseBusiness size={16}/></span>
                <span className="journey-point-title">{item.title}</span>
              </button>
            ))}
          </div>
          {currentExperience && (
            <article className="journey-detail" id="journey-details" role="tabpanel">
              <div className="journey-detail-top">
                <span className="journey-index">EXPERIENCE / {String(activeExperience + 1).padStart(2, '0')}</span>
                <span className="journey-date-pill">{currentExperience.date}</span>
              </div>
              <div className="journey-detail-grid">
                <div>
                  <h3>{currentExperience.title}</h3>
                  {currentExperience.company && <p className="journey-company"><MapPin size={15}/> {currentExperience.company}</p>}
                </div>
                <div className="journey-copy">
                  {currentExperience.description && <p>{currentExperience.description}</p>}
                  {currentExperience.highlight && <p className="journey-highlight">{currentExperience.highlight}</p>}
                </div>
              </div>
              <div className="journey-controls">
                <span>{String(activeExperience + 1).padStart(2, '0')} <span className="journey-muted">/ {String(experienceItems.length).padStart(2, '0')}</span></span>
                <div className="journey-arrows">
                  <button type="button" aria-label="Previous experience" disabled={activeExperience === 0} onClick={() => setActiveExperience((i) => Math.max(0, i - 1))}>←</button>
                  <button type="button" aria-label="Next experience" disabled={activeExperience >= experienceItems.length - 1} onClick={() => setActiveExperience((i) => Math.min(experienceItems.length - 1, i + 1))}>→</button>
                </div>
              </div>
            </article>
          )}
        </div>
      )}
    </div>
  </section>
  <section id="leadership" className="event-explorer">
    <div className="wrap">
      <div className="sec-head event-head" data-reveal>
        <p className="eyebrow">Leadership & Events · {eventItems.length} highlights</p>
        <h2>Behind the scenes, making it happen</h2>
        <p className="sec-intro">Explore the events, communities, and teams I've helped bring together.</p>
      </div>
      {eventItems.length > 0 && currentEvent && (
        <div className="event-stage" data-reveal>
          <div className="event-index-rail" role="tablist" aria-label="Leadership and event highlights">
            {eventItems.map((item, i) => (
              <button type="button" className={i === activeEvent ? 'event-rail-item is-active' : 'event-rail-item'} role="tab" aria-selected={i === activeEvent} aria-controls="event-details" key={item.title + i} onClick={() => setActiveEvent(i)}>
                <span className="event-rail-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="event-rail-title">{item.title}</span>
                <ArrowUpRight size={16} className="event-rail-arrow"/>
              </button>
            ))}
          </div>
          <article className="event-feature" id="event-details" role="tabpanel">
            <div className="event-feature-orb" aria-hidden="true"/>
            <div className="event-feature-top">
              <span className="event-kicker"><CalendarDays size={15}/> {currentEvent.date || 'Event highlight'}</span>
              <span className="event-count">{String(activeEvent + 1).padStart(2, '0')} / {String(eventItems.length).padStart(2, '0')}</span>
            </div>
            <div className="event-feature-content">
              <h3>{currentEvent.title}</h3>
              {currentEvent.company && <p className="event-organization"><Users size={15}/> {currentEvent.company}</p>}
              {currentEvent.description && <p className="event-description">{currentEvent.description}</p>}
              {currentEvent.highlight && <div className="event-impact"><span>MY CONTRIBUTION</span><p>{currentEvent.highlight}</p></div>}
            </div>
            <div className="event-feature-bottom">
              <span>LEADERSHIP · COLLABORATION · EXECUTION</span>
              <div className="event-feature-nav">
                <button type="button" aria-label="Previous event" disabled={activeEvent === 0} onClick={() => setActiveEvent((i) => Math.max(0, i - 1))}>←</button>
                <button type="button" aria-label="Next event" disabled={activeEvent >= eventItems.length - 1} onClick={() => setActiveEvent((i) => Math.min(eventItems.length - 1, i + 1))}>→</button>
              </div>
            </div>
          </article>
        </div>
      )}
    </div>
  </section>
  <section id="tools">
        <div className="wrap">
          <div className="sec-head" data-reveal>
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
          <div className="about-grid" data-reveal>
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
          <div className="contact-editorial" data-reveal>
            <div className="contact-meta">
              <p className="eyebrow">Let's connect</p>
              <span className="contact-index">06 / CONTACT</span>
            </div>
            <h2>
              Have a good idea?
              <span>Let's make it happen.</span>
            </h2>
            <div className="contact-bottom">
              <p className="muted">Open to opportunities, collaborations, and interesting problems worth solving.</p>
              <div className="contact-links">
                {safeMailto(profile.email) && (
                  <a className="contact-email-link" href={safeMailto(profile.email)} data-track="contact: email">
                    <span>Drop me a line</span>
                    <strong>{profile.email}</strong>
                    <ArrowRight size={22} aria-hidden="true" />
                  </a>
                )}
                <div className="contact-social-links">
                  <a href="https://www.linkedin.com/in/athena-picones-7554aa286/" data-track="contact: linkedin" target="_blank" rel="noopener noreferrer">
                    LinkedIn <span aria-hidden="true">↗</span>
                  </a>
                  {safeHref(profile.github) && (
                    <a href={safeHref(profile.github)} data-track="contact: github" target="_blank" rel="noopener noreferrer">
                      GitHub <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>


      <footer>
        <div className="wrap footer-content">
          <div className="footer-social-links" aria-label="Social links">
            {safeMailto(profile.email) && (
              <a href={safeMailto(profile.email)} aria-label="Email" data-track="footer: email">
                <FaEnvelope size={20} />
              </a>
            )}
            <a
              href="https://www.facebook.com/atheeeens"
              aria-label="Facebook"
              data-track="footer: facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="https://www.instagram.com/athenelytical/"
              aria-label="Instagram"
              data-track="footer: instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/athena-picones-7554aa286/"
              aria-label="LinkedIn"
              data-track="footer: linkedin"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn size={20} />
            </a>
            {safeHref(profile.github) && (
              <a
                href={safeHref(profile.github)}
                aria-label="GitHub"
                data-track="footer: github"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub size={20} />
              </a>
            )}
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} {profile.name}</span>
            {analyticsOn && <span>Privacy-friendly stats, no cookies</span>}
            <span>Built with React &amp; Google Sheets</span>
          </div>
        </div>
      </footer>
    </>
  )
}

const DEFAULTS = { profile: pf, social: sc, auto: au, experience: ex, leadershipEvents: le }

// Older browser caches may predate the Experience and Leadership & Events sections.
// Merge cached content with defaults so new arrays always exist on the first render.
function mergeCachedContent(cached) {
  if (!cached || typeof cached !== 'object') return DEFAULTS
  return {
    ...DEFAULTS,
    ...cached,
    profile: { ...DEFAULTS.profile, ...cached.profile },
    social: { ...DEFAULTS.social, ...cached.social },
    auto: { ...DEFAULTS.auto, ...cached.auto },
    experience: Array.isArray(cached.experience) ? cached.experience : DEFAULTS.experience,
    leadershipEvents: Array.isArray(cached.leadershipEvents) ? cached.leadershipEvents : DEFAULTS.leadershipEvents,
  }
}


export default function App() {
  const [content, setContent] = useState(() => mergeCachedContent(SHEET_ID && cachedContent()))
  // First-time visitors have no cached content yet, so show skeletons until the sheet answers (or 3 s pass).
  const [syncing, setSyncing] = useState(() => Boolean(SHEET_ID && !cachedContent()))

  useEffect(() => { document.documentElement.classList.toggle('syncing', syncing) }, [syncing])

  useEffect(() => {
    let active = true
    const stopSyncing = setTimeout(() => setSyncing(false), 3000)

    const refreshContent = async () => {
      try {
        const updatedContent = await loadSheetContent(DEFAULTS)
        if (active && updatedContent) {
          setContent(updatedContent)
        }
      } catch (error) {
        console.error('Failed to refresh portfolio content:', error)
      } finally {
        if (active) setSyncing(false)
      }
    }

    refreshContent()
    const interval = setInterval(refreshContent, 15000)

    return () => {
      active = false
      clearTimeout(stopSyncing)
      clearInterval(interval)
    }
  }, [])

  return <Portfolio content={content} />
}