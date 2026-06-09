"use client";
import { useLanguage } from "@/contexts/language-context";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, ArrowRight } from "lucide-react";
import { BreadcrumbNavigation } from "@/components/breadcrumb-navigation";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export default function ProjectCategoryClient({ slug }: { slug: string }) {
  const { language } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [ctaSection, setCtaSection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Fetch category by slug and locale, and fetch projects
    const fetchData = async () => {
      try {
        // Fetch category by slug and locale
        const categoryRes = await fetch(
          `${STRAPI_URL}/api/categories?filters[slug][$eq]=${slug}&populate=*&locale=${language}`,
          { cache: "no-store" }
        );
        const categoryJson = await categoryRes.json();
        const categoryData = categoryJson.data[0];
        if (!categoryData) throw new Error("Category not found");

        // Fetch all projects with categories (with locale)
        const projectRes = await fetch(
          `${STRAPI_URL}/api/our-feature-projects?populate=*&locale=${language}`,
          { cache: "no-store" }
        );
        const projectJson = await projectRes.json();
        // Filter projects by category slug
        const filteredProjects = projectJson.data.filter((project: any) =>
          project.categories?.some((cat: any) => cat.slug === slug)
        );

        setData({ category: categoryData, projects: filteredProjects });
      } catch (e: any) {
        setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, language]);

  // Pisahkan fetch CTA agar errornya tidak bentrok dengan fetch utama
  useEffect(() => {
    const fetchCTA = async () => {
      try {
        const ctaRes = await fetch(
          `${STRAPI_URL}/api/product-page?populate[cta_section_category][populate]=button&locale=${language}`,
          { cache: "no-store" }
        );
        const ctaData = await ctaRes.json();
        setCtaSection(ctaData.data?.cta_section_category);
      } catch (e) {
        setCtaSection(null); // Jika error, abaikan saja CTA
      }
    };
    fetchCTA();
  }, [language]);

  if (loading) return <div className="py-20 text-center">Loading...</div>;
  if (error || !data || !data.category)
    return (
      <div className="py-20 text-center text-red-500">
        {error || "Category not found."}
      </div>
    );

  // Strapi v4: data langsung di root (bukan attributes)
  const { category, projects } = data;
  const attr = category; // jika attributes, ganti ke category.attributes
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: `${attr.name} Projects` },
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
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          {attr.badge && (
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              {attr.badge}
            </Badge>
          )}
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {attr.name} Projects
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
            {attr.description || `Our premium ${attr.name} installations.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {Array.isArray(attr.ctabutton) && attr.ctabutton.length > 0 ? (
              attr.ctabutton.map((btn: any, idx: number) => (
                <Button
                  key={btn.id || idx}
                  size="lg"
                  variant={btn.style === "primary" ? "default" : "secondary"}
                  className={
                    btn.style === "secondary"
                      ? "bg-white text-primary border-primary hover:bg-primary hover:text-white"
                      : btn.style === "primary"
                      ? "hover:bg-white hover:text-primary hover:shadow-lg transition-colors"
                      : ""
                  }
                  asChild
                >
                  <Link href={btn.link || "#"}>{btn.teks}</Link>
                </Button>
              ))
            ) : (
              <Button size="lg" asChild>
                <Link href="/contact">
                  Start Your Project <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>
      {/* Projects Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {projects.map((projectItem: any) => (
              <Card
                key={projectItem.id}
                className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow"
              >
                <div className="relative h-64">
                  <Image
                    src={
                      projectItem.image
                        ? `${STRAPI_URL}${projectItem.image.url}`
                        : "/placeholder.svg"
                    }
                    alt={projectItem.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    {projectItem.categories?.[0] && (
                      <Badge className="bg-primary/90 text-white">
                        {projectItem.categories[0].name}
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-3">
                    {projectItem.title}
                  </h3>
                  <div className="flex items-center text-slate-600 mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{projectItem.location}</span>
                  </div>
                  <div className="flex items-center text-slate-600 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {new Date(projectItem.completionDate).getFullYear()}
                    </span>
                  </div>
                  <div className="flex items-center text-slate-600 mb-4">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {projectItem.elevatorCount} elevators
                    </span>
                  </div>
                  <div className="prose prose-sm text-slate-700 mb-4 max-w-none">
                    <BlocksRenderer content={projectItem.description as any} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-800">
                      Key Features:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(projectItem.keyFeatures || []).map((feature: any) => (
                        <Badge
                          key={feature.id}
                          variant="secondary"
                          className="text-xs"
                        >
                          {feature.text}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {ctaSection?.Title || "Ready to Start Your Project?"}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {ctaSection?.Subtitle ||
              "Let our experienced team help you design and implement the perfect solution for your needs."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {ctaSection?.button?.length > 0 ? (
              ctaSection.button.map((btn: any, idx: number) => (
                <Button
                  key={btn.id || idx}
                  size="lg"
                  variant={btn.style === "primary" ? "default" : "secondary"}
                  className={
                    btn.style === "secondary"
                      ? "bg-white text-primary border-primary hover:bg-primary hover:text-white"
                      : btn.style === "primary"
                      ? "hover:bg-white hover:text-primary hover:shadow-lg transition-colors"
                      : ""
                  }
                  asChild
                >
                  <Link href={btn.link || "#"}>{btn.teks}</Link>
                </Button>
              ))
            ) : (
              <>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/contact">Get Free Consultation</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary"
                  asChild
                >
                  <Link href="/projects">View All Projects</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
