import { readJsonData } from "@/services/jsonDb";
import { Profile, Project, Skill, Experience, Blog, Certificate, Testimonial } from "@/types/portfolio";
import { PortfolioData } from "../types/portfolioTypes";

export class PortfolioService {
  static async getProfile(): Promise<Profile> {
    return readJsonData<Profile>("profile.json", {
      name: "Abdul Askar",
      title: "Senior Full Stack Engineer",
      subtitle: "Software Architect",
      bio: "",
      avatar: "",
      email: "",
      phone: "",
      location: "",
      cvUrl: "",
      socialLinks: [],
      services: [],
      education: [],
    });
  }

  static async getProjects(): Promise<Project[]> {
    return readJsonData<Project[]>("projects.json", []);
  }

  static async getSkills(): Promise<Skill[]> {
    return readJsonData<Skill[]>("skills.json", []);
  }

  static async getExperience(): Promise<Experience[]> {
    return readJsonData<Experience[]>("experience.json", []);
  }

  static async getBlogs(): Promise<Blog[]> {
    return readJsonData<Blog[]>("blogs.json", []);
  }

  static async getCertificates(): Promise<Certificate[]> {
    return readJsonData<Certificate[]>("certificates.json", []);
  }

  static async getTestimonials(): Promise<Testimonial[]> {
    return readJsonData<Testimonial[]>("testimonials.json", []);
  }

  static async getPortfolioData(): Promise<PortfolioData> {
    const [profile, projects, skills, experience, blogs, certificates, testimonials] = await Promise.all([
      this.getProfile(),
      this.getProjects(),
      this.getSkills(),
      this.getExperience(),
      this.getBlogs(),
      this.getCertificates(),
      this.getTestimonials(),
    ]);

    return {
      profile,
      projects,
      skills,
      experience,
      blogs,
      certificates,
      testimonials,
    };
  }
}
