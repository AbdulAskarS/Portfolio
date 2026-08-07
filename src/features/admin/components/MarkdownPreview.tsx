import React from "react";

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  if (!content) {
    return <p className="text-muted-foreground italic text-xs">No article content written yet.</p>;
  }

  const lines = content.split("\n");

  return (
    <div className="prose prose-invert max-w-none text-sm space-y-3.5 text-foreground leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Headers
        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={idx} className="text-base font-extrabold mt-4 mb-2 text-foreground tracking-tight border-b border-border/10 pb-1">
              {trimmed.slice(4)}
            </h4>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={idx} className="text-lg font-extrabold mt-5 mb-2 text-foreground tracking-tight border-b border-border/10 pb-1">
              {trimmed.slice(3)}
            </h3>
          );
        }
        if (trimmed.startsWith("# ")) {
          return (
            <h2 key={idx} className="text-xl font-black mt-6 mb-3 text-foreground tracking-tight border-b border-border/20 pb-1.5">
              {trimmed.slice(2)}
            </h2>
          );
        }

        // Lists
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <li key={idx} className="list-disc ml-5 text-muted-foreground font-medium pl-1">
              {trimmed.slice(2)}
            </li>
          );
        }

        // Blockquotes
        if (trimmed.startsWith("> ")) {
          return (
            <blockquote key={idx} className="border-l-4 border-primary pl-4 italic text-muted-foreground bg-muted/5 py-2 rounded-r-lg my-2 font-medium">
              {trimmed.slice(2)}
            </blockquote>
          );
        }

        // Code block dividers (we can skip visual backticks)
        if (trimmed.startsWith("```")) {
          return null;
        }

        // Empty line separator
        if (trimmed === "") {
          return <div key={idx} className="h-2" aria-hidden="true" />;
        }

        // Paragraph line mapping with inline styling parser
        let formatted = line;

        // Escape HTML to prevent injection issues, then parse simple tags
        formatted = formatted
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");

        // Parse Bold
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-foreground'>$1</strong>");
        
        // Parse Italic
        formatted = formatted.replace(/\*(.*?)\*/g, "<em class='italic'>$1</em>");
        
        // Parse Inline Code
        formatted = formatted.replace(/`(.*?)`/g, "<code class='bg-muted px-1.5 py-0.5 rounded text-xs font-mono border border-border/20 text-primary font-semibold'>$1</code>");

        return (
          <p
            key={idx}
            className="text-muted-foreground whitespace-pre-wrap font-medium"
            dangerouslySetInnerHTML={{ __html: formatted }}
          />
        );
      })}
    </div>
  );
}
