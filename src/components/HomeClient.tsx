"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Countdown from "@/components/Countdown";
import PhotoCarousel, { Foto } from "@/components/PhotoCarousel";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import { Config } from "@/hooks/useConfig";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: any[];
  }
}

interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  link: string;
}

interface ScheduleItem {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  description: string;
}

interface HomeClientProps {
  config: Config;
  sponsors: Sponsor[];
  schedule: ScheduleItem[];
  fotos: Foto[];
}

export default function HomeClient({ config, sponsors, schedule, fotos }: HomeClientProps) {
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  const trackClick = useCallback((action: string, label: string) => {
    if (typeof window !== "undefined") {
      if (window.gtag) {
        window.gtag("event", action, {
          event_category: "engagement",
          event_label: label,
        });
      }
      if (window.fbq && (action === "click_buy_ticket" || action === "click_register")) {
        window.fbq("track", "InitiateCheckout");
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: action,
        event_category: "engagement",
        event_label: label,
      });
    }
  }, []);

  const glassStyle =
    "bg-white/10 backdrop-blur-[12px] border border-white/20 shadow-[0_20px_50px_0_rgba(0,0,0,0.3),inset_1px_1px_2px_0_rgba(255,255,255,0.1)]";

  const heroImage = config.hero_title_image;
  const aboutTitle = config.section_about_title || "Sobre o Evento";
  const scheduleTitle = config.section_schedule_title || "Programação";
  const locationTitle = config.section_location_title || "Local do Evento";
  const sponsorsTitle = config.section_sponsors_title || "Patrocinadores";
  const footerText = config.footer_text || "Drumond Sports";
  const footerSubtext = config.footer_subtext || "Brasília . 2026";
  const mapsEmbedLink = config.maps_embed_link || "";
  const registerLink = config.register_link || "#";
  const aboutText = config.about_text || "";
  const shouldTruncate = aboutText.length > 200;
  const displayedText = shouldTruncate && !isAboutExpanded ? aboutText.slice(0, 200) + "..." : aboutText;

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 70% 50% at 10% 10%, rgba(248,141,42,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 30%, rgba(255,255,255,0.03) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 20% 80%, rgba(248,141,42,0.05) 0%, transparent 60%), radial-gradient(ellipse 65% 55% at 85% 85%, rgba(255,255,255,0.02) 0%, transparent 60%), #101820`,
          }}
        />
      </div>

      <div className="w-full min-h-screen pb-16 md:pb-24 overflow-x-hidden relative z-10 bg-transparent flex flex-col items-center">
        <div className="pt-28 md:pt-44 flex flex-col items-center w-full">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center mb-6 md:mb-10 text-center px-4"
          >
            {heroImage ? (
              <>
                <div className="relative w-[400px] h-[120px] mx-auto md:hidden">
                  <Image
                    src={config.hero_title_image_mobile || heroImage}
                    alt="Nacional de Sinuca"
                    fill
                    className="object-contain"
                    sizes="400px"
                    priority
                  />
                </div>
                <div className="relative hidden md:block w-[600px] h-[130px] mx-auto">
                  <Image
                    src={heroImage}
                    alt="Nacional de Sinuca"
                    fill
                    className="object-contain"
                    sizes="600px"
                    priority
                  />
                </div>
              </>
            ) : null}
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${glassStyle} rounded-[40px] px-4 md:px-10 py-4 md:py-6 flex items-center justify-center z-10 relative mb-0 md:mb-2 mx-4`}
          >
            <Countdown eventDate={config.event_date} />
          </motion.div>

          {/* Carrossel */}
          <section
            id="sobre"
            className="w-full mb-8 md:mb-12 scroll-mt-28 md:scroll-mt-32"
          >
            <PhotoCarousel fotos={fotos} />
            <div className="w-full max-w-3xl mx-auto px-5 mt-2 md:mt-4 flex flex-col sm:flex-row justify-center">
              <Link
                href={config.ingressos_em_breve === "true" ? "/ingressos" : (config.ticket_link || "/ingressos")}
                target={config.ingressos_em_breve !== "true" && config.ticket_link?.startsWith("http") ? "_blank" : undefined}
                rel={config.ingressos_em_breve !== "true" && config.ticket_link?.startsWith("http") ? "noopener noreferrer" : undefined}
                onClick={() => {
                  if (config.ingressos_em_breve !== "true") {
                     trackClick("click_buy_ticket", "carousel_tickets");
                  }
                }}
                className={`bg-transparent border-2 border-drumond-orange text-drumond-orange rounded-full py-4 md:py-5 px-8 md:px-10 font-display text-xl md:text-2xl uppercase italic text-center font-bold w-full sm:w-auto transition-all ${
                  config.ingressos_em_breve === "true" 
                  ? "opacity-70 hover:bg-drumond-orange/5" 
                  : "hover:bg-drumond-orange/10 hover:shadow-[0_0_15px_rgba(248,141,42,0.2)]"
                }`}
              >
                {config.ingressos_em_breve === "true" ? "Ingressos (Em breve)" : "Ver Ingressos"}
              </Link>
            </div>
          </section>

          {/* Sobre o Evento */}
          <section className="w-full max-w-4xl px-5 md:px-6 mb-8 md:mb-12 relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="relative bg-[#101820]/40 backdrop-blur-sm border border-white/5 border-l-4 border-l-drumond-orange rounded-r-2xl md:rounded-r-3xl p-6 md:p-10 shadow-lg"
            >
              <div className="absolute -top-5 md:-top-6 -left-2 text-6xl md:text-8xl text-drumond-orange/20 font-serif select-none">
                “
              </div>
              
              <h2 className="font-display text-2xl md:text-3xl text-white mb-4 md:mb-6 flex items-center gap-3">
                <span className="w-8 md:w-10 h-[2px] bg-drumond-orange/50"></span>
                {aboutTitle}
              </h2>
              
              <div className="relative">
                <motion.div 
                  initial={false}
                  animate={{ height: isAboutExpanded ? "auto" : "auto" }}
                  className="overflow-hidden"
                >
                  <p className="text-gray-200 font-body leading-relaxed text-base md:text-lg italic pl-3 md:pl-5 border-l-2 border-drumond-orange/30">
                    {displayedText}
                  </p>
                </motion.div>
                
                {shouldTruncate && !isAboutExpanded && (
                  <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#101820]/80 to-transparent pointer-events-none" />
                )}
              </div>

              {shouldTruncate && (
                <button
                  onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                  className="mt-4 ml-3 md:ml-5 text-drumond-orange text-sm md:text-base font-bold uppercase tracking-wider hover:text-white transition-colors flex items-center gap-1"
                >
                  {isAboutExpanded ? "Recolher" : "Ver mais"}
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 ${isAboutExpanded ? "rotate-180" : ""}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}

              <div className="absolute -bottom-4 right-4 text-6xl md:text-8xl text-drumond-orange/20 font-serif select-none rotate-180">
                “
              </div>
            </motion.div>
          </section>

          {/* Programação */}
          <section className="w-full max-w-5xl px-5 md:px-6 mb-8 md:mb-12">
            <div className="text-center mb-6 md:mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-white uppercase italic tracking-wide">
                {scheduleTitle}
              </h2>
              <div className="w-12 md:w-16 h-[2px] bg-drumond-orange mx-auto mt-2 opacity-50" />
            </div>
            {schedule.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {schedule.map((day) => (
                  <div
                    key={day.id}
                    className="group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-drumond-orange/40 transition-all duration-300 flex flex-col"
                  >
                    <div className="absolute left-0 top-4 bottom-4 w-[3px] bg-drumond-orange/60 rounded-r-full" />
                    <div className="p-5 md:p-6 flex flex-col flex-1">
                      <p className="text-drumond-orange/80 text-xs font-bold uppercase tracking-widest mb-3">
                        {new Date(day.date + 'T00:00:00').toLocaleDateString("pt-BR", {
                          weekday: "short", day: "2-digit", month: "short",
                        })}
                      </p>
                      <h3 className="font-display text-xl md:text-2xl text-white mb-3 leading-tight">
                        {day.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-4 text-gray-400 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-drumond-orange/80" />
                        {day.start_time.slice(0, 5)} – {day.end_time.slice(0, 5)}
                      </div>
                      <p className="text-gray-300/80 text-sm leading-relaxed flex-1">
                        {day.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </section>

          {/* Local do Evento */}
          <section className="w-full max-w-5xl px-5 md:px-6 mb-6 md:mb-10">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-stretch">
              <div className="space-y-3 md:space-y-4">
                <div className="inline-flex items-center gap-2 bg-drumond-orange/20 text-drumond-orange px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider">
                  <svg
                    className="w-3 h-3 md:w-4 md:h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a8 8 0 0 0-8 8c0 6 8 10 8 10s8-4 8-10a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                  </svg>
                  {locationTitle.toUpperCase()}
                </div>
                <h2 className="font-display text-2xl md:text-4xl text-white uppercase leading-tight">
                  {config.event_location_name || "A definir"}
                </h2>
                <div className="flex items-start gap-2 text-gray-300">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 mt-1 text-drumond-orange"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                    />
                  </svg>
                  <p className="text-gray-200 text-sm md:text-base">
                    {config.event_address ||
                      "Em breve o endereço será divulgado"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3 pt-2">
                  {config.maps_link && (
                    <a
                      href={config.maps_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 border border-drumond-orange/50 hover:bg-drumond-orange/20 transition px-3 md:px-4 py-1.5 md:py-2 rounded-full text-white text-xs md:text-sm font-medium"
                    >
                      <svg
                        className="w-3 h-3 md:w-4 md:h-4 text-[#4285F4]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      Google Maps
                    </a>
                  )}
                  {config.waze_link && (
                    <a
                      href={config.waze_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 border border-drumond-orange/50 hover:bg-drumond-orange/20 transition px-3 md:px-4 py-1.5 md:py-2 rounded-full text-white text-xs md:text-sm font-medium"
                    >
                      <svg
                        className="w-3 h-3 md:w-4 md:h-4 text-[#33CCFF]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                      </svg>
                      Waze
                    </a>
                  )}
                </div>
              </div>

              {mapsEmbedLink ? (
                <div className="rounded-xl md:rounded-2xl overflow-hidden border border-white/10 h-full min-h-[200px]">
                  <iframe
                    src={mapsEmbedLink}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "250px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Local do evento"
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="bg-white/5 rounded-xl md:rounded-2xl overflow-hidden border border-white/10 p-4 flex items-center justify-center min-h-[160px] md:min-h-[250px] relative group h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-drumond-orange/10 to-transparent"></div>
                  <div className="relative z-10 text-center">
                    <svg
                      className="w-12 h-12 md:w-16 md:h-16 text-drumond-orange/40 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                    <p className="text-gray-400 text-xs md:text-sm">
                      Mapa interativo em breve
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Botões de ação */}
          <div className="w-full max-w-3xl px-5 md:px-6 mb-6 md:mb-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={registerLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick("click_register", "hero_register")}
              className="bg-drumond-orange text-[#101820] rounded-full py-4 md:py-5 px-8 md:px-10 font-display text-xl md:text-2xl uppercase italic shadow-[0_0_20px_rgba(248,141,42,0.4)] hover:shadow-[0_0_35px_rgba(248,141,42,0.6)] hover:scale-105 transition-all text-center font-bold"
            >
              Fazer Inscrição
            </a>
            <Link
              href="/patrocinador"
              onClick={() => trackClick("click_partner", "hero_partner")}
              className="bg-transparent border border-white/30 text-white rounded-full py-4 md:py-5 px-8 md:px-10 font-display text-xl md:text-2xl uppercase italic hover:bg-white/10 transition-colors text-center"
            >
              Seja um Parceiro
            </Link>
          </div>

          {/* Patrocinadores */}
          <section className="w-full max-w-6xl px-5 md:px-6 mb-14 md:mb-28">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-6 md:mb-8"
            >
              <h2 className="font-display text-xl md:text-2xl text-white uppercase italic tracking-wide">
                {sponsorsTitle}
              </h2>
              <div className="w-12 md:w-16 h-[2px] bg-drumond-orange mx-auto mt-2 opacity-50" />
            </motion.div>
            {sponsors.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-6 md:gap-8 items-center">
                {sponsors.map((sponsor) => (
                  <a
                    key={sponsor.id}
                    href={sponsor.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block transition hover:scale-105"
                  >
                    <div className="relative w-24 h-16 md:w-40 md:h-24 bg-white/5 rounded-lg p-2">
                      <Image
                        src={sponsor.logo_url}
                        alt={sponsor.name}
                        fill
                        className="object-contain p-2"
                        sizes="(max-width: 768px) 96px, 160px"
                      />
                    </div>
                  </a>
                ))}
              </div>
            ) : null}
          </section>

          {/* Rodapé */}
          <footer className="w-full text-center pb-8 md:pb-12 pt-4 md:pt-6 mt-4 md:mt-6 relative z-10 flex flex-col items-center">
            <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-drumond-orange/50 to-transparent mb-4 md:mb-6" />
            <div className="font-display text-xl md:text-2xl text-white/70 italic uppercase tracking-widest">
              {footerText}
            </div>
            <div className="font-body text-[0.5rem] md:text-[0.6rem] tracking-[0.3em] text-drumond-orange uppercase mt-2 font-bold opacity-80">
              {footerSubtext}
            </div>
            <div className="flex gap-4 md:gap-6 mt-4 md:mt-6">
              {config.instagram_url && (
                <a
                  href={config.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-drumond-orange transition text-xl md:text-2xl"
                >
                  <FaInstagram />
                </a>
              )}
              {config.facebook_url && (
                <a
                  href={config.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-drumond-orange transition text-xl md:text-2xl"
                >
                  <FaFacebook />
                </a>
              )}
              {config.tiktok_url && (
                <a
                  href={config.tiktok_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-drumond-orange transition text-xl md:text-2xl"
                >
                  <FaTiktok />
                </a>
              )}
            </div>
          </footer>
        </div>
      </div>
      <WhatsAppFloat />
    </>
  );
}