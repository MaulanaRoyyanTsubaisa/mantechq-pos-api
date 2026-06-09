"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Target } from "lucide-react";

const VisionMission = ({ data }: { data: any }) => {
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
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 reveal">
            {data?.vision_title} & {data?.mission_title}
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto reveal reveal-delay-1">
            Explore the core principles that drive our commitment to excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Card className="border-none shadow-lg reveal">
            <CardHeader className="flex flex-row items-center gap-4">
              <Eye className="h-10 w-10 text-accent" />
              <CardTitle className="text-2xl">{data?.vision_title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 dark:text-slate-300">
                {data?.vision_content}
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg reveal reveal-delay-2">
            <CardHeader className="flex flex-row items-center gap-4">
              <Target className="h-10 w-10 text-accent" />
              <CardTitle className="text-2xl">{data?.mission_title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 dark:text-slate-300">
                {data?.mission_content}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
