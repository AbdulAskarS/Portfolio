export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface Service {
  title: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  duration: string;
}

export interface Profile {
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
  cvUrl: string;
  socialLinks: SocialLink[];
  services: Service[];
  education: Education[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: "Frontend" | "Backend" | "DevOps" | "Tools" | "Languages";
  level: number; // 0 to 100
  icon: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  startDate: string; // YYYY-MM
  endDate?: string;  // YYYY-MM (or "Present")
  current: boolean;
  description: string[];
  skills: string[];
}

export interface Blog {
  id: string;
  title: string;
  description: string;
  content: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  published: boolean;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  text: string;
  rating: number; // 1 to 5
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  mapUrl?: string;
  availability: string;
}
