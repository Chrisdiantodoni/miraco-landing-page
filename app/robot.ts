import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://miracohpl.com/sitemap.xml", // Ganti dengan domain asli Anda
  };
}
