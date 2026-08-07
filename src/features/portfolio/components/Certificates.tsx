"use client";

import React from "react";
import { motion } from "framer-motion";
import { Certificate } from "@/types/portfolio";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Calendar, Link2 } from "lucide-react";
import { formatDate } from "../utils/portfolioUtils";

interface CertificatesProps {
  certificates: Certificate[];
}

export function Certificates({ certificates }: CertificatesProps) {
  return (
    <section id="certificates" className="py-20 border-t border-border/40">
      <div className="space-y-3 text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Certifications</h2>
        <div className="w-12 h-1 bg-primary rounded-full mx-auto" />
        <p className="text-muted-foreground text-sm">
          Technical validations and credentials issued by industry-leading providers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
          >
            <Card className="border border-border/60 bg-muted/10 h-full flex flex-col sm:flex-row overflow-hidden group">
              {/* Image Preview */}
              <div className="relative w-full sm:w-1/3 aspect-video sm:aspect-square overflow-hidden border-b sm:border-b-0 sm:border-r border-border/60">
                <img
                  src={cert.image}
                  alt={cert.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                />
              </div>

              {/* Certificate Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 text-xs text-primary font-bold uppercase tracking-wider">
                    <Award className="h-3.5 w-3.5 text-primary" />
                    {cert.issuer}
                  </span>
                  <h3 className="font-bold text-base text-foreground leading-snug">{cert.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    {formatDate(cert.issueDate)}{cert.expiryDate ? ` – ${formatDate(cert.expiryDate)}` : ""}
                  </div>
                  {cert.credentialId && (
                    <p className="text-[11px] font-mono text-muted-foreground bg-muted/50 border border-border/30 px-2 py-0.5 rounded-sm inline-block">
                      ID: {cert.credentialId}
                    </p>
                  )}
                </div>

                {cert.credentialUrl && (
                  <div className="pt-2">
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Link2 className="h-3.5 w-3.5" />
                      Verify Credential
                    </a>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
