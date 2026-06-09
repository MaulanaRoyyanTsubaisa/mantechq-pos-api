"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

interface BenefitCard {
  id: number;
  title: string;
  description: string;
  Icon: {
    url: string;
    alternativeText: string | null;
  } | null;
}

interface WhyChooseUsData {
  whyChooseUsTitle: string;
  whyChooseUsDescription: {
    type: string;
    children: { type: string; text: string }[];
  }[];
  benefits: BenefitCard[];
}

async function getHomepageData(
  language: string
): Promise<WhyChooseUsData | null> {
  const url = new URL(`${STRAPI_URL}/api/homepage`);
  url.searchParams.append("populate[benefits][populate]", "*");
  url.searchParams.append("locale", language);

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      console.error("Failed to fetch Homepage data");
      return null;
    }
    const json = await res.json();
    // Data dari single type ada di dalam json.data (struktur datar)
    return json.data;
  } catch (error) {
    console.error("Error fetching Homepage data:", error);
    return null;
  }
}

const FeaturesSection = () => {
  const { t, language } = useLanguage();
  const [data, setData] = useState<WhyChooseUsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await getHomepageData(language);
      setData(fetchedData);
      setLoading(false);
    };
    fetchData();
  }, [language]);

  useEffect(() => {
    if (loading) return;

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
      <section className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="container text-center">Loading...</div>
      </section>
    );
  }

  if (!data) {
    return null; // or some fallback UI
  }

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 reveal">
            {data.whyChooseUsTitle || t("features.title")}
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto reveal reveal-delay-1">
            {data.whyChooseUsDescription?.[0]?.children?.[0]?.text ||
              t("features.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.benefits.map((feature, index) => (
            <Card
              key={feature.id}
              className="border-none shadow-md hover:shadow-lg transition-shadow reveal"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="mb-4">
                  {feature.Icon && (
                    <Image
                      src={`${STRAPI_URL}${feature.Icon.url}`}
                      alt={feature.Icon.alternativeText || feature.title}
                      width={40}
                      height={40}
                      className="h-10 w-10 text-accent"
                    />
                  )}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
