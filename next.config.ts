import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
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
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      // Production - Your actual domain
      {
        protocol: "https",
        hostname: "your-domain.com",
        pathname: "/storage/**",
      },
    ],
    // dangerouslyAllowLocalIP: true,
  },
  // Cache API responses lebih agresif
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
