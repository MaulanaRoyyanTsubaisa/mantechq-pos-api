import { strapi } from "./strapi";
import qs from "qs";
import { getStrapiURL } from "@/lib/utils";
import axios from "axios";

export async function getFeaturedProjects() {
  try {
    const response = await strapi.get("/api/our-feature-projects?populate=*");

    return response.data.data;
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    return [];
  }
}

const footerQuery = qs.stringify(
  {
    populate: ["social_links", "quick_links", "product_links"],
  },
  {
    encodeValuesOnly: true, // prettify URL
  }
);

export async function getFooterData() {
  const url = getStrapiURL(`/api/footer?${footerQuery}`);
  try {
    const response = await axios.get(url);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching footer data:", error);
    return null;
  }
}

export async function getAboutData(language?: string) {
  const aboutPopulateQuery = `populate[team_members][populate]=photo&populate[history_legacy][populate]=image`;
  const url = getStrapiURL(
    `/api/about?${aboutPopulateQuery}&${language ? `locale=${language}` : ""}`
  );
  console.log("[GET ABOUT DATA] Fetching URL:", url);
  try {
    const response = await axios.get(url);
    console.log("[GET ABOUT DATA] Response data:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching about data:", error);
    return null;
  }
}

const navbarQuery = qs.stringify(
  {
    populate: {
      logo: true,
      navlink: true,
      navdropdown: { populate: ["dropdownItems"] },
      ctaButton: true,
      Languages: { populate: ["icon"] },
    },
  },
  { encodeValuesOnly: true }
);

export async function getNavbarData(language?: string) {
  const url = getStrapiURL(
    `/api/navbar?${navbarQuery}${language ? `&locale=${language}` : ""}`
  );
  try {
    const response = await axios.get(url);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching navbar data:", error);
    return null;
  }
}

export async function getContactData(language?: string) {
  const url = getStrapiURL(
    `/api/contact-page?populate=*&${language ? `locale=${language}` : ""}`
  );
  console.log("[GET CONTACT DATA] Fetching URL:", url);
  try {
    const response = await axios.get(url);
    console.log("[GET CONTACT DATA] Response data:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching contact data:", error);
    return null;
  }
}

export async function getProductPageData(language?: string) {
  const url = getStrapiURL(
    `/api/product-page?populate[cta_section_category][populate]=button&${
      language ? `locale=${language}` : ""
    }`
  );
  console.log("[GET PRODUCT PAGE DATA] Fetching URL:", url);
  try {
    const response = await axios.get(url);
    console.log("[GET PRODUCT PAGE DATA] Response data:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching product page data:", error);
    return null;
  }
}

export async function getProducts(language?: string) {
  const url = getStrapiURL(
    `/api/products?populate=image&${language ? `locale=${language}` : ""}`
  );
  console.log("[GET PRODUCTS] Fetching URL:", url);
  try {
    const response = await axios.get(url);
    console.log("[GET PRODUCTS] Response data:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
