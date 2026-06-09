"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Youtube,
  Twitch,
} from "lucide-react";

// Helper to map social platform name to Lucide icon component
const socialIconMap: { [key: string]: React.ElementType } = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  x: Twitter,
  youtube: Youtube,
  tiktok: Twitch,
};

const Footer = ({ footerData }: { footerData: any }) => {
  if (!footerData) {
    return (
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p>Failed to load footer data.</p>
        </div>
      </footer>
    );
  }

  const {
    logo_text,
    description,
    social_links,
    quick_links_title,
    quick_links,
    product_links_title,
    product_links,
    contact_title,
    address,
    phone,
    email,
    copyright_text,
  } = footerData;

  // Split logo text for styling if it exists
  const logoMain = logo_text ? logo_text.slice(0, 2) : "QQ";
  const logoAccent = logo_text ? logo_text.slice(2) : "Elevator";

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              {logoMain}
              <span className="text-accent">{logoAccent}</span>
            </h3>
            <p className="text-slate-300 mb-4">{description}</p>
            <div className="flex space-x-4">
              {social_links &&
                social_links
                  .filter(
                    (link: any) =>
                      link && typeof link.url === "string" && link.url.trim()
                  )
                  .map((link: any) => {
                    const Icon =
                      socialIconMap[link.platform.toLowerCase()] || Link;
                    return (
                      <Link
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-accent transition-colors"
                      >
                        <Icon size={20} />
                        <span className="sr-only">{link.platform}</span>
                      </Link>
                    );
                  })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{quick_links_title}</h3>
            <ul className="space-y-2">
              {quick_links &&
                quick_links
                  .filter(
                    (link: any) =>
                      link && typeof link.url === "string" && link.url.trim()
                  )
                  .map((link: any) => (
                    <li key={link.id}>
                      <Link
                        href={link.url}
                        className="text-slate-300 hover:text-accent transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              {product_links_title}
            </h3>
            <ul className="space-y-2">
              {product_links &&
                product_links
                  .filter(
                    (link: any) =>
                      link && typeof link.url === "string" && link.url.trim()
                  )
                  .map((link: any) => (
                    <li key={link.id}>
                      <Link
                        href={link.url}
                        className="text-slate-300 hover:text-accent transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{contact_title}</h3>
            <ul className="space-y-3">
              {address && (
                <li className="flex items-start">
                  <MapPin
                    size={18}
                    className="mr-2 mt-1 flex-shrink-0 text-accent"
                  />
                  <span className="text-slate-300">{address}</span>
                </li>
              )}
              {phone && (
                <li className="flex items-center">
                  <Phone size={18} className="mr-2 flex-shrink-0 text-accent" />
                  <a
                    href={`tel:${phone}`}
                    className="text-slate-300 hover:text-accent"
                  >
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li className="flex items-center">
                  <Mail size={18} className="mr-2 flex-shrink-0 text-accent" />
                  <a
                    href={`mailto:${email}`}
                    className="text-slate-300 hover:text-accent"
                  >
                    {email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-6 text-center text-slate-400">
          <p>{copyright_text}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
