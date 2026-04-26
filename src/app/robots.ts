import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://ulkuyamancollection.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api",
          "/api/",
          "/hesabim",
          "/siparisler",
          "/odeme",
          "/giris",
          "/sepet",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
