"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

// Impor tipe data dari Strapi
import { Product as ProductType } from "@/types/strapi";

// Impor komponen UI
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { getProducts, getProductPageData } from "@/lib/data";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// Tipe data untuk konten halaman
interface PageDataType {
  heading: string;
  subheading: string;
}

const ProductsList = () => {
  const { language, t } = useLanguage();

  // 1. Siapkan state untuk menampung data dari API
  const [products, setProducts] = useState<ProductType[]>([]);
  const [pageData, setPageData] = useState<PageDataType | null>(null);
  const [loading, setLoading] = useState(true);

  // 2. useEffect untuk mengambil data dari Strapi
  useEffect(() => {
    setLoading(true);
    Promise.all([getProductPageData(language), getProducts(language)])
      .then(([pageContent, productsData]) => {
        setPageData(pageContent);
        setProducts(productsData || []);
      })
      .catch((error) => {
        console.error("Gagal mengambil data produk:", error);
      })
      .finally(() => setLoading(false));
  }, [language]);

  // useEffect untuk animasi tidak diubah
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
  }, [loading, products]); // Tambahkan products ke dependency array

  if (loading) {
    return <section className="py-20 text-center">Loading Products...</section>;
  }

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          {/* 3. Gunakan data dinamis untuk judul dan subtitle */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4 reveal">
            {pageData?.heading || "Elevator Solutions for Every Need"}
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto reveal reveal-delay-1">
            {pageData?.subheading || ""}
          </p>
        </div>

        <div className="space-y-24">
          {/* 4. Gunakan data dinamis untuk me-render daftar produk */}
          {products
            .filter((product) => product && product.name)
            .map((product, index) => (
              <div
                key={product.id}
                id={product.name.toLowerCase().replace(/ /g, "-")}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="relative h-[400px] rounded-lg overflow-hidden reveal">
                    <Image
                      src={
                        product.image?.url
                          ? `${STRAPI_URL}${product.image.url}`
                          : "/placeholder.svg"
                      }
                      alt={product.name || "Product image"}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <Card className="border-none shadow-none bg-transparent reveal reveal-delay-1">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-3xl font-bold">
                        {product.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0">
                      <div className="prose dark:prose-invert max-w-none text-base text-slate-700 dark:text-slate-300 mb-6">
                        <p>
                          {product.description?.[0]?.children?.[0]?.text || ""}
                        </p>
                      </div>
                      <h4 className="font-semibold text-lg mb-4">
                        {t("common.keyFeatures")}:
                      </h4>
                      <ul className="space-y-2 mb-6">
                        {product.features?.map((featureItem) => (
                          <li key={featureItem.id} className="flex items-start">
                            <Check className="h-5 w-5 text-accent mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-700 dark:text-slate-300">
                              {featureItem.feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="px-0 pb-0">
                      <Button asChild>
                        <Link href={product.buttonLink || "/contact"}>
                          {product.buttonText || "Request Information"}{" "}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsList;
