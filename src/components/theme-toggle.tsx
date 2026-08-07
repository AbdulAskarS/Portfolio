"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-10 h-10 cursor-pointer" aria-hidden="true">
        <div className="w-4 h-4 rounded-full bg-muted animate-pulse" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-10 h-10 rounded-lg hover:bg-accent hover:text-accent-foreground cursor-pointer"
      aria-label="Toggle visual theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-amber-500 transition-all duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="h-5 w-5 text-slate-800 transition-all duration-300 rotate-0 scale-100" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
