export function CollaborationSkeleton() {
  return (
    <section
      id="collaboration"
      className="min-h-screen w-full flex flex-col justify-center bg-transparent text-[#0A0A0A] py-10 sm:py-14 px-4 sm:px-6 relative overflow-visible snap-start scroll-mt-0"
      aria-busy="true"
      aria-label="Loading collaboration form..."
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mb-6">
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-[#0A0A0A] leading-tight">
            Let’s Build <span className="text-[#2547FF]">Together</span>
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-[#262626]/75 leading-relaxed max-w-lg mx-auto">
            Connect with student innovators and startups at PSG Tech.
          </p>
        </div>

        {/* Form Wizard Container */}
        <div className="w-full">
          {/* Stepper Steps Placeholder */}
          <div className="flex justify-between items-center mb-8 px-2 max-w-2xl mx-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600 animate-pulse">
                  {i}
                </div>
                <div className="hidden sm:block h-3 w-14 bg-slate-200 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Form Card Placeholder */}
          <div className="w-full min-h-[480px] rounded-2xl bg-white border border-[var(--color-hairline)] p-6 sm:p-10 shadow-xs animate-pulse">
            <div className="h-6 w-48 bg-slate-200 rounded mb-2" />
            <div className="h-4 w-72 bg-slate-100 rounded mb-8" />
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-slate-200 rounded" />
                <div className="h-11 w-full bg-slate-100 rounded-lg border border-[var(--color-hairline)]" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-28 bg-slate-200 rounded" />
                <div className="h-11 w-full bg-slate-100 rounded-lg border border-[var(--color-hairline)]" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-36 bg-slate-200 rounded" />
                <div className="h-11 w-full bg-slate-100 rounded-lg border border-[var(--color-hairline)]" />
              </div>
              <div className="flex justify-end pt-4">
                <div className="h-10 w-32 bg-[var(--color-blue)]/30 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default CollaborationSkeleton

