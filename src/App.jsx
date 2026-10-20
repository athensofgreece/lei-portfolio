import { useState, useLayoutEffect, useEffect, useCallback } from 'react'
import { flushSync } from 'react-dom'
import { profile as pf, social as sc, auto as au } from './data.js'
import { SHEET_ID } from './sheet.config.js'
import { loadSheetContent, cachedContent } from './sheet.js'
import { Timeline, Flow } from './components/Visuals.jsx'
import {
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
const KEY = 'portfolio-mode'

function initialMode() {
  try {
    const m = localStorage.getItem(KEY)
    if (m === 'light' || m === 'dark') return m
  } catch {}
  return 'light'
}

function Portfolio({ content }) {
  const { profile, social, auto } = content
  const [mode, setMode] = useState(initialMode)
  const [menuOpen, setMenuOpen] = useState(false)

  const isSocial = mode === 'light'
  const d = isSocial ? social : auto

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

      <nav>
        <div className="wrap navin">
          <b>{profile.name}</b>

          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>

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

          <div className="theme-switch-area">
            <div className="switch" role="group" aria-label="Choose portfolio focus">
              <button
                className="social-switch"
                aria-label="Social Media mode"
                aria-pressed={isSocial}
                data-tooltip="Switch to Creative & Marketing"
                onClick={(e) => switchMode('light', e)}
              >
                <Palette size={16} />
              </button>

              <button
                className="automation-switch"
                aria-label="Automation mode"
                aria-pressed={!isSocial}
                data-tooltip="Switch to Tech & Automation"
                onClick={(e) => switchMode('dark', e)}
              >
                <Code2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="wrap">
          <div className="grid">
            <div>
              <span className="badge">
                <i /> {d.badge}
              </span>
              <h1>{d.headline}</h1>
              <p className="lede">{d.lede}</p>
              <div className="btns">
                <a className="btn primary" href="#contact">
                  Work with me
                </a>
                <a className="btn" href="#work">
                  {isSocial ? 'See my work' : 'See my projects'}
                </a>
              </div>
            </div>
            {isSocial ? <Timeline /> : <Flow />}
          </div>
          <div className="stats">
            {d.stats.map((s) => (
              <div key={s.l}>
                <b>{s.n}</b>
                <span>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <section id="services">
        <div className="wrap">
          <h2>{isSocial ? 'What I do for you' : 'What I can build for you'}</h2>
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
              <h2>Selected work</h2>
              {social.projects.map((p) => (
                <article className="case" key={p.title}>
                  {p.image ? (
                    <div className="media has">
                      <img
                        src={/^https?:/.test(p.image) ? p.image : BASE + p.image}
                        alt={p.title}
                      />
                    </div>
                  ) : (
                    <div className="media">{p.placeholder}</div>
                  )}
                  <div>
                    <h3>{p.title}</h3>
                    <dl>
                      <dt>Client</dt>
                      <dd>{p.client}</dd>
                      <dt>The need</dt>
                      <dd>{p.need}</dd>
                      <dt>What I did</dt>
                      <dd>{p.did}</dd>
                      <dt>Tools</dt>
                      <dd>{p.tools}</dd>
                      <dt>Result</dt>
                      <dd className="result">{p.result}</dd>
                    </dl>
                    {p.link && (
                      <a
                        className="btn"
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View the work
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </>
          ) : (
            <>
              <h2>Websites I've built</h2>
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
              <h2 className="sub">Automation demos</h2>
              <p className="note">
                These proof-of-concept workflows demonstrate how I approach automation, streamline
                repetitive tasks, and connect everyday tools. Created as portfolio projects,
                they showcase my workflow design and problem-solving skills.
              </p>
              <div className="cards">
                {auto.demos.map((p) => (
                  <div className="card" key={p.title}>
                    <span className={`chip ${p.status === 'Live' ? 'ok' : ''}`}>{p.status}</span>
                    <h3>{p.title}</h3>
                    <div className="steps">
                      {p.steps.map((s, i) => (
                        <span key={s}>
                          {s}
                          {i < p.steps.length - 1 && <em>→</em>}
                        </span>
                      ))}
                    </div>
                    <p>{p.text}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2>{isSocial ? 'Tools I use' : 'My skills roadmap'}</h2>
          <div className="tools">
            {isSocial
              ? social.tools.map((t) => {
                  const Icon = getToolIcon(t)
                  return (
                    <span key={t}>
                      {Icon && <Icon className="tool-icon" aria-hidden="true" />}
                      <span className="tool-label">{t}</span>
                    </span>
                  )
                })
              : auto.roadmap.map((t) => {
                  const Icon = getToolIcon(t.tool)
                  return (
                    <span key={t.tool} className={t.level === 'Using' ? 'using' : ''}>
                      {Icon && <Icon className="tool-icon" aria-hidden="true" />}
                      <span className="tool-label">{t.tool}</span>
                      <em>{t.level}</em>
                    </span>
                  )
                })}
          </div>
        </div>
      </section>

      <section id="about">
        <div className="wrap">
          <h2>About me</h2>
          {d.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      <section id="contact">
        <div className="wrap">
          <h2>Let's work together</h2>
          <p className="muted">
            Tell me about your brand and what you need. I'll reply with how I can help.
          </p>
          <a className="mail" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <p style={{ marginTop: '1.5rem' }}>
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              github.com/athensofgreece
            </a>
          </p>
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
                href="https://www.linkedin.com/"
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
            <span>© 2026 Athena Madaleine Picones</span>
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