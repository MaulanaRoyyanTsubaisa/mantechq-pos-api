"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Product as ProductType } from "@/types/strapi";
import { useLanguage } from "@/contexts/language-context";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

async function getFeaturedProducts(language: string): Promise<any[]> {
  const url = new URL(`${STRAPI_URL}/api/products`);
  url.searchParams.append("populate", "image");
  url.searchParams.append("locale", language);

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      console.error(
        "Failed to fetch featured products:",
        res.status,
        res.statusText
      );
      return [];
    }
    const json = await res.json();
    const allProducts = json.data || [];
    // Ambil SEMUA produk yang isFeatured true dan slug tidak kosong
    const featuredProducts = allProducts.filter(
      (product: any) => product.isFeatured === true && product.slug
    );
    return featuredProducts;
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}

async function getHomepageData(language: string): Promise<any> {
  const url = new URL(`${STRAPI_URL}/api/homepage`);
  url.searchParams.append("populate", "*");
  url.searchParams.append("locale", language);

  try {
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
    return null;
  }
}

const ProductShowcase = () => {
  const { language } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [homepageData, setHomepageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let [featuredProducts, pageData] = await Promise.all([
        getFeaturedProducts(language),
        getHomepageData(language),
      ]);
      // Fallback ke EN jika kosong
      if (featuredProducts.length === 0 && language !== "en") {
        [featuredProducts, pageData] = await Promise.all([
          getFeaturedProducts("en"),
          getHomepageData("en"),
        ]);
      }
      setProducts(featuredProducts);
      setHomepageData(pageData);
      setLoading(false);
    };
    fetchData();
  }, [language]);

  useEffect(() => {
    // Don't set up the observer until the loading is finished
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
  }, [loading]); // Rerun this effect when loading state changes

  const nextSlide = useCallback(() => {
    if (products.length === 0) return;
    setCurrentSlide((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  }, [products.length]);

  const prevSlide = useCallback(() => {
    if (products.length === 0) return;
    setCurrentSlide((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  }, [products.length]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (autoplay && products.length > 1) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoplay, products.length, nextSlide]);

  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  console.log("[RENDER] products:", products);

  if (loading) {
    return (
      <section className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="container text-center">
          Loading featured products...
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 reveal">
            {homepageData?.featuredProductsTitle || "Produk Unggulan"}
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto reveal reveal-delay-1">
            {homepageData?.featuredProductsDescription?.[0]?.children?.[0]
              ?.text ||
              "Jelajahi solusi elevator premium kami yang dirancang untuk berbagai aplikasi dan lingkungan."}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="mb-8">
              Belum ada produk unggulan yang tersedia untuk bahasa ini.
            </p>
            <p className="text-sm text-slate-400">
              Cek data di Strapi dan pastikan ada produk dengan{" "}
              <b>isFeatured</b> = true.
            </p>
          </div>
        ) : (
          <div
            className="relative max-w-5xl mx-auto reveal reveal-delay-2"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="overflow-hidden rounded-xl shadow-xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {products.map((product) => (
                  <div key={product.slug} className="w-full flex-shrink-0">
                    <Link href={`/products/${product.slug}`}>
                      <div className="relative h-[500px] w-full">
                        <Image
                          src={
                            product.image?.url
                              ? `${STRAPI_URL}${product.image.url}`
                              : "/placeholder.svg"
                          }
                          alt={product.name}
                          fill
                          className="object-cover"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8 text-white">
                          <h3 className="text-2xl font-bold mb-2">
                            {product.name}
                          </h3>
                          <p className="text-lg text-slate-200 mb-4">
                            {product.description?.[0]?.children?.[0]?.text ||
                              ""}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {products.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800"
                  onClick={prevSlide}
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800"
                  onClick={nextSlide}
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>

                <div className="flex justify-center mt-6 space-x-2">
                  {products.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={cn(
                        "w-3 h-3 rounded-full transition-all duration-300",
                        currentSlide === index
                          ? "bg-primary w-8"
                          : "bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500"
                      )}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductShowcase;
