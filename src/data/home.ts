export interface HeroData {
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
}

export interface AboutCardData {
  id: string;
  text: string;
}

export interface AboutData {
  eyebrow: string;
  title: string;
  cards: readonly AboutCardData[];
}

export interface CardItem {
  id: string;
  title: string;
  description: string;
}

export interface SectionWithCards {
  title: string;
  subtitle?: string;
  cards: readonly CardItem[];
}

export interface FinalCTAData {
  title: string;
  description: string;
  ctaText: string;
}

const HERO_DATA: HeroData = {
  title: 'Ideas are just the beginning.',
  description:
    'A space to ideate, collaborate, and build. Turn your curiosity into ideas, your ideas into solutions, and your solutions into something that matters.',
  primaryCta: 'Get Involved',
  secondaryCta: 'Explore Our Vision',
};

const ABOUT_DATA: AboutData = {
  eyebrow: 'About E-Cell',
  title: 'More than an idea. A place to begin.',
  cards: [
    {
      id: 'about-1',
      text: 'Every meaningful venture starts with an idea. But turning that idea into reality takes more than inspiration. It takes the right people, the right opportunities, and the willingness to take the first step.',
    },
    {
      id: 'about-2',
      text: 'CSEA E-Cell aims to create an environment where students can explore entrepreneurship, discover real-world problems, collaborate across disciplines, and develop ideas into tangible solutions.',
    },
    {
      id: 'about-3',
      text: 'We believe entrepreneurship is not just something to learn about. It is something to experience, experiment with, and build.',
    },
  ],
};

const APPROACH_DATA: SectionWithCards = {
  title: 'Our Approach',
  cards: [
    {
      id: 'approach-ideate',
      title: 'Ideate',
      description:
        'Identify problems, explore opportunities, challenge assumptions, and develop ideas that have the potential to make a difference.',
    },
    {
      id: 'approach-collaborate',
      title: 'Collaborate',
      description:
        'Connect with fellow students, alumni, industry professionals, and people from different disciplines to turn individual ideas into collective efforts.',
    },
    {
      id: 'approach-build',
      title: 'Build',
      description:
        'Move beyond discussions. Develop projects, test solutions, solve real-world problems, and explore the possibilities of building a venture.',
    },
  ],
};

// These are planned areas of development. Update this section as specific collaborations are confirmed.
const ECOSYSTEM_DATA: SectionWithCards = {
  title: 'Building an Entrepreneurial Ecosystem',
  subtitle: 'Connecting campus to the real world.',
  cards: [
    {
      id: 'eco-academic',
      title: 'Academic Collaboration',
      description:
        'Explore opportunities to work with institutions such as PSG Institute of Management, bringing together technical, managerial, and entrepreneurial perspectives.',
    },
    {
      id: 'eco-alumni',
      title: 'Alumni and Industry Connections',
      description:
        'Work towards connecting students with alumni and industry networks through industry-driven hackathons, hands-on projects, and real-world problem-solving opportunities.',
    },
    {
      id: 'eco-interdisciplinary',
      title: 'Interdisciplinary Innovation',
      description:
        'Encourage students from different departments and associations within PSG Tech to come together, exchange ideas, and build solutions beyond their usual circles.',
    },
  ],
};

const STUDENT_JOURNEY_DATA: SectionWithCards = {
  title: 'Student Journey',
  cards: [
    {
      id: 'journey-discover',
      title: 'Discover Opportunities',
      description:
        'Find people to work with, explore industry connections, and discover ways to take your ideas beyond the classroom.',
    },
    {
      id: 'journey-explore',
      title: 'Explore the Real World',
      description:
        'Talk to people, conduct surveys, understand business problems, learn from entrepreneurs, and build your network.',
    },
    {
      id: 'journey-impact',
      title: 'Create Meaningful Impact',
      description:
        'Engage with communities, understand the challenges they face, and work towards developing practical solutions.',
    },
    {
      id: 'journey-expand',
      title: 'Expand Your Horizons',
      description:
        'Refine your solutions, learn from real entrepreneurial experiences, and explore the possibility of turning your work into a venture.',
    },
  ],
};

const WHO_IS_ECELL_FOR_DATA: SectionWithCards = {
  title: 'Who Is E-Cell For?',
  subtitle: "You don't need a startup idea to get started.",
  cards: [
    {
      id: 'for-idea-person',
      title: 'The Idea Person',
      description:
        'Have an idea? Find the people and opportunities to explore it.',
    },
    {
      id: 'for-builder',
      title: 'The Builder',
      description:
        'Want to create, experiment, and turn concepts into working solutions?',
    },
    {
      id: 'for-collaborator',
      title: 'The Collaborator',
      description:
        'Looking to meet people, build teams, and work across disciplines?',
    },
    {
      id: 'for-explorer',
      title: 'The Explorer',
      description:
        'Curious about entrepreneurship and looking for somewhere to begin?',
    },
  ],
};

const FINAL_CTA_DATA: FinalCTAData = {
  title: 'Your idea deserves a first step.',
  description:
    "Meet people. Explore problems. Build something meaningful. Your entrepreneurial journey doesn't have to start with a business plan. It can start with a conversation.",
  ctaText: 'Get Involved',
};

// Accessor functions
export function getHeroData(): HeroData {
  return HERO_DATA;
}

export function getAboutData(): AboutData {
  return ABOUT_DATA;
}

export function getApproachData(): SectionWithCards {
  return APPROACH_DATA;
}

export function getEcosystemData(): SectionWithCards {
  return ECOSYSTEM_DATA;
}

export function getStudentJourneyData(): SectionWithCards {
  return STUDENT_JOURNEY_DATA;
}

export function getWhoIsECellForData(): SectionWithCards {
  return WHO_IS_ECELL_FOR_DATA;
}

export function getFinalCTAData(): FinalCTAData {
  return FINAL_CTA_DATA;
}

