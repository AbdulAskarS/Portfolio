"use client";

import React from "react";
import { motion } from "framer-motion";
import { Profile } from "@/types/portfolio";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AboutProps {
  profile: Profile;
}

export function About({ profile }: AboutProps) {
  return (
    <section id="about-details" className="py-20 border-t border-border/40">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Avatar image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="md:col-span-5 lg:col-span-4 flex justify-center"
        >
          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary to-purple-500 blur-md opacity-25 group-hover:opacity-45 transition-all duration-300 -z-10" />
            <img
              src={profile.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"}
              alt={profile.name}
              className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-2xl border-2 border-border shadow-md"
            />
          </div>
        </motion.div>

        {/* Biography */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="md:col-span-7 lg:col-span-8 space-y-6"
        >
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">About Me</h2>
            <div className="w-12 h-1 bg-primary rounded-full" />
          </div>

          <p className="text-muted-foreground leading-relaxed">
            I am a full-stack engineer and software architect passionate about building highly optimized, scalable, and responsive web applications. I bridge the gap between back-end infrastructure and clean user interface implementations.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Over the years, I have successfully designed API orchestrations, reduced system startup latency, and configured containerized deployment flows. My core philosophy is centered on clean modular structures, accessibility compliance, and robust developer experiences.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
            <Card className="border border-border/60 bg-muted/10">
              <CardContent className="p-5 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-primary">8+</span>
                <span className="text-xs text-muted-foreground mt-1 font-medium">Years Experience</span>
              </CardContent>
            </Card>
            <Card className="border border-border/60 bg-muted/10">
              <CardContent className="p-5 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-primary">20+</span>
                <span className="text-xs text-muted-foreground mt-1 font-medium">Projects Delivered</span>
              </CardContent>
            </Card>
            <Card className="col-span-2 sm:col-span-1 border border-border/60 bg-muted/10">
              <CardContent className="p-5 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-primary">100%</span>
                <span className="text-xs text-muted-foreground mt-1 font-medium">Client Rating</span>
              </CardContent>
            </Card>
          </div>

          <div className="pt-2">
            <Button
              onClick={() => {
                if (profile.cvUrl && profile.cvUrl !== "#") {
                  window.open(profile.cvUrl, "_blank");
                } else {
                  alert("CV download is not seeded. Please upload resume in administrative dashboard.");
                }
              }}
              variant="outline"
              className="cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Download Resume
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
