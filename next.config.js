/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    env: {
        HOST_NAME_API: process.env.HOST_NAME_API,
    },
    images: {
        domains: [process.env.DOMAIN_NAME_API],
    },
};

module.exports = nextConfig;