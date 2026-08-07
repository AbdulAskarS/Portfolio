import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Abdul Askar | Senior Full Stack Engineer & Architect Portfolio",
    template: "%s | Abdul Askar"
  },
  description: "A production-ready, modular developer portfolio demonstrating advanced clean architecture, Next.js, and TypeScript.",
  keywords: ["Full Stack Developer", "Software Architect", "Next.js 15", "TypeScript", "React", "Node.js", "Cloud Engineer"],
  authors: [{ name: "Abdul Askar" }],
  creator: "Abdul Askar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourdomain.com",
    title: "Abdul Askar | Senior Full Stack Engineer Portfolio",
    description: "A production-ready, modular developer portfolio demonstrating advanced clean architecture, Next.js, and TypeScript.",
    siteName: "Abdul Askar Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdul Askar | Senior Full Stack Engineer Portfolio",
    description: "A production-ready, modular developer portfolio demonstrating advanced clean architecture, Next.js, and TypeScript.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jakarta.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
