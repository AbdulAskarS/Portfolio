import { MetadataRoute } from "next";
import { readJsonData } from "@/services/jsonDb";
import { Blog } from "@/types/portfolio";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

  try {
    const blogs = await readJsonData<Blog[]>("blogs.json", []);
    const blogUrls = blogs
      .filter((b) => b.published)
      .map((b) => ({
        url: `${baseUrl}/blogs/${b.id}`,
        lastModified: new Date(b.date),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1.0,
      },
      ...blogUrls,
    ];
  } catch (error) {
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1.0,
      },
    ];
  }
}
