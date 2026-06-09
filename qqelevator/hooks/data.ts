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
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching footer data:", error);
    return null;
  }
}

export async function getAboutData(language?: string) {
  const url = getStrapiURL(
    `/api/about?populate=*&${language ? `locale=${language}` : ""}`
  );
  try {
    const response = await axios.get(url);
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

export async function getNavbarData() {
  const url = getStrapiURL(`/api/navbar?${navbarQuery}`);
  try {
    const response = await axios.get(url);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching navbar data:", error);
    return null;
  }
}
