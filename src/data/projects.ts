import { Project } from "@/types/project";
import { WorksWheelItem } from "@/components/ui/works-wheel";

const ART = (name: string) => `https://www.crafterui.com/art/${name}.jpg`;

export const PROJECTS: Project[] = [
  {
    slug: "ecogrid-energy",
    title: "EcoGrid Energy",
    tagline: "Decentralized Microgrid AI Management",
    coverImage: ART("prismatic-rift-anime"),
    description: "An AI-powered decentralized microgrid optimizer designed for industrial campuses. EcoGrid autonomously orchestrates solar, wind, and battery storage to cut peak tariff expenses by up to 34%.",
    technologies: ["IoT Edge", "Rust", "TensorFlow", "FastAPI", "InfluxDB"],
    teamLead: "Karthik Subramanian",
    teamMembers: ["Ananya Rao", "Vignesh Murugan"],
    domain: "CleanTech & Energy",
    featured: true,
    links: [
      { label: "Live Demo", url: "https://example.com/ecogrid" },
      { label: "GitHub", url: "https://github.com/example/ecogrid" }
    ]
  },
  {
    slug: "aeropulse-drones",
    title: "AeroPulse Fleet",
    tagline: "Autonomous Healthcare Drone Logistics",
    coverImage: ART("rocket-launch-gradient"),
    description: "Cold-chain medical logistics drone system capable of autonomous delivery of emergency blood and antivenom supplies to remote rural healthcare centers within a 45km radius.",
    technologies: ["Computer Vision", "PX4 Autopilot", "ROS2", "Next.js", "WebRTC"],
    teamLead: "Deepak Shanmugam",
    teamMembers: ["Pooja Krishnan", "Rahul Dev"],
    domain: "Aerospace & Robotics",
    featured: true,
    links: [
      { label: "Project Spec", url: "https://example.com/aeropulse" }
    ]
  },
  {
    slug: "neurosync-bci",
    title: "NeuroSync BCI",
    tagline: "Low-Cost Assistive Neural Interface",
    coverImage: ART("celestial-light-figure"),
    description: "Non-invasive brain-computer interface enabling motor-impaired patients to control smart assistive wheelchairs and communication synthesizers with ultra-low latency.",
    technologies: ["EEG Biosensing", "Signal Processing", "PyTorch", "C++", "Bluetooth LE"],
    teamLead: "Shreya Sundaram",
    teamMembers: ["Harish Narayanan", "Dinesh Kumar"],
    domain: "DeepTech & Health",
    featured: true,
    links: [
      { label: "Research Paper", url: "https://example.com/neurosync" }
    ]
  },
  {
    slug: "agrisense-iot",
    title: "AgriSense Smart Soil",
    tagline: "Precision Crop Yield & Irrigation Intelligence",
    coverImage: ART("black-hole-ember-clouds"),
    description: "Solar-powered LoRaWAN soil moisture, NPK fertility, and canopy temperature sensor nodes connected to predictive irrigation scheduling models.",
    technologies: ["LoRaWAN", "Embedded C", "Node.js", "TimescaleDB", "React"],
    teamLead: "Gautham Balaji",
    teamMembers: ["Meera Venkat", "Rohan Prasad"],
    domain: "AgriTech",
    featured: false,
    links: [
      { label: "Product Overview", url: "https://example.com/agrisense" }
    ]
  },
  {
    slug: "medflow-diagnostics",
    title: "MedFlow Diagnostics",
    tagline: "Point-of-Care Microfluidic Blood Screening",
    coverImage: ART("neon-portrait-uplight"),
    description: "Handheld microfluidic lab-on-a-chip device paired with smartphone optical sensors to screen for infectious diseases in under 8 minutes.",
    technologies: ["Biomedical Optics", "Microfluidics", "Flutter", "Edge TPU"],
    teamLead: "Aishwarya Natarajan",
    teamMembers: ["Siddharth Jayaraman"],
    domain: "HealthTech",
    featured: true,
    links: [
      { label: "Clinical Trial Data", url: "https://example.com/medflow" }
    ]
  },
  {
    slug: "hyperledger-trace",
    title: "HyperLedger Trace",
    tagline: "Cryptographic Supply Chain Provenance",
    coverImage: ART("neon-cave-portal-silhouette"),
    description: "End-to-end supply chain verification tracking organic agricultural produce and certified textiles from farm harvest to consumer retail shelf.",
    technologies: ["Solidity", "Zero-Knowledge Proofs", "TypeScript", "Ethers.js"],
    teamLead: "Naveen Prakash",
    teamMembers: ["Divya Selvam", "Arun V."],
    domain: "Web3 & Logistics",
    featured: false,
    links: [
      { label: "Whitepaper", url: "https://example.com/hyperledger" }
    ]
  },
  {
    slug: "solaris-powertrain",
    title: "Solaris EV Drive",
    tagline: "High-Efficiency Axial Flux Motor Drive",
    coverImage: ART("indigo-liquid-marble"),
    description: "High power-density axial flux motor controller architecture delivering 96.8% electrical conversion efficiency for lightweight electric mobility.",
    technologies: ["Power Electronics", "STM32 DSP", "CAN Bus", "Thermal Modeling"],
    teamLead: "Pranav Rajan",
    teamMembers: ["Kavya Mohan"],
    domain: "CleanTech & EV",
    featured: false,
    links: [
      { label: "CAD & Telemetry", url: "https://example.com/solaris" }
    ]
  },
  {
    slug: "nanopure-filters",
    title: "NanoPure Filtration",
    tagline: "Graphene Oxide Membrane Water Purifier",
    coverImage: ART("red-ribbon-typography"),
    description: "Gravity-driven nano-membrane filtration technology eliminating heavy metal ions, fluoride, and microplastics from rural groundwater reservoirs without electricity.",
    technologies: ["Nanotechnology", "Material Science", "Fluid Mechanics"],
    teamLead: "Sanjay Swaminathan",
    teamMembers: ["Revathi S."],
    domain: "Sustainability",
    featured: false,
    links: [
      { label: "Lab Validation", url: "https://example.com/nanopure" }
    ]
  },
  {
    slug: "quantumforge-sim",
    title: "QuantumForge",
    tagline: "Computational Material Discovery Engine",
    coverImage: ART("astronaut-cosmic-wave"),
    description: "Accelerated density functional theory (DFT) simulation platform empowering material scientists to discover novel battery cathode alloys in days instead of months.",
    technologies: ["Quantum Computing", "Python", "CUDA", "WebGL", "Three.js"],
    teamLead: "Varun Chandrasekar",
    teamMembers: ["Akshaya Ramesh", "Ganesh K."],
    domain: "DeepTech",
    featured: true,
    links: [
      { label: "Interactive Sandbox", url: "https://example.com/quantumforge" }
    ]
  }
];

export function getProjects(): Project[] {
  return PROJECTS;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getWorksWheelItems(): WorksWheelItem[] {
  return PROJECTS.map((project) => ({
    title: project.title,
    image: project.coverImage,
    href: `/projects/${project.slug}`
  }));
}
