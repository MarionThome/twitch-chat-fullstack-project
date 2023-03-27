/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  env: {
    REACT_APP_PUSHER_KEY: process.env.REACT_APP_PUSHER_KEY,
    REACT_APP_PUSHER_CLUSTER: process.env.REACT_APP_PUSHER_CLUSTER,
  },
};

module.exports = nextConfig;