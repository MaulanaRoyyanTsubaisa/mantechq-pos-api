"use client";

import { useEffect, useState } from "react";
import Footer from "./footer";
import { useLanguage } from "@/contexts/language-context";
import { getFooterData } from "@/lib/data";

const FooterWrapper = () => {
  const { language } = useLanguage();
  const [footerData, setFooterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getFooterData(language)
      .then((data) => setFooterData(data))
      .catch((e) => setError(e.message || "Failed to load footer data"))
      .finally(() => setLoading(false));
  }, [language]);

  if (loading) {
    return (
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p>Loading footer...</p>
        </div>
      </footer>
    );
  }

  if (error) {
    return (
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p>{error}</p>
        </div>
      </footer>
    );
  }

  return <Footer footerData={footerData} />;
};

export default FooterWrapper;
