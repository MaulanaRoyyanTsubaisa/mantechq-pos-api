"use client";

import { useEffect } from "react";
import Image from "next/image";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

const CompanyHistory = ({ data }: { data: any }) => {
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

  const historyTitle = data?.history_title || "Our History";
  const historySubtitle =
    data?.history_subtitle ||
    "From humble beginnings to industry leadership, our journey has been defined by innovation, quality, and a commitment to excellence.";
  const legacy = data?.history_legacy;
  const milestones = data?.history_milestones || [];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 reveal">
            {historyTitle}
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto reveal reveal-delay-1">
            {historySubtitle}
          </p>
        </div>

        {legacy && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 lg:order-1">
              <div className="relative h-[400px] rounded-lg overflow-hidden reveal">
                {legacy.image &&
                  legacy.image.url &&
                  (() => {
                    const strapiUrl =
                      process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "") ||
                      "http://localhost:1337";
                    const rawUrl = legacy.image.url;
                    const imageUrl = rawUrl.startsWith("http")
                      ? rawUrl
                      : `${strapiUrl}${rawUrl}`;

                    return (
                      <Image
                        src={imageUrl}
                        alt={legacy.title || "Company history"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    );
                  })()}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="text-2xl font-bold mb-4 reveal">{legacy.title}</h3>
              <div className="prose dark:prose-invert text-slate-700 dark:text-slate-300 mb-4 reveal reveal-delay-1">
                <BlocksRenderer content={legacy.content} />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          <h3 className="text-2xl font-bold text-center mb-8 reveal">
            Key Milestones
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {milestones.map((milestone: any, index: number) => (
              <div
                key={milestone.id || index}
                className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 reveal"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-accent font-bold text-xl mb-2">
                  {milestone.year}
                </div>
                <h4 className="text-xl font-semibold mb-3">
                  {milestone.title}
                </h4>
                <p className="text-slate-700 dark:text-slate-300">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyHistory;
