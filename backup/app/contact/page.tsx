"use client";

import { useEffect, useState } from "react";
import ContactHero from "@/components/sections/contact-hero";
import ContactForm from "@/components/sections/contact-form";
import ContactInfo from "@/components/sections/contact-info";
import MapSection from "@/components/sections/map-section";
import { BreadcrumbNavigation } from "@/components/breadcrumb-navigation";
import { getContactData, getAboutData } from "@/lib/data";
import { useLanguage } from "@/contexts/language-context";

export default function ContactPage() {
  const { language } = useLanguage();
  const [contactData, setContactData] = useState<any>(null);
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([getContactData(language), getAboutData(language)])
      .then(([contact, about]) => {
        setContactData(contact);
        setAboutData(about);
        console.log("[DEBUG] aboutData after fetch:", about);
      })
      .catch((e) => setError(e.message || "Failed to load contact/about data"))
      .finally(() => setLoading(false));
  }, [language]);

  if (loading) {
    return <div className="py-20 text-center">Loading contact page...</div>;
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

      <ContactHero data={contactData} />
      <div className="container mx-auto px-4 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ContactForm data={contactData} />
        <ContactInfo data={contactData} />
      </div>
      <MapSection data={contactData} />
    </div>
  );
}
