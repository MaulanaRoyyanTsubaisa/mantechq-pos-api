"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { getStrapiURL } from "@/lib/api";

interface StrapiImage {
  id: number;
  url: string;
  alternativeText: string | null;
}

interface Testimonial {
  id: number;
  name: string;
  authorName: string;
  authorPosition: string;
  quote: string;
  image: StrapiImage;
}

interface RichTextBlock {
  type: string;
  children: {
    text: string;
    type: string;
  }[];
}

interface HomepageData {
  id?: number;
  clientSectionTitle?: string;
  clientSectionSubtitle?: RichTextBlock[];
  testimonial?: Testimonial[];
}

const ClientShowcase = () => {
  const { t, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [data, setData] = useState<HomepageData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          getStrapiURL(
            `/api/homepage?populate[testimonial][populate]=*&locale=${language}`
          )
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        if (json.data) {
          setData(json.data);
        } else {
          setData({});
        }
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred");
        }
        console.error("Failed to fetch homepage data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  const testimonials = data?.testimonial || [];

  const nextSlide = useCallback(() => {
    if (testimonials.length === 0) return;
    setCurrentSlide((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  }, [testimonials.length]);

  const prevSlide = useCallback(() => {
    if (testimonials.length === 0) return;
    setCurrentSlide((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  }, [testimonials.length]);

  useEffect(() => {
    if (loading || !testimonials.length) return;

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
  }, [loading, testimonials.length]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoplay) {
      interval = setInterval(() => {
        nextSlide();
      }, 6000);
    }
    return () => clearInterval(interval);
  }, [autoplay, nextSlide]);

  const handleMouseEnter = () => {
    setAutoplay(false);
  };

  const handleMouseLeave = () => {
    setAutoplay(true);
  };

  if (loading) {
    return (
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loading Clients...
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            Please wait while we fetch our valued client stories.
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 text-center text-red-500">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Failed to Load Clients
          </h2>
          <p>There was an error fetching the data. Please try again later.</p>
          <p className="text-sm mt-2">Error: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 reveal">
            {data.clientSectionTitle || t("clientShowcase.title")}
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto reveal reveal-delay-1">
            {data.clientSectionSubtitle?.[0]?.children?.[0]?.text ||
              t("clientShowcase.subtitle")}
          </p>
        </div>

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
              {testimonials.map((client) => (
                <div key={client.id} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="relative h-full min-h-[300px] md:min-h-[400px]">
                      <Image
                        src={getStrapiURL(client.image.url)}
                        alt={
                          client.image.alternativeText ||
                          client.name ||
                          client.authorName ||
                          "Testimonial Image"
                        }
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-8 flex flex-col justify-center">
                      <div className="mb-6">
                        <Quote className="h-10 w-10 text-accent opacity-50" />
                      </div>
                      <p className="text-lg italic text-slate-700 dark:text-slate-300 mb-6">
                        "{client.quote}"
                      </p>
                      <div className="mt-auto">
                        <h3 className="font-bold text-xl">
                          {client.authorName}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          {client.authorPosition}
                        </p>
                        <p className="text-primary font-medium mt-1">
                          {client.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="secondary"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800"
            onClick={prevSlide}
            aria-label="Previous client"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800"
            onClick={nextSlide}
            aria-label="Next client"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  currentSlide === index
                    ? "bg-primary w-8"
                    : "bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500"
                )}
                aria-label={`Go to client ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientShowcase;
