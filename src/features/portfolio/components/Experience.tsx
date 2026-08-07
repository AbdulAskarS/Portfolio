"use client";

import React from "react";
import { motion } from "framer-motion";
import { Experience as ExperienceType } from "@/types/portfolio";
import { formatDate } from "../utils/portfolioUtils";
import { Briefcase, Calendar, MapPin } from "lucide-react";

interface ExperienceProps {
  experience: ExperienceType[];
}

export function Experience({ experience }: ExperienceProps) {
  // Sort experience (current/latest job first)
  const sortedExperience = [...experience].sort((a, b) => {
    if (a.current && !b.current) return -1;
    if (!a.current && b.current) return 1;
    return b.startDate.localeCompare(a.startDate);
  });

  return (
    <section id="experience" className="py-20 border-t border-border/40">
      <div className="space-y-3 text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Work Experience</h2>
        <div className="w-12 h-1 bg-primary rounded-full mx-auto" />
        <p className="text-muted-foreground text-sm">
          My professional employment history, software highlights, and team impact.
        </p>
      </div>

      <div className="relative max-w-3xl mx-auto pl-6 border-l border-border/60 space-y-12">
        {sortedExperience.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            className="relative"
          >
            {/* Timeline Bullet */}
            <span
              className="absolute -left-[31px] top-1.5 flex items-center justify-center w-6 h-6 rounded-full border border-border bg-background text-primary shadow-xs"
              aria-hidden="true"
            >
              <Briefcase className="h-3 w-3" />
            </span>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{exp.role}</h3>
                  <p className="text-sm font-semibold text-primary">
                    {exp.companyUrl ? (
                      <a
                        href={exp.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline inline-flex items-center"
                      >
                        {exp.company}
                      </a>
                    ) : (
                      exp.company
                    )}
                  </p>
                </div>
                <div className="flex flex-col sm:items-end text-xs text-muted-foreground mt-1 sm:mt-0 space-y-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate || "")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {exp.location}
                  </span>
                </div>
              </div>

              {/* Accomplishments */}
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2 leading-relaxed">
                {exp.description.map((bullet, bulletIdx) => (
                  <li key={bulletIdx}>{bullet}</li>
                ))}
              </ul>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {exp.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs bg-muted/60 text-muted-foreground px-2.5 py-0.5 rounded-md border border-border/40 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
