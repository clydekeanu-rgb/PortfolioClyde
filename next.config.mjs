/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
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
