import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Stock placeholder + Google profil
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },

      // Eski / orijinal site — apex + tüm subdomain'ler (cdn., www., images. vs.)
      { protocol: "https", hostname: "ulkuyamancollection.com" },
      { protocol: "https", hostname: "**.ulkuyamancollection.com" },

      // Yaygın Turkiye e-ticaret platformları
      { protocol: "https", hostname: "**.ticimax.com" },
      { protocol: "https", hostname: "**.ticimaxcdn.com" },
      { protocol: "https", hostname: "**.tsoftcdn.com" },
      { protocol: "https", hostname: "**.tsoftpanel.com" },
      { protocol: "https", hostname: "**.dsmcdn.com" },
      { protocol: "https", hostname: "**.ideasoftpanel.com" },
      { protocol: "https", hostname: "**.myikas.com" },
      { protocol: "https", hostname: "ikas.com" },

      // Genel CDN'ler — Shopify / Cloudinary / AWS / Bunny / Imgix / Supabase
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.b-cdn.net" },
      { protocol: "https", hostname: "**.imgix.net" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  serverExternalPackages: ["iyzipay", "@prisma/client", "prisma"],
};

export default nextConfig;
