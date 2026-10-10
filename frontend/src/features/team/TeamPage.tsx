import { useState, useMemo } from 'react'
import { FolderGrid, type FolderItemConfig } from './components/FolderGrid'
import { ProfileGrid } from './components/ProfileGrid'
import { FinderToolbar } from './components/FinderToolbar'
import { FinderSidebar, type DirectoryLevel } from './components/FinderSidebar'
import type { BreadcrumbSegment } from './components/FinderBreadcrumbs'
import { teamProfiles } from '@/data/teamDirectoryData'
import type { TeamProfile } from '@/types/teamDirectory'

export default function TeamPage() {
  const [activeLevel, setActiveLevel] = useState<DirectoryLevel>('root')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid')

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
  const rootFolders: FolderItemConfig[] = [
    {
      id: 'folder-leads',
      label: 'Leads',
      count: teamProfiles.leads.length,
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
  ]

  // Members folder configs: exactly 2 folders: Technical & Industry and Community Outreach
  const memberFolders: FolderItemConfig[] = [
    {
      id: 'folder-technical',
      label: 'Technical',
      count: teamProfiles.technical.length,
      description: 'Developers, designers, and systems architects building club platforms.',
      color: '#2547FF',
      onClick: () => setActiveLevel('technical'),
    },
    {
      id: 'folder-outreach',
      label: 'Industry and Community Outreach',
      count: teamProfiles.industryAndCommunityOutreach.length,
      description: 'Building industry partnerships, sponsorships, and community relations.',
      color: '#0284C7',
      onClick: () => setActiveLevel('outreach'),
    },
  ]

  // Profiles for current view (if in a leaf view)
  const currentProfiles: TeamProfile[] = useMemo(() => {
    let list: TeamProfile[] = []
    if (activeLevel === 'leads') {
      list = teamProfiles.leads
    } else if (activeLevel === 'technical') {
      list = teamProfiles.technical
    } else if (activeLevel === 'outreach') {
      list = teamProfiles.industryAndCommunityOutreach
    }

    if (!searchQuery.trim()) return list

    const q = searchQuery.toLowerCase().trim()
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(q)),
    )
  }, [activeLevel, searchQuery])

  const totalAllProfiles =
    teamProfiles.leads.length +
    teamProfiles.technical.length +
    teamProfiles.industryAndCommunityOutreach.length

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
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h1 className="text-[clamp(2.25rem,4.5vw,3.75rem)] font-light leading-tight tracking-[-0.03em] text-[var(--color-ink)]">
            Our <span className="text-[var(--color-blue)] font-normal">People</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[var(--color-ink-muted)]">
            Explore the people behind our community. Navigate through folders to meet our leads and member wings.
          </p>
        </div>

        {/* Directory Workspace */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Finder Sidebar (Desktop / Laptops) */}
          <FinderSidebar
            currentLevel={activeLevel}
            onNavigate={(level) => setActiveLevel(level)}
            totalCount={totalAllProfiles}
          />

          {/* Main Content Area */}
          <section aria-label="Team Directory Workspace" className="flex-1 w-full min-w-0">
            {/* Finder Toolbar */}
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

            {/* Stage content */}
            <div className="mt-6">
              {/* ROOT VIEW */}
              {activeLevel === 'root' && (
                <div className="py-6">
                  <div className="mb-6 flex items-center justify-between border-b border-[var(--color-hairline)] pb-3">
                    <span className="font-mono text-xs font-medium tracking-wider text-[var(--color-ink-faint)] uppercase">
                      Root Folders
                    </span>
                    <span className="rounded-full bg-[var(--color-blue-ghost)] px-2.5 py-0.5 font-mono text-xs font-semibold text-[var(--color-blue)]">
                      2 categories
                    </span>
                  </div>
                  <FolderGrid folders={rootFolders} />
                </div>
              )}

              {/* MEMBERS VIEW (Exactly 2 child folders) */}
              {activeLevel === 'members' && (
                <div className="py-6">
                  <div className="mb-6 flex items-center justify-between border-b border-[var(--color-hairline)] pb-3">
                    <span className="font-mono text-xs font-medium tracking-wider text-[var(--color-ink-faint)] uppercase">
                      Member Wings
                    </span>
                    <span className="rounded-full bg-[var(--color-blue-ghost)] px-2.5 py-0.5 font-mono text-xs font-semibold text-[var(--color-blue)]">
                      2 wings
                    </span>
                  </div>
                  <FolderGrid folders={memberFolders} />
                </div>
              )}

              {/* LEADS VIEW (Exactly 7 profiles) */}
              {activeLevel === 'leads' && (
                <div className="py-4">
                  <ProfileGrid
                    profiles={currentProfiles}
                    title="Executive & Wing Leadership"
                  />
                </div>
              )}

              {/* TECHNICAL VIEW (Exactly 15 profiles) */}
              {activeLevel === 'technical' && (
                <div className="py-4">
                  <ProfileGrid
                    profiles={currentProfiles}
                    title="Technical Wing Members"
                  />
                </div>
              )}

              {/* OUTREACH VIEW (Exactly 15 profiles) */}
              {activeLevel === 'outreach' && (
                <div className="py-4">
                  <ProfileGrid
                    profiles={currentProfiles}
                    title="Industry and Community Outreach Members"
                  />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
