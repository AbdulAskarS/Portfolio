"use client";

import React from "react";
import { motion } from "framer-motion";
import { useContact } from "../hooks/useContact";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Profile } from "@/types/portfolio";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";

interface ContactFormProps {
  profile: Profile;
}

export function ContactForm({ profile }: ContactFormProps) {
  const { form, isSubmitting, submitResult, onSubmit } = useContact();

  return (
    <section id="contact" className="py-20 border-t border-border/40">
      <div className="space-y-3 text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Get In Touch</h2>
        <div className="w-12 h-1 bg-primary rounded-full mx-auto" />
        <p className="text-muted-foreground text-sm">
          Have an interesting opportunity or project? Shoot a message over!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto items-start">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="lg:col-span-5 space-y-6"
        >
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-foreground">Contact Details</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you have any questions or would like to partner on projects, feel free to use the form or mail me directly.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4 items-start p-4 rounded-xl border border-border/60 bg-muted/10">
              <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h4 className="font-bold text-sm text-foreground">Email</h4>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {profile.email}
                </a>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 rounded-xl border border-border/60 bg-muted/10">
              <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h4 className="font-bold text-sm text-foreground">Phone</h4>
                <a
                  href={`tel:${profile.phone}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {profile.phone}
                </a>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 rounded-xl border border-border/60 bg-muted/10">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h4 className="font-bold text-sm text-foreground">Location</h4>
                <span className="text-sm text-muted-foreground">{profile.location}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="lg:col-span-7"
        >
          <Card className="border border-border/60 bg-muted/10">
            <CardContent className="p-6">
              <form onSubmit={onSubmit} className="space-y-4">
                {submitResult && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-3 p-4 rounded-lg text-sm border ${
                      submitResult.success
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 dark:text-emerald-400"
                        : "bg-destructive/10 border-destructive/30 text-destructive"
                    }`}
                  >
                    {submitResult.success ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
                    )}
                    <span>{submitResult.message}</span>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Your Name"
                    id="name"
                    error={form.formState.errors.name?.message}
                  >
                    <Input id="name" placeholder="John Doe" {...form.register("name")} />
                  </FormField>
                  <FormField
                    label="Your Email"
                    id="email"
                    error={form.formState.errors.email?.message}
                  >
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      {...form.register("email")}
                    />
                  </FormField>
                </div>

                <FormField
                  label="Subject"
                  id="subject"
                  error={form.formState.errors.subject?.message}
                >
                  <Input id="subject" placeholder="Project Inquiry" {...form.register("subject")} />
                </FormField>

                <FormField
                  label="Message"
                  id="message"
                  error={form.formState.errors.message?.message}
                >
                  <Textarea
                    id="message"
                    placeholder="Describe your design goals, timeline, or requirements..."
                    rows={5}
                    {...form.register("message")}
                  />
                </FormField>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
