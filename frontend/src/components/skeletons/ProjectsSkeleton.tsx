import { ArrowDown } from 'lucide-react'
import { Eyebrow } from '@/components/common/Eyebrow'
import { GridBackdrop } from '@/components/common/GridBackdrop'

export function ProjectsSkeleton() {
  return (
    <div
      className="projects-page min-h-screen bg-[var(--color-bg)] pb-24"
      aria-busy="true"
      aria-label="Loading projects..."
    >
      {/* 1. Header block */}
      <header className="projects-page-header relative pt-32 pb-12 md:pt-40 md:pb-16 text-center">
        <GridBackdrop className="opacity-40" />
        <div className="container-site relative z-10 flex flex-col items-center">
          <Eyebrow className="mb-4">OUR WORK</Eyebrow>
          <h1 className="font-display font-medium text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.03em] text-[var(--color-ink)] mb-6">
            Our <span className="text-[var(--color-blue)]">Projects</span>
          </h1>
          <p className="max-w-xl text-base md:text-lg text-[var(--color-ink-muted)] leading-relaxed">
            Ideas our students are building, from first sketch to working solution.
          </p>

          {/* Scroll hint */}
          <div className="mt-10 inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-ink-muted)] select-none">
            <span>SCROLL TO VIEW PROJECTS</span>
            <ArrowDown
              className="w-3.5 h-3.5 text-[var(--color-blue)] animate-bounce motion-reduce:animate-none"
              aria-hidden="true"
            />
          </div>
        </div>
      </header>

      {/* 2. Row: Sidebar + Stack Skeleton */}
      <div className="container-site mt-8 md:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(180px,240px)_minmax(0,1fr)] lg:gap-12 items-start">
          {/* Sidebar placeholder */}
          <aside className="hidden lg:block sticky top-[140px] self-start z-20 space-y-3 py-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-3 w-5 bg-slate-200 rounded animate-pulse" />
                <div
                  className="h-4 bg-slate-200 rounded animate-pulse"
                  style={{ width: `${80 + (i % 3) * 30}px` }}
                />
              </div>
            ))}
          </aside>

          {/* Stack Card Placeholder */}
          <div className="w-full min-w-0">
            <div className="w-full bg-white rounded-[24px] border border-[var(--color-hairline)] h-[min(60vh,420px)] lg:h-[min(56vh,380px)] p-[clamp(20px,3vw,40px)] shadow-[0_24px_60px_-28px_rgba(35,64,255,0.18)] animate-pulse flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row gap-6 h-full">
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div className="space-y-4">
                    <div className="h-4 w-24 bg-blue-100 rounded" />
                    <div className="h-8 w-3/4 bg-slate-200 rounded" />
                    <div className="space-y-2 pt-2">
                      <div className="h-4 w-full bg-slate-100 rounded" />
                      <div className="h-4 w-5/6 bg-slate-100 rounded" />
                      <div className="h-4 w-2/3 bg-slate-100 rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-32 bg-blue-200/60 rounded pt-4" />
                </div>
                <div className="hidden sm:block shrink-0 w-[180px] sm:w-[220px] md:w-[260px] lg:w-[280px] h-full rounded-2xl bg-slate-100 border border-[var(--color-hairline)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ProjectsSkeleton

