/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["randomuser.me"], // ✅ allow images from this domain
  },
};

module.exports = nextConfig;
