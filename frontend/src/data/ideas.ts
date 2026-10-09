import type { IdeaStep } from '@/types'

export const ideas: IdeaStep[] = [
  {
    id: 'about',
    eyebrow: '01 - ABOUT E-CELL',
    headlineTop: 'More Than',
    headlineAccent: 'An Idea',
    body: 'Every meaningful venture starts with an idea, but turning it into reality takes the right people, the right opportunities, and the willingness to take the first step. CSEA E-Cell gives students a place to experience entrepreneurship, not just learn about it.',
    pills: ['EXPLORE', 'DISCOVER', 'COLLABORATE', 'BUILD'],
    layout: 'quote',
    sideLabel: 'PSG College of Technology',
    cards: [
      {
        text: 'Entrepreneurship is not just something to learn about. It is something to experience, experiment with, and build.',
      },
    ],
    microLabels: ['ENTREPRENEURSHIP', 'REAL PROBLEMS'],
  },
  {
    id: 'approach',
    eyebrow: '02 - OUR APPROACH',
    headlineTop: 'Our',
    headlineAccent: 'Approach',
    body: 'A simple loop for turning curiosity into something that matters.',
    pills: ['IDEATE', 'COLLABORATE', 'BUILD'],
    layout: 'trio',
    cards: [
      {
        index: '01',
        title: 'Ideate',
        text: 'Identify problems, explore opportunities, challenge assumptions, and develop ideas that can make a difference.',
      },
      {
        index: '02',
        title: 'Collaborate',
        text: 'Connect with fellow students, alumni, industry professionals, and people from other disciplines to turn individual ideas into collective efforts.',
      },
      {
        index: '03',
        title: 'Build',
        text: 'Move beyond discussion. Develop projects, test solutions, and solve real-world problems.',
      },
    ],
    microLabels: ['IDEAS', 'TEAMS', 'SOLUTIONS'],
  },
  {
    id: 'ecosystem',
    eyebrow: '03 - ECOSYSTEM',
    headlineTop: 'Real-World',
    headlineAccent: 'Connections',
    body: 'Connecting campus to the real world.',
    pills: ['ACADEMIA', 'ALUMNI', 'INDUSTRY'],
    layout: 'trio',
    cards: [
      {
        index: '01',
        title: 'Academic Collaboration',
        text: 'Explore opportunities to work with institutions such as PSG Institute of Management, bringing together technical, managerial, and entrepreneurial perspectives.',
      },
      {
        index: '02',
        title: 'Alumni and Industry Connections',
        text: 'Work towards connecting students with alumni and industry networks through industry-driven hackathons, hands-on projects, and real-world problem solving.',
      },
      {
        index: '03',
        title: 'Interdisciplinary Innovation',
        text: 'Encourage students from different departments and associations within PSG Tech to exchange ideas and build solutions beyond their usual circles.',
      },
    ],
    microLabels: ['PARTNERSHIPS', 'NETWORKS'],
  },
  {
    id: 'journey',
    eyebrow: '04 - STUDENT JOURNEY',
    headlineTop: 'Your',
    headlineAccent: 'Journey',
    body: 'From first conversation to a possible venture.',
    pills: ['DISCOVER', 'EXPLORE', 'CREATE', 'EXPAND'],
    layout: 'quad',
    cards: [
      {
        index: '01',
        title: 'Discover Opportunities',
        text: 'Find people to work with, explore industry connections, and take your ideas beyond the classroom.',
      },
      {
        index: '02',
        title: 'Explore the Real World',
        text: 'Talk to people, conduct surveys, understand business problems, and learn from entrepreneurs.',
      },
      {
        index: '03',
        title: 'Create Meaningful Impact',
        text: 'Engage with communities, understand their challenges, and work towards practical solutions.',
      },
      {
        index: '04',
        title: 'Expand Your Horizons',
        text: 'Refine your solutions, learn from real entrepreneurial experiences, and explore turning your work into a venture.',
      },
    ],
    microLabels: ['LEARN', 'TEST', 'GROW'],
  },
  {
    id: 'audience',
    eyebrow: '05 - WHO IS E-CELL FOR',
    headlineTop: 'Who Is',
    headlineAccent: 'E-Cell For',
    body: "You don't need a startup idea to get started.",
    pills: ['IDEA', 'BUILD', 'COLLABORATE', 'EXPLORE'],
    layout: 'grid2x2',
    cards: [
      {
        index: '01',
        title: 'The Idea Person',
        text: 'Have an idea? Find the people and opportunities to explore it.',
      },
      {
        index: '02',
        title: 'The Builder',
        text: 'Want to create, experiment, and turn concepts into working solutions?',
      },
      {
        index: '03',
        title: 'The Collaborator',
        text: 'Looking to meet people, build teams, and work across disciplines?',
      },
      {
        index: '04',
        title: 'The Explorer',
        text: 'Curious about entrepreneurship and looking for somewhere to begin?',
      },
    ],
    microLabels: ['OPEN TO ALL DEPARTMENTS'],
  },
]
