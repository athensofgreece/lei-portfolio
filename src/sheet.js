import { SHEET_ID } from './sheet.config.js'

// Reads your Google Sheet (one tab per section) and returns updated content.
// If anything fails, the site quietly keeps using src/data.js.
const CACHE = 'portfolio-sheet-cache'
const ALIAS = { number: 'n', label: 'l' }
const LISTS = new Set(['steps'])
const split = (s) => s.split('|').map((x) => x.trim()).filter(Boolean)
const hidden = (v) => ['no', 'false', '0', 'hide'].includes((v || '').toLowerCase())

// tab name -> [section, field, column that must have text]
const COLLECTIONS = {
  social_projects: ['social', 'projects', 'title'],
  social_services: ['social', 'services', 'title'],
  social_stats: ['social', 'stats', 'l'],
  auto_services: ['auto', 'services', 'title'],
  auto_projects: ['auto', 'webProjects', 'title'],
  auto_demos: ['auto', 'demos', 'title'],
  auto_roadmap: ['auto', 'roadmap', 'tool'],
  auto_stats: ['auto', 'stats', 'l'],
}
// settings tab: key -> [section, field, isList]
const SETTINGS = {
  name: ['profile', 'name'], email: ['profile', 'email'], github: ['profile', 'github'], location: ['profile', 'location'],
  social_badge: ['social', 'badge'], social_headline: ['social', 'headline'], social_lede: ['social', 'lede'],
  social_about: ['social', 'about', true], social_tools: ['social', 'tools', true],
  auto_badge: ['auto', 'badge'], auto_headline: ['auto', 'headline'], auto_lede: ['auto', 'lede'], auto_about: ['auto', 'about', true],
}

function parseCsv(t) {
  const rows = []; let row = [], cell = '', q = false
  for (let i = 0; i < t.length; i++) {
    const c = t[i]
    if (q) { if (c === '"') { if (t[i + 1] === '"') { cell += '"'; i++ } else q = false } else cell += c }
    else if (c === '"') q = true
    else if (c === ',') { row.push(cell); cell = '' }
    else if (c === '\n' || c === '\r') { if (c === '\r' && t[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = '' }
    else cell += c
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row) }
  return rows
}

async function fetchTab(name, keyCol) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(name)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const rows = parseCsv(await res.text())
  const head = (rows[0] || []).map((h) => { const k = h.trim().toLowerCase(); return ALIAS[k] || k })
  // Google returns the first tab if a name is wrong, so make sure this is the right one
  if (!head.includes(keyCol)) throw new Error(`tab "${name}" not found or missing "${keyCol}" column`)
  return rows.slice(1).map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] || '').trim()])))
}

export const cachedContent = () => { try { return JSON.parse(localStorage.getItem(CACHE)) } catch { return null } }

export async function loadSheetContent(base) {
  if (!SHEET_ID) return null
  const out = JSON.parse(JSON.stringify(base)); let changed = false
  await Promise.all([
    ...Object.entries(COLLECTIONS).map(async ([tab, [a, b, key]]) => {
      try {
        const rows = (await fetchTab(tab, key)).filter((r) => r[key] && !hidden(r.show))
          .map((r) => Object.fromEntries(Object.entries(r).filter(([k]) => k !== 'show').map(([k, v]) => [k, LISTS.has(k) ? split(v) : v])))
        if (rows.length) { out[a][b] = rows; changed = true }
      } catch (e) { console.warn('[sheet]', tab, e.message) }
    }),
    (async () => {
      try {
        for (const r of await fetchTab('settings', 'key')) {
          const m = SETTINGS[r.key]; if (!m || !r.value) continue
          out[m[0]][m[1]] = m[2] ? split(r.value) : r.value; changed = true
        }
      } catch (e) { console.warn('[sheet] settings', e.message) }
    })(),
  ])
  if (!changed) return null
  try { localStorage.setItem(CACHE, JSON.stringify(out)) } catch {}
  return out
}
