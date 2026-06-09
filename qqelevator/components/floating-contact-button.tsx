"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import ContactForm from "@/components/sections/contact-form";
import ContactInfo from "@/components/sections/contact-info";
import { getContactData, getAboutData } from "@/lib/data";
import { useLanguage } from "@/contexts/language-context";
import MapSection from "@/components/sections/map-section";

const FloatingContactButton = () => {
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { language } = useLanguage();
  const [contactData, setContactData] = useState<any>(null);
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLElement | null>(null);

  // Detect scroll seperti navbar (tombol hanya muncul jika scrollY > 10)
  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch contact data (sama seperti halaman contact)
  useEffect(() => {
    setLoading(true);
    Promise.all([getContactData(language), getAboutData(language)])
      .then(([contact, about]) => {
        setContactData(contact);
        setAboutData(about);
      })
      .finally(() => setLoading(false));
  }, [language]);

  return (
    <>
      {/* Tombol floating */}
      <button
        onClick={() => setShowModal(true)}
        className={`fixed z-50 bottom-8 right-8 bg-yellow-400 hover:bg-yellow-500 text-slate-900 flex items-center gap-2 px-5 py-3 rounded-full shadow-lg font-semibold text-lg transition-all duration-500 ease-in-out border-2 border-yellow-500
          ${
            show
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.12)" }}
        aria-label="Hubungi Kami"
      >
        <MessageCircle className="w-6 h-6 mr-1" /> Hubungi Kami
      </button>

      {/* Modal popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-3xl md:max-w-6xl w-auto mx-auto my-12 relative animate-fadeInUp flex flex-col max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-900 dark:hover:text-white text-2xl font-bold"
              aria-label="Tutup"
            >
              ×
            </button>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-x-1 p-0 text-xs">
              {/* Kolom 1-2: Map (2 kolom) */}
              <div className="flex flex-col h-full bg-white dark:bg-slate-900 p-3 justify-center md:col-span-2 overflow-x-auto">
                <div className="flex justify-center w-full">
                  <MapSection
                    data={contactData}
                    titleClassName="text-xs font-semibold mb-1"
                    subtitleClassName="mb-2 text-xs"
                    iframeClassName="w-full max-w-full"
                  />
                </div>
              </div>
              {/* Kolom 3: Form */}
              <div className="flex flex-col h-full bg-white dark:bg-slate-900 p-3 justify-center md:col-span-2">
                <ContactForm data={contactData} />
              </div>
              {/* Kolom 4: Info */}
              <div className="flex flex-col h-full bg-white dark:bg-slate-900 p-3 justify-center md:col-span-2">
                <ContactInfo data={contactData} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingContactButton;
