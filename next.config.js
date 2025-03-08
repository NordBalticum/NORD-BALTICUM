/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false, // Nepalikti / pabaigoje URL
  images: {
    domains: ["example.com"], // Pridėti reikiamus domenus
    formats: ["image/webp"], // Optimizuotos WebP nuotraukos
  },
  experimental: {
    optimizeCss: true, // Optimizuotas CSS
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false }; // Pašalina fs klaidas kliento pusėje
    }
    config.cache = true; // Išjungia cache, jei reikalinga švari kompiliacija
    return config;
  },
};

module.exports = nextConfig;
