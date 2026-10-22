export interface Experience {
  id?: string;
  title: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
  live: string;
  featured: boolean;
  video_url?: string | null;
  demo_login?: string | null;
  health_demo?: boolean | null;
}

export interface SkillCategory {
  id?: string;
  category: string;
  items: string[];
}

export interface PortfolioSettings {
  resume_url: string;
  job_available: boolean;
}