module.exports = ({ env }) => {
  // --- DEBUGGING: Tampilkan environment variables yang dibaca Strapi ---
  console.log("--- Strapi Cloudinary Config ---");
  console.log("Cloud Name:", env("CLOUDINARY_NAME") ? "Loaded" : "NOT LOADED");
  console.log("API Key:", env("CLOUDINARY_KEY") ? "Loaded" : "NOT LOADED");
  console.log(
    "API Secret:",
    env("CLOUDINARY_SECRET") ? "Loaded" : "NOT LOADED"
  );
  console.log("--------------------------------");
  // ---

  return {
    upload: {
      config: {
        provider: "cloudinary",
        providerOptions: {
          cloud_name: env("CLOUDINARY_NAME"),
          api_key: env("CLOUDINARY_KEY"),
          api_secret: env("CLOUDINARY_SECRET"),
        },
        actionOptions: {
          upload: {},
          delete: {},
        },
      },
    },
  };
};
