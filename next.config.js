/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    // Désactive l'optimisation d'image de Next.js pour éviter les erreurs
    // "upstream image response failed" quand les URLs R2 sont inaccessibles.
    // Les images sont servies directement depuis leur source (R2 ou backend local).
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '0.0.0.0',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'consultingmedia.autogare.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'consultingmedia.autogare.com',
        port: '',
        pathname: '/**',
      },
      // Endpoint brut Cloudflare R2 (fallback si domaine personnalisé non configuré)
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;