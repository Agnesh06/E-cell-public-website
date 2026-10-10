import type { TeamMember } from '@/types'

export const team: TeamMember[] = [
  {
    id: 'director',
    name: 'Placeholder Name',
    role: 'Director',
    department: 'Department of Computer Science and Engineering',
    photo: null,
    leadership: 'director',
    wing: { id: 'leadership', name: 'Leadership' },
    socials: { linkedin: '', github: '', email: '' },
  },
  {
    id: 'co-director',
    name: 'Placeholder Name',
    role: 'Co-Director',
    department: 'Department of Computer Science and Engineering',
    photo: null,
    leadership: 'co-director',
    wing: { id: 'leadership', name: 'Leadership' },
    socials: { linkedin: '', github: '', email: '' },
  },
  {
    id: 'placeholder-member-one',
    name: 'Placeholder Member One',
    role: 'Placeholder Role',
    department: 'Placeholder Department',
    photo: null,
    wing: { id: 'placeholder-wing', name: 'Placeholder Wing' },
    socials: { linkedin: '', github: '', email: '' },
  },
  {
    id: 'placeholder-member-two',
    name: 'Placeholder Member Two',
    role: 'Placeholder Role',
    department: 'Placeholder Department',
    photo: null,
    wing: { id: 'placeholder-wing', name: 'Placeholder Wing' },
    socials: { linkedin: '', github: '', email: '' },
  },
]
