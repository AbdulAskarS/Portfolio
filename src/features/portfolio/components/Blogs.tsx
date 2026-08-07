"use client";

import React from "react";
import { motion } from "framer-motion";
import { Blog } from "@/types/portfolio";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { formatDate } from "../utils/portfolioUtils";

interface BlogsProps {
  blogs: Blog[];
}

export function Blogs({ blogs }: BlogsProps) {
  // Show only published blogs
  const publishedBlogs = blogs.filter((blog) => blog.published);

  return (
    <section id="blogs" className="py-20 border-t border-border/40">
      <div className="space-y-3 text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Technical Blog</h2>
        <div className="w-12 h-1 bg-primary rounded-full mx-auto" />
        <p className="text-muted-foreground text-sm">
          Thoughts on software design, modular frameworks, and server architectures.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {publishedBlogs.map((blog, index) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
          >
            <Card className="flex flex-col h-full border border-border/60 bg-muted/10 overflow-hidden group">
              {/* Blog Banner */}
              <div className="relative aspect-video overflow-hidden border-b border-border/60">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                />
              </div>

              {/* Metadata & Title */}
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    {formatDate(blog.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    {blog.readTime}
                  </span>
                </div>
                <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {blog.title}
                </CardTitle>
              </CardHeader>

              {/* Body */}
              <CardContent className="flex-1 space-y-4 pb-4">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {blog.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-muted/80 text-muted-foreground px-2.5 py-0.5 rounded-md border border-border/40 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>

              {/* Action Button */}
              <CardFooter className="pt-0 border-t border-border/20 p-6">
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      `Full article routing will be configured in Phase 4: ${blog.title}`
                    )
                  }
                  className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  Read Article
                  <ArrowRight className="h-4 w-4" />
                </button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
