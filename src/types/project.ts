export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline?: string;
  coverImage: string;
  description: string;
  technologies: string[];
  teamLead: string;
  teamMembers?: string[];
  domain?: string;
  links?: ProjectLink[];
  featured?: boolean;
}
