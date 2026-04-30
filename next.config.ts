import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Configurações do Next.js */
  images: {
    domains: [
      process.env.NEXT_PUBLIC_SUPABASE_URL 
        ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname 
        : "your-supabase-project.supabase.co"
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Desabilitado porque usamos rotas dinâmicas e APIs
  output: "standalone",
  // Compressão gzip/brotli já vem por padrão no Next
  compiler: {
    // Remove console.log em produção (opcional)
    removeConsole: process.env.NODE_ENV === "production",
  },
  // headers personalizados para segurança
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;