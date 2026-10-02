import { TeamMember } from '@/types/team';

// Placeholder office bearers since team data was not populated in the initial repository scaffold
const TEAM_MEMBERS: readonly TeamMember[] = [
  {
    id: 'lead-1',
    name: 'President',
    role: 'Student Head & President',
    wing: 'Executive',
    isOfficeBearer: true,
    image: '/team/placeholder-lead.jpg',
  },
  {
    id: 'lead-2',
    name: 'Vice President',
    role: 'Operations & Strategy Head',
    wing: 'Executive',
    isOfficeBearer: true,
    image: '/team/placeholder-vp.jpg',
  },
  {
    id: 'lead-3',
    name: 'Technical Secretary',
    role: 'Innovation & Projects Lead',
    wing: 'Technical',
    isOfficeBearer: true,
    image: '/team/placeholder-tech.jpg',
  },
  {
    id: 'lead-4',
    name: 'Treasurer',
    role: 'Finance & Corporate Relations',
    wing: 'Finance',
    isOfficeBearer: true,
    image: '/team/placeholder-treasurer.jpg',
  },
] as const;

export function getTeam(): readonly TeamMember[] {
  return TEAM_MEMBERS;
}

export function getOfficeBearers(): readonly TeamMember[] {
  return TEAM_MEMBERS.filter((m) => m.isOfficeBearer);
}

