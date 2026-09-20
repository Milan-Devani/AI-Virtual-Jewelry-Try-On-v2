/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Disable webpack cache corruption on rapid file reloads in dev
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
