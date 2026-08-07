import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  title: z.string().min(2, { message: "Title is required" }),
  subtitle: z.string().min(2, { message: "Subtitle is required" }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
  avatar: z.string().url({ message: "Must be a valid URL" }),
  email: z.string().email({ message: "Must be a valid email" }),
  phone: z.string().min(5, { message: "Phone is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  cvUrl: z.string().optional(),
});

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, { message: "Title is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  longDescription: z.string().optional(),
  image: z.string().url({ message: "Must be a valid image URL" }),
  tags: z.string().min(1, { message: "Tags are required (comma separated)" }),
  demoUrl: z.string().url({ message: "Must be a valid URL" }).or(z.literal("")).optional(),
  githubUrl: z.string().url({ message: "Must be a valid URL" }).or(z.literal("")).optional(),
  featured: z.boolean(),
});

export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Name is required" }),
  category: z.enum(["Frontend", "Backend", "DevOps", "Tools", "Languages"]),
  level: z.number().min(0).max(100, { message: "Level must be between 0 and 100" }),
  icon: z.string().min(1, { message: "Icon name is required" }),
});

export const experienceSchema = z.object({
  id: z.string().optional(),
  role: z.string().min(2, { message: "Role is required" }),
  company: z.string().min(2, { message: "Company is required" }),
  companyUrl: z.string().url({ message: "Must be a valid URL" }).or(z.literal("")).optional(),
  location: z.string().min(2, { message: "Location is required" }),
  startDate: z.string().regex(/^\d{4}-\d{2}$/, { message: "Format must be YYYY-MM" }),
  endDate: z.string().or(z.literal("")).or(z.literal("Present")).optional(),
  current: z.boolean(),
  description: z.string().min(5, { message: "Accomplishments are required (newline separated)" }),
  skills: z.string().min(1, { message: "Skills are required (comma separated)" }),
});

export const certificateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Name is required" }),
  issuer: z.string().min(2, { message: "Issuer is required" }),
  issueDate: z.string().regex(/^\d{4}-\d{2}$/, { message: "Format must be YYYY-MM" }),
  expiryDate: z.string().regex(/^\d{4}-\d{2}$/, { message: "Format must be YYYY-MM" }).or(z.literal("")).optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url({ message: "Must be a valid URL" }).or(z.literal("")).optional(),
  image: z.string().url({ message: "Must be a valid image URL" }),
});

export const blogSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  content: z.string().min(20, { message: "Content must be at least 20 characters" }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Format must be YYYY-MM-DD" }),
  readTime: z.string().min(1, { message: "Read time is required" }),
  image: z.string().url({ message: "Must be a valid image URL" }),
  tags: z.string().min(1, { message: "Tags are required (comma separated)" }),
  published: z.boolean(),
});

export const testimonialSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Name is required" }),
  role: z.string().min(2, { message: "Role is required" }),
  company: z.string().min(2, { message: "Company is required" }),
  image: z.string().url({ message: "Must be a valid avatar URL" }),
  text: z.string().min(10, { message: "Quote must be at least 10 characters" }),
  rating: z.number().min(1).max(5, { message: "Rating must be between 1 and 5" }),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type CertificateInput = z.infer<typeof certificateSchema>;
export type BlogInput = z.infer<typeof blogSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
