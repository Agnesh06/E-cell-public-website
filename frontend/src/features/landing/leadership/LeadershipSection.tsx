import { Button } from '@/components/common/Button'
import { useSheetData } from '@/lib/useSheetData'
import type { TeamMember } from '@/types'
import { TeamSection } from '@/features/team/TeamSection'

const ROLES = ['director', 'co-director'] as const

export default function LeadershipSection() {
  const { data: teamData, status } = useSheetData('team')

  if (status === 'loading') {
    return (
      <section
        id="team"
        aria-labelledby="team-heading"
        className="relative py-7 sm:py-10 md:py-[clamp(5rem,10vw,9rem)] min-h-0 sm:min-h-[500px] md:min-h-[600px]"
        aria-busy="true"
      />
    )
  }

  const leaders = ROLES.map((r) => teamData.members.find((m) => m.leadership === r)).filter(Boolean) as TeamMember[]
  if (!leaders.length) return null

  return (
    <section id="team" aria-labelledby="team-heading" className="relative py-7 sm:py-10 md:py-[clamp(5rem,10vw,9rem)]">
      <div className="container-site px-0 sm:px-6 md:px-10 flex flex-col items-center text-center">
        <h2 id="team-heading" className="text-[clamp(2rem,4vw,3.25rem)] font-light leading-tight tracking-[-0.02em] px-4 sm:px-0 mb-3 sm:mb-4 md:mb-6">
          Meet Our <span className="text-[var(--color-blue)]">Team</span>
        </h2>

        <div className="w-full flex flex-row flex-nowrap justify-center">
          <TeamSection
            catchphrase="The minds building the future at PSG Tech E-Cell"
            subtitle="EXECUTIVE & CORE TEAM"
          />
        </div>

        <div className="mt-6 sm:mt-8 md:mt-12 px-4 sm:px-0">
          <Button to="/team">View Full Team</Button>
        </div>
      </div>
    </section>
  )
}