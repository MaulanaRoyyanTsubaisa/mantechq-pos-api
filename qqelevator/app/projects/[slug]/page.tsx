import ProjectCategoryClient from "@/components/sections/project-category-client";

interface ProjectCategoryPageProps {
  params: { slug: string };
}

export default function ProjectCategoryPage({
  params,
}: ProjectCategoryPageProps) {
  const { slug } = params;
  return <ProjectCategoryClient slug={slug} />;
}
