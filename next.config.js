const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['your-supabase-bucket-url', 'res.cloudinary.com'], 
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_ADMIN_WALLET: process.env.NEXT_PUBLIC_ADMIN_WALLET,
    NEXT_PUBLIC_REOWN_PROJECT_ID: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID,
  },
  experimental: {
    optimizeCss: true, 
  },
};

module.exports = nextConfig;
