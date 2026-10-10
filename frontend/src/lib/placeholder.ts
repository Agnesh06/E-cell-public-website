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