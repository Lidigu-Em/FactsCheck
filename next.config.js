/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '**.strapi.io' },
      { protocol: 'https', hostname: '**.onrender.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'http', hostname: 'localhost', port: '1337' },
      { protocol: 'http', hostname: '127.0.0.1', port: '1337' },
    ],
  },
};

module.exports = nextConfig;
