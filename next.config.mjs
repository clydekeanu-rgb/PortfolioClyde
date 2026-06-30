/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
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
