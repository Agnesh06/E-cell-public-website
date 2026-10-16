export function ProjectDetailSkeleton() {
  return (
    <div
      className="project-detail-page min-h-screen bg-[var(--color-bg)] pt-32 pb-20"
      aria-busy="true"
      aria-label="Loading project details..."
    >
      <div className="container-site max-w-5xl">
        {/* Breadcrumb line */}
        <div className="mb-6 flex items-center gap-2 text-xs font-mono text-[var(--color-ink-muted)]">
          <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
          <span>/</span>
          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="h-4 w-24 bg-blue-100 rounded mb-3 animate-pulse" />
          <div className="h-10 sm:h-12 w-2/3 bg-slate-200 rounded mb-4 animate-pulse" />
          <div className="h-5 w-4/5 bg-slate-100 rounded animate-pulse" />
        </div>

        {/* Media Banner with aspect ratio */}
        <div className="w-full aspect-[16/9] sm:aspect-[21/10] rounded-2xl md:rounded-3xl border border-[var(--color-hairline)] bg-slate-200/60 mb-10 animate-pulse" />

        {/* Content sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 min-h-[220px] rounded-2xl bg-white border border-[var(--color-hairline)] p-6 space-y-4 animate-pulse">
            <div className="h-5 w-32 bg-slate-200 rounded" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="h-4 w-5/6 bg-slate-100 rounded" />
              <div className="h-4 w-3/4 bg-slate-100 rounded" />
            </div>
          </div>
          <div className="min-h-[220px] rounded-2xl bg-white border border-[var(--color-hairline)] p-6 space-y-4 animate-pulse">
            <div className="h-5 w-28 bg-slate-200 rounded" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="h-4 w-2/3 bg-slate-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ProjectDetailSkeleton

