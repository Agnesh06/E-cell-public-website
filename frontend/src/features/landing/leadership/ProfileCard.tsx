import React, { useEffect, useRef } from 'react'

interface ProfileCardProps {
  name: string
  title: string
  subtitle?: string
  avatarUrl: string
  enableTilt?: boolean
  className?: string
}

const clamp = (v: number, min = 0, max = 100) => Math.min(Math.max(v, min), max)

export default function ProfileCard({
  name,
  title,
  subtitle,
  avatarUrl,
  enableTilt = true,
  className = '',
}: ProfileCardProps) {
  const shellRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const shell = shellRef.current
    if (!shell || !enableTilt) return undefined
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!canHover || reduced) return undefined

    let raf = 0
    const set = (px: number, py: number) => {
      shell.style.setProperty('--px', `${px}%`)
      shell.style.setProperty('--py', `${py}%`)
      shell.style.setProperty('--rx', `${((py - 50) / 50) * -6}deg`)
      shell.style.setProperty('--ry', `${((px - 50) / 50) * 6}deg`)
    }
    const onMove = (e: PointerEvent) => {
      const r = shell.getBoundingClientRect()
      const px = clamp(((e.clientX - r.left) / r.width) * 100)
      const py = clamp(((e.clientY - r.top) / r.height) * 100)
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => set(px, py))
    }
    const onEnter = () => shell.setAttribute('data-active', '')
    const onLeave = () => {
      cancelAnimationFrame(raf)
      shell.removeAttribute('data-active')
      set(50, 50)
    }
    shell.addEventListener('pointermove', onMove)
    shell.addEventListener('pointerenter', onEnter)
    shell.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      shell.removeEventListener('pointermove', onMove)
      shell.removeEventListener('pointerenter', onEnter)
      shell.removeEventListener('pointerleave', onLeave)
    }
  }, [enableTilt])

  return (
    <div className={`[perspective:900px] ${className}`}>
      <div
        ref={shellRef}
        className="group relative overflow-hidden rounded-[28px] border border-[var(--color-hairline)] bg-gradient-to-b from-white to-[var(--color-blue-ghost)] p-5 shadow-[0_24px_60px_-28px_rgba(35,64,255,0.35)] transition-transform duration-300 ease-out will-change-transform"
        style={
          {
            '--px': '50%',
            '--py': '50%',
            '--rx': '0deg',
            '--ry': '0deg',
            transform: 'rotateX(var(--rx)) rotateY(var(--ry))',
          } as React.CSSProperties
        }
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-data-[active]:opacity-100"
          style={{
            background:
              'radial-gradient(420px circle at var(--px) var(--py), rgba(255,255,255,0.7), transparent 60%)',
          }}
        />
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--color-blue-ghost)]">
          <img
            src={avatarUrl}
            alt={`Portrait of ${name}`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative mt-5 text-center">
          <h3 className="text-[clamp(1.35rem,2.6vw,1.8rem)] font-medium leading-tight text-[var(--color-ink)]">
            {name}
          </h3>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-blue)]">
            {title}
          </p>
          {subtitle && (
            <p className="mx-auto mt-2 max-w-[28ch] text-sm leading-snug text-[var(--color-ink-muted)]">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}