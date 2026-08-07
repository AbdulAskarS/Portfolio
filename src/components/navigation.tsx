import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Container } from "@/components/container";
import { readJsonData } from "@/services/jsonDb";
import { Profile } from "@/types/portfolio";

export async function Navigation() {
  const profile = await readJsonData<Profile>("profile.json", {
    name: "Abdul Askar",
    title: "",
    subtitle: "",
    bio: "",
    avatar: "",
    email: "",
    phone: "",
    location: "",
    cvUrl: "",
    socialLinks: [],
    services: [],
    education: [],
  });

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-extrabold text-lg bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent hover:opacity-85 transition-all">
          {profile.name}.dev
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/#experience" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Experience
          </Link>
          <Link href="/#projects" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Projects
          </Link>
          <Link href="/#blogs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Blogs
          </Link>
          <Link href="/#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </Link>
          <span className="w-[1px] h-4 bg-border/60 mx-1" aria-hidden="true" />
          <Link href="/admin" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
            Admin
          </Link>
          <ThemeToggle />
        </nav>
      </Container>
    </header>
  );
}
