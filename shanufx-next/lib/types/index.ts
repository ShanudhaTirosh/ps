export interface Skill {
  id: string;
  label: string;
  icon: string;
  level: 'Specialist' | 'Expert' | 'Advanced' | 'Proficient' | 'Learning';
  color: string;
}

export interface Project {
  id: string;
  title: string;
  category: 'Web' | 'Android' | 'Bot' | 'IoT' | 'Desktop' | 'Other';
  status: 'Active' | 'Completed' | 'Archived';
  desc: string;
  link: string;
  icon: string;
  color: string;
  tags: string[];
  stars?: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  desc: string;
  order: number;
}

export interface Service {
  id: string;
  title: string;
  icon: string;
  color: string;
  desc: string;
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  avatar: string;
  createdAt?: unknown;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt?: unknown;
}

export interface SiteSettings {
  discordWebhook?: string;
  siteTitle?: string;
  maintenance?: boolean;
}

export type UserRole = 'primary' | 'admin' | null;
