"use client";

import { useEffect } from "react";

const AboutHero = ({ data }: { data: any }) => {
  useEffect(() => {
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
  }, []);

  console.log("[HISTORY LEGACY IMAGE DEBUG]", data?.history_legacy?.image);

  return (
    <section className="relative py-24 md:py-32">
      <div
        className="about-hero-background absolute inset-0 bg-cover bg-center bg-no-repeat brightness-50"
        style={{
          backgroundImage: data?.hero_image?.url
            ? `url(${
                data.hero_image.url.startsWith("http")
                  ? data.hero_image.url
                  : typeof window !== "undefined"
                  ? data.hero_image.url
                  : process.env.NEXT_PUBLIC_STRAPI_URL + data.hero_image.url
              })`
            : undefined,
        }}
      ></div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 reveal">
          {data?.hero_text || "About Elevate Engineering"}
        </h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto reveal reveal-delay-1">
          {data?.hero_subtext ||
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam molestiae deserunt corrupti exercitationem totam quis."}
        </p>
      </div>
    </section>
  );
};

export default AboutHero;
