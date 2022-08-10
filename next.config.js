/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    HOST_NAME_API: process.env.HOST_NAME_API,
  },
  images: {
    domains: ["localhost"],
  },
};

module.exports = nextConfig;
