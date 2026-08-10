/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  async redirects() {
    return [
      {
        source: "/homepage-redo",
        destination: "/",
        permanent: true,
      },
      {
        source: "/homepage-redo/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/v2",
        destination: "/",
        permanent: true,
      },
      {
        source: "/v2/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/work/ch-services",
        destination: "/work/property-maintenance/",
        permanent: true,
      },
      {
        source: "/work/ch-services/",
        destination: "/work/property-maintenance/",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/song-generator/",
        destination: "/song-generator/index.html",
      },
    ];
  },
};

export default nextConfig;
