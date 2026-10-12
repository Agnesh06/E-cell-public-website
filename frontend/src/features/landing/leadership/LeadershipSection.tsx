import ProfileCard from './ProfileCard'
import { Button } from '@/components/common/Button'
import { useSheetData } from '@/lib/useSheetData'
import { initialsImage } from '@/lib/placeholder'
import type { TeamMember } from '@/types'

const ROLES = ['director', 'co-director'] as const

export default function LeadershipSection() {
  const { data: teamData, status } = useSheetData('team')

  if (status === 'loading') {
    return (
      <section
        id="team"
        aria-labelledby="team-heading"
        className="relative py-[clamp(5rem,10vw,9rem)] min-h-[500px] sm:min-h-[600px]"
        aria-busy="true"
      />
    )
  }

  const leaders = ROLES.map((r) => teamData.members.find((m) => m.leadership === r)).filter(Boolean) as TeamMember[]
  if (!leaders.length) return null

  return (
    <section id="team" aria-labelledby="team-heading" className="relative py-[clamp(5rem,10vw,9rem)]">
      <div className="container-site flex flex-col items-center text-center">
        <h2 id="team-heading" className="text-[clamp(2rem,4vw,3.25rem)] font-light leading-tight tracking-[-0.02em]">
          Meet Our <span className="text-[var(--color-blue)]">Team</span>
        </h2>

        <div className="mt-12 flex flex-col items-center justify-center gap-8 md:flex-row md:items-stretch">
          {leaders.map((m) => (
            <ProfileCard
              key={m.id}
              className="w-[clamp(260px,80vw,340px)]"
              name={m.name}
              title={m.role}
              subtitle={m.department}
              avatarUrl={m.photo ?? initialsImage(m.name)}
            />
          ))}
        </div>

        <div className="mt-12">
          <Button to="/team">View Full Team</Button>
        </div>
      </div>
    </section>
  )
}