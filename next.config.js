/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'raw.githubusercontent.com', 'via.placeholder.com', 'ui-avatars.com', 'upload.wikimedia.org'],
    unoptimized: true
  }
};

module.exports = nextConfig;
