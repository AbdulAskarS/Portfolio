"use server";

import { revalidatePath } from "next/cache";
import { readJsonData, writeJsonData } from "@/services/jsonDb";
import { Profile, Project, Skill, Experience, Blog, Certificate, Testimonial } from "@/types/portfolio";
import {
  profileSchema, ProfileInput,
  projectSchema, ProjectInput,
  skillSchema, SkillInput,
  experienceSchema, ExperienceInput,
  certificateSchema, CertificateInput,
  blogSchema, BlogInput,
  testimonialSchema, TestimonialInput
} from "./types/adminTypes";

// ==========================================
// PROFILE MUTATIONS
// ==========================================
export async function updateProfile(data: ProfileInput) {
  const result = profileSchema.safeParse(data);
  if (!result.success) {
    return { success: false, message: "Validation failed.", errors: result.error.flatten().fieldErrors };
  }

  try {
    const existing = await readJsonData<Profile>("profile.json", {
      name: "", title: "", subtitle: "", bio: "", avatar: "", email: "", phone: "", location: "", cvUrl: "",
      socialLinks: [], services: [], education: []
    });

    const updated: Profile = {
      ...existing,
      ...result.data,
      cvUrl: result.data.cvUrl || "#",
    };

    await writeJsonData("profile.json", updated);
    revalidatePath("/");
    return { success: true, message: "Profile settings updated successfully." };
  } catch (err) {
    return { success: false, message: "Failed to write database file." };
  }
}

// ==========================================
// PROJECT MUTATIONS
// ==========================================
export async function upsertProject(data: ProjectInput) {
  const result = projectSchema.safeParse(data);
  if (!result.success) {
    return { success: false, message: "Validation failed.", errors: result.error.flatten().fieldErrors };
  }

  try {
    const projects = await readJsonData<Project[]>("projects.json", []);
    const input = result.data;
    
    // Convert tags string to array
    const tagArray = input.tags.split(",").map(t => t.trim()).filter(Boolean);

    const projectToSave: Project = {
      id: input.id || `proj-${Date.now()}`,
      title: input.title,
      description: input.description,
      longDescription: input.longDescription || "",
      image: input.image,
      tags: tagArray,
      demoUrl: input.demoUrl || "",
      githubUrl: input.githubUrl || "",
      featured: input.featured,
    };

    if (input.id) {
      const idx = projects.findIndex(p => p.id === input.id);
      if (idx !== -1) projects[idx] = projectToSave;
    } else {
      projects.push(projectToSave);
    }

    await writeJsonData("projects.json", projects);
    revalidatePath("/");
    return { success: true, message: "Project saved successfully." };
  } catch (err) {
    return { success: false, message: "Failed to write database file." };
  }
}

export async function deleteProject(id: string) {
  try {
    const projects = await readJsonData<Project[]>("projects.json", []);
    const filtered = projects.filter(p => p.id !== id);
    await writeJsonData("projects.json", filtered);
    revalidatePath("/");
    return { success: true, message: "Project deleted successfully." };
  } catch (err) {
    return { success: false, message: "Failed to write database file." };
  }
}

// ==========================================
// SKILL MUTATIONS
// ==========================================
export async function upsertSkill(data: SkillInput) {
  const result = skillSchema.safeParse(data);
  if (!result.success) {
    return { success: false, message: "Validation failed.", errors: result.error.flatten().fieldErrors };
  }

  try {
    const skills = await readJsonData<Skill[]>("skills.json", []);
    const input = result.data;

    const skillToSave: Skill = {
      id: input.id || `skill-${Date.now()}`,
      name: input.name,
      category: input.category,
      level: input.level,
      icon: input.icon,
    };

    if (input.id) {
      const idx = skills.findIndex(s => s.id === input.id);
      if (idx !== -1) skills[idx] = skillToSave;
    } else {
      skills.push(skillToSave);
    }

    await writeJsonData("skills.json", skills);
    revalidatePath("/");
    return { success: true, message: "Skill saved successfully." };
  } catch (err) {
    return { success: false, message: "Failed to write database file." };
  }
}

export async function deleteSkill(id: string) {
  try {
    const skills = await readJsonData<Skill[]>("skills.json", []);
    const filtered = skills.filter(s => s.id !== id);
    await writeJsonData("skills.json", filtered);
    revalidatePath("/");
    return { success: true, message: "Skill deleted successfully." };
  } catch (err) {
    return { success: false, message: "Failed to write database file." };
  }
}

// ==========================================
// EXPERIENCE MUTATIONS
// ==========================================
export async function upsertExperience(data: ExperienceInput) {
  const result = experienceSchema.safeParse(data);
  if (!result.success) {
    return { success: false, message: "Validation failed.", errors: result.error.flatten().fieldErrors };
  }

  try {
    const experiences = await readJsonData<Experience[]>("experience.json", []);
    const input = result.data;

    // Parse skills and accomplishments lists
    const skillArray = input.skills.split(",").map(s => s.trim()).filter(Boolean);
    const descArray = input.description.split("\n").map(d => d.trim()).filter(Boolean);

    const expToSave: Experience = {
      id: input.id || `exp-${Date.now()}`,
      role: input.role,
      company: input.company,
      companyUrl: input.companyUrl || "",
      location: input.location,
      startDate: input.startDate,
      endDate: input.current ? "Present" : input.endDate || "",
      current: input.current,
      description: descArray,
      skills: skillArray,
    };

    if (input.id) {
      const idx = experiences.findIndex(e => e.id === input.id);
      if (idx !== -1) experiences[idx] = expToSave;
    } else {
      experiences.push(expToSave);
    }

    await writeJsonData("experience.json", experiences);
    revalidatePath("/");
    return { success: true, message: "Experience milestone saved successfully." };
  } catch (err) {
    return { success: false, message: "Failed to write database file." };
  }
}

