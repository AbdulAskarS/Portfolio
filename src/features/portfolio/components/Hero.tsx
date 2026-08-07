"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Twitter, Mail, MapPin } from "lucide-react";
import { Profile } from "@/types/portfolio";
import { Button } from "@/components/ui/button";

interface HeroProps {
  profile: Profile;
}

export function Hero({ profile }: HeroProps) {
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "github":
        return <Github className="h-5 w-5" />;
      case "linkedin":
        return <Linkedin className="h-5 w-5" />;
      case "twitter":
        return <Twitter className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <section id="about" className="relative py-24 md:py-32 flex flex-col justify-center min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-10 left-0 -z-10 w-72 h-72 bg-violet-500/10 rounded-full blur-[100px]" />

      <div className="space-y-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Available for New Roles
        </motion.div>

        <div className="space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-4xl font-extrabold tracking-tight sm:text-6xl leading-tight"
          >
            Hi, I&apos;m <span className="bg-gradient-to-r from-primary via-violet-500 to-pink-500 bg-clip-text text-transparent">{profile.name}</span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-2xl font-bold text-muted-foreground sm:text-3xl"
          >
            {profile.title}
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="text-lg text-muted-foreground leading-relaxed max-w-2xl"
        >
          {profile.bio}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-2"
        >
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-primary" />
            {profile.location}
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="h-4 w-4 text-primary" />
            {profile.email}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          className="flex flex-wrap items-center gap-4 pt-4"
        >
          <Button
            onClick={() => {
              const el = document.getElementById("projects");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            size="lg"
            className="cursor-pointer"
          >
            View Projects
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => {
              const el = document.getElementById("contact");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            variant="outline"
            size="lg"
            className="cursor-pointer"
          >
            Get In Touch
          </Button>

          <div className="flex items-center gap-3 sm:ml-4">
            {profile.socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-all duration-200"
                title={link.platform}
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
