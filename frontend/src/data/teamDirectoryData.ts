import type { TeamProfile } from '@/types/teamDirectory'

export const leads: TeamProfile[] = [
  {
    id: 'lead-1',
    name: 'Placeholder Lead 1',
    role: 'Overall Head',
    team: 'leads',
    isPlaceholder: true,
    subtitle: 'Department of Computer Science and Engineering',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
    },
  },
  {
    id: 'lead-2',
    name: 'Placeholder Lead 2',
    role: 'Technical Lead',
    team: 'leads',
    isPlaceholder: true,
    subtitle: 'Department of Computer Science and Engineering',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
    },
  },
  {
    id: 'lead-3',
    name: 'Placeholder Lead 3',
    role: 'Outreach & Partnerships Lead',
    team: 'leads',
    isPlaceholder: true,
    subtitle: 'Department of Computer Science and Engineering',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
  },
  {
    id: 'lead-4',
    name: 'Placeholder Lead 4',
    role: 'Operations & Logistics Lead',
    team: 'leads',
    isPlaceholder: true,
    subtitle: 'Department of Computer Science and Engineering',
    socialLinks: {
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'lead-5',
    name: 'Placeholder Lead 5',
    role: 'Design & Media Lead',
    team: 'leads',
    isPlaceholder: true,
    subtitle: 'Department of Computer Science and Engineering',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
  },
  {
    id: 'lead-6',
    name: 'Placeholder Lead 6',
    role: 'Events & Initiatives Lead',
    team: 'leads',
    isPlaceholder: true,
    subtitle: 'Department of Computer Science and Engineering',
    socialLinks: {
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'lead-7',
    name: 'Placeholder Lead 7',
    role: 'Finance & Sponsorship Lead',
    team: 'leads',
    isPlaceholder: true,
    subtitle: 'Department of Computer Science and Engineering',
    socialLinks: {
      linkedin: 'https://linkedin.com',
    },
  },
]

export const technical: TeamProfile[] = Array.from({ length: 15 }, (_, i) => {
  const num = i + 1
  return {
    id: `tech-member-${num}`,
    name: `Technical Member ${num}`,
    role: num <= 5 ? 'Frontend Developer' : num <= 10 ? 'Backend Developer' : 'Systems & Cloud Engineer',
    team: 'technical',
    isPlaceholder: true,
    subtitle: 'Technical Wing',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
    },
  }
})

export const industryAndCommunityOutreach: TeamProfile[] = Array.from({ length: 15 }, (_, i) => {
  const num = i + 1
  return {
    id: `outreach-member-${num}`,
    name: `Outreach Member ${num}`,
    role: num <= 5 ? 'Corporate Relations Associate' : num <= 10 ? 'Community Manager' : 'Sponsorship & PR Coordinator',
    team: 'industryAndCommunityOutreach',
    isPlaceholder: true,
    subtitle: 'Industry & Community Outreach Wing',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
  }
})

export const teamProfiles = {
  leads,
  technical,
  industryAndCommunityOutreach,
}

