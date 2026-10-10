import { Folder, Users, Layers, ShieldCheck, ChevronRight } from 'lucide-react'

export type DirectoryLevel = 'root' | 'leads' | 'members' | 'technical' | 'outreach'

interface FinderSidebarProps {
  currentLevel: DirectoryLevel
  onNavigate: (level: DirectoryLevel) => void
  totalCount: number
}

export function FinderSidebar({ currentLevel, onNavigate, totalCount }: FinderSidebarProps) {
  const navItems = [
    {
      id: 'root' as DirectoryLevel,
      label: 'Team Root',
      icon: Layers,
      count: 2,
      badge: 'Dirs',
    },
    {
      id: 'leads' as DirectoryLevel,
      label: 'Leads',
      icon: ShieldCheck,
      count: 7,
      badge: 'Leads',
    },
    {
      id: 'members' as DirectoryLevel,
      label: 'Members',
      icon: Users,
      count: 2,
      badge: 'Subdirs',
    },
    {
      id: 'technical' as DirectoryLevel,
      label: 'Technical',
      icon: Folder,
      count: 15,
      indent: true,
      badge: 'Devs',
    },
    {
      id: 'outreach' as DirectoryLevel,
      label: 'Industry & Outreach',
      icon: Folder,
      count: 15,
      indent: true,
      badge: 'Partners',
    },
  ]

  return (
    <aside
      aria-label="Finder Sidebar"
      className="hidden lg:flex w-64 flex-col rounded-3xl border border-[var(--color-hairline)] bg-white/75 p-5 backdrop-blur-xl shadow-xs shrink-0 self-start sticky top-24"
    >
      <div className="mb-4 flex items-center justify-between pb-3 border-b border-[var(--color-hairline)]">
        <span className="font-mono text-xs font-semibold tracking-wider text-[var(--color-ink-faint)] uppercase">
          Favorites
        </span>
        <span className="rounded-full bg-[var(--color-blue-ghost)] px-2 py-0.5 font-mono text-[10px] font-bold text-[var(--color-blue)]">
          {totalCount} total
        </span>
      </div>

      <nav className="flex flex-col space-y-1">
        {navItems.map((item) => {
          const isActive = currentLevel === item.id
          const IconComponent = item.icon

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                item.indent ? 'ml-3' : ''
              } ${
                isActive
                  ? 'bg-[var(--color-blue)] text-white shadow-xs font-semibold'
                  : 'text-[var(--color-ink-muted)] hover:bg-[var(--color-blue-ghost)] hover:text-[var(--color-blue)]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <IconComponent
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-[var(--color-ink-faint)] group-hover:text-[var(--color-blue)]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-zinc-100 text-[var(--color-ink-faint)] group-hover:bg-white group-hover:text-[var(--color-blue)]'
                  }`}
                >
                  {item.count}
                </span>
                <ChevronRight
                  className={`h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100 ${
                    isActive ? 'opacity-100 text-white' : 'text-[var(--color-ink-faint)]'
                  }`}
                />
              </div>
            </button>
          )
        })}
      </nav>

      {/* System info badge */}
      <div className="mt-8 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-blue-ghost)]/50 p-3 text-[11px] text-[var(--color-ink-muted)]">
        <p className="font-semibold text-[var(--color-blue)]">E-Cell Volume</p>
        <p className="mt-0.5 text-zinc-500 font-mono">Hierarchy: 3 tiers</p>
        <p className="text-zinc-500 font-mono">Format: React Bits Folder</p>
      </div>
    </aside>
  )
}

