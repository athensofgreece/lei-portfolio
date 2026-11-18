// Anything typed into the Google Sheet is untrusted text. Links from it may only be web addresses
// (http or https), and email addresses must look like real emails. Anything else, such as
// "javascript:..." or "data:...", is dropped so it can never run when someone clicks it.

export const safeHref = (value) => {
  const v = String(value ?? '').trim()
  if (!v) return ''
  try {
    const u = new URL(v, window.location.href)
    return u.protocol === 'http:' || u.protocol === 'https:' ? v : ''
  } catch {
    return ''
  }
}

export const safeMailto = (email) => {
  const e = String(email ?? '').trim()
  return /^[^\s@<>"'`]+@[^\s@<>"'`]+\.[^\s@<>"'`]+$/.test(e) ? `mailto:${e}` : undefined
}