export async function deleteExperience(id: string) {
  try {
    const experiences = await readJsonData<Experience[]>("experience.json", []);
    const filtered = experiences.filter(e => e.id !== id);
    await writeJsonData("experience.json", filtered);
    revalidatePath("/");
    return { success: true, message: "Experience milestone deleted successfully." };
  } catch (err) {
    return { success: false, message: "Failed to write database file." };
  }
}

// ==========================================
// CERTIFICATE MUTATIONS
// ==========================================
export async function upsertCertificate(data: CertificateInput) {
  const result = certificateSchema.safeParse(data);
  if (!result.success) {
    return { success: false, message: "Validation failed.", errors: result.error.flatten().fieldErrors };
  }

  try {
    const certificates = await readJsonData<Certificate[]>("certificates.json", []);
    const input = result.data;

    const certToSave: Certificate = {
      id: input.id || `cert-${Date.now()}`,
      name: input.name,
      issuer: input.issuer,
      issueDate: input.issueDate,
      expiryDate: input.expiryDate || "",
      credentialId: input.credentialId || "",
      credentialUrl: input.credentialUrl || "",
      image: input.image,
    };

    if (input.id) {
      const idx = certificates.findIndex(c => c.id === input.id);
      if (idx !== -1) certificates[idx] = certToSave;
    } else {
      certificates.push(certToSave);
    }

    await writeJsonData("certificates.json", certificates);
    revalidatePath("/");
    return { success: true, message: "Certificate credential saved successfully." };
  } catch (err) {
    return { success: false, message: "Failed to write database file." };
  }
}

export async function deleteCertificate(id: string) {
  try {
    const certificates = await readJsonData<Certificate[]>("certificates.json", []);
    const filtered = certificates.filter(c => c.id !== id);
    await writeJsonData("certificates.json", filtered);
    revalidatePath("/");
    return { success: true, message: "Certificate credential deleted successfully." };
  } catch (err) {
    return { success: false, message: "Failed to write database file." };
  }
}

// ==========================================
// BLOG MUTATIONS
// ==========================================
export async function upsertBlog(data: BlogInput) {
  const result = blogSchema.safeParse(data);
  if (!result.success) {
    return { success: false, message: "Validation failed.", errors: result.error.flatten().fieldErrors };
  }

  try {
    const blogs = await readJsonData<Blog[]>("blogs.json", []);
    const input = result.data;
    const tagArray = input.tags.split(",").map(t => t.trim()).filter(Boolean);

    const blogToSave: Blog = {
      id: input.id || `blog-${Date.now()}`,
      title: input.title,
      description: input.description,
      content: input.content,
      date: input.date,
      readTime: input.readTime,
      image: input.image,
      tags: tagArray,
      published: input.published,
    };

    if (input.id) {
      const idx = blogs.findIndex(b => b.id === input.id);
      if (idx !== -1) blogs[idx] = blogToSave;
    } else {
      blogs.push(blogToSave);
    }

    await writeJsonData("blogs.json", blogs);
    revalidatePath("/");
    return { success: true, message: "Blog article saved successfully." };
  } catch (err) {
    return { success: false, message: "Failed to write database file." };
  }
}

export async function deleteBlog(id: string) {
  try {
    const blogs = await readJsonData<Blog[]>("blogs.json", []);
    const filtered = blogs.filter(b => b.id !== id);
    await writeJsonData("blogs.json", filtered);
    revalidatePath("/");
    return { success: true, message: "Blog article deleted successfully." };
  } catch (err) {
    return { success: false, message: "Failed to write database file." };
  }
}

// ==========================================
// TESTIMONIAL MUTATIONS
// ==========================================
export async function upsertTestimonial(data: TestimonialInput) {
  const result = testimonialSchema.safeParse(data);
  if (!result.success) {
    return { success: false, message: "Validation failed.", errors: result.error.flatten().fieldErrors };
  }

  try {
    const testimonials = await readJsonData<Testimonial[]>("testimonials.json", []);
    const input = result.data;

    const testToSave: Testimonial = {
      id: input.id || `test-${Date.now()}`,
      name: input.name,
      role: input.role,
      company: input.company,
      image: input.image,
      text: input.text,
      rating: input.rating,
    };

    if (input.id) {
      const idx = testimonials.findIndex(t => t.id === input.id);
      if (idx !== -1) testimonials[idx] = testToSave;
    } else {
      testimonials.push(testToSave);
    }

    await writeJsonData("testimonials.json", testimonials);
    revalidatePath("/");
    return { success: true, message: "Testimonial saved successfully." };
  } catch (err) {
    return { success: false, message: "Failed to write database file." };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    const testimonials = await readJsonData<Testimonial[]>("testimonials.json", []);
    const filtered = testimonials.filter(t => t.id !== id);
    await writeJsonData("testimonials.json", filtered);
    revalidatePath("/");
    return { success: true, message: "Testimonial deleted successfully." };
  } catch (err) {
    return { success: false, message: "Failed to write database file." };
  }
}
