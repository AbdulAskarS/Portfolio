"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Project } from "@/types/portfolio";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

interface ProjectsProps {
  projects: Project[];
}

export function Projects({ projects }: ProjectsProps) {
  const [activeFilter, setActiveFilter] = React.useState<string>("All");

  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((project) => project.tags.forEach((tag) => tags.add(tag)));
    return ["All", ...Array.from(tags)];
  }, [projects]);

  const filteredProjects = React.useMemo(() => {
    if (activeFilter === "All") return projects;
    return projects.filter((project) => project.tags.includes(activeFilter));
  }, [projects, activeFilter]);

  return (
    <section id="projects" className="py-20 border-t border-border/40">
      <div className="space-y-3 text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Featured Work</h2>
        <div className="w-12 h-1 bg-primary rounded-full mx-auto" />
        <p className="text-muted-foreground text-sm">
          A showcase of systems engineering, full-stack web applications, and analytics dashboards.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {allTags.map((tag) => (
          <Button
            key={tag}
            variant={activeFilter === tag ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(tag)}
            className="rounded-full cursor-pointer"
          >
            {tag}
          </Button>
        ))}
      </div>

      {/* Projects Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
            >
              <Card className="flex flex-col h-full border border-border/60 overflow-hidden bg-muted/10 group">
                {/* Project Image */}
                <div className="relative aspect-video overflow-hidden border-b border-border/60">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                  {project.featured && (
                    <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                      Featured
                    </span>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 space-y-4 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-muted/80 text-muted-foreground px-2 py-0.5 rounded-md border border-border/40 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="gap-3 pt-0 border-t border-border/20 p-6">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button variant="default" size="sm" className="w-full cursor-pointer">
                        <ExternalLink className="h-4 w-4" />
                        Live Demo
                      </Button>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button variant="outline" size="sm" className="w-full cursor-pointer">
                        <Github className="h-4 w-4" />
                        Source Code
                      </Button>
                    </a>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
