/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Užtikrina griežtesnę React logiką
  trailingSlash: false, // Nepalikti / URL pabaigoje
  images: {
    domains: ["example.com"], // ✅ Pakeisk į savo domenus
    formats: ["image/webp"], // ✅ WebP formatas optimaliam vaizdų naudojimui
  },
  experimental: {
    optimizeCss: true, // ✅ Optimizuoja CSS (naudoti atsargiai)
    serverActions: true, // ✅ Nauja Next.js server-side funkcija
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false, // ✅ Išjungia fs naudojimą kliento pusėje
      };
    }
    config.cache = false; // ✅ Išjungia Webpack cache, jei reikalinga švari kompiliacija
    return config;
  },
};

module.exports = nextConfig;
