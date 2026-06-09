"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Homepage as HomepageType } from "@/types/strapi";
import { useLanguage } from "@/contexts/language-context";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

async function getHomepageData(language: string): Promise<HomepageType | null> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/homepage?populate=*&locale=${language}`
    );
    if (!res.ok) {
      console.error("Failed to fetch homepage data:", res.status);
      return null;
    }
    const json = await res.json();
    return json.data?.attributes || json.data || null;
  } catch (error) {
    console.error("An error occurred while fetching homepage data:", error);
    return null;
  }
}

const IntroSection = () => {
  const { language } = useLanguage();
  const [data, setData] = useState<HomepageType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const homepageData = await getHomepageData(language);
      setData(homepageData);
      setLoading(false);
    };
    fetchData();
  }, [language]);

  // Keep the original animation observer if needed
  useEffect(() => {
    if (loading) return; // Don't run animation logic while loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 }
    );

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, [loading]);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          Loading Content...
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center text-red-500">
          Failed to load content.
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2 reveal">
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
              {data.image?.url && (
                <Image
                  src={`${STRAPI_URL}${data.image.url}`}
                  alt={data.image.alternativeText || "About Us"}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              )}
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 reveal">
              {data.title}
            </h2>
            <div className="text-gray-700 mb-8 reveal reveal-delay-1 prose max-w-none">
              <BlocksRenderer content={data.description as any} />
            </div>
            <div className="space-y-4 mb-8 reveal reveal-delay-2">
              {data.featureList.map((feature) => (
                <div key={feature.id} className="flex items-start">
                  <Check className="h-5 w-5 text-amber-500 mr-3 mt-1" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
            {data.button?.link && data.button?.text && (
              <div className="reveal reveal-delay-3">
                <Button asChild size="lg">
                  <Link href={data.button.link}>{data.button.text}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
