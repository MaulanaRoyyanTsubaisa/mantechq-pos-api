"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { getStrapiURL } from "@/lib/api";

interface ClientLogo {
  id: number;
  logo: {
    url: string;
    alternativeText: string | null;
  };
}

interface RichTextBlock {
  type: string;
  children: {
    text: string;
    type: string;
  }[];
}

interface ButtonLink {
  id: number;
  teks: string;
  link: string;
  style: string;
}

interface HomepageData {
  trustedByTitle?: string;
  trustedByDescription?: RichTextBlock[];
  clientLogos?: ClientLogo[];
  trustedByButton?: ButtonLink;
}

const ClientsSection = () => {
  const { t, language } = useLanguage();
  const [data, setData] = useState<HomepageData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          getStrapiURL(
            `/api/homepage?populate[clientLogos][populate]=*&populate=trustedByButton&locale=${language}`
          )
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        if (json.data) {
          setData(json.data);
        } else {
          setData({});
        }
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred");
        }
        console.error("Failed to fetch homepage data for clients:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  useEffect(() => {
    if (loading || !data.clientLogos?.length) return;

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
  }, [loading, data]);

  const clientLogos = data.clientLogos || [];

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 reveal">
            {data.trustedByTitle || t("clients.title")}
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto reveal reveal-delay-1">
            {data.trustedByDescription?.[0]?.children?.[0]?.text ||
              t("clients.subtitle")}
          </p>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="flex animate-marquee [animation-play-state:running] hover:[animation-play-state:paused]">
            {[...clientLogos, ...clientLogos].map((client, index) => (
              <div
                key={`${client.id}-${index}`}
                className="flex-shrink-0 mx-8"
                style={{ width: "160px" }}
              >
                <div className="relative h-16 w-full">
                  <Image
                    src={getStrapiURL(client.logo.url)}
                    alt={
                      client.logo.alternativeText || `Client ${index + 1} logo`
                    }
                    fill
                    className="object-contain transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white to-transparent dark:from-slate-900"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white to-transparent dark:from-slate-900"></div>
        </div>

        {data.trustedByButton?.link && (
          <div className="text-center mt-12 reveal reveal-delay-3">
            <Button asChild size="lg">
              <Link href={data.trustedByButton.link || "/projects"}>
                {data.trustedByButton.teks || t("clients.viewProjects")}{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ClientsSection;
