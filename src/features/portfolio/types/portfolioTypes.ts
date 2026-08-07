import { Profile, Project, Skill, Experience, Blog, Certificate, Testimonial } from "@/types/portfolio";
import { z } from "zod";

export interface PortfolioData {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  blogs: Blog[];
  certificates: Certificate[];
  testimonials: Testimonial[];
}

export const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(3, { message: "Subject must be at least 3 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export type ContactInput = z.infer<typeof contactSchema>;
