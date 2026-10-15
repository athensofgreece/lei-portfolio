import { useState, useLayoutEffect, useEffect } from 'react'
import { flushSync } from 'react-dom'
import { profile as pf, social as sc, auto as au } from './data.js'
import { SHEET_ID } from './sheet.config.js'
import { loadSheetContent, cachedContent } from './sheet.js'
import { Timeline, Flow } from './components/Visuals.jsx'
import { Code2, Palette, Scissors, BriefcaseBusiness } from 'lucide-react'
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
  SiJavascript,
} from 'react-icons/si'

const BASE = import.meta.env.BASE_URL
const KEY = 'portfolio-mode'

function initialMode() {
  try { const m = localStorage.getItem(KEY); if (m === 'light' || m === 'dark') return m } catch {}
  return 'light'
}

function Portfolio({ content }) {
  const { profile, social, auto } = content
  const [mode, setMode] = useState(initialMode)
  const isSocial = mode === 'light'
  const d = isSocial ? social : auto

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = mode
    try { localStorage.setItem(KEY, mode) } catch {}
  }, [mode])

  // Circular reveal from the clicked button (falls back to an instant switch)
  function switchMode(next, e) {
    if (next === mode) return
    const apply = () => flushSync(() => setMode(next))
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduced) return apply()
    const x = e.clientX, y = e.clientY
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    const t = document.startViewTransition(apply)
    t.ready.then(() => document.documentElement.animate(
      { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 650, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
    ))
  }

  
