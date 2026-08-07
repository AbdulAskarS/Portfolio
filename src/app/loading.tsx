import React from "react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center bg-background gap-4" aria-live="polite" aria-busy="true">
      {/* Premium pulsing indicator */}
      <div className="relative flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-primary/20 animate-spin border-t-primary" />
        <div className="absolute h-8 w-8 rounded-full bg-primary/15 animate-ping pointer-events-none" />
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground animate-pulse">
        Loading showcase...
      </p>
    </div>
  );
}
