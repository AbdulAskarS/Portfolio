import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PortfolioService } from "@/features/portfolio/services/portfolioService";
import { readJsonData } from "@/services/jsonDb";
import { Overview } from "@/features/admin/components/sections/Overview";
import { SettingsCrud } from "@/features/admin/components/sections/SettingsCrud";
import { ProjectsCrud } from "@/features/admin/components/sections/ProjectsCrud";
import { SkillsCrud } from "@/features/admin/components/sections/SkillsCrud";
import { ExperienceCrud } from "@/features/admin/components/sections/ExperienceCrud";
import { CertificatesCrud } from "@/features/admin/components/sections/CertificatesCrud";
import { BlogsCrud } from "@/features/admin/components/sections/BlogsCrud";
import { TestimonialsCrud } from "@/features/admin/components/sections/TestimonialsCrud";

interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

interface ContactConfig {
  email: string;
  phone: string;
  address: string;
  availability: string;
  messages: Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    date: string;
  }>;
}

export default async function AdminPage({ searchParams }: PageProps) {
  // Validate secure session cookie
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("admin_session")?.value === "true";
  
  if (!isAuthenticated) {
    redirect("/login");
  }

  const resolvedParams = await searchParams;
  const currentTab = resolvedParams.tab || "overview";

  // Fetch all portfolio and message logs
  const data = await PortfolioService.getPortfolioData();
  const contactConfig = await readJsonData<ContactConfig>("contact.json", {
    email: "abdul.askar@example.com",
    phone: "+1 (555) 019-2834",
    address: "San Francisco, CA",
    availability: "Open for full-time roles & freelance consultancies",
    messages: [],
  });

  const counts = {
    projects: data.projects.length,
    skills: data.skills.length,
    experience: data.experience.length,
    certificates: data.certificates.length,
    blogs: data.blogs.length,
    testimonials: data.testimonials.length,
  };

  // Conditionally render CRUD sections
  switch (currentTab) {
    case "settings":
      return <SettingsCrud profile={data.profile} />;
    case "projects":
      return <ProjectsCrud projects={data.projects} />;
    case "skills":
      return <SkillsCrud skills={data.skills} />;
    case "experience":
      return <ExperienceCrud experience={data.experience} />;
    case "certificates":
      return <CertificatesCrud certificates={data.certificates} />;
    case "blogs":
      return <BlogsCrud blogs={data.blogs} />;
    case "testimonials":
      return <TestimonialsCrud testimonials={data.testimonials} />;
    case "overview":
    default:
      return <Overview counts={counts} messages={contactConfig.messages || []} />;
  }
}
export const dynamic = "force-dynamic";
