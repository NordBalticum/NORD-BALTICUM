/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false, // Nepalikti / pabaigoje URL
  images: {
    domains: ["example.com"], // Pridėti reikiamus domenus iš kurių leidžiama krauti paveikslėlius
    formats: ["image/webp"], // Optimizuotos WebP formato nuotraukos
  },
  experimental: {
    optimizeCss: false, // Optimizuoja CSS, bet naudoti atsargiai
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false, // Pašalina fs klaidas kliento pusėje
      };
    }
    config.cache = true; // Išjungia cache, jei reikalinga švari kompiliacija
    return config;
  },
};

module.exports = nextConfig;
