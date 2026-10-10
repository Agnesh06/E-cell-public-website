import { Mail, Globe } from 'lucide-react'
import type { ProfileSocialLinks } from '@/types/teamDirectory'

interface SocialLinksProps {
  links?: ProfileSocialLinks
  className?: string
  memberName?: string
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

const PLATFORM_LABELS = {
  linkedin: 'LinkedIn profile',
  github: 'GitHub profile',
  instagram: 'Instagram profile',
  email: 'Email address',
  website: 'Personal website',
} as const

export function SocialLinks({ links, className = '', memberName = 'Member' }: SocialLinksProps) {
  if (!links) return null

  // Filter only entries that are defined, non-empty, and not '#'
  const validEntries = Object.entries(links).filter(([, url]) => {
    return typeof url === 'string' && url.trim().length > 0 && url.trim() !== '#'
  })

  if (validEntries.length === 0) return null

  const renderIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <LinkedInIcon className="h-3.5 w-3.5" />
      case 'github':
        return <GitHubIcon className="h-3.5 w-3.5" />
      case 'instagram':
        return <InstagramIcon className="h-3.5 w-3.5" />
      case 'email':
        return <Mail className="h-3.5 w-3.5" />
      default:
        return <Globe className="h-3.5 w-3.5" />
    }
  }

  return (
    <div
      className={`mt-4 flex items-center justify-center gap-2 pt-2.5 border-t border-[var(--color-hairline)]/70 ${className}`}
      aria-label={`${memberName} social links`}
    >
      {validEntries.map(([platform, url]) => {
        const labelText =
          PLATFORM_LABELS[platform as keyof typeof PLATFORM_LABELS] || `${platform} link`
        const safeUrl =
          url!.startsWith('mailto:') || url!.startsWith('http://') || url!.startsWith('https://')
            ? url!
            : `https://${url}`

        return (
          <a
            key={platform}
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${memberName}'s ${labelText}`}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[var(--color-ink-muted)] border border-[var(--color-border)] shadow-xs transition-all duration-200 hover:scale-110 hover:border-[var(--color-blue)] hover:bg-[var(--color-blue-ghost)] hover:text-[var(--color-blue)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-blue)]"
          >
            {renderIcon(platform)}
          </a>
        )
      })}
    </div>
  )
}