function getToolIcon(tool) {
  const name = tool.toLowerCase()

  if (name.includes('capcut')) return Scissors
  if (name.includes('canva')) return Palette
  if (name.includes('figma')) return SiFigma
  if (name.includes('tiktok')) return SiTiktok
  if (name.includes('facebook')) return SiFacebook
  if (name.includes('google sheets')) return SiGooglesheets
  if (name.includes('google')) return SiGoogle
  if (name.includes('microsoft')) return BriefcaseBusiness
  if (name.includes('zapier')) return SiZapier
  if (name.includes('make')) return SiMake
  if (name.includes('airtable')) return SiAirtable
  if (name.includes('notion')) return SiNotion
  if (name.includes('react')) return SiReact
  if (name.includes('html')) return SiHtml5
  if (name.includes('css')) return Code2
  if (name.includes('javascript')) return SiJavascript
  if (name.includes('capcut')) return Scissors
  if (name.includes('microsoft')) return BriefcaseBusiness
  if (name.includes('canva')) return Palette
  if (name.includes('css')) return Code2
  return null
}


  return (
    <>
      {isSocial && (
        <div className="nuda-gradient-aurora" aria-hidden="true" />
      )}
      

      <nav>
        <div className="wrap navin">
          <b>{profile.name}</b>
          <ul>
            <li><a href="#services">Services</a></li>
            <li><a href="#work">{isSocial ? 'Work' : 'Projects'}</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div className="switch" role="group" aria-label="Choose portfolio focus">
            <button className="social-switch" aria-label="Social Media mode" aria-pressed={isSocial} onClick={(e) => switchMode('light', e)}>
              <Palette size={16}/><span>Social Media</span>
            </button>
            <button className="automation-switch" aria-label="Automation mode" aria-pressed={!isSocial} onClick={(e) => switchMode('dark', e)}>
              <Code2 size={16} />
              <span>Automation</span>
            </button>
          </div>

        </div>
      </nav>

      <header className="hero"><div className="wrap">
        <div className="grid">
          <div>
            <span className="badge"><i /> {d.badge}</span>
            <h1>{d.headline}</h1>
            <p className="lede">{d.lede}</p>
            <div className="btns">
              <a className="btn primary" href="#contact">Work with me</a>
              <a className="btn" href="#work">{isSocial ? 'See my work' : 'See my projects'}</a>
            </div>
          </div>
          {isSocial ? <Timeline /> : <Flow />}
        </div>
        <div className="stats">
          {d.stats.map((s) => <div key={s.l}><b>{s.n}</b><span>{s.l}</span></div>)}
        </div>
      </div></header>

      <section id="services"><div className="wrap">
        <h2>{isSocial ? 'What I do for you' : 'What I can build for you'}</h2>
        <div className={`cards c${d.services.length}`}>
          {d.services.map((s) => (
            <div className="card" key={s.title}>
              {s.status && <span className={`chip ${s.status === 'Available' ? 'ok' : ''}`}>{s.status}</span>}
              <h3>{s.title}</h3><p>{s.text}</p>
            </div>
          ))}
        </div>
      </div></section>

      <section id="work"><div className="wrap">
        {isSocial ? <>
          <h2>Selected work</h2>
          {social.projects.map((p) => (
            <article className="case" key={p.title}>
              {p.image
                ? <div className="media has"><img src={/^https?:/.test(p.image) ? p.image : BASE + p.image} alt={p.title} /></div>
                : <div className="media">{p.placeholder}</div>}
              <div>
                <h3>{p.title}</h3>
                <dl>
                  <dt>Client</dt><dd>{p.client}</dd>
                  <dt>The need</dt><dd>{p.need}</dd>
                  <dt>What I did</dt><dd>{p.did}</dd>
                  <dt>Tools</dt><dd>{p.tools}</dd>
                  <dt>Result</dt><dd className="result">{p.result}</dd>
                </dl>
                {p.link && <a className="btn" href={p.link} target="_blank" rel="noopener noreferrer">View the work</a>}
              </div>
            </article>
          ))}
        </> : <>
          <h2>Websites I've built</h2>
          <div className="cards c2">
            {auto.webProjects.map((p) => (
              <div className="card" key={p.title}>
                <span className="chip ok">{p.status}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <p className="stack">{p.stack}</p>
                {p.link && <a className="btn" href={p.link} target="_blank" rel="noopener noreferrer">Visit site</a>}
              </div>
            ))}
          </div>
          <h2 className="sub">Automation demos</h2>
          <p className="note">These are demo workflows I'm building while I train. They are not client projects.</p>
          <div className="cards c3">
            {auto.demos.map((p) => (
              <div className="card" key={p.title}>
                <span className={`chip ${p.status === 'Live' ? 'ok' : ''}`}>{p.status}</span>
                <h3>{p.title}</h3>
                <div className="steps">{p.steps.map((s, i) => <span key={s}>{s}{i < p.steps.length - 1 && <em>→</em>}</span>)}</div>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </>}
      </div></section>

      
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
                <span
                  key={t.tool}
                  className={t.level === 'Using' ? 'using' : ''}
                >
                  {Icon && <Icon className="tool-icon" aria-hidden="true" />}
                  <span className="tool-label">{t.tool}</span>
                  <em>{t.level}</em>
                </span>
              )
            })}
          </div>
        </div>
      </section>


      <section id="about"><div className="wrap">
        <h2>About me</h2>
        {d.about.map((p) => <p key={p}>{p}</p>)}
      </div></section>

      <section id="contact"><div className="wrap">
        <h2>Let's work together</h2>
        <p className="muted">Tell me about your brand and what you need. I'll reply with how I can help.</p>
        <a className="mail" href={`mailto:${profile.email}`}>{profile.email}</a>
        <p style={{ marginTop: '1.5rem' }}><a href={profile.github} target="_blank" rel="noopener noreferrer">github.com/athensofgreece</a></p>
      </div></section>

      <footer><div className="wrap">{profile.name} | {profile.location}</div></footer>
    </>
  )
}

const defaults = { profile: pf, social: sc, auto: au }

export default function App() {
  // Show the last sheet content (or data.js) instantly, then refresh from the sheet
  const [content, setContent] = useState(() => (SHEET_ID && cachedContent()) || defaults)
  
  useEffect(() => {
    let on = true
    const refreshContent = async () => {
      try {
        const updatedContent = await loadSheetContent(defaults) 
        if (on && updatedContent){
          setContent(updatedContent)
        }
      } catch (error) {
        console.error('Failed to refresh portfolio content:', error)
      }
    }
    refreshContent()

    const interval = setInterval(refreshContent, 15000)

    return () => {
      on = false
      clearInterval(interval)
    }
  }, [])
  return <Portfolio content={content} />
}
