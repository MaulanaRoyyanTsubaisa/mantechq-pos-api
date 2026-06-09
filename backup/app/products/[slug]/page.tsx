import type { Metadata } from "next";

import { notFound } from "next/navigation";

import Image from "next/image";

import Link from "next/link";

// Impor komponen UI

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { CheckCircle, ArrowRight, Phone, Mail } from "lucide-react";

import { BreadcrumbNavigation } from "@/components/breadcrumb-navigation";

import { BlocksRenderer } from "@strapi/blocks-react-renderer";

// Impor tipe data dari Strapi

import { Product as ProductType } from "@/types/strapi";

import ProductDetailClient from "@/components/sections/product-detail-client";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// Fungsi untuk mengambil data SATU produk dari Strapi berdasarkan slug

async function getProductBySlug(
  slug: string,
  locale: string
): Promise<ProductType | null> {
  try {
    const productRes = await fetch(
      `${STRAPI_URL}/api/products?filters[slug][$eq]=${slug}&locale=${locale}`,
      { cache: "no-store" }
    );

    if (!productRes.ok) return null;

    const productData = await productRes.json();

    if (!productData.data || productData.data.length === 0) return null;

    return productData.data[0];
  } catch (error) {
    console.error("Failed to fetch product:", error);

    return null;
  }
}

// Fungsi untuk mengambil gambar produk secara terpisah

async function getProductImageBySlug(
  slug: string,
  locale: string
): Promise<string | null> {
  try {
    const imageRes = await fetch(
      `${STRAPI_URL}/api/products?filters[slug][$eq]=${slug}&populate=image&locale=${locale}`,
      { cache: "no-store" }
    );
    if (!imageRes.ok) return null;
    const imageData = await imageRes.json();
    const product = imageData.data[0];
    return product?.image?.url || null;
  } catch (error) {
    console.error("Failed to fetch product image:", error);
    return null;
  }
}

// Fungsi untuk mengambil data CTA dari Product Page Single Type

async function getProductPageCta(locale: string): Promise<any> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/product-page?populate[cta_section_category][populate]=button&locale=${locale}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;

    const json = await res.json();

    return json.data || null;
  } catch (error) {
    console.error("Failed to fetch product page CTA:", error);

    return null;
  }
}

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// Fungsi untuk generate Metadata dinamis

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug;
  const product = await getProductBySlug(slug, "en");

  if (!product) return { title: "Product Not Found" };

  const description =
    product.description?.[0]?.children?.[0]?.text ||
    `Details for ${product.name}`;

  return {
    title: `${product.name} | Elevate Engineering`,
    description: description,
  };
}

// Komponen Halaman Utama (Server Component)

export default function ProductPage({ params }: { params: { slug: string } }) {
  return <ProductDetailClient slug={params.slug} />;
}

// Fungsi generateStaticParams tidak perlu diubah

export async function generateStaticParams() {
  try {
    const res = await fetch(`${STRAPI_URL}/api/products?fields[0]=slug`);

    if (!res.ok) return [];

    const json = await res.json();

    const products = json.data || [];

    return products

      .filter((product: any) => product.slug)

      .map((product: any) => ({ slug: product.slug }));
  } catch (error) {
    console.error("Failed to generate static params:", error);

    return [];
  }
}
