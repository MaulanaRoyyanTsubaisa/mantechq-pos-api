// src/types/strapi.ts

// Tipe Generic untuk struktur { id, attributes } yang selalu dipakai Strapi
// Kita akan hapus penggunaannya untuk tipe yang API-nya datar
export interface StrapiObject<T> {
  id: number;
  attributes: T;
}

// Tipe untuk format gambar dari Strapi
export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
}

// Tipe untuk objek Media (Gambar, PDF) - Disederhanakan untuk struktur datar
export interface StrapiMedia {
  id: number;
  url: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats?: {
    // Dibuat opsional
    thumbnail: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
}

// Tipe untuk Rich Text (Blocks)
export interface RichTextBlock {
  type: string;
  children: { type: string; text: string }[];
}

// Tipe untuk Component di dalam Strapi
export interface StrapiComponent {
  id: number;
  __component: string;
  [key: string]: any;
}

// --- TIPE-TIPE SPESIFIK UNTUK MODEL ANDA ---

// Tipe untuk Collection Type "Product" (flat, sesuai response Strapi sekarang)
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: any[];
  image?: { url: string };
  features?: { id: number; feature: string }[];
  buttonText?: string;
  buttonLink?: string;
  isFeatured?: boolean;
  [key: string]: any;
}
// export type Product = StrapiObject<ProductAttributes>; // OLD, jangan dipakai

// Tipe untuk Single Type "Product Page"
export interface CtaButton {
  id: number;
  teks: string;
  link: string;
  style: "primary" | "secondary";
}
export interface ProductPageAttributes {
  heading: string;
  subheading: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtons: CtaButton[];
}
export type ProductPage = StrapiObject<ProductPageAttributes>;

// Tipe untuk Component yang Anda buat
export interface HeroProdukDetail extends StrapiComponent {
  tagline: string;
  title: string;
  subtitle: string;
  buttons: CtaButton[]; // Menggunakan kembali tipe CtaButton
}

export interface SeksiFiturUtama extends StrapiComponent {
  title: string;
  daftarFitur: { id: number; feature: string }[]; // Nama field 'feature' sesuai builder
}

export interface SeksiSpekTeknis extends StrapiComponent {
  title: string;
  daftarSpek: { id: number; judulSpek: string; nilaiSpek: string }[];
}

export interface SeksiAplikasi extends StrapiComponent {
  title: string;
  daftarTags: { id: number; label: string }[];
}

// Tipe untuk Component "feature-item"
export interface FeatureItem {
  id: number;
  title: string;
  text?: string; // Menambahkan text agar kompatibel sementara
}

// Tipe untuk Collection Type "Category" - Dibuat Datar
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  our_feature_projects?: { data: OurFeatureProject[] }; // Tetap relasi, dibuat opsional
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

// Tipe untuk Collection Type "our-feature-project" - Dibuat Datar
export interface OurFeatureProject {
  id: number;
  title: string;
  slug: string;
  description: RichTextBlock[];
  image: StrapiMedia | null; // Menggunakan tipe StrapiMedia yang disederhanakan
  galery: StrapiMedia[] | null;
  categories: Category[]; // Relasi langsung ke array Category
  location: string;
  completionDate: string;
  clientName: string;
  elevatorCount: number;
  floorCount: number;
  projectValue: string;
  keyFeatures: FeatureItem[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  // Menambahkan testimonial jika ada di data datar
  testimonial?: any;
}

// Tipe untuk komponen yang digunakan di Homepage
export interface HomepageFeatureItem {
  id: number;
  text: string;
}

export interface HomepageButton {
  id: number;
  text: string;
  link: string;
  style: string; // atau tipe yang lebih spesifik jika ada
}

// Tipe untuk Single Type "Homepage"
export interface Homepage {
  id: number;
  title: string;
  description: RichTextBlock[];
  image: StrapiMedia;
  featureList: HomepageFeatureItem[];
  button: HomepageButton;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

// Hapus tipe lama yang menggunakan StrapiObject
// export type OurFeatureProject = StrapiObject<OurFeatureProjectAttributes>;
// export type Category = StrapiObject<CategoryAttributes>;

// (Tipe data untuk Project dan komponennya juga bisa ditambahkan di sini jika perlu)
