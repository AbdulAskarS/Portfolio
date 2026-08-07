"use client";

import React from "react";
import { motion } from "framer-motion";
import { Education as EducationType } from "@/types/portfolio";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Calendar } from "lucide-react";

interface EducationProps {
  education: EducationType[];
}

export function Education({ education }: EducationProps) {
  return (
    <section id="education" className="py-20 border-t border-border/40">
      <div className="space-y-3 text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Education</h2>
        <div className="w-12 h-1 bg-primary rounded-full mx-auto" />
        <p className="text-muted-foreground text-sm">
          My academic history and formal technology degrees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {education.map((edu, index) => (
          <motion.div
            key={edu.degree}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
          >
            <Card className="border border-border/60 bg-muted/10 h-full hover:border-primary/40 hover:bg-muted/20 transition-all duration-300">
              <CardContent className="p-6 flex gap-4 items-start">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0" aria-hidden="true">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-foreground leading-snug">{edu.degree}</h3>
                  <p className="text-sm font-semibold text-primary">{edu.institution}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    {edu.duration}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
