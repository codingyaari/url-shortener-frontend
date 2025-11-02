/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Disable source maps in production for faster builds
  productionBrowserSourceMaps: false,
  // Optimize images
  images: {
    unoptimized: false,
  },
};

export default nextConfig;
