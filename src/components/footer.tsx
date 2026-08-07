import { Container } from "@/components/container";
import { readJsonData } from "@/services/jsonDb";
import { Profile } from "@/types/portfolio";

export async function Footer() {
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
    <footer className="border-t border-border/40 bg-muted/20 py-8 mt-20 relative z-10">
      <Container className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div>
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
        </div>
        <div className="flex items-center gap-6">
          {profile.socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground hover:underline transition-colors"
            >
              {link.platform}
            </a>
          ))}
        </div>
      </Container>
    </footer>
  );
}
