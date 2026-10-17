import { useState } from 'react'
import { useParams, Link } from 'react-router'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Layers,
  Compass,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import { useSheetData } from '@/lib/useSheetData'
import { projectBannerPlaceholder } from '@/lib/placeholder'
import { Button } from '@/components/common/Button'
import { Eyebrow } from '@/components/common/Eyebrow'
import { GridBackdrop } from '@/components/common/GridBackdrop'
import { usePageTitle } from '@/hooks/usePageTitle'
import { ProjectDetailSkeleton } from '@/components/skeletons/ProjectDetailSkeleton'

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: projectsData, status } = useSheetData('projects')
  const [imageError, setImageError] = useState(false)

  const project =
    status === 'loading' ? undefined : slug ? projectsData.find((p) => p.slug === slug) : undefined

  usePageTitle(project ? project.title : 'Project Details')

  if (status === 'loading') {
    return <ProjectDetailSkeleton />
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] pt-32 pb-20">
        <div className="container-site max-w-3xl text-center py-16">
          <Eyebrow className="mb-4">PROJECT DIRECTORY</Eyebrow>
          <h1 className="font-display font-medium text-4xl sm:text-5xl text-[var(--color-ink)] mb-4 tracking-tight">
            Project Details
          </h1>
          <div className="mt-8 p-8 sm:p-12 bg-white rounded-3xl border border-[var(--color-hairline)] shadow-sm">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[var(--color-blue-ghost)] flex items-center justify-center text-[var(--color-blue)]">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-medium text-[var(--color-ink)] mb-3">
              Project Not Found
            </h2>
            <p className="text-[var(--color-ink-muted)] max-w-md mx-auto mb-8 leading-relaxed">
              We couldn&apos;t find a project matching{' '}
              <code className="px-2 py-1 bg-slate-100 rounded text-sm font-mono text-[var(--color-ink)]">
                /{slug}
              </code>
              . It may have been renamed or moved.
            </p>
            <Button to="/projects" variant="primary" withArrow>
              Back to All Projects
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const sortedProjects = [...projectsData].sort((a, b) => a.order - b.order)
  const currentIndex = sortedProjects.findIndex((p) => p.slug === project.slug)
  const prev = currentIndex > 0 ? sortedProjects[currentIndex - 1] : undefined
  const next = currentIndex < sortedProjects.length - 1 ? sortedProjects[currentIndex + 1] : undefined

  const isImagePlaceholder = !project.image || imageError
  const displayedImage = isImagePlaceholder
    ? projectBannerPlaceholder(project.title, project.order)
    : project.image

  const isTechnical =
    project.kind !== undefined
      ? project.kind === 'technical'
      : project.techOrApproach?.type !== 'approach'

  const feasibilityText =
    typeof project.feasibility === 'string'
      ? project.feasibility
      : project.feasibility?.summaryAssessment || 'Feasibility analysis underway.'

  const changeText =
    project.change ||
    project.impact?.changeStatement ||
    'Project outcomes and campus community impact.'

  const stackItems: string[] =
    project.stack && project.stack.length > 0
      ? project.stack
      : project.techOrApproach?.items?.map((item) => item.name) || []

  return (
    <div className="project-detail-page min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)] selection:bg-[var(--color-blue-ghost)]">
      {/* Top Banner / Breadcrumb & Header */}
      <header className="relative pt-28 pb-10 md:pt-36 md:pb-14 border-b border-[var(--color-hairline)] overflow-hidden">
        <GridBackdrop className="opacity-30" />
        <div className="container-site relative z-10">
          {/* Breadcrumb row */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-blue)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-blue)] rounded py-1 px-1.5 -ml-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Projects</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-[var(--color-blue-ghost)] text-[var(--color-blue)] font-semibold tracking-wider uppercase">
                Project #{String(project.order).padStart(2, '0')}
              </span>
              <span className="font-mono text-xs px-2.5 py-1 rounded-full border border-[var(--color-hairline)] bg-white text-[var(--color-ink-muted)] uppercase">
                {project.status || 'Ongoing'}
              </span>
            </div>
          </div>

          {/* Title Header */}
          <div className="max-w-4xl">
            <Eyebrow className="mb-3">PROJECT DETAILS</Eyebrow>
            <h1 className="font-display font-medium text-[clamp(2.25rem,5vw,4rem)] text-[var(--color-ink)] leading-[1.05] tracking-tight mb-4">
              {project.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[var(--color-ink-muted)] leading-relaxed max-w-3xl">
              {project.summary}
            </p>

            {/* Tags & Lead */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {project.lead && (
                <>
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-ink-faint)] mr-1">
                    Lead:
                  </span>
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-white border border-[var(--color-hairline)] text-[var(--color-ink)] mr-3">
                    {project.lead}
                  </span>
                </>
              )}
              {project.tags && project.tags.length > 0 && (
                <>
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-ink-faint)] mr-1">
                    Tags:
                  </span>
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-3 py-1 rounded-full bg-[var(--color-blue-ghost)] text-[var(--color-blue)]"
                    >
                      {tag}
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Project Details */}
      <div className="container-site max-w-5xl py-12 md:py-16 space-y-12 md:space-y-16">
        {/* 1. PROJECT IMAGE */}
        <section
          data-detail-item="1"
          aria-labelledby="detail-heading-image"
          className="space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-blue)] font-semibold">
              01 / Project Image
            </span>
            <span className="text-xs font-mono text-[var(--color-ink-faint)]">
              {isImagePlaceholder
                ? 'Placeholder Active (Replace in src/data/projects.ts)'
                : 'Official Media'}
            </span>
          </div>
          <div className="group relative w-full aspect-[16/9] sm:aspect-[21/10] rounded-2xl md:rounded-3xl overflow-hidden border border-[var(--color-hairline)] bg-slate-100 shadow-[0_16px_40px_-20px_rgba(35,64,255,0.12)]">
            <img
              src={displayedImage}
              alt={`${project.title} Preview`}
              width={1200}
              height={675}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.01]"
            />
            {isImagePlaceholder && (
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[var(--color-hairline)] text-xs font-mono text-[var(--color-ink-muted)] shadow-sm">
                Image Placeholder
              </div>
            )}
          </div>
        </section>

        {/* 2. DESCRIPTION */}
        <section
          data-detail-item="2"
          aria-labelledby="detail-heading-description"
          className="space-y-4"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-blue)] font-semibold block">
            02 / Description
          </span>
          <div className="p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl bg-white border border-[var(--color-hairline)] shadow-[0_12px_32px_-16px_rgba(11,11,15,0.06)]">
            <h2
              id="detail-heading-description"
              className="text-xl sm:text-2xl font-medium text-[var(--color-ink)] mb-4 tracking-tight"
            >
              Project Overview &amp; Problem Statement
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[var(--color-ink)] leading-relaxed font-normal">
              {project.description}
            </p>
          </div>
        </section>

        {/* 3. FACTS GRID (Feasibility, Change It Made, Tech Stack / Tools & Resources) */}
        <section
          data-detail-item="3"
          aria-labelledby="detail-heading-facts"
          className="space-y-4"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-blue)] font-semibold block">
            03 / Project Facts
          </span>
          <h2 id="detail-heading-facts" className="sr-only">
            Project Facts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Feasibility */}
            <div className="p-6 sm:p-8 rounded-2xl md:rounded-3xl bg-white border border-[var(--color-hairline)] shadow-[0_12px_32px_-16px_rgba(11,11,15,0.06)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-ink-faint)] font-semibold">
                    Assessment
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[var(--color-blue-ghost)] text-[var(--color-blue)]">
                    <Sparkles className="w-3.5 h-3.5" />
                    Feasibility
                  </span>
                </div>
                <h3
                  id="detail-heading-feasibility"
                  className="text-xl sm:text-2xl font-medium text-[var(--color-ink)] tracking-tight mb-3"
                >
                  Feasibility
                </h3>
                <p className="text-base text-[var(--color-ink-muted)] leading-relaxed">
                  {feasibilityText}
                </p>
              </div>
            </div>

            {/* Card 2: Change It Made */}
            <div className="p-6 sm:p-8 rounded-2xl md:rounded-3xl bg-white border border-[var(--color-hairline)] shadow-[0_12px_32px_-16px_rgba(11,11,15,0.06)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-ink-faint)] font-semibold">
                    Outcome
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[var(--color-blue-ghost)] text-[var(--color-blue)]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Impact
                  </span>
                </div>
                <h3
                  id="detail-heading-impact"
                  className="text-xl sm:text-2xl font-medium text-[var(--color-ink)] tracking-tight mb-3"
                >
                  Change It Made
                </h3>
                <p className="text-base text-[var(--color-ink-muted)] leading-relaxed">
                  {changeText}
                </p>
              </div>
            </div>

            {/* Card 3: Tech Stack or Tools & Resources (spanning both columns on desktop) */}
            <div className="md:col-span-2 p-6 sm:p-8 rounded-2xl md:rounded-3xl bg-white border border-[var(--color-hairline)] shadow-[0_12px_32px_-16px_rgba(11,11,15,0.06)]">
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-ink-faint)] font-semibold">
                  {isTechnical ? 'Technologies' : 'Methodology'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[var(--color-blue-ghost)] text-[var(--color-blue)]">
                  {isTechnical ? <Layers className="w-3.5 h-3.5" /> : <Compass className="w-3.5 h-3.5" />}
                  {isTechnical ? 'Technical' : 'Non-Technical'}
                </span>
              </div>
              <h3
                id="detail-heading-tech-approach"
                className="text-xl sm:text-2xl font-medium text-[var(--color-ink)] tracking-tight mb-4"
              >
                {isTechnical ? 'Tech Stack' : 'Tools & Resources'}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {stackItems.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-2 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-bg)] text-sm font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-blue)]/30 hover:bg-white"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. CONTACT US BUTTON */}
        <section
          data-detail-item="4"
          aria-labelledby="detail-heading-contact"
          className="relative p-8 sm:p-12 md:p-16 rounded-3xl bg-gradient-to-br from-white to-[var(--color-blue-ghost)]/40 border border-[var(--color-hairline)] shadow-[0_20px_50px_-25px_rgba(35,64,255,0.2)] text-center space-y-6"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-blue)] font-semibold block">
            04 / Get in Touch
          </span>
          <div className="max-w-2xl mx-auto space-y-4">
            <h2
              id="detail-heading-contact"
              className="text-2xl sm:text-3xl md:text-4xl font-display font-medium text-[var(--color-ink)] tracking-tight"
            >
              Interested in {project.title}?
            </h2>
            <p className="text-base sm:text-lg text-[var(--color-ink-muted)] leading-relaxed">
              Whether you are an industry partner looking to sponsor, an alumni mentor offering
              domain advice, or a student aspiring to join this initiative, our team is ready to
              connect.
            </p>
          </div>

          <div className="pt-2">
            <Button
              to="/contact"
              variant="primary"
              withArrow
              className="px-9 py-4 text-base font-semibold shadow-md hover:shadow-lg"
            >
              Contact Us
            </Button>
          </div>
        </section>

        {/* Adjacent Navigation Bar: Previous / All / Next */}
        <nav
          aria-label="Project pagination"
          className="pt-8 border-t border-[var(--color-hairline)] flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          {prev ? (
            <Link
              to={`/projects/${prev.slug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-blue)] transition-colors py-2 px-3 rounded-lg hover:bg-white border border-transparent hover:border-[var(--color-hairline)]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous: {prev.title}</span>
            </Link>
          ) : (
            <div />
          )}

          <Link
            to="/projects"
            className="text-xs font-mono uppercase tracking-widest text-[var(--color-blue)] font-semibold hover:underline px-3 py-2"
          >
            View All Projects
          </Link>

          {next ? (
            <Link
              to={`/projects/${next.slug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-blue)] transition-colors py-2 px-3 rounded-lg hover:bg-white border border-transparent hover:border-[var(--color-hairline)]"
            >
              <span>Next: {next.title}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </div>
    </div>
  )
}
