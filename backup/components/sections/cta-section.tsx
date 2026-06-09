"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { getStrapiURL } from "@/lib/api";
import { cn } from "@/lib/utils";

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
  ctaTitle?: string;
  ctaDescription?: RichTextBlock[];
  ctaButtons?: ButtonLink[];
}

const CTASection = () => {
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
          getStrapiURL(`/api/homepage?populate=ctaButtons&locale=${language}`)
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
        console.error("Failed to fetch homepage data for CTA:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  useEffect(() => {
    if (loading || !data.ctaButtons?.length) return;

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

  if (loading) {
    return (
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="h-9 w-3/4 bg-primary-foreground/20 rounded-md mx-auto mb-6 animate-pulse"></div>
          <div className="h-6 w-full max-w-2xl bg-primary-foreground/20 rounded-md mx-auto mb-8 animate-pulse"></div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="h-12 w-[160px] bg-primary-foreground/20 rounded-md animate-pulse"></div>
            <div className="h-12 w-[160px] bg-primary-foreground/20 rounded-md animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 reveal">
          {data.ctaTitle || t("cta.title")}
        </h2>
        <p className="text-lg text-slate-200 max-w-3xl mx-auto mb-8 reveal reveal-delay-1">
          {data.ctaDescription?.[0]?.children?.[0]?.text || t("cta.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 reveal reveal-delay-2">
          {data.ctaButtons && data.ctaButtons.length > 0 ? (
            data.ctaButtons.map((button) => (
              <Button
                key={button.id}
                asChild
                size="lg"
                variant={button.style === "secondary" ? "secondary" : "outline"}
                className={cn(
                  "min-w-[160px] transition-transform duration-200 hover:-translate-y-1",
                  {
                    "bg-transparent text-white border-white hover:bg-white/10":
                      button.style !== "secondary",
                    "text-primary hover:bg-slate-100":
                      button.style === "secondary",
                  }
                )}
              >
                <Link href={button.link}>
                  {button.teks}
                  {button.style !== "secondary" && (
                    <ArrowRight className="ml-2 h-4 w-4" />
                  )}
                </Link>
              </Button>
            ))
          ) : (
            <>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="min-w-[160px] text-primary hover:bg-slate-100 transition-transform duration-200 hover:-translate-y-1"
              >
                <Link href="/contact">{t("cta.getQuote")}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="min-w-[160px] bg-transparent text-white border-white hover:bg-white/10 transition-transform duration-200 hover:-translate-y-1"
              >
                <Link href="/products">
                  {t("cta.exploreProducts")}{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
