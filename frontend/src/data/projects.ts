import type { Project } from '@/types'

export const projects: Project[] = [
  {
    slug: 'placeholder-project-one',
    title: 'Campus Innovation Platform',
    summary: 'Empowering student entrepreneurs to build real-world products.',
    description:
      'The Campus Innovation Platform is a centralized digital workspace built to nurture student founders and technical creators across PSG Tech. By bridging departmental silos, the initiative connects multidisciplinary student teams, faculty mentors, and campus resources into a unified pipeline. It directly tackles the fragmented discovery of student innovation, enabling early-stage student ideas to systematically find collaborators, technical validation, and institutional backing.',
    tags: ['Innovation', 'Platform'],
    lead: 'CSEA E-Cell',
    links: [],
    image: undefined, // Replace with project image URL (e.g. '/images/projects/campus-innovation.jpg') when available
    featured: true,
    order: 1,
    status: 'Ongoing',
    kind: 'technical',
    stack: ['React 19 & TypeScript', 'Tailwind CSS', 'Node.js & Express', 'PostgreSQL', 'Redis', 'Docker'],
    change:
      'Aims to dismantle departmental isolation and double cross-disciplinary venture formation across PSG Tech.',
    feasibility: {
      status: 'High Feasibility',
      technicalRequirements:
        'Standard full-stack web architecture with relational database storage, secure JWT session management, and role-based access control.',
      resourceRequirements:
        'A core team of 4 student full-stack developers, 1 UI/UX designer, faculty advisory coordination, and institutional staging servers.',
      timeline:
        'Estimated 3–4 months for initial MVP rollout and departmental beta testing.',
      potentialConstraints:
        'Encouraging user adoption across non-computing departments and ensuring sustained student administrative moderation.',
      summaryAssessment:
        'Highly practical to build and maintain using proven open-source web technologies and student developer capacity with minimal recurring overhead.',
    },
    impact: {
      status: 'Ongoing',
      changeStatement:
        'Aims to dismantle departmental isolation and double cross-disciplinary venture formation across PSG Tech.',
      impactType: 'expected',
      outcomes: [
        'Expected to onboard 500+ active student creators across engineering and management departments.',
        'Aims to foster 30+ multidisciplinary project team formations per academic year.',
        'Designed to streamline mentor-matching cycles from several weeks to under 72 hours.',
      ],
    },
    techOrApproach: {
      type: 'tech-stack',
      title: 'Technology Stack',
      summary:
        'A robust, type-safe web architecture optimized for low-latency interactions, responsive client experiences, and modular campus system integrations.',
      items: [
        { name: 'React 19 & TypeScript', category: 'Frontend', description: 'Declarative component architecture with strict end-to-end type safety.' },
        { name: 'Tailwind CSS', category: 'Styling', description: 'Utility-first styling following the institutional design language.' },
        { name: 'Node.js & Express', category: 'Backend', description: 'RESTful API gateway managing business logic and authorization.' },
        { name: 'PostgreSQL', category: 'Database', description: 'ACID-compliant relational database for student and project records.' },
        { name: 'Redis', category: 'Caching', description: 'High-throughput in-memory cache for session state and rate limiting.' },
        { name: 'Docker', category: 'DevOps', description: 'Containerized deployment for consistent local testing and cloud staging.' },
      ],
    },
  },
  {
    slug: 'placeholder-project-two',
    title: 'Alumni Venture Network',
    summary: 'Bridging current founders with experienced PSG Tech alumni.',
    description:
      'The Alumni Venture Network connects ambitious student founders with PSG Tech alumni who are active startup operators, corporate leaders, and angel investors. It addresses the critical gap in early-stage industry mentorship, domain feedback, and investor access faced by collegiate startups. Through structured cohort matching, founder office hours, and venture advisory circles, student innovators receive tactical guidance from experienced alumni.',
    tags: ['Network', 'Mentorship'],
    lead: 'CSEA E-Cell',
    links: [],
    image: undefined, // Replace with project image URL when available
    featured: true,
    order: 2,
    status: 'Proposed',
    kind: 'non-technical',
    stack: ['Cohort Matching', 'Founder Office Hours', 'Venture Advisory Circles', 'Alumni Mentorship'],
    change:
      'Aims to build a permanent, structured pipeline of alumni expertise that de-risks and accelerates student entrepreneurship.',
    feasibility: {
      status: 'High Feasibility',
      technicalRequirements:
        'Low technical barrier; requires structured scheduling tools, secure communication channels, and an internal membership directory.',
      resourceRequirements:
        'Alumni relations liaison team, 2 student cohort coordinators, and participating alumni mentors across diverse industries.',
      timeline:
        'Estimated 2 months to establish the inaugural advisory circle and onboard the first pilot mentor cohort.',
      potentialConstraints:
        'Balancing busy alumni schedules across domestic and international time zones and maintaining mentor engagement over multiple terms.',
      summaryAssessment:
        'Extremely practical to execute by harnessing the extensive, highly supportive PSG Tech global alumni community with minimal financial requirements.',
    },
    impact: {
      status: 'Proposed',
      changeStatement:
        'Aims to build a permanent, structured pipeline of alumni expertise that de-risks and accelerates student entrepreneurship.',
      impactType: 'expected',
      outcomes: [
        'Targeting 25+ dedicated alumni venture advisors across deep-tech, manufacturing, SaaS, and venture capital.',
        'Aims to provide 1-on-1 strategic mentorship to 15+ student startups each semester.',
        'Expected to host bi-monthly virtual founder office hours and investor feedback roundtables.',
      ],
    },
    techOrApproach: {
      type: 'approach',
      title: 'Strategic Approach & Execution Strategy',
      summary:
        'A structured, relationship-driven mentorship and engagement framework grounded in cohort milestones and institutional collaboration.',
      items: [
        { name: 'Cohort-Based Needs Matching', category: 'Matching Framework', description: 'Systematic alignment of startup requirements with specific alumni domain expertise.' },
        { name: 'Bi-Weekly Founder Office Hours', category: 'Mentorship', description: 'Direct 45-minute tactical review sessions focused on unit economics and product-market fit.' },
        { name: 'Alumni Advisory Circles', category: 'Governance', description: 'Quarterly strategic advisory check-ins for high-growth student ventures.' },
        { name: 'Alumni Association Partnership', category: 'Institutional Outreach', description: 'Coordination with PSG Tech Alumni Association chapters worldwide.' },
      ],
    },
  },
  {
    slug: 'placeholder-project-three',
    title: 'Interdisciplinary Hackathon',
    summary: 'Solving real-world industry problems through tech collaboration.',
    description:
      'The Interdisciplinary Hackathon is an intensive 36-hour sprint where engineering, design, and management students join forces to tackle vetted industrial and societal challenges. It solves the traditional isolation between technical disciplines by mandating cross-domain teamwork for comprehensive solution design. Participants receive real-time technical and commercial mentoring from industry leaders to transform raw ideas into working prototypes.',
    tags: ['Hackathon', 'Community'],
    lead: 'CSEA E-Cell',
    links: [],
    image: undefined, // Replace with project image URL when available
    featured: true,
    order: 3,
    status: 'Ongoing',
    kind: 'non-technical',
    stack: ['Problem Statement Curation', 'Cross-Domain Team Formation', 'Milestone Checkpoints', 'Rubric Evaluation'],
    change:
      'Cultivates rapid problem-solving, real-time collaboration under pressure, and cross-functional prototype validation.',
    feasibility: {
      status: 'High Feasibility',
      technicalRequirements:
        'Robust campus networking infrastructure, staging cloud credits, project submission portal, and audio-visual presentation equipment.',
      resourceRequirements:
        'Event organizing committee of 25 student leaders, faculty advisors, 12 industry judges, and campus auditorium/laboratory access.',
      timeline:
        'Estimated 6–8 weeks of pre-event coordination, sponsor acquisition, and team registrations.',
      potentialConstraints:
        'Coordinating round-the-clock campus facility access, managing laboratory safety, and securing corporate sponsorship commitments.',
      summaryAssessment:
        'Proven event format with strong precedent within CSEA; highly feasible given established campus infrastructure and active student leadership.',
    },
    impact: {
      status: 'Ongoing',
      changeStatement:
        'Cultivates rapid problem-solving, real-time collaboration under pressure, and cross-functional prototype validation.',
      impactType: 'expected',
      outcomes: [
        'Expected participation of 250+ undergraduate engineers and designers across 60+ diverse teams.',
        'Targeting 15+ real-world problem statements provided directly by corporate sponsors and community partners.',
        'Aims for at least 5 top prototypes to be incubated into ongoing startup and patent initiatives.',
      ],
    },
    techOrApproach: {
      type: 'approach',
      title: 'Execution Strategy & Methodology',
      summary:
        'A disciplined sprint methodology combining rapid prototyping cycles, interdisciplinary pairing, and milestone-driven technical evaluations.',
      items: [
        { name: 'Problem Statement Curation', category: 'Preparation', description: 'Curating authentic challenge statements vetted with industry and social enterprise partners.' },
        { name: 'Cross-Domain Team Formation', category: 'Collaboration', description: 'Mandatory pairing of computing, core engineering, and product/design talent.' },
        { name: 'Milestone Checkpoints', category: 'Sprint Process', description: 'Four structured checkpoints: ideation pitch, architecture review, demo test, and final presentation.' },
        { name: 'Rubric-Based Evaluation', category: 'Assessment', description: 'Standardized grading on technical merit, operational feasibility, and market viability.' },
      ],
    },
  },
  {
    slug: 'campus-connect',
    title: 'Campus Connect',
    summary: 'Unified portal linking student talent with campus startup ventures.',
    description:
      'Campus Connect is a talent discovery and recruitment portal designed specifically for student-led startups and aspiring campus builders. Student founders frequently struggle to recruit co-founders, UI designers, and embedded engineers from other departments due to limited physical reach. Campus Connect provides a verified repository of student skillsets and venture openings, streamlining collaboration from residence halls to incubation labs.',
    tags: ['Networking', 'Collaboration'],
    lead: 'CSEA E-Cell',
    links: [],
    image: undefined, // Replace with project image URL when available
    featured: false,
    order: 4,
    status: 'Proposed',
    kind: 'technical',
    stack: ['React & Vite', 'Tailwind CSS', 'Node.js & Express', 'PostgreSQL', 'JWT & OAuth2'],
    change:
      'Aims to remove barriers to campus startup talent acquisition, accelerating team formation from weeks to days.',
    feasibility: {
      status: 'High Feasibility',
      technicalRequirements:
        'Modern responsive web application with profile validation, skill tagging, search indexing, and real-time in-app notification services.',
      resourceRequirements:
        '3 student web developers, 1 UI designer, student outreach ambassadors, and institutional roll-out clearance.',
      timeline:
        'Estimated 8–10 weeks for MVP construction, authentication hardening, and initial campus beta rollout.',
      potentialConstraints:
        'Ensuring accurate self-reporting of student skills and maintaining sustained engagement beyond the initial registration drive.',
      summaryAssessment:
        'Technically straightforward and well within the capabilities of undergraduate student developers utilizing standard open-source tooling.',
    },
    impact: {
      status: 'Proposed',
      changeStatement:
        'Aims to remove barriers to campus startup talent acquisition, accelerating team formation from weeks to days.',
      impactType: 'expected',
      outcomes: [
        'Aims to connect 400+ student creators across computing, electrical, mechanical, and design disciplines.',
        'Targeted to support 25+ student ventures in filling critical engineering and marketing vacancies.',
        'Expected to reduce average co-founder discovery time to under 48 hours.',
      ],
    },
    techOrApproach: {
      type: 'tech-stack',
      title: 'Technology Stack',
      summary:
        'A high-performance modern web stack featuring reactive client state, secure JWT authorization, and indexed search capabilities.',
      items: [
        { name: 'React & Vite', category: 'Frontend', description: 'Lightweight, rapid-rendering client application with modern build optimizations.' },
        { name: 'Tailwind CSS', category: 'Styling', description: 'Consistent interface tokens aligning with institutional design guidelines.' },
        { name: 'Node.js & Express', category: 'Backend', description: 'RESTful API backend managing applicant workflows and profile queries.' },
        { name: 'PostgreSQL', category: 'Database', description: 'Indexed relational database storing verified credentials and venture profiles.' },
        { name: 'JWT & OAuth2', category: 'Security', description: 'Secure campus identity validation and session state management.' },
      ],
    },
  },
  {
    slug: 'greenloop',
    title: 'GreenLoop',
    summary: 'Circular campus economy and sustainable waste exchange network.',
    description:
      'GreenLoop is a student-driven circular economy platform that coordinates the reuse, redistribution, and recycling of materials across campus hostels and laboratories. Every academic semester, substantial volumes of textbooks, electronic components, drafting tools, and hardware kits are discarded. GreenLoop establishes decentralized drop-off points and an exchange directory so incoming students can acquire essential academic materials at nominal or zero cost.',
    tags: ['Sustainability', 'Eco'],
    lead: 'CSEA E-Cell',
    links: [],
    image: undefined, // Replace with project image URL when available
    featured: false,
    order: 5,
    status: 'Ongoing',
    kind: 'non-technical',
    stack: ['Hostel Hubs', 'Quality Triage', 'Mobile QR Logging', 'Distribution Fairs'],
    change:
      'Instills sustainable consumption habits across campus and diverts functional student materials from local landfills.',
    feasibility: {
      status: 'Feasible',
      technicalRequirements:
        'Lightweight mobile-friendly web catalog for logging collected inventory with QR-code scanning capabilities.',
      resourceRequirements:
        'Hostel student coordinator committee, campus sanitation department alignment, and designated hostel sorting rooms.',
      timeline:
        'Estimated 6 weeks to establish collection hubs ahead of end-of-semester examinations.',
      potentialConstraints:
        'Student volunteer availability during exam periods, verifying cleanliness and quality of donated items, and vacation storage limits.',
      summaryAssessment:
        'Highly feasible operationally; requires diligent coordination between hostel representatives and student volunteers with very low capital expenditure.',
    },
    impact: {
      status: 'Ongoing',
      changeStatement:
        'Instills sustainable consumption habits across campus and diverts functional student materials from local landfills.',
      impactType: 'expected',
      outcomes: [
        'Aims to divert 1.5+ tons of academic supplies and electronic components from waste streams annually.',
        'Targeted to support 300+ junior students with subsidized or free textbooks, drafting gear, and electronic starter kits.',
        'Creates an actionable campus sustainability blueprint that can be expanded to other collegiate institutions.',
      ],
    },
    techOrApproach: {
      type: 'approach',
      title: 'Operational Methodology & Logistics',
      summary:
        'A decentralized logistics framework combining physical campus collection hubs with transparent digital inventory tracking.',
      items: [
        { name: 'Decentralized Hostel Hubs', category: 'Collection', description: 'Designated drop-off receptacles located in each residential hostel block.' },
        { name: 'Volunteer Quality Triage', category: 'Inspection', description: 'Student team verification of item integrity and safety prior to cataloging.' },
        { name: 'Mobile QR Logging', category: 'Inventory', description: 'Rapid mobile scanning to record available equipment in the campus exchange directory.' },
        { name: 'End-of-Term Distribution Fairs', category: 'Redistribution', description: 'Campus pop-up distribution events where students claim items for the upcoming semester.' },
      ],
    },
  },
  {
    slug: 'skillbridge',
    title: 'SkillBridge',
    summary: 'Peer mentorship platform matching technical and product skills.',
    description:
      'SkillBridge is a peer-to-peer micro-mentorship platform connecting junior students with experienced upperclassmen for practical tech and product guidance. It solves the barrier juniors face when seeking targeted, informal advice on competitive programming, open source, and hackathons. By facilitating structured 30-minute 1-on-1 sessions, it democratizes access to institutional knowledge.',
    tags: ['EdTech', 'Mentorship'],
    lead: 'CSEA E-Cell',
    links: [],
    image: undefined, // Replace with project image URL when available
    featured: false,
    order: 6,
    status: 'Proposed',
    kind: 'technical',
    stack: ['React 19 & TypeScript', 'Tailwind CSS', 'Node.js & WebSockets', 'PostgreSQL & Supabase', 'WebRTC'],
    change:
      'Empowers junior students to accelerate technical proficiency through empathetic, relatable peer-to-peer guidance.',
    feasibility: {
      status: 'High Feasibility',
      technicalRequirements:
        'Web application with calendar integration, automated scheduling, video room signaling, and feedback logging.',
      resourceRequirements:
        'Student frontend/backend team of 3, student community leads, and mentor onboarding coordinators.',
      timeline:
        'Estimated 6–8 weeks from architecture design to campus beta rollout.',
      potentialConstraints:
        'Peer mentor availability during examination schedules and maintaining punctuality.',
      summaryAssessment:
        'Very practical to build and deploy using open-source WebRTC tools and established cloud providers within student developer capacity.',
    },
    impact: {
      status: 'Proposed',
      changeStatement:
        'Empowers junior students to accelerate technical proficiency through empathetic, relatable peer-to-peer guidance.',
      impactType: 'expected',
      outcomes: [
        'Aims to host 200+ monthly peer mentorship sessions across software, design, and hardware disciplines.',
        'Expected to reduce first-year onboarding friction for technical clubs and hackathons.',
        'Builds a continuous culture of giving back as mentees become upper-year mentors.',
      ],
    },
    techOrApproach: {
      type: 'tech-stack',
      title: 'Technology Stack',
      summary:
        'Real-time communication and scheduling architecture built with modern TypeScript web technologies.',
      items: [
        { name: 'React 19 & TypeScript', category: 'Frontend', description: 'Client application with type safety and interactive UI states.' },
        { name: 'Tailwind CSS', category: 'Styling', description: 'Modern, accessible design system matching campus guidelines.' },
        { name: 'Node.js & WebSockets', category: 'Real-time', description: 'Signaling server for WebRTC peer connection establishment.' },
        { name: 'PostgreSQL & Supabase', category: 'Database', description: 'Relational data store managing profiles, availability, and session ratings.' },
        { name: 'WebRTC', category: 'Media', description: 'Peer-to-peer encrypted video and audio communication in browser.' },
      ],
    },
  },
  {
    slug: 'agrisense',
    title: 'AgriSense',
    summary: 'Smart IoT telemetry helping local farmers optimize irrigation.',
    description:
      'AgriSense is a low-cost IoT sensor telemetry platform designed to help local farming communities optimize irrigation and soil nutrient management. It tackles excessive water consumption and crop stress caused by imprecise manual watering schedules. By deploying ruggedized soil moisture, pH, and ambient sensors with cellular and LoRa telemetry, farmers receive actionable SMS and dashboard alerts.',
    tags: ['IoT', 'AgriTech'],
    lead: 'CSEA E-Cell',
    links: [],
    image: undefined, // Replace with project image URL when available
    featured: false,
    order: 7,
    status: 'Ongoing',
    kind: 'technical',
    stack: ['ESP32 & Arduino', 'LoRaWAN & GSM', 'Python & FastAPI', 'TimescaleDB', 'React & Chart.js'],
    change:
      'Aims to deliver accessible, data-driven irrigation guidance to smallholder farmers to conserve water and improve yield consistency.',
    feasibility: {
      status: 'Moderate Feasibility',
      technicalRequirements:
        'Embedded sensor design, low-power LoRaWAN or GSM telemetry, solar battery charging circuitry, and cloud data aggregation pipelines.',
      resourceRequirements:
        'Hardware engineering team of 4, agricultural faculty advisor, access to PSG Tech fabrication labs, and participating pilot farm.',
      timeline:
        'Estimated 4–5 months including PCB iteration, sensor calibration, and initial field testing.',
      potentialConstraints:
        'Sensor probe degradation in acidic soil conditions, rural network coverage limitations, and weatherproofing against monsoons.',
      summaryAssessment:
        'Technically viable with lab prototyping facilities at PSG Tech, though requires rigorous field validation and calibration before wider rollout.',
    },
    impact: {
      status: 'Ongoing',
      changeStatement:
        'Aims to deliver accessible, data-driven irrigation guidance to smallholder farmers to conserve water and improve yield consistency.',
      impactType: 'expected',
      outcomes: [
        'Projected 20–30% reduction in agricultural water waste during pilot dry season trials.',
        'Aims to deploy 10 pilot nodes across partnered local farms in Coimbatore district.',
        'Provides farmers with local-language SMS alerts for optimal irrigation timing.',
      ],
    },
    techOrApproach: {
      type: 'tech-stack',
      title: 'Technology Stack',
      summary:
        'End-to-end IoT architecture combining low-power microcontroller hardware with cloud time-series telemetry.',
      items: [
        { name: 'ESP32 & Arduino', category: 'Hardware', description: 'Low-power microcontroller managing analog/digital sensor readings.' },
        { name: 'LoRaWAN & GSM', category: 'Telemetry', description: 'Long-range, low-power RF protocol transmitting sensor telemetry to gateways.' },
        { name: 'Python & FastAPI', category: 'Backend', description: 'High-performance backend ingesting telemetry and dispatching alerts.' },
        { name: 'PostgreSQL / TimescaleDB', category: 'Time-Series DB', description: 'Optimized storage for time-series soil moisture and temperature readings.' },
        { name: 'React & Chart.js', category: 'Dashboard', description: 'Web dashboard providing trend visualizations and sensor health monitoring.' },
      ],
    },
  },
  {
    slug: 'meditrack',
    title: 'MediTrack',
    summary: 'Streamlined health record keeping and campus clinic scheduling.',
    description:
      'MediTrack is a digital clinical workflow and appointment scheduling system engineered for collegiate health centers and student wellness services. It replaces cumbersome paper logs and overcrowded waiting rooms with digital triage and confidential health record keeping. The system ensures student patient privacy while streamlining prescription fulfillment and follow-up care.',
    tags: ['HealthTech', 'Operations'],
    lead: 'CSEA E-Cell',
    links: [],
    image: undefined, // Replace with project image URL when available
    featured: false,
    order: 8,
    status: 'Proposed',
    kind: 'technical',
    stack: ['React & TypeScript', 'Tailwind CSS', 'Python & FastAPI', 'PostgreSQL (AES-256)', 'Docker & TLS'],
    change:
      'Aims to modernize collegiate healthcare delivery, eliminating clinic waiting bottlenecks and protecting student health privacy.',
    feasibility: {
      status: 'Under Feasibility Review',
      technicalRequirements:
        'Compliance-grade encryption, secure role-based medical record access, audit logging, and automated appointment queuing.',
      resourceRequirements:
        'Full-stack development team, campus medical officer consultation, and legal/data compliance oversight.',
      timeline:
        'Estimated 5–6 months subject to compliance clearance and institutional approval.',
      potentialConstraints:
        'Strict medical confidentiality regulations, consent workflows, and integration with existing campus administration systems.',
      summaryAssessment:
        'Technically achievable, but requires formal regulatory verification and institutional approval before prototype deployment.',
    },
    impact: {
      status: 'Proposed',
      changeStatement:
        'Aims to modernize collegiate healthcare delivery, eliminating clinic waiting bottlenecks and protecting student health privacy.',
      impactType: 'expected',
      outcomes: [
        'Expected to cut student clinic wait times by an estimated 40% through scheduled digital triage.',
        'Aims to provide 100% digital, confidential prescription and referral tracking.',
        'Targeted implementation for over 8,000 campus students and staff members.',
      ],
    },
    techOrApproach: {
      type: 'tech-stack',
      title: 'Technology Stack',
      summary:
        'Secure, compliance-focused web architecture featuring role-based data isolation and encrypted medical logs.',
      items: [
        { name: 'React & TypeScript', category: 'Frontend', description: 'Clinical and student interfaces designed with accessibility and speed.' },
        { name: 'Tailwind CSS', category: 'Styling', description: 'High-contrast, clean UI system for clinical environments.' },
        { name: 'Python & FastAPI', category: 'Backend', description: 'Secure REST services with automated audit logging and token verification.' },
        { name: 'PostgreSQL (AES-256)', category: 'Database', description: 'Encrypted storage for patient records and consultation histories.' },
        { name: 'Docker & TLS', category: 'Security', description: 'Isolated container environment with end-to-end encryption in transit.' },
      ],
    },
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => a.order - b.order)
}

export function getAdjacentProjects(slug: string): {
  prev?: Project
  next?: Project
} {
  const sorted = getAllProjects()
  const index = sorted.findIndex((p) => p.slug === slug)
  if (index === -1) return {}
  return {
    prev: index > 0 ? sorted[index - 1] : undefined,
    next: index < sorted.length - 1 ? sorted[index + 1] : undefined,
  }
}
