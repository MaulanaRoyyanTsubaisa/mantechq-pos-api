"use client";

import { useEffect } from "react";
import { useLanguage } from "@/contexts/language-context";

const MapSection = ({
  data,
  titleClassName = "text-3xl font-bold mb-4",
  subtitleClassName = "mb-8 text-slate-600",
  iframeClassName = "w-full",
}: {
  data: any;
  titleClassName?: string;
  subtitleClassName?: string;
  iframeClassName?: string;
}) => {
  const { t } = useLanguage();

  const title = data?.location_title || "Our Location";
  const subtitle =
    data?.location_subtitle ||
    "Visit our headquarters to see our showroom and discuss your project in person.";
  const mapUrl =
    Array.isArray(data?.map_embed_url) &&
    data.map_embed_url[0]?.children?.[0]?.text
      ? data.map_embed_url[0].children[0].text
      : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.817527264993!2d-74.0060156845932!3d40.7127757793306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDQyJzQ2LjAiTiA3NMKwMDAnMjIuMCJX!5e0!3m2!1sen!2sus!4v1610000000000!5m2!1sen!2sus";

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

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className={titleClassName}>{title}</h2>
        <p className={subtitleClassName}>{subtitle}</p>
        <div className="flex justify-center">
          <iframe
            src={mapUrl}
            width="1000"
            height="400"
            style={{ border: 0, borderRadius: 16 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className={iframeClassName}
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
