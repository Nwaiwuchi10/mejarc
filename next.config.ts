import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "spotride-uploads-049815585232-eu-north-1-an.s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "mejarc.s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      }
    ],
  },
};

export default nextConfig;
