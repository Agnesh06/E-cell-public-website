import ProfileCard from '@/features/landing/leadership/ProfileCard'
import { initialsImage } from '@/lib/placeholder'
import { SocialLinks } from './SocialLinks'
import type { TeamProfile } from '@/types/teamDirectory'

interface TeamProfileCardProps {
  profile: TeamProfile
  className?: string
  enableTilt?: boolean
}

export function TeamProfileCard({
  profile,
  className = '',
  enableTilt = true,
}: TeamProfileCardProps) {
  const avatar = profile.image || initialsImage(profile.name)

  return (
    <ProfileCard
      name={profile.name}
      title={profile.role}
      subtitle={profile.subtitle}
      avatarUrl={avatar}
      enableTilt={enableTilt}
      className={className}
    >
      <SocialLinks links={profile.socialLinks} memberName={profile.name} />
    </ProfileCard>
  )
}

