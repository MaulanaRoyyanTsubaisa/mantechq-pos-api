"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, ChevronRight, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/contexts/language-context";
import { getNavbarData } from "@/lib/data";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

async function getCategories(): Promise<any[]> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/categories`);
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : json.data || [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [projectCategories, setProjectCategories] = useState<any[]>([]);
  const [navbar, setNavbar] = useState<any>(null);
  const pathname = usePathname();
  const { t, language } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const fetchCategories = async () => {
      const categories = await getCategories();
      setProjectCategories(categories);
    };

    const fetchNavbar = async () => {
      console.log("[NAVBAR] Fetching for language:", language);
      const data = await getNavbarData(language);
      setNavbar(data || null);
      console.log("NAVBAR DATA:", data || null);
    };

    fetchCategories();
    fetchNavbar();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [language]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setIsProjectsOpen(false);
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    setIsProjectsOpen(false);
  };

  const toggleProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProjectsOpen(!isProjectsOpen);
  };

  const productItems = [
    "Passenger Elevator",
    "Dumbwaiter",
    "Freight Elevator",
    "Home Lift",
    "Hospital Elevator",
    "Lift",
    "Escalator",
    "Panoramic Elevator",
    "Car Elevator",
    "Moving Walk",
    "Schneider",
  ];

  const navLinks = navbar?.navlink || [];

  const slugify = (text: string) => {
    return text.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-md dark:bg-slate-900/90"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2">
            {navbar?.logo?.url ? (
              <img
                src={STRAPI_URL + navbar.logo.url}
                alt="Logo"
                className="h-10 w-auto"
                style={{ maxHeight: 40 }}
              />
            ) : (
              <span className="text-2xl font-bold text-primary">
                Elevate<span className="text-accent">Engineering</span>
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navbar &&
              (navbar.navlink || navbar.navdropdown) &&
              [
                ...(navbar.navlink || []).map((item: any) => ({
                  __component: "nav-links.nav-link",
                  ...item,
                })),
                ...(navbar.navdropdown || []).map((item: any) => ({
                  __component: "nav-links.nav-dropdown",
                  ...item,
                })),
              ].map((item: any, idx: number) => {
                if (item.__component === "nav-links.nav-link") {
                  return (
                    <Link
                      key={idx}
                      href={item.url}
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        pathname === item.url
                          ? "text-primary"
                          : "text-slate-700 dark:text-slate-200"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                }
                if (item.__component === "nav-links.nav-dropdown") {
                  return (
                    <DropdownMenu key={idx}>
                      <DropdownMenuTrigger className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary text-slate-700 dark:text-slate-200">
                        <span>{item.label}</span>
                        <ChevronDown size={16} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        {item.dropdownItems && item.dropdownItems.length > 0 ? (
                          item.dropdownItems.map((sub: any, subIdx: number) => (
                            <DropdownMenuItem key={subIdx} asChild>
                              <Link href={sub.url} className="w-full">
                                {sub.label}
                              </Link>
                            </DropdownMenuItem>
                          ))
                        ) : (
                          <DropdownMenuItem disabled>
                            <span className="text-slate-400">No items</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }
                return null;
              })}

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* CTA Button */}
            {navbar?.ctaButton?.length > 0 && (
              <Button asChild>
                <Link href={navbar.ctaButton[0].link}>
                  {navbar.ctaButton[0].teks}
                </Link>
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Language Switcher Mobile */}
            <LanguageSwitcher />
            <button
              className="text-slate-700 dark:text-slate-200 p-2"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              type="button"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Backdrop - FIXED: Removed onClick handler */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-40"
          style={{ top: "80px" }} // Start below header
        />
      )}

      {/* Mobile Navigation - FIXED: Improved structure and event handling */}
      <div
        className={cn(
          "md:hidden fixed top-20 left-0 right-0 bg-white dark:bg-slate-900 shadow-lg transition-all duration-300 ease-in-out border-t z-50",
          isOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-2"
        )}
      >
        <div className="container mx-auto px-4 py-6 max-h-[calc(100vh-80px)] overflow-y-auto">
          <nav className="flex flex-col space-y-4">
            {/* Dynamic Mobile Navigation Links */}
            {navbar &&
              (navbar.navlink || navbar.navdropdown) &&
              [
                ...(navbar.navlink || []).map((item: any) => ({
                  __component: "nav-links.nav-link",
                  ...item,
                })),
                ...(navbar.navdropdown || []).map((item: any) => ({
                  __component: "nav-links.nav-dropdown",
                  ...item,
                })),
              ].map((item: any, idx: number) => {
                if (item.__component === "nav-links.nav-link") {
                  return (
                    <Link
                      key={idx}
                      href={item.url}
                      className={cn(
                        "text-base font-medium transition-colors hover:text-primary py-2 block",
                        pathname === item.url
                          ? "text-primary"
                          : "text-slate-700 dark:text-slate-200"
                      )}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  );
                }
                if (item.__component === "nav-links.nav-dropdown") {
                  const isOpen = openDropdown === item.label;
                  return (
                    <div className="space-y-2" key={idx}>
                      <button
                        onClick={() =>
                          setOpenDropdown(isOpen ? null : item.label)
                        }
                        className="flex items-center justify-between w-full text-base font-medium text-slate-700 dark:text-slate-200 py-2 hover:text-primary transition-colors"
                        aria-expanded={isOpen}
                        type="button"
                      >
                        <span>{item.label}</span>
                        {isOpen ? (
                          <ChevronDown size={20} />
                        ) : (
                          <ChevronRight size={20} />
                        )}
                      </button>
                      <div
                        className={cn(
                          "overflow-hidden transition-all duration-300 ease-in-out",
                          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        )}
                      >
                        <div className="pl-4 space-y-1 pb-2">
                          {item.dropdownItems &&
                          item.dropdownItems.length > 0 ? (
                            item.dropdownItems.map(
                              (sub: any, subIdx: number) => (
                                <Link
                                  key={subIdx}
                                  href={sub.url}
                                  className="block text-sm text-slate-600 dark:text-slate-300 hover:text-primary transition-colors py-2 border-b border-slate-100 dark:border-slate-800 last:border-b-0"
                                  onClick={closeMenu}
                                >
                                  {sub.label}
                                </Link>
                              )
                            )
                          ) : (
                            <span className="text-slate-400">No items</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            {/* Mobile CTA Button */}
            {navbar?.ctaButton?.length > 0 && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button asChild className="w-full">
                  <Link href={navbar.ctaButton[0].link} onClick={closeMenu}>
                    {navbar.ctaButton[0].teks}
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
