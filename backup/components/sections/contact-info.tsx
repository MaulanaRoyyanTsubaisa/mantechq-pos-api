"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

const ContactInfo = ({ data }: { data: any }) => {
  const { t } = useLanguage();

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

  const infoTitle = data?.info_title || t("contact.info.title");
  const infoSubtitle = data?.info_subtitle || t("contact.info.subtitle");
  const address = data?.address || null;
  const mainPhone = data?.main_phone || "Main: +1 (555) 123-4567";
  const supportPhone = data?.support_phone || "Support: +1 (555) 987-6543";
  const generalEmail = data?.general_email || "info@elevateengineering.com";
  const supportEmail = data?.support_email || "support@elevateengineering.com";
  const businessHours = data?.business_hours || [
    { days: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
    { days: "Saturday", hours: "9:00 AM - 1:00 PM" },
    { days: "Sunday", hours: "Closed" },
  ];
  const socialLinks = data?.social_links || [];

  return (
    <Card className="border-none shadow-lg reveal reveal-delay-2">
      <CardHeader>
        <CardTitle className="text-2xl">{infoTitle}</CardTitle>
        <CardDescription>{infoSubtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-accent mr-3 mt-1" />
            <div>
              <h4 className="font-medium">{t("contact.info.address")}</h4>
              <p className="text-slate-600 dark:text-slate-400">
                {address ? (
                  typeof address === "string" ? (
                    address.split("\n").map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))
                  ) : null
                ) : (
                  <>
                123 Elevator Street, Engineering District
                <br />
                New York, NY 10001
                <br />
                United States
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Phone className="h-5 w-5 text-accent mr-3 mt-1" />
            <div>
              <h4 className="font-medium">{t("contact.info.phone")}</h4>
              <p className="text-slate-600 dark:text-slate-400">
                {mainPhone}
                <br />
                {supportPhone}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Mail className="h-5 w-5 text-accent mr-3 mt-1" />
            <div>
              <h4 className="font-medium">{t("contact.info.email")}</h4>
              <p className="text-slate-600 dark:text-slate-400">
                General Inquiries: {generalEmail}
                <br />
                Support: {supportEmail}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Clock className="h-5 w-5 text-accent mr-3 mt-1" />
            <div>
              <h4 className="font-medium">{t("contact.info.hours")}</h4>
              <p className="text-slate-600 dark:text-slate-400">
                {businessHours.map((item: any, i: number) => (
                  <span key={i}>
                    {item.days}: {item.hours}
                <br />
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <h4 className="font-medium mb-3">{t("contact.info.connect")}</h4>
          <div className="flex space-x-4">
            {socialLinks.length > 0 ? (
              socialLinks.map((item: any, i: number) => {
                let Icon = null;
                switch ((item.platform || "").toLowerCase()) {
                  case "facebook":
                    Icon = Facebook;
                    break;
                  case "twitter":
                    Icon = Twitter;
                    break;
                  case "instagram":
                    Icon = Instagram;
                    break;
                  case "linkedin":
                    Icon = Linkedin;
                    break;
                  default:
                    Icon = null;
                }
                return (
                  <a
                    key={i}
                    href={item.url}
                    className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {Icon ? <Icon size={22} /> : item.platform}
                    <span className="sr-only">{item.platform}</span>
                  </a>
                );
              })
            ) : (
              <>
                <a
              href="#"
              className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors"
            >
              <Facebook size={22} />
              <span className="sr-only">Facebook</span>
                </a>
                <a
              href="#"
              className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors"
            >
              <Twitter size={22} />
              <span className="sr-only">Twitter</span>
                </a>
                <a
              href="#"
              className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors"
            >
              <Instagram size={22} />
              <span className="sr-only">Instagram</span>
                </a>
                <a
              href="#"
              className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors"
            >
              <Linkedin size={22} />
              <span className="sr-only">LinkedIn</span>
                </a>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfo;
