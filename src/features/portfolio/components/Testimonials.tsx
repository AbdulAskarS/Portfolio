"use client";

import React from "react";
import { motion } from "framer-motion";
import { Testimonial } from "@/types/portfolio";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section id="testimonials" className="py-20 border-t border-border/40">
      <div className="space-y-3 text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Testimonials</h2>
        <div className="w-12 h-1 bg-primary rounded-full mx-auto" />
        <p className="text-muted-foreground text-sm">
          Feedback from engineering directors and product partners I have worked with.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((test, index) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
          >
            <Card className="border border-border/60 bg-muted/10 h-full relative p-6">
              <Quote className="absolute right-6 top-6 h-8 w-8 text-primary/10" aria-hidden="true" />
              <CardContent className="p-0 flex flex-col justify-between h-full space-y-6">
                <div className="space-y-3">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < test.rating ? "text-amber-500 fill-amber-500" : "text-muted"
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    &ldquo;{test.text}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={test.image}
                    alt={test.name}
                    className="w-12 h-12 object-cover rounded-full border border-border"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{test.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {test.role} at <span className="text-primary font-semibold">{test.company}</span>
                    </p>
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
