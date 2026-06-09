"use client";

import { useEffect, useState } from "react";
import type { Metadata } from "next";
import AboutHero from "@/components/sections/about-hero";
import VisionMission from "@/components/sections/vision-mission";
import CompanyHistory from "@/components/sections/company-history";
import TeamSection from "@/components/sections/team-section";
import CTASection from "@/components/sections/cta-section";
import { BreadcrumbNavigation } from "@/components/breadcrumb-navigation";
import { getAboutData } from "@/lib/data";
import { useLanguage } from "@/contexts/language-context";

export default function AboutPage() {
  const { language } = useLanguage();
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getAboutData(language)
      .then((data) => setAboutData(data))
      .catch((e) => setError(e.message || "Failed to load about data"))
      .finally(() => setLoading(false));
  }, [language]);

  if (loading) {
    return <div className="py-20 text-center">Loading about page...</div>;
  }
  if (error) {
    return <div className="py-20 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col w-full">
      {/* Breadcrumb */}
      <div className="bg-slate-50 py-4 mt-20">
        <div className="container mx-auto px-4">
          <BreadcrumbNavigation />
        </div>
      </div>

      <AboutHero data={aboutData} />
      <VisionMission data={aboutData} />
      <CompanyHistory data={aboutData} />
      <TeamSection data={aboutData} />
      <CTASection />
    </div>
  );
}
