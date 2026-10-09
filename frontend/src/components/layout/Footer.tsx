import { Link } from 'react-router'
import { ExternalLink } from 'lucide-react'
import { site } from '@/data/site'
import { Container } from '@/components/common'

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  const getSocialIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'linkedin':
        return <LinkedInIcon className="h-5 w-5" />
      case 'instagram':
        return <InstagramIcon className="h-5 w-5" />
      case 'github':
        return <GitHubIcon className="h-5 w-5" />
      default:
        return null
    }
  }

  return (
    <footer className="border-t border-[var(--color-hairline)] bg-[var(--color-bg)] pt-16 pb-12 text-[var(--color-ink)]">
      <Container>
        {/* Four columns on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12">
          {/* Col 1: Brand and Tagline */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-medium tracking-tight text-[var(--color-ink)]">
              {site.name}
            </h2>
            <p className="text-base text-[var(--color-ink-muted)]">
              {site.tagline}
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-mono font-medium uppercase tracking-[var(--letter-spacing-eyebrow)] text-[var(--color-ink-muted)]">
              Navigation
            </h3>
            <nav aria-label="Footer" className="flex flex-col gap-2.5">
              {site.navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-sm text-[var(--color-ink)] hover:text-[var(--color-blue)] transition-colors w-fit"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3: Contact Block */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-mono font-medium uppercase tracking-[var(--letter-spacing-eyebrow)] text-[var(--color-ink-muted)]">
              Contact
            </h3>
            <div className="flex flex-col gap-2 text-sm text-[var(--color-ink-muted)]">
              {/* TODO: replace placeholder email with real official contact email */}
              <a
                href="mailto:ecell@psgtech.ac.in"
                className="hover:text-[var(--color-blue)] transition-colors w-fit"
              >
                ecell@psgtech.ac.in
              </a>
              <address className="not-italic leading-relaxed">
                PSG College of Technology,
                <br />
                Coimbatore
              </address>
            </div>
          </div>

          {/* Col 4: CSEA Website Link & Socials */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-mono font-medium uppercase tracking-[var(--letter-spacing-eyebrow)] text-[var(--color-ink-muted)]">
              Connect
            </h3>
            <div className="flex flex-col gap-4">
              <a
                href={site.cseaUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CSEA Official Website (opens in new tab)"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-blue)] hover:underline"
              >
                <span>CSEA Website</span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>

              <div className="flex items-center gap-4">
                {site.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.label} (opens in new tab)`}
                    className="text-[var(--color-ink-muted)] hover:text-[var(--color-blue)] transition-colors"
                  >
                    {getSocialIcon(social.label)}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--color-hairline)] pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--color-ink-muted)] gap-4">
          <p>© {currentYear} CSEA E-Cell, PSG College of Technology, Coimbatore</p>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
