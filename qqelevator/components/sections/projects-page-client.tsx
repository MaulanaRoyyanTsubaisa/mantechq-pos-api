"use client";

import { useEffect, useState } from "react";
import ProjectsHero from "@/components/sections/projects-hero";
import ProjectsList from "@/components/sections/projects-list";
import ClientLogos from "@/components/sections/client-logos";
import CTASection from "@/components/sections/cta-section";
import { BreadcrumbNavigation } from "@/components/breadcrumb-navigation";
import { useLanguage } from "@/contexts/language-context";
import axios from "axios";
import { getStrapiURL } from "@/lib/utils";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const fetchProjectPageData = async (locale: string) => {
  // Fetch the project page single type (for hero, section titles, client logos, etc)
  const url = getStrapiURL(
    `/api/project?populate=client_logos.client_logos&locale=${locale}`
  );
  try {
    const res = await axios.get(url);
    return res.data.data;
  } catch (e) {
    console.error("Failed to fetch project page data:", e);
    return null;
  }
};

export default function ProjectsPageClient() {
  const { language } = useLanguage();
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchProjectPageData(language).then((data) => {
      if (!data && language !== "en") {
        // Fallback to English if not found
        fetchProjectPageData("en").then((fallbackData) => {
          if (isMounted) {
            setPageData(fallbackData);
            setLoading(false);
          }
        });
      } else {
        if (isMounted) {
          setPageData(data);
          setLoading(false);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, [language]);

  if (loading) {
    return <div className="py-32 text-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full">
      {/* Breadcrumb */}
      <div className="bg-slate-50 py-4 mt-20">
        <div className="container mx-auto px-4">
          <BreadcrumbNavigation />
        </div>
      </div>
      <ProjectsHero data={pageData} />
      <ProjectsList data={pageData} />
      <ClientLogos data={pageData} />
      <CTASection />
    </div>
  );
}
