import { useState, useMemo, useRef, useEffect } from 'react'
import { FolderGrid, type FolderItemConfig } from './components/FolderGrid'
import { ProfileGrid } from './components/ProfileGrid'
import { FinderToolbar } from './components/FinderToolbar'
import { FinderSidebar, type DirectoryLevel } from './components/FinderSidebar'
import type { BreadcrumbSegment } from './components/FinderBreadcrumbs'
import { useSheetData } from '@/lib/useSheetData'
import type { TeamProfile } from '@/types/teamDirectory'
import { TeamSkeleton } from '@/components/skeletons/TeamSkeleton'

export default function TeamPage() {
  const [activeLevel, setActiveLevel] = useState<DirectoryLevel>('root')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid')
  const contentRef = useRef<HTMLElement>(null)
  const { data: teamData, status } = useSheetData('team')

  const leadsProfiles = teamData.profiles.leads
  const technicalProfiles = teamData.profiles.technical
  const outreachProfiles = teamData.profiles.industryAndCommunityOutreach

  // Scroll to top of content workspace on level navigation
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [activeLevel])

  // Breadcrumbs construction
  const breadcrumbs: BreadcrumbSegment[] = useMemo(() => {
    const list: BreadcrumbSegment[] = [
      {
        id: 'root',
        label: 'Team Directory',
        onClick: () => setActiveLevel('root'),
        isCurrent: activeLevel === 'root',
      },
    ]

    if (activeLevel === 'leads') {
      list.push({
        id: 'leads',
        label: 'Leads',
        isCurrent: true,
      })
    } else if (activeLevel === 'members') {
      list.push({
        id: 'members',
        label: 'Members',
        isCurrent: true,
      })
    } else if (activeLevel === 'technical' || activeLevel === 'outreach') {
      list.push({
        id: 'members',
        label: 'Members',
        onClick: () => setActiveLevel('members'),
        isCurrent: false,
      })

      if (activeLevel === 'technical') {
        list.push({
          id: 'technical',
          label: 'Technical',
          isCurrent: true,
        })
      } else {
        list.push({
          id: 'outreach',
          label: 'Industry and Community Outreach',
          isCurrent: true,
        })
      }
    }

    return list
  }, [activeLevel])

  // Back button handler
  const handleBack = () => {
    if (activeLevel === 'technical' || activeLevel === 'outreach') {
      setActiveLevel('members')
    } else if (activeLevel === 'leads' || activeLevel === 'members') {
      setActiveLevel('root')
    }
  }

  const canGoBack = activeLevel !== 'root'

  // Root folder configs: exactly 2 folders: Leads & Members
  const rootFolders: FolderItemConfig[] = useMemo(() => [
    {
      id: 'folder-leads',
      label: 'Leads',
      count: leadsProfiles.length,
      description: 'The core leadership guiding strategy, innovation, and club initiatives.',
      color: '#2547FF',
      onClick: () => setActiveLevel('leads'),
    },
    {
      id: 'folder-members',
      label: 'Members',
      count: 2, // exactly 2 child folders
      description: 'The core pillars: Technical and Industry and Community Outreach.',
      color: '#3B82F6',
      onClick: () => setActiveLevel('members'),
    },
  ], [leadsProfiles.length])

  // Members folder configs: exactly 2 folders: Technical & Industry and Community Outreach
  const memberFolders: FolderItemConfig[] = useMemo(() => [
    {
      id: 'folder-technical',
      label: 'Technical',
      count: technicalProfiles.length,
      description: 'Developers, designers, and systems architects building club platforms.',
      color: '#2547FF',
      onClick: () => setActiveLevel('technical'),
    },
    {
      id: 'folder-outreach',
      label: 'Industry and Community Outreach',
      count: outreachProfiles.length,
      description: 'Building industry partnerships, sponsorships, and community relations.',
      color: '#0284C7',
      onClick: () => setActiveLevel('outreach'),
    },
  ], [technicalProfiles.length, outreachProfiles.length])

  // Profiles for current view (if in a leaf view)
  const currentProfiles: TeamProfile[] = useMemo(() => {
    let list: TeamProfile[] = []
    if (activeLevel === 'leads') {
      list = leadsProfiles
    } else if (activeLevel === 'technical') {
      list = technicalProfiles
    } else if (activeLevel === 'outreach') {
      list = outreachProfiles
    }

    if (!searchQuery.trim()) return list

    const q = searchQuery.toLowerCase().trim()
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(q)),
    )
  }, [activeLevel, searchQuery, leadsProfiles, technicalProfiles, outreachProfiles])

  const totalAllProfiles =
    leadsProfiles.length +
    technicalProfiles.length +
    outreachProfiles.length

  if (status === 'loading') {
    return <TeamSkeleton />
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pt-24 pb-20 sm:pt-28">
      {/* Background ambient lighting in white-and-blue theme */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-[var(--color-blue-ghost)]/60 blur-[120px]" />
        <div className="absolute top-1/3 -left-40 h-[450px] w-[450px] rounded-full bg-blue-100/40 blur-[100px]" />
      </div>

      <div className="container-site relative z-10">
        {/* Main Header / Intro */}
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <h1 className="text-[clamp(2.25rem,4.5vw,3.75rem)] font-light leading-tight tracking-[-0.03em] text-[var(--color-ink)]">
            Our <span className="text-[var(--color-blue)] font-normal">People</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[var(--color-ink-muted)]">
            Explore the people behind our community. Navigate through folders to meet our leads and member wings.
          </p>
        </div>

        {/* Unified macOS Finder Window Frame */}
        <div className="mx-auto w-full max-w-6xl rounded-2xl sm:rounded-3xl border border-[var(--color-hairline)] bg-white/85 shadow-[0_20px_50px_-15px_rgba(37,71,255,0.08)] backdrop-blur-xl overflow-hidden flex flex-col min-h-[640px]">
          {/* macOS Finder Toolbar / Titlebar */}
          <FinderToolbar
            breadcrumbs={breadcrumbs}
            onBack={handleBack}
            canGoBack={canGoBack}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            currentCount={
              activeLevel === 'root'
                ? 2
                : activeLevel === 'members'
                  ? 2
                  : currentProfiles.length
            }
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* macOS Window Body (Sidebar + Content Workspace) */}
          <div className="flex flex-col lg:flex-row flex-1 min-h-0">
            {/* Finder Sidebar */}
            <FinderSidebar
              currentLevel={activeLevel}
              onNavigate={(level) => {
                setActiveLevel(level)
                setSearchQuery('')
              }}
              totalCount={totalAllProfiles}
              folderCounts={{
                leads: leadsProfiles.length,
                technical: technicalProfiles.length,
                outreach: outreachProfiles.length,
              }}
            />

            {/* Main Content Area */}
            <section
              ref={contentRef}
              aria-label="Team Directory Workspace"
              className="flex-1 flex flex-col min-h-[500px] min-w-0 bg-white/40 overflow-y-auto"
            >
              {/* ROOT VIEW */}
              {activeLevel === 'root' && (
                <div className="py-5 px-6">
                  <div className="mb-4 flex items-center justify-between border-b border-[var(--color-hairline)] pb-3">
                    <span className="font-mono text-xs font-medium tracking-wider text-[var(--color-ink-faint)] uppercase">
                      Root Folders
                    </span>
                    <span className="rounded-full bg-[var(--color-blue-ghost)] px-2.5 py-0.5 font-mono text-xs font-semibold text-[var(--color-blue)]">
                      2 categories
                    </span>
                  </div>
                  <FolderGrid folders={rootFolders} viewMode={viewMode} />
                  {totalAllProfiles === 0 && (
                    <p
                      data-testid="team-empty-state"
                      className="mt-8 text-center text-sm text-[var(--color-ink-muted)]"
                    >
                      No team members available.
                    </p>
                  )}
                </div>
              )}

              {/* MEMBERS VIEW (Exactly 2 child folders) */}
              {activeLevel === 'members' && (
                <div className="py-5 px-6">
                  <div className="mb-4 flex items-center justify-between border-b border-[var(--color-hairline)] pb-3">
                    <span className="font-mono text-xs font-medium tracking-wider text-[var(--color-ink-faint)] uppercase">
                      Member Wings
                    </span>
                    <span className="rounded-full bg-[var(--color-blue-ghost)] px-2.5 py-0.5 font-mono text-xs font-semibold text-[var(--color-blue)]">
                      2 wings
                    </span>
                  </div>
                  <FolderGrid folders={memberFolders} viewMode={viewMode} />
                </div>
              )}

              {/* LEADS VIEW (Exactly 7 profiles) */}
              {activeLevel === 'leads' && (
                <div className="py-4 px-6">
                  <ProfileGrid
                    profiles={currentProfiles}
                    title="Executive & Wing Leadership"
                    viewMode={viewMode}
                  />
                </div>
              )}

              {/* TECHNICAL VIEW (Exactly 15 profiles) */}
              {activeLevel === 'technical' && (
                <div className="py-4 px-6">
                  <ProfileGrid
                    profiles={currentProfiles}
                    title="Technical Wing Members"
                    viewMode={viewMode}
                  />
                </div>
              )}

              {/* OUTREACH VIEW (Exactly 15 profiles) */}
              {activeLevel === 'outreach' && (
                <div className="py-4 px-6">
                  <ProfileGrid
                    profiles={currentProfiles}
                    title="Industry and Community Outreach Members"
                    viewMode={viewMode}
                  />
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
