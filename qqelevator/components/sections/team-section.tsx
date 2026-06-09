"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Linkedin, Twitter } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { getStrapiURL } from "@/lib/utils";

const TeamSection = ({ data }: { data: any }) => {
  const { t } = useLanguage();

  console.log("[DEBUG] TeamSection data:", data);

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

  const teamMembers = data?.team_members || [];
  console.log("[DEBUG] teamMembers:", teamMembers);
  const sectionTitle = data?.team_title || t("team.title");
  const sectionSubtitle = data?.team_subtitle || t("team.subtitle");

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 reveal">
            {sectionTitle}
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto reveal reveal-delay-1">
            {sectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {teamMembers.map((member: any) => {
            let imageUrl = undefined;
            if (member.photo?.url) {
              imageUrl = member.photo.url.startsWith("http")
                ? member.photo.url
                : getStrapiURL(member.photo.url);
            }
            console.log(
              "[TEAM IMAGE DEBUG] member:",
              member.name,
              "photo:",
              member.photo,
              "imageUrl:",
              imageUrl
            );

            return (
              <div
                key={member.id}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden text-center"
              >
                <div className="relative h-80 w-full">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-80 w-full bg-slate-200 flex items-center justify-center text-slate-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
                    {member.position}
                  </p>
                  <div className="flex justify-center space-x-4">
                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-primary"
                      >
                        <Linkedin size={20} />
                      </a>
                    )}
                    {member.twitter_url && (
                      <a
                        href={member.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-primary"
                      >
                        <Twitter size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
