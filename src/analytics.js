import { GOATCOUNTER_CODE } from './analytics.config.js'

const code = String(GOATCOUNTER_CODE || '').trim()
export const analyticsOn = /^[a-z0-9-]{2,}$/i.test(code)

// Send one named event (for example "cta: work with me"). Never throws, and does nothing if analytics is off.
export function track(name) {
  try {
    const gc = window.goatcounter
    if (gc && typeof gc.count === 'function') gc.count({ path: name, title: name, event: true })
  } catch {
    /* analytics must never break the page */
  }
}

export function initAnalytics() {
  if (!analyticsOn) return
  // Respect visitors who ask not to be tracked (Do Not Track or Global Privacy Control)
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl) return
  if (document.querySelector('script[data-goatcounter]')) return
  const s = document.createElement('script')
  s.async = true
  s.src = 'https://gc.zgo.at/count.js'
  s.dataset.goatcounter = `https://${code}.goatcounter.com/count`
  document.head.appendChild(s)
  // Any element with a data-track="name" attribute reports a click as an event
  document.addEventListener('click', (e) => {
    const el = e.target instanceof Element ? e.target.closest('[data-track]') : null
    if (el) track(el.dataset.track)
  })
}
