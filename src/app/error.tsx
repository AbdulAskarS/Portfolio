"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("App boundary error intercepted:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center bg-background px-4 text-center">
      <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center mb-5" aria-hidden="true">
        <AlertTriangle className="h-7 w-7 text-destructive" />
      </div>
      <h2 className="text-xl font-extrabold tracking-tight text-foreground mb-1.5">
        Something went wrong
      </h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
        An unexpected application boundary error occurred. Click reload to reset.
      </p>
      <Button onClick={() => reset()} className="cursor-pointer font-semibold shadow">
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Try Again
      </Button>
    </div>
  );
}
