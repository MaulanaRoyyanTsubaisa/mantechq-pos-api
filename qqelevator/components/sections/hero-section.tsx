"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { cn } from "@/lib/utils";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const HeroSection = () => {
  const { t, language } = useLanguage();

  const [heroData, setHeroData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await axios.get(
          `${STRAPI_URL}/api/hero-section?populate=*&locale=${language}`
        );
        const data = response.data.data || response.data;
        setHeroData(data);
      } catch (error) {
        console.error("Gagal mengambil data Hero Section:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroData();
  }, [language]);

  // Kode animasi tidak perlu diubah
  useEffect(() => {
    if (!loading && heroData) {
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
    }
  }, [loading, heroData]);

  if (loading) {
    return <section className="h-screen bg-slate-900" />;
  }

  if (!heroData) {
    return (
      <section className="h-screen flex items-center justify-center">
        Hero content not found.
      </section>
    );
  }

  // Menggunakan nama field yang BENAR dari data Anda
  const backgroundImageUrl = heroData.background?.url
    ? `${STRAPI_URL}${heroData.background.url}`
    : ""; // Biarkan kosong jika tidak ada gambar

  return (
    <section
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url('${backgroundImageUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 reveal">
          {heroData.title} {/* DIGANTI: dari heading menjadi title */}
        </h1>
        <div className="text-xl text-slate-200 max-w-3xl mx-auto mb-8 reveal reveal-delay-1">
          {
            Array.isArray(heroData.description) && (
              <BlocksRenderer content={heroData.description} />
            ) /* DIGANTI: dari subheading menjadi description */
          }
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 reveal reveal-delay-2">
          {/* DIGANTI: dari buttons menjadi button (tanpa 's') */}
          {(heroData.button || []).map((btn: any) => {
            const isPrimary = btn.style === "primary";

            return (
              <Button
                asChild
                size="lg"
                className={cn(
                  "min-w-[160px]",
                  !isPrimary &&
                    "bg-transparent text-white border-white hover:bg-white/10"
                )}
                variant={isPrimary ? "default" : "outline"}
                key={btn.id}
              >
                <Link href={btn.link || "#"}>
                  {btn.teks} {/* <-- Diubah dari text menjadi teks */}
                  {!isPrimary && <ArrowRight className="ml-2 h-4 w-4" />}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
