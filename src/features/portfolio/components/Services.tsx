"use client";

import React from "react";
import { motion } from "framer-motion";
import { Service } from "@/types/portfolio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Cpu, Settings } from "lucide-react";

interface ServicesProps {
  services: Service[];
}

export function Services({ services }: ServicesProps) {
  const getServiceIcon = (index: number) => {
    switch (index % 3) {
      case 0:
        return <Code2 className="h-6 w-6 text-primary" />;
      case 1:
        return <Cpu className="h-6 w-6 text-primary" />;
      case 2:
        return <Settings className="h-6 w-6 text-primary" />;
      default:
        return <Code2 className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <section id="services" className="py-20 border-t border-border/40">
      <div className="space-y-3 text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Services</h2>
        <div className="w-12 h-1 bg-primary rounded-full mx-auto" />
        <p className="text-muted-foreground text-sm">
          Technical solutions offered to assist engineering groups in scaling systems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
          >
            <Card className="border border-border/60 bg-muted/10 h-full hover:border-primary/40 hover:bg-muted/20 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3" aria-hidden="true">
                  {getServiceIcon(index)}
                </div>
                <CardTitle className="text-lg font-bold text-foreground">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
