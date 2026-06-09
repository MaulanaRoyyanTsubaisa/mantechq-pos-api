"use client";
import { useLanguage } from "@/contexts/language-context";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Phone, Mail } from "lucide-react";
import { BreadcrumbNavigation } from "@/components/breadcrumb-navigation";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export default function ProductDetailClient({ slug }: { slug: string }) {
  const { language } = useLanguage();
  const [product, setProduct] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [detailPageContent, setDetailPageContent] = useState<any[]>([]);
  const [productPageData, setProductPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(
        `${STRAPI_URL}/api/products?filters[slug][$eq]=${slug}&locale=${language}`
      )
        .then((res) => res.json())
        .then((data) => data.data[0]),
      fetch(
        `${STRAPI_URL}/api/products?filters[slug][$eq]=${slug}&populate=image&locale=${language}`
      )
        .then((res) => res.json())
        .then((data) => data.data[0]?.image?.url || null),
      fetch(
        `${STRAPI_URL}/api/products?filters[slug][$eq]=${slug}&populate[detailPageContent][populate]=*&locale=${language}`
      )
        .then((res) => res.json())
        .then((data) => data.data[0]?.detailPageContent || []),
      fetch(
        `${STRAPI_URL}/api/product-page?populate[cta_section_category][populate]=button&locale=${language}`
      )
        .then((res) => res.json())
        .then((data) => data.data || null),
    ])
      .then(([prod, img, dz, pageData]) => {
        setProduct(prod);
        setImageUrl(img);
        setDetailPageContent(dz);
        setProductPageData(pageData);
      })
      .finally(() => setLoading(false));
  }, [slug, language]);

  if (loading) return <div className="py-20 text-center">Loading...</div>;
  if (!product)
    return (
      <div className="py-20 text-center text-red-500">Product not found.</div>
    );

  // Dynamic zone helpers
  const getBlock = (componentName: string) => {
    return detailPageContent?.find(
      (block: any) => block.__component === `products.${componentName}`
    );
  };
  const heroBlock = getBlock("hero-produk-detail");
  const featuresBlock = getBlock("seksi-fitur-utama");
  const specsBlock = getBlock("seksi-spek-teknis");
  const appsBlock = getBlock("seksi-aplikasi");

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: product.name || "Product" },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Breadcrumb */}
      <div className="bg-slate-50 py-4 mt-20">
        <div className="container mx-auto px-4">
          <BreadcrumbNavigation items={breadcrumbItems} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              {heroBlock?.tagline || "Premium Product"}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {heroBlock?.title || product.name}
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
              {heroBlock?.subtitle || ""}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {heroBlock?.buttons && heroBlock.buttons.length > 0 ? (
                heroBlock.buttons.map((button: any, idx: number) => (
                  <Button
                    key={button.id || idx}
                    size="lg"
                    variant={
                      button.style === "primary" ? "default" : "secondary"
                    }
                    className={
                      button.style === "secondary"
                        ? "bg-white text-primary border-primary hover:bg-primary hover:text-white"
                        : button.style === "primary"
                        ? "hover:bg-white hover:text-primary hover:shadow-lg transition-colors"
                        : ""
                    }
                    asChild
                  >
                    <Link href={button.link || "#"}>{button.teks}</Link>
                  </Button>
                ))
              ) : (
                <>
                  <Button
                    size="lg"
                    className="hover:bg-white hover:text-primary hover:shadow-lg transition-colors"
                    asChild
                  >
                    <Link href="/contact">
                      Get Quote <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-primary border-primary hover:bg-primary hover:text-white"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Call Now
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Product Image */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              {imageUrl ? (
                <Image
                  src={`${STRAPI_URL}${imageUrl}`}
                  alt={product.name || "Product image"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-500">
                  No image available
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Key Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(featuresBlock?.daftarFitur || []).map(
                (feature: any, index: number) => (
                  <Card
                    key={feature.id || index}
                    className="border-0 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <p className="text-slate-700 font-medium">
                          {feature.text}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Specifications Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Technical Specifications
            </h2>
            <Card className="shadow-xl">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {(specsBlock?.daftarSpek || []).map(
                    (spec: any, index: number) => (
                      <div
                        key={spec.id || index}
                        className="flex justify-between items-center py-3 border-b border-slate-200 last:border-b-0"
                      >
                        <span className="font-medium text-slate-700">
                          {spec.judulspek}
                        </span>
                        <span className="text-primary font-semibold">
                          {spec.nilaispek}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Applications
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(appsBlock?.daftarTags || []).map((tag: any, index: number) => (
                <div
                  key={tag.id || index}
                  className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 text-center"
                >
                  <span className="font-medium text-slate-700">
                    {tag.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {productPageData?.cta_section_category?.Title ||
                "Ready to Get Started?"}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {productPageData?.cta_section_category?.Subtitle ||
                "Contact our experts today for a customized solution that meets your specific requirements."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {productPageData?.cta_section_category?.button?.length > 0 ? (
                productPageData.cta_section_category.button.map(
                  (btn: any, idx: number) => (
                    <Button
                      key={btn.id || idx}
                      size="lg"
                      variant="outline"
                      className={
                        btn.style === "primary"
                          ? "bg-white text-primary border-primary hover:bg-primary hover:text-white transition-all duration-200 min-w-[160px]"
                          : "bg-primary/80 text-white border-white hover:bg-white hover:text-primary transition-all duration-200 min-w-[160px]"
                      }
                      asChild
                    >
                      <Link href={btn.link || "#"}>{btn.teks}</Link>
                    </Button>
                  )
                )
              ) : (
                <>
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/contact">
                      <Mail className="mr-2 h-5 w-5" />
                      Get Free Quote
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-black hover:bg-white hover:text-primary"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    +1 (555) 123-4567
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
