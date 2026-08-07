"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { logoutAdmin } from "@/features/auth/actions";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileCode,
  Hammer,
  Briefcase,
  Award,
  BookOpen,
  MessageSquare,
  User2,
  ArrowLeft,
  LogOut
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get("tab") || "overview";

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "settings", label: "Profile & Settings", icon: User2 },
    { id: "projects", label: "Projects", icon: FileCode },
    { id: "skills", label: "Skills", icon: Hammer },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "certificates", label: "Certifications", icon: Award },
    { id: "blogs", label: "Blogs", icon: BookOpen },
    { id: "testimonials", label: "Testimonials", icon: MessageSquare },
  ];

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar (Tablet & Desktop) */}
      <aside className="w-64 border-r border-border/40 bg-muted/10 hidden md:flex flex-col justify-between shrink-0">
        <div>
          <div className="flex h-16 items-center justify-between border-b border-border/40 px-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Site
            </Link>
            <ThemeToggle />
          </div>
          <nav className="space-y-1.5 p-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => router.push(`/admin?tab=${item.id}`)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-border/40 bg-muted/5">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5" aria-hidden="true" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Viewport Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-border/40 bg-background/50 flex items-center justify-between px-6 sticky top-0 z-10 backdrop-blur-md">
          <h1 className="text-lg font-extrabold capitalize tracking-tight text-foreground">
            {currentTab === "overview" ? "Dashboard Overview" : `${currentTab} Manager`}
          </h1>
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-destructive flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Dynamic Screen Viewport */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {/* Mobile Selector Tab */}
          <div className="md:hidden mb-6">
            <select
              value={currentTab}
              onChange={(e) => router.push(`/admin?tab=${e.target.value}`)}
              className="w-full p-2.5 rounded-lg border border-border bg-background text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {menuItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
