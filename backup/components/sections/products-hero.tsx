"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useLanguage } from "@/contexts/language-context";
import { getProductPageData } from "@/lib/data";
// Asumsi Anda akan membuat tipe data untuk ProductPage di strapi.ts nanti
// import { ProductPage as ProductPageType } from "@/types/strapi";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const ProductsHero = () => {
  const { language } = useLanguage();
  const [pageData, setPageData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProductPageData(language)
      .then((data) => setPageData(data))
      .catch((e) => setPageData(null))
      .finally(() => setLoading(false));
  }, [language]);

  // Logika animasi
  useEffect(() => {
    if (!loading) {
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
  }, [loading]);

  if (loading || !pageData) {
    return (
      <section className="relative py-24 md:py-32 bg-slate-800">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Loading...
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-24 md:py-32">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1567610701070-6739001d5144?q=80&w=1920&auto=format&fit=crop')",
          filter: "brightness(0.4)",
        }}
      ></div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 reveal">
          {pageData.heading}
        </h1>
        <p className="text-xl text-slate-200 max-w-3xl mx-auto reveal reveal-delay-1">
          {pageData.subheading}
        </p>
      </div>
    </section>
  );
};

export default ProductsHero;
