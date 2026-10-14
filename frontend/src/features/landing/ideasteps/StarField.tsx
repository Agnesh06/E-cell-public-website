import React, { useEffect, useRef, useState } from 'react'

interface Star {
  x: number
  y: number
  vx: number
  vy: number
  baseSpeed: number
  r: number
  baseOpacity: number
  opacity: number
  rotation: number
  rotationSpeed: number
  spawnTime: number
  fadingOut: boolean
  fadeStartTime: number
}

interface MergeRing {
  x: number
  y: number
  startTime: number
  duration: number
}

const BASE_STAR_RADIUS = 32

function parseRgb(color: string): [number, number, number] {
  const trimmed = color.trim()
  if (trimmed.startsWith('#')) {
    const hex = trimmed.slice(1)
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16),
        parseInt(hex[1] + hex[1], 16),
        parseInt(hex[2] + hex[2], 16),
      ]
    }
    if (hex.length >= 6) {
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
      ]
    }
  }
  const match = trimmed.match(/\d+/g)
  if (match && match.length >= 3) {
    return [parseInt(match[0], 10), parseInt(match[1], 10), parseInt(match[2], 10)]
  }
  return [37, 71, 255]
}

function createStarSprite(blueColor: string, outerRadius: number = BASE_STAR_RADIUS): HTMLCanvasElement {
  // Faint halo radius about 2.2 x star radius
  const haloRadius = outerRadius * 2.2
  const size = Math.ceil(haloRadius * 2) + 8
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const ctx = c.getContext('2d')
  if (!ctx) return c

  const cx = size / 2
  const cy = size / 2

  // 1. Faint halo behind each star: radial gradient from blue at 35% alpha to transparent
  const [r, g, b] = parseRgb(blueColor)
  const haloGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, haloRadius)
  haloGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.35)`)
  haloGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
  ctx.fillStyle = haloGrad
  ctx.beginPath()
  ctx.arc(cx, cy, haloRadius, 0, Math.PI * 2)
  ctx.fill()

  // 2. Five-point star: outer radius = star's radius; inner radius = 0.45 x outer
  // Points are sharp, with a small solid core
  const innerRadius = outerRadius * 0.45
  ctx.beginPath()
  for (let i = 0; i < 10; i++) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5
    const rad = i % 2 === 0 ? outerRadius : innerRadius
    const x = cx + Math.cos(angle) * rad
    const y = cy + Math.sin(angle) * rad
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fillStyle = blueColor
  ctx.fill()

  // Small solid core
  ctx.beginPath()
  ctx.arc(cx, cy, innerRadius * 0.75, 0, Math.PI * 2)
  ctx.fillStyle = blueColor
  ctx.fill()

  return c
}

function createInitialStars(count: number, width: number, height: number, now: number): Star[] {
  const stars: Star[] = []
  const w = Math.max(100, width)
  const h = Math.max(100, height)
  for (let i = 0; i < count; i++) {
    const r = 3 + Math.random() * 2 // 3 to 5 px
    const baseSpeed = 18 + Math.random() * 18 // 18 to 36 px/s
    const angle = Math.random() * Math.PI * 2
    const baseOpacity = 0.6 + Math.random() * 0.3 // 0.6 to 0.9
    const rotation = Math.random() * Math.PI * 2
    const rotSpeedDeg = 20 + Math.random() * 20 // 20 to 40 deg/s
    const rotationSpeed = ((rotSpeedDeg * Math.PI) / 180) * (Math.random() < 0.5 ? -1 : 1)
    const x = r + Math.random() * (w - 2 * r)
    const y = r + Math.random() * (h - 2 * r)
    stars.push({
      x,
      y,
      vx: Math.cos(angle) * baseSpeed,
      vy: Math.sin(angle) * baseSpeed,
      baseSpeed,
      r,
      baseOpacity,
      opacity: baseOpacity,
      rotation,
      rotationSpeed,
      spawnTime: now - 1000, // past grace period at start
      fadingOut: false,
      fadeStartTime: 0,
    })
  }
  return stars
}

function mergeStars(
  star1: Star,
  star2: Star,
  stars: Star[],
  rings: MergeRing[],
  now: number,
  width: number,
  height: number,
) {
  star1.fadingOut = true
  star1.fadeStartTime = now
  star2.fadingOut = true
  star2.fadeStartTime = now

  const mx = (star1.x + star2.x) / 2
  const my = (star1.y + star2.y) / 2

  rings.push({
    x: mx,
    y: my,
    startTime: now,
    duration: 450,
  })

  const largerR = Math.max(star1.r, star2.r)
  const childR = Math.max(2.2, 0.6 * largerR)
  const randomAngle = Math.random() * Math.PI * 2

  const newChildren: Star[] = []
  for (let i = 0; i < 3; i++) {
    const dir = randomAngle + i * ((2 * Math.PI) / 3)
    const speed = 18 + Math.random() * 18
    const baseOpacity = 0.6 + Math.random() * 0.3
    const rotation = Math.random() * Math.PI * 2
    const rotSpeedDeg = 20 + Math.random() * 20
    const rotationSpeed = ((rotSpeedDeg * Math.PI) / 180) * (Math.random() < 0.5 ? -1 : 1)
    const cx = Math.max(childR, Math.min(width - childR, mx + Math.cos(dir) * 14))
    const cy = Math.max(childR, Math.min(height - childR, my + Math.sin(dir) * 14))
    newChildren.push({
      x: cx,
      y: cy,
      vx: Math.cos(dir) * speed,
      vy: Math.sin(dir) * speed,
      baseSpeed: speed,
      r: childR,
      baseOpacity,
      opacity: 0,
      rotation,
      rotationSpeed,
      spawnTime: now,
      fadingOut: false,
      fadeStartTime: 0,
    })
  }

  // Population cap: at most 40 alive stars (fading stars do not count)
  const otherAliveStars = stars.filter((s) => !s.fadingOut && s !== star1 && s !== star2)
  const newAliveCount = otherAliveStars.length + 3

  if (newAliveCount > 40) {
    otherAliveStars.sort((a, b) => a.spawnTime - b.spawnTime)
    const excess = newAliveCount - 40
    for (let k = 0; k < excess && k < otherAliveStars.length; k++) {
      otherAliveStars[k].fadingOut = true
      otherAliveStars[k].fadeStartTime = now
    }
  }

  stars.push(...newChildren)
}

function forceMergeTwoNearest(
  stars: Star[],
  rings: MergeRing[],
  now: number,
  width: number,
  height: number,
) {
  const aliveStars = stars.filter((s) => !s.fadingOut)
  if (aliveStars.length < 2) return

  let minDist = Infinity
  let pair: [Star, Star] | null = null

  for (let i = 0; i < aliveStars.length; i++) {
    for (let j = i + 1; j < aliveStars.length; j++) {
      const dx = aliveStars[i].x - aliveStars[j].x
      const dy = aliveStars[i].y - aliveStars[j].y
      const dist = Math.hypot(dx, dy)
      if (dist < minDist) {
        minDist = dist
        pair = [aliveStars[i], aliveStars[j]]
      }
    }
  }

  if (pair) {
    mergeStars(pair[0], pair[1], stars, rings, now, width, height)
  }
}

export const StarField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return
    const canvas = canvasRef.current
    if (!canvas) return

    const stageEl = canvas.parentElement || canvas
    const computedBlue =
      getComputedStyle(stageEl).getPropertyValue('--color-blue').trim() || '#2340FF'
    const sprite = createStarSprite(computedBlue, BASE_STAR_RADIUS)

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const initialW = stageEl.clientWidth || 1280
    const initialH = stageEl.clientHeight || 720
    const stageSize = { width: initialW, height: initialH }

    const stars: Star[] = createInitialStars(28, initialW, initialH, performance.now())
    const rings: MergeRing[] = []

    let lastTime = performance.now()
    let lastScrollY = window.scrollY
    let smoothedSpeed = 0
    let lastAttrUpdateTime = 0
    let rafId = 0
    let isIntersecting = false

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = Math.round(initialW * dpr)
    canvas.height = Math.round(initialH * dpr)
    canvas.style.width = `${initialW}px`
    canvas.style.height = `${initialH}px`

    if (import.meta.env.DEV) {
      canvas.setAttribute('data-stars-alive', '28')
      canvas.setAttribute('data-stars-total', '28')
      canvas.setAttribute('data-speed-factor', '1.00')
      canvas.setAttribute('data-sprite-size', String(sprite.width))
      canvas.setAttribute('data-sprite-radius', String(BASE_STAR_RADIUS))
      ;(canvas as unknown as { __starSprite?: HTMLCanvasElement; __starBaseRadius?: number }).__starSprite = sprite
      ;(canvas as unknown as { __starSprite?: HTMLCanvasElement; __starBaseRadius?: number }).__starBaseRadius = BASE_STAR_RADIUS
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect
        if (newW <= 0 || newH <= 0) continue

        const oldW = stageSize.width
        const oldH = stageSize.height

        stageSize.width = newW
        stageSize.height = newH

        const currentDpr = Math.min(2, window.devicePixelRatio || 1)
        canvas.width = Math.round(newW * currentDpr)
        canvas.height = Math.round(newH * currentDpr)
        canvas.style.width = `${newW}px`
        canvas.style.height = `${newH}px`

        if (oldW > 0 && oldH > 0) {
          const sx = newW / oldW
          const sy = newH / oldH
          stars.forEach((star) => {
            star.x *= sx
            star.y *= sy
          })
          rings.forEach((ring) => {
            ring.x *= sx
            ring.y *= sy
          })
        }
      }
    })

    resizeObserver.observe(stageEl)

    const handleForceMergeEvent = () => {
      const now = performance.now()
      forceMergeTwoNearest(stars, rings, now, stageSize.width, stageSize.height)
      if (import.meta.env.DEV) {
        const aliveCount = stars.filter((s) => !s.fadingOut).length
        canvas.setAttribute('data-stars-alive', String(aliveCount))
        canvas.setAttribute('data-stars-total', String(stars.length))
      }
    }

    if (import.meta.env.DEV) {
      canvas.addEventListener('stars:force-merge', handleForceMergeEvent)
    }

    const render = () => {
      const now = performance.now()
      const rawDt = (now - lastTime) / 1000
      lastTime = now
      const dt = Math.min(0.05, rawDt)

      const currentScrollY = window.scrollY
      const scrollDelta = Math.abs(currentScrollY - lastScrollY)
      lastScrollY = currentScrollY

      const rawSpeed = dt > 0 ? scrollDelta / dt : 0
      const tau = rawSpeed > smoothedSpeed ? 0.12 : 0.55
      const alpha = 1 - Math.exp(-dt / tau)
      smoothedSpeed += (rawSpeed - smoothedSpeed) * alpha
      if (smoothedSpeed < 2) smoothedSpeed = 0

      const speedFactor = 1 + Math.min(3, smoothedSpeed / 1500)

      const { width, height } = stageSize

      // 1. Collision pass: alive stars merge when distance < sum of radii and not in grace period
      const aliveStars = stars.filter((s) => !s.fadingOut)
      for (let i = 0; i < aliveStars.length; i++) {
        const s1 = aliveStars[i]
        if (s1.fadingOut) continue
        if (now - s1.spawnTime < 800) continue

        for (let j = i + 1; j < aliveStars.length; j++) {
          const s2 = aliveStars[j]
          if (s2.fadingOut) continue
          if (now - s2.spawnTime < 800) continue

          const dx = s1.x - s2.x
          const dy = s1.y - s2.y
          const dist = Math.hypot(dx, dy)
          if (dist < s1.r + s2.r) {
            mergeStars(s1, s2, stars, rings, now, width, height)
            break
          }
        }
      }

      // 2. Movement pass & opacity update
      for (let i = stars.length - 1; i >= 0; i--) {
        const star = stars[i]
        if (star.fadingOut) {
          const fadeElapsed = now - star.fadeStartTime
          if (fadeElapsed >= 500) {
            stars.splice(i, 1)
            continue
          }
          star.opacity = star.baseOpacity * (1 - fadeElapsed / 500)
        } else {
          const spawnElapsed = now - star.spawnTime
          if (spawnElapsed < 500) {
            star.opacity = star.baseOpacity * (spawnElapsed / 500)
          } else {
            star.opacity = star.baseOpacity
          }
        }

        star.rotation += star.rotationSpeed * dt
        star.x += star.vx * speedFactor * dt
        star.y += star.vy * speedFactor * dt

        // Bounce off bounds with random angle change up to 10 deg (10 * pi / 180)
        const maxAngleDelta = (10 * Math.PI) / 180
        if (star.x - star.r < 0) {
          star.x = star.r
          star.vx = Math.abs(star.vx)
          const angle = Math.atan2(star.vy, star.vx) + (Math.random() - 0.5) * 2 * maxAngleDelta
          star.vx = Math.cos(angle) * star.baseSpeed
          star.vy = Math.sin(angle) * star.baseSpeed
        } else if (star.x + star.r > width) {
          star.x = width - star.r
          star.vx = -Math.abs(star.vx)
          const angle = Math.atan2(star.vy, star.vx) + (Math.random() - 0.5) * 2 * maxAngleDelta
          star.vx = Math.cos(angle) * star.baseSpeed
          star.vy = Math.sin(angle) * star.baseSpeed
        }

        if (star.y - star.r < 0) {
          star.y = star.r
          star.vy = Math.abs(star.vy)
          const angle = Math.atan2(star.vy, star.vx) + (Math.random() - 0.5) * 2 * maxAngleDelta
          star.vx = Math.cos(angle) * star.baseSpeed
          star.vy = Math.sin(angle) * star.baseSpeed
        } else if (star.y + star.r > height) {
          star.y = height - star.r
          star.vy = -Math.abs(star.vy)
          const angle = Math.atan2(star.vy, star.vx) + (Math.random() - 0.5) * 2 * maxAngleDelta
          star.vx = Math.cos(angle) * star.baseSpeed
          star.vy = Math.sin(angle) * star.baseSpeed
        }
      }

      // Update rings
      for (let i = rings.length - 1; i >= 0; i--) {
        if (now - rings[i].startTime >= rings[i].duration) {
          rings.splice(i, 1)
        }
      }

      // Dev attribute updates (at most every 100ms)
      if (import.meta.env.DEV) {
        if (now - lastAttrUpdateTime >= 100) {
          lastAttrUpdateTime = now
          const aliveCount = stars.filter((s) => !s.fadingOut).length
          canvas.setAttribute('data-stars-alive', String(aliveCount))
          canvas.setAttribute('data-stars-total', String(stars.length))
          canvas.setAttribute('data-speed-factor', speedFactor.toFixed(2))
        }
      }

      // 3. Render pass
      const currentDpr = Math.min(2, window.devicePixelRatio || 1)
      ctx.save()
      ctx.scale(currentDpr, currentDpr)
      ctx.clearRect(0, 0, width, height)

      // Rings
      for (const ring of rings) {
        const progress = (now - ring.startTime) / ring.duration
        if (progress < 1) {
          const r = progress * 28
          const alpha = 0.5 * (1 - progress)
          ctx.save()
          ctx.beginPath()
          ctx.arc(ring.x, ring.y, r, 0, Math.PI * 2)
          ctx.strokeStyle = computedBlue
          ctx.lineWidth = 1.5
          ctx.globalAlpha = alpha
          ctx.stroke()
          ctx.restore()
        }
      }

      // Stars
      for (const star of stars) {
        if (star.opacity <= 0.001) continue
        const destSize = (sprite.width * star.r) / BASE_STAR_RADIUS
        ctx.save()
        ctx.translate(star.x, star.y)
        ctx.rotate(star.rotation)
        ctx.globalAlpha = star.opacity
        ctx.drawImage(
          sprite,
          -destSize / 2,
          -destSize / 2,
          destSize,
          destSize,
        )
        ctx.restore()
      }

      ctx.restore()

      rafId = requestAnimationFrame(render)
    }

    const startLoop = () => {
      if (!rafId) {
        lastTime = performance.now()
        lastScrollY = window.scrollY
        rafId = requestAnimationFrame(render)
      }
    }

    const stopLoop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = 0
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isIntersecting = entry.isIntersecting
          if (isIntersecting && !document.hidden) {
            startLoop()
          } else {
            stopLoop()
          }
        }
      },
      { threshold: 0.01 },
    )

    io.observe(stageEl)

    const handleVisibility = () => {
      if (!document.hidden && isIntersecting) {
        startLoop()
      } else {
        stopLoop()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      stopLoop()
      io.disconnect()
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      if (import.meta.env.DEV) {
        canvas.removeEventListener('stars:force-merge', handleForceMergeEvent)
      }
    }
  }, [prefersReducedMotion])

  if (prefersReducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      className="star-field-canvas absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  )
}

export default StarField
