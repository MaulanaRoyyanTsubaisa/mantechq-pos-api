// path: ./config/middlewares.ts

export default [
  "strapi::errors",
  "strapi::security",
  {
    name: "strapi::cors",
    config: {
      enabled: true,
      headers: "*",
      // Pastikan URL frontend Anda ada di sini. Port default Next.js adalah 3000.
      origin: ["http://localhost:3000"],
    },
  },
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
