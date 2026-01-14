import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: "/request.html",
        destination: "/en/request",
        permanent: true,
      },

      // Redirect untuk .html pages di root
      {
        source: "/e-catalogue.html",
        destination: "/en/e-catalogue",
        permanent: true,
      },

      // Redirect untuk pages di /products/
      {
        source: "/products/wood.html",
        destination: "/en/collections/woods",
        permanent: true,
      },
      {
        source: "/products/marbles.html",
        destination: "/en/collections/pattern",
        permanent: true,
      },
      {
        source: "/products/fabrics.html",
        destination: "/en/collections/pattern", // atau sesuaikan dengan kategori yang tepat
        permanent: true,
      },
      {
        source: "/products/bookmatched.html",
        destination: "/en/collections/pattern", // atau sesuaikan dengan kategori yang tepat
        permanent: true,
      },
      {
        source: "/products/stone.html",
        destination: "/en/collections/pattern",
        permanent: true,
      },

      {
        source: "/wood/:slug",
        destination: "/en/collections/woods",
        permanent: true,
      },
      {
        source: "/solids/:slug",
        destination: "/en/collections/solid",
        permanent: true,
      },
      {
        source: "/stones/:slug",
        destination: "/en/collections/pattern",
        permanent: true,
      },
      {
        source: "/marbles/:slug",
        destination: "/en/collections/pattern",
        permanent: true,
      },
      {
        source: "/leathers/:slug",
        destination: "/en/collections/pattern",
        permanent: true,
      },

      // Catch-all untuk URL dengan .html
      {
        source: "/:path*.html",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      // Development - Local Laravel
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
      },

      {
        protocol: "http",
        hostname: "72.61.215.207",
        port: "9000",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      // Production - Your actual domain
      {
        protocol: "https",
        hostname: "miracohpl.com",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "dashboard.miracohpl.com",
        pathname: "/storage/**",
      },
    ],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp"],
    // dangerouslyAllowLocalIP: true,
  },
  experimental: {
    proxyTimeout: 30000, // 30 detik
  },
  // Cache API responses lebih agresif
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  reactStrictMode: false,
  onError: (err: any) => {
    if (err.message.includes("disconnected port")) {
      return;
    }
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
