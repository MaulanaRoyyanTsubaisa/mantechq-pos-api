"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { OurFeatureProject, Category, RichTextBlock } from "@/types/strapi";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Building,
  Calendar,
  ImageIcon,
  MessageSquareQuote,
} from "lucide-react";
import ProjectGalleryModal from "@/components/project-gallery-modal";
import { useLanguage } from "@/contexts/language-context";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// ** KITA DEFINISIKAN TIPE DATA UNTUK FRONTEND DI SINI DAN EKSPOR **
export type ProjectDetails = {
  id: number;
  name: string;
  location: string;
  year: string;
  type: string;
  category: string;
  description: string;
  fullDescription: RichTextBlock[] | null; // Tipe Rich Text asli
  features: string[];
  mainImage: string;
  images: { url: string; alt: string; caption: string }[];
  clientName: string;
  completionDate: string;
  projectValue: string;
  elevatorCount: number;
  floors: number;
  testimonial?: {
    quote: RichTextBlock[] | null; // Tipe Rich Text asli
    author: string;
    position: string;
    company: string;
    image: string;
  };
};

// Fungsi "penerjemah" menggunakan tipe data yang sudah benar
const mapStrapiToProjectDetails = (
  project: OurFeatureProject
): ProjectDetails => {
  const mainCategory =
    project.categories?.find((cat) => cat.name)?.name.toLowerCase() ||
    "uncategorized";

  // LOGIKA BARU: Jika image utama null, gunakan gambar pertama dari galeri
  const mainImageUrl = project.image?.url
    ? `${STRAPI_URL}${project.image.url}`
    : project.galery?.[0]?.url
    ? `${STRAPI_URL}${project.galery[0].url}`
    : "/placeholder.svg";

  return {
    id: project.id,
    name: project.title,
    location: project.location,
    year: project.completionDate
      ? new Date(project.completionDate).getFullYear().toString()
      : "",
    type: project.categories?.map((cat) => cat.name).join(", ") || "",
    category: mainCategory,
    description:
      project.description?.[0]?.children?.[0]?.text.substring(0, 150) + "..." ||
      "",
    fullDescription: project.description,
    features:
      project.keyFeatures
        ?.map((feature) => feature.text)
        .filter((text): text is string => !!text) || [],
    mainImage: mainImageUrl, // Menggunakan URL gambar yang sudah di-fallback
    images: (project.galery || []).map((img) => ({
      url: img?.url ? `${STRAPI_URL}${img.url}` : "",
      alt: img?.alternativeText || project.title,
      caption: img?.caption || "",
    })),
    clientName: project.clientName,
    completionDate: project.completionDate,
    projectValue: project.projectValue,
    elevatorCount: project.elevatorCount,
    floors: project.floorCount,
    testimonial: project.testimonial
      ? {
          quote: project.testimonial.quote,
          author: project.testimonial.authorName,
          position: project.testimonial.authorJabatan,
          company: project.testimonial.authorCompany,
          image: project.testimonial.imageOverview?.url
            ? `${STRAPI_URL}${project.testimonial.imageOverview.url}`
            : "",
        }
      : undefined,
  };
};

const ProjectsList = ({ data }: { data: any }) => {
  const { t, language } = useLanguage();

  const [allProjects, setAllProjects] = useState<ProjectDetails[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectDetails[]>(
    []
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const [selectedProject, setSelectedProject] = useState<ProjectDetails | null>(
    null
  );
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories with locale
        const categoryRes = await axios.get(
          `${STRAPI_URL}/api/categories?populate=*&locale=${language}`
        );
        setCategories(categoryRes.data.data || categoryRes.data || []);

        // Fetch projects with locale
        const projectRes = await axios.get(
          `${STRAPI_URL}/api/our-feature-projects?populate=*&locale=${language}`
        );
        const projectsData = projectRes.data.data
          ? projectRes.data.data
          : projectRes.data || [];
        const validProjects = projectsData.filter(
          (p: OurFeatureProject) => p && p.title
        );
        const mappedProjects = validProjects.map(mapStrapiToProjectDetails);
        setAllProjects(mappedProjects);
        setFilteredProjects(mappedProjects);
      } catch (error) {
        console.error("Gagal mengambil data dari Strapi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [language]);

  useEffect(() => {
    if (filter === "all") {
      setFilteredProjects(allProjects);
    } else {
      setFilteredProjects(allProjects.filter((p) => p.category === filter));
    }
  }, [filter, allProjects]);

  const projectCounts = allProjects.reduce((acc, project) => {
    if (project.category) {
      acc[project.category] = (acc[project.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  projectCounts.all = allProjects.length;

  const openGallery = (project: ProjectDetails) => {
    setSelectedProject(project);
    setIsGalleryOpen(true);
  };

  if (loading) {
    return <div className="text-center py-20">Loading Projects...</div>;
  }

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {data?.Section_Projects_Title || t("projects.list.title")}
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
            {data?.Section_Projects_Subtitle || t("projects.list.subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="min-w-[120px]"
          >
            {t("projects.all")} ({projectCounts.all || 0})
          </Button>
          {categories
            .filter((cat) => cat && cat.name)
            .map((cat) => {
              const categoryName = cat.name.toLowerCase();
              return (
                <Button
                  key={cat.id}
                  variant={filter === categoryName ? "default" : "outline"}
                  onClick={() => setFilter(categoryName)}
                  className="min-w-[120px]"
                >
                  {cat.name} ({projectCounts[categoryName] || 0})
                </Button>
              );
            })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            // --- PERUBAHAN UTAMA ADA DI SINI ---
            // class "reveal" dan properti "style" dihapus untuk menonaktifkan animasi
            <Card
              key={project.id}
              className="border-none shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div
                className="relative h-60 w-full group cursor-pointer"
                onClick={() => openGallery(project)}
              >
                <Image
                  src={project.mainImage || "/placeholder.svg"}
                  alt={project.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-white/90 dark:bg-slate-800/90 rounded-full p-2">
                    <ImageIcon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="sr-only">View gallery</span>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge
                    variant="secondary"
                    className="bg-white/90 text-slate-800 font-medium"
                  >
                    {project.year}
                  </Badge>
                </div>
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <Badge
                    variant="secondary"
                    className="bg-white/90 text-slate-800 font-medium"
                  >
                    <ImageIcon className="h-3 w-3 mr-1" />{" "}
                    {project.images.length}
                  </Badge>
                  {project.testimonial && (
                    <Badge
                      variant="secondary"
                      className="bg-white/90 text-slate-800 font-medium"
                    >
                      <MessageSquareQuote className="h-3 w-3 mr-1" />{" "}
                      {t("common.testimonial")}
                    </Badge>
                  )}
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <Badge
                    variant="outline"
                    className="bg-accent/10 text-accent border-accent"
                  >
                    {project.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2 mb-4">
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="h-4 w-4 mr-2" />
                    {project.location}
                  </div>
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <Building className="h-4 w-4 mr-2" />
                    {project.category.charAt(0).toUpperCase() +
                      project.category.slice(1)}
                  </div>
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    {t("projects.completedIn")} {project.year}
                  </div>
                </div>
                <CardDescription className="text-base text-slate-700 dark:text-slate-300">
                  {project.description}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => openGallery(project)}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />{" "}
                  {t("projects.viewGallery")}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600 dark:text-slate-400">
              No projects found for the selected category.
            </p>
          </div>
        )}
      </div>

      <ProjectGalleryModal
        project={selectedProject}
        open={isGalleryOpen}
        onOpenChange={setIsGalleryOpen}
      />
    </section>
  );
};

export default ProjectsList;
