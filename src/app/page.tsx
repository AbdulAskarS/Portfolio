import React from "react";
import dynamic from "next/dynamic";
import { Container } from "@/components/container";
import { PortfolioService } from "@/features/portfolio/services/portfolioService";
import { Hero } from "@/features/portfolio/components/Hero";
import { About } from "@/features/portfolio/components/About";
import { Services } from "@/features/portfolio/components/Services";
import { Skills } from "@/features/portfolio/components/Skills";
import { Experience } from "@/features/portfolio/components/Experience";
import { Education } from "@/features/portfolio/components/Education";

// Asynchronous dynamic component split loaders
const Projects = dynamic(
  () => import("@/features/portfolio/components/Projects").then((m) => m.Projects),
  { loading: () => <div className="h-40 bg-muted/10 rounded-xl animate-pulse" aria-hidden="true" /> }
);
const Certificates = dynamic(
  () => import("@/features/portfolio/components/Certificates").then((m) => m.Certificates),
  { loading: () => <div className="h-40 bg-muted/10 rounded-xl animate-pulse" aria-hidden="true" /> }
);
const Testimonials = dynamic(
  () => import("@/features/portfolio/components/Testimonials").then((m) => m.Testimonials),
  { loading: () => <div className="h-40 bg-muted/10 rounded-xl animate-pulse" aria-hidden="true" /> }
);
const Blogs = dynamic(
  () => import("@/features/portfolio/components/Blogs").then((m) => m.Blogs),
  { loading: () => <div className="h-40 bg-muted/10 rounded-xl animate-pulse" aria-hidden="true" /> }
);
const ContactForm = dynamic(
  () => import("@/features/portfolio/components/ContactForm").then((m) => m.ContactForm),
  { loading: () => <div className="h-40 bg-muted/10 rounded-xl animate-pulse" aria-hidden="true" /> }
);

export default async function Home() {
  const data = await PortfolioService.getPortfolioData();

  return (
    <Container className="space-y-6">
      <Hero profile={data.profile} />
      <About profile={data.profile} />
      <Services services={data.profile.services} />
      <Skills skills={data.skills} />
      <Experience experience={data.experience} />
      <Projects projects={data.projects} />
      <Education education={data.profile.education} />
      <Certificates certificates={data.certificates} />
      <Testimonials testimonials={data.testimonials} />
      <Blogs blogs={data.blogs} />
      <ContactForm profile={data.profile} />
    </Container>
  );
}
