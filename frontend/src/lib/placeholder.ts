export function placeholderImage(n: number): string {
  const num = String(n).padStart(2, '0')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2340FF"/><stop offset="1" stop-color="#6F86FF"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/><text x="48" y="170" font-family="monospace" font-size="120" fill="#fff" fill-opacity=".3">${num}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export function initialsImage(name: string) {
  const initials =
    name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').replace(/[^A-Za-z0-9]/g, '').toUpperCase() || '?'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2340FF"/><stop offset="1" stop-color="#6F86FF"/></linearGradient></defs><rect width="800" height="1000" fill="url(#g)"/><text x="400" y="580" text-anchor="middle" font-family="sans-serif" font-size="260" fill="#fff" fill-opacity=".9">${initials}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export function projectBannerPlaceholder(title: string, order: number = 1): string {
  const num = String(order).padStart(2, '0')
  const escapedTitle = title
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1E3AE8"/><stop offset="50%" stop-color="#2547FF"/><stop offset="100%" stop-color="#5874FF"/></linearGradient><pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M 48 0 L 0 0 0 48" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.1"/></pattern></defs><rect width="1200" height="675" fill="url(#bg)"/><rect width="1200" height="675" fill="url(#grid)"/><circle cx="1020" cy="180" r="260" fill="#FFFFFF" fill-opacity="0.08"/><text x="80" y="140" font-family="monospace" font-size="24" font-weight="600" fill="#EDEFFC" letter-spacing="4">PSG TECH · CSEA E-CELL · PROJECT ${num}</text><text x="80" y="320" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="700" fill="#FFFFFF">${escapedTitle}</text><rect x="80" y="365" width="100" height="4" rx="2" fill="#FFFFFF" fill-opacity="0.8"/><text x="80" y="560" font-family="monospace" font-size="20" fill="#EDEFFC" fill-opacity="0.8">PROJECT PREVIEW · OFFICIAL INITIATIVE</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}