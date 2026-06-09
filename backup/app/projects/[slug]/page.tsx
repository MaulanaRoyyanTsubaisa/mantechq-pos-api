import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

// Impor komponen UI
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, ArrowRight } from "lucide-react";
import { BreadcrumbNavigation } from "@/components/breadcrumb-navigation";

// Impor tipe data dari Strapi
import { Category as CategoryType, OurFeatureProject } from "@/types/strapi";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// 1. Fungsi untuk mengambil data (STRATEGI BARU & FINAL)
async function getCategoryAndProjects(slug: string): Promise<{
  category: any;
  projects: any[];
} | null> {
  try {
    // Ambil SEMUA proyek dan populate kategorinya
    const apiUrl = `${STRAPI_URL}/api/our-feature-projects?populate=*`;
    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) {
      console.error(
        `Gagal mengambil data Proyek dari Strapi. Status: ${res.status}`
      );
      return null;
    }

    const json = await res.json();
    if (!json.data || !Array.isArray(json.data)) {
      console.error("Format data proyek dari Strapi tidak sesuai.");
      return null;
    }

    // Filter semua proyek untuk menemukan yang kategorinya cocok dengan slug
    const filteredProjects = json.data.filter((project: any) => {
      // Tambahkan pengecekan keamanan untuk project
      if (!project) {
        return false;
      }
      if (!project.categories || !Array.isArray(project.categories)) {
        return false;
      }
      return project.categories.some((cat: any) => cat && cat.slug === slug);
    });

    if (filteredProjects.length === 0) {
      console.error(
        `Tidak ada proyek yang ditemukan untuk kategori slug '${slug}'.`
      );
      return null;
    }

    // Ambil detail kategori dari proyek pertama yang ditemukan
    const categoryData = filteredProjects[0].categories.find(
      (cat: any) => cat.slug === slug
    );

    if (!categoryData) return null;

    return {
      category: categoryData,
      projects: filteredProjects,
    };
  } catch (error) {
    console.error("Terjadi error tak terduga saat memproses proyek:", error);
    return null;
  }
}

interface ProjectCategoryPageProps {
  params: Promise<{ slug: string }>;
}

// 2. Fungsi untuk generate Metadata dinamis
export async function generateMetadata({
  params,
}: ProjectCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryAndProjects(slug);
  if (!data || !data.category) return { title: "Projects Not Found" };

  return {
    title: `${data.category.name} Projects | Elevate Engineering`,
    description:
      data.category.description ||
      `Our portfolio of ${data.category.name} projects.`,
  };
}

// 3. Komponen Halaman Utama
export default async function ProjectCategoryPage({
  params,
}: ProjectCategoryPageProps) {
  const { slug } = await params;
  const data = await getCategoryAndProjects(slug);

  // Debug: log data dan URL API Strapi
  console.log("[DEBUG] category:", data?.category);
  console.log(
    "[DEBUG] Strapi API URL:",
    `${STRAPI_URL}/api/our-feature-projects?populate=*`
  );

  if (!data || !data.category) {
    notFound();
  }

  const { category, projects } = data;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: `${category.name} Projects` },
  ];

  // Fetch CTA section from single type Project
  const ctaRes = await fetch(
    `${STRAPI_URL}/api/project?populate[cta_section][populate]=button`,
    { cache: "no-store" }
  );
  const ctaData = await ctaRes.json();
  const ctaSection = ctaData.data?.cta_section;

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
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
            Project Portfolio
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {category.name} Projects
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
            {category.description ||
              `Our premium ${category.name} installations.`}
          </p>
          <Button size="lg" asChild>
            <Link href="/contact">
              Start Your Project <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {projects.map((projectItem) => {
              return (
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
                      <BlocksRenderer
                        content={projectItem.description as any}
                      />
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
              );
            })}
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

// 4. Fungsi untuk generate semua kemungkinan path kategori
export async function generateStaticParams() {
  try {
    const res = await fetch(`${STRAPI_URL}/api/categories?fields[0]=slug`);
    if (!res.ok) return [];
    const json = await res.json();
    const categories = json.data || [];
    return categories
      .filter((cat: any) => cat.attributes && cat.attributes.slug)
      .map((cat: any) => ({
        slug: cat.attributes.slug,
      }));
  } catch (error) {
    console.error(
      "Failed to generate static params for project categories:",
      error
    );
    return [];
  }
}
