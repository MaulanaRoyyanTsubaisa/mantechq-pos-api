"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";

const ClientLogos = ({ data }: { data: any }) => {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

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

  // Ambil logo dari data Strapi, support dua kemungkinan nama field
  const logos = data?.client_logos || data?.clientLogos || [];
  const mid = Math.ceil(logos.length / 2);
  const clientLogos1 = logos.slice(0, mid);
  const clientLogos2 = logos.slice(mid);

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-800 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 reveal">
            {t("clients.logos.title")}
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto reveal reveal-delay-1">
            {t("clients.logos.subtitle")}
          </p>
        </div>

        <div className="reveal reveal-delay-2">
          {/* First row - scrolling left to right */}
          <div className="flex space-x-12 mb-12 overflow-hidden">
            <div
              className="flex space-x-12 animate-marquee"
              style={{ animationDuration: "18s" }}
            >
              {[...clientLogos1, ...clientLogos1]
                .filter(
                  (client) => client.client_logos && client.client_logos.url
                )
                .map((client, index) => (
                  <div key={index} className="flex-shrink-0 w-40 h-20 relative">
                    <Image
                      src={
                        client.client_logos.url.startsWith("http")
                          ? client.client_logos.url
                          : process.env.NEXT_PUBLIC_STRAPI_URL +
                            client.client_logos.url
                      }
                      alt={client.client_logos.name || "Client Logo"}
                      fill
                      className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Second row - scrolling right to left */}
          <div className="flex space-x-12 overflow-hidden">
            <div
              className="flex space-x-12 animate-marquee-reverse"
              style={{ animationDuration: "18s" }}
            >
              {[...clientLogos2, ...clientLogos2]
                .filter(
                  (client) => client.client_logos && client.client_logos.url
                )
                .map((client, index) => (
                  <div key={index} className="flex-shrink-0 w-40 h-20 relative">
                    <Image
                      src={
                        client.client_logos.url.startsWith("http")
                          ? client.client_logos.url
                          : process.env.NEXT_PUBLIC_STRAPI_URL +
                            client.client_logos.url
                      }
                      alt={client.client_logos.name || "Client Logo"}
                      fill
                      className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
