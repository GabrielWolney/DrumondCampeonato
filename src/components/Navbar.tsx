"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useScroll, useMotionValueEvent, AnimatePresence, motion } from "framer-motion";
import { useLightbox } from "@/context/LightboxContext";
import { useConfig } from "@/hooks/useConfig";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { isOpen: lightboxOpen } = useLightbox();
  const { config, loading: configLoading } = useConfig();

  const scrollContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    scrollContainerRef.current = document.getElementById("main-scroll-container");
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  const { scrollY } = useScroll(
    mounted ? { container: scrollContainerRef } : undefined
  );

  const handleScroll = useCallback((latest: number) => {
    setIsScrolled(latest > 50);
  }, []);

  useMotionValueEvent(scrollY, "change", handleScroll);

  if (!mounted || lightboxOpen) return null;

  const navLinks = [
    { name: "Início", path: "/" },
    { name: "Ingressos", path: "/ingressos" },
    { name: "Patrocinador", path: "/patrocinador" },
  ];

  const logoSrc = (!configLoading && config.navbar_logo) ? config.navbar_logo : "/logo-barra.png";

  return (
    <>
      <nav
        className={[
          "fixed inset-x-0 z-[99999]",
          "transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          isScrolled
            ? "bg-[#101820]/80 backdrop-blur-xl saturate-[180%] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.8)] rounded-[30px] top-4 mx-auto max-w-[92%]"
            // ↓↓↓ largura reduzida no estado inicial (desktop)
            : "bg-transparent w-full top-0 md:max-w-3xl md:mx-auto",
        ].join(" ")}
        style={{
          padding: isScrolled ? "10px 24px" : "25px 16px",
        }}
      >
        {/* Estado inicial: mobile com logo centralizada + links horizontais */}
        {!isScrolled && (
          <div className="flex flex-col items-center md:hidden">
            <Link href="/" className="mb-3">
              <div className="relative h-10 w-40">
                <Image
                  src={logoSrc}
                  alt="Drumond Sports"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            <ul className="flex gap-5 justify-center">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className={`text-[0.75rem] font-body font-bold uppercase tracking-[0.15em] transition-colors duration-300 whitespace-nowrap ${
                      pathname === link.path ||
                      (link.path !== "/" && pathname?.includes(link.path.replace("#", "")))
                        ? "text-drumond-orange"
                        : "text-white opacity-70 hover:opacity-100 hover:text-drumond-orange"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Estado scrollado (mobile) e desktop (sempre visível) */}
        <div
          className={`w-full flex items-center justify-between ${
            !isScrolled ? "hidden md:flex" : "flex"
          }`}
        >
          <Link href="/" className="shrink-0">
            <div className="relative h-10 w-36 md:h-14 md:w-56">
              <Image
  src={logoSrc}
  alt="Drumond Sports"
  fill
  className={`object-contain ${isScrolled ? "object-left" : ""}`}
  sizes="(max-width: 768px) 144px, 224px"
  priority
/>
            </div>
          </Link>

          <ul className="hidden md:flex gap-5 md:gap-10 m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.name} className="list-none">
                <Link
                  href={link.path}
                  className={`text-[0.8rem] md:text-sm font-body font-bold uppercase tracking-widest no-underline transition-colors duration-300 ${
                    pathname === link.path ||
                    (link.path !== "/" && pathname?.includes(link.path.replace("#", "")))
                      ? "text-drumond-orange"
                      : "text-white opacity-70 hover:opacity-100 hover:text-drumond-orange"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {isScrolled && (
            <button
              className="md:hidden text-white p-2 -mr-2 relative z-50"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileOpen}
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span
                  className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${
                    mobileOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${
                    mobileOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${
                    mobileOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          )}
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && isScrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[99998] bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-20 right-4 w-48 bg-[#101820]/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
            >
              <ul className="flex flex-col p-2">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-colors ${
                        pathname === link.path ||
                        (link.path !== "/" && pathname?.includes(link.path.replace("#", "")))
                          ? "text-drumond-orange bg-white/10"
                          : "text-white hover:bg-white/10"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}