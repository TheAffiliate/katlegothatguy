import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://katlegothatguy.vercel.app", lastModified: new Date() },
  ];
}