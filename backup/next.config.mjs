/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["localhost", "127.0.0.1", "images.unsplash.com"],
    unoptimized: false,
  },
  i18n: {
    // Daftar bahasa yang Anda dukung
    locales: ["en", "id"],
    // Bahasa default jika pengunjung tidak menentukan
    defaultLocale: "en",
  },
};

export default nextConfig;
