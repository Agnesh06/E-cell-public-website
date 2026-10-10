export type TeamGroup = 'leads' | 'technical' | 'industryAndCommunityOutreach'

export type SocialPlatform = 'linkedin' | 'github' | 'instagram' | 'email' | 'website'

export interface ProfileSocialLinks {
  linkedin?: string
  github?: string
  instagram?: string
  email?: string
  website?: string
  [key: string]: string | undefined
}

export interface TeamProfile {
  id: string
  name: string
  role: string
  team: TeamGroup
  isPlaceholder: boolean
  image?: string
  subtitle?: string
  socialLinks: ProfileSocialLinks
}

export interface FolderNode {
  id: string
  name: string
  path: string
  itemCount: number
  type: 'folder'
  badge?: string
}

