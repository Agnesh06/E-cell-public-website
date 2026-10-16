export function TeamSkeleton() {
  return (
    <div
      className="min-h-screen bg-[var(--color-bg)] pt-24 pb-20 sm:pt-28"
      aria-busy="true"
      aria-label="Loading team directory..."
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-[var(--color-blue-ghost)]/60 blur-[120px]" />
        <div className="absolute top-1/3 -left-40 h-[450px] w-[450px] rounded-full bg-blue-100/40 blur-[100px]" />
      </div>

      <div className="container-site relative z-10">
        {/* Main Header */}
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <h1 className="text-[clamp(2.25rem,4.5vw,3.75rem)] font-light leading-tight tracking-[-0.03em] text-[var(--color-ink)]">
            Our <span className="text-[var(--color-blue)] font-normal">People</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[var(--color-ink-muted)]">
            Explore the people behind our community. Navigate through folders to meet our leads and member wings.
          </p>
        </div>

        {/* macOS Finder Window Frame */}
        <div className="mx-auto w-full max-w-6xl rounded-2xl sm:rounded-3xl border border-[var(--color-hairline)] bg-white/85 shadow-[0_20px_50px_-15px_rgba(37,71,255,0.08)] backdrop-blur-xl overflow-hidden flex flex-col min-h-[640px]">
          {/* macOS Finder Toolbar */}
          <div className="flex h-14 items-center justify-between border-b border-[var(--color-hairline)] px-4 sm:px-6 bg-slate-50/60">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
              <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
              <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
              <div className="ml-4 h-4 w-28 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="h-8 w-40 sm:w-56 bg-slate-200/80 rounded-lg animate-pulse" />
          </div>

          {/* macOS Finder Body */}
          <div className="grid flex-1 grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] min-h-[580px]">
            {/* Sidebar */}
            <div className="hidden md:block border-r border-[var(--color-hairline)] p-4 space-y-3 bg-slate-50/30">
              <div className="h-3 w-16 bg-slate-200 rounded animate-pulse mb-3" />
              <div className="h-8 w-full bg-blue-100/60 rounded-lg animate-pulse" />
              <div className="h-8 w-full bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-8 w-full bg-slate-100 rounded-lg animate-pulse" />
            </div>

            {/* Folder Grid Skeleton */}
            <div className="p-6 sm:p-8 flex-1">
              <div className="mb-6 flex items-center justify-between border-b border-[var(--color-hairline)] pb-3">
                <div className="h-3.5 w-24 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-blue-100 rounded-full animate-pulse" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-48 rounded-2xl border border-[var(--color-hairline)] bg-white p-6 shadow-xs animate-pulse flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-blue-100 shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="h-5 w-24 bg-slate-200 rounded" />
                        <div className="h-3.5 w-16 bg-slate-100 rounded" />
                      </div>
                    </div>
                    <div className="space-y-1.5 pt-4 border-t border-slate-100">
                      <div className="h-3 w-full bg-slate-100 rounded" />
                      <div className="h-3 w-3/4 bg-slate-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default TeamSkeleton

