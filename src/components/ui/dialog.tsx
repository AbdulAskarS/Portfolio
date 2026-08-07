"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ isOpen, onClose, title, children, className }: DialogProps) {
  // Lock scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay/Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={cn(
              "relative z-50 w-full max-w-lg rounded-xl border bg-card p-6 shadow-xl text-card-foreground",
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b">
              {title ? (
                <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-muted transition-all duration-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>

            {/* Body Content */}
            <div className="text-sm text-muted-foreground">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
