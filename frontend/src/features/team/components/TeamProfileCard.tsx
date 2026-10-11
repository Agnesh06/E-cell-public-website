import { initialsImage } from '@/lib/placeholder'
import { SocialLinks } from './SocialLinks'
import type { TeamProfile } from '@/types/teamDirectory'

export interface TeamProfileCardProps {
  profile: TeamProfile
  className?: string
  viewMode?: 'grid' | 'compact'
}

export function TeamProfileCard({
  profile,
  className = '',
  viewMode = 'grid',
}: TeamProfileCardProps) {
  const avatar = profile.image || initialsImage(profile.name)

  if (viewMode === 'compact') {
    return (
      <div
        tabIndex={0}
        aria-label={`${profile.name}, ${profile.role}`}
        className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all duration-150 hover:bg-[var(--color-blue-ghost)]/80 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-blue)] cursor-default border border-transparent hover:border-[var(--color-blue)]/20 ${className}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-zinc-200/80 bg-blue-50/80 shadow-2xs">
            <img
              src={avatar}
              alt={`Portrait of ${profile.name}`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-blue)] transition-colors truncate">
              {profile.name}
            </h3>
            <p className="text-xs text-[var(--color-ink-muted)] truncate">
              {profile.role}
              {profile.subtitle ? ` • ${profile.subtitle}` : ''}
            </p>
          </div>
        </div>

        <div className="shrink-0 pl-3">
          <SocialLinks
            links={profile.socialLinks}
            memberName={profile.name}
            compact={true}
          />
        </div>
      </div>
    )
  }

  return (
    <div
      tabIndex={0}
      aria-label={`${profile.name}, ${profile.role}`}
      className={`group relative flex w-[110px] flex-col items-center justify-start rounded-xl p-2.5 transition-all duration-150 hover:bg-[var(--color-blue-ghost)]/70 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-blue)] cursor-default select-none text-center ${className}`}
    >
      {/* Avatar Icon */}
      <div className="relative flex items-center justify-center pt-1 pb-1">
        <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-2xl border border-zinc-200/90 bg-gradient-to-b from-blue-50 to-blue-100/60 shadow-xs transition-transform duration-200 group-hover:scale-105">
          <img
            src={avatar}
            alt={`Portrait of ${profile.name}`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Name label centered under icon */}
      <h3 className="mt-2 text-center text-xs font-semibold text-[var(--color-ink)] leading-snug line-clamp-2 w-full break-words group-hover:text-[var(--color-blue)] transition-colors">
        {profile.name}
      </h3>

      {/* Subtitle / Role centered under name */}
      <p className="mt-0.5 text-center text-[10px] font-mono text-[var(--color-blue)] uppercase tracking-wider truncate w-full">
        {profile.role}
      </p>

      {/* Social links */}
      <div className="mt-1.5 w-full">
        <SocialLinks
          links={profile.socialLinks}
          memberName={profile.name}
          compact={true}
        />
      </div>
    </div>
  )
}
