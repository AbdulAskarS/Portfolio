"use client";

import React from "react";
import { motion } from "framer-motion";
import { Skill } from "@/types/portfolio";
import { groupSkillsByCategory } from "../utils/portfolioUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SkillsProps {
  skills: Skill[];
}

export function Skills({ skills }: SkillsProps) {
  const groupedSkills = groupSkillsByCategory(skills);

  return (
    <section id="skills" className="py-20 border-t border-border/40">
      <div className="space-y-3 text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Technical Expertise</h2>
        <div className="w-12 h-1 bg-primary rounded-full mx-auto" />
        <p className="text-muted-foreground text-sm">
          A breakdown of my professional development capabilities, technologies, and runtime environments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(groupedSkills).map(([category, items], categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: categoryIndex * 0.1, ease: "easeOut" }}
          >
            <Card className="border border-border/60 bg-muted/10 h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold border-b border-border/60 pb-2 text-primary">
                  {category}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {items.map((skill) => (
                  <div key={skill.id} className="space-y-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span>{skill.name}</span>
                      <span className="text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden" aria-hidden="true">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                        className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
