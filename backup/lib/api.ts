export function getStrapiURL(path = "") {
  return `${
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://qq-strapi.herokuapp.com"
  }${path}`;
}
