"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";
import { useConfig } from "@/hooks/useConfig";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface TicketTier {
  id: string;
  name: string;
  price: number;
  total_quantity: number;
  sold_quantity: number;
  is_active: boolean;
  unlock_date: string | null;
  end_date: string | null;
  purchase_link: string | null;
  ordem: number;
  highlight?: boolean;
}

export default function IngressosPage() {
  const [tiers, setTiers] = useState<TicketTier[]>([]);
  const [loading, setLoading] = useState(true);
  const { config, loading: configLoading } = useConfig();

  useEffect(() => {
    async function loadData() {
      const { data: tiersData } = await supabase
        .from("ticket_tiers")
        .select("*")
        .eq("is_active", true)
        .order("ordem", { ascending: true });

      const hasHighlight = (tiersData || []).some((t) => t.highlight);
      const enhanced = (tiersData || []).map((t, i) => ({
        ...t,
        highlight: hasHighlight ? t.highlight : i === 0,
      }));
      setTiers(enhanced);
      setLoading(false);
    }
    loadData();
  }, []);

  const trackClick = useCallback((action: string, label: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", action, {
        event_category: "engagement",
        event_label: label,
      });
    }
  }, []);

  const glassStyle =
    "bg-white/10 backdrop-blur-[12px] border border-white/20 shadow-[0_20px_50px_0_rgba(0,0,0,0.3),inset_1px_1px_2px_0_rgba(255,255,255,0.1)]";

  const now = new Date();

  const activeTiers = tiers.filter((t) => {
    const unlocked = !t.unlock_date || new Date(t.unlock_date) <= now;
    const notExpired = !t.end_date || new Date(t.end_date) >= now;
    return unlocked && notExpired;
  });

  const futureTiers = tiers.filter((t) => {
    if (!t.unlock_date) return false;
    return new Date(t.unlock_date) > now;
  });

  const title = (!configLoading && config.ingressos_title) || "Escolha seu Ingresso";
  const description =
    (!configLoading && config.ingressos_description) ||
    "Selecione a melhor opção para você e garanta sua vaga no maior evento de sinuca do Brasil.";
  const registerLink = config.register_link || "#";

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

      <main className="relative z-10 min-h-screen pt-28 md:pt-44 pb-16 md:pb-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Cabeçalho */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 md:mb-12"
          >
            {loading || configLoading ? (
              <>
                <Skeleton className="h-8 md:h-12 w-64 md:w-96 mx-auto mb-3" />
                <Skeleton className="h-4 md:h-5 w-80 md:w-[600px] mx-auto" />
              </>
            ) : (
              <>
                <h1 className="font-display text-3xl md:text-5xl text-white uppercase italic mb-3 md:mb-4">
                  {title}
                </h1>
                <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
                  {description}
                </p>
              </>
            )}
          </motion.div>

          {/* Banner de inscrição controlado via admin */}
          {!loading && config.register_banner_enabled === "true" && registerLink && registerLink !== "#" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 md:mb-10"
            >
              <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-r from-drumond-orange/20 to-drumond-orange/5 border border-drumond-orange/30 p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-8 h-8 md:w-10 md:h-10 text-drumond-orange shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 2l3 7h6l-5 4 2 7-6-4-6 4 2-7-5-4h6z"
                    />
                    <circle cx="12" cy="12" r="1" fill="currentColor" />
                  </svg>
                  <div>
                    <p className="text-white font-display text-lg md:text-xl uppercase italic">
                      {config.register_banner_text}
                    </p>
                    <p className="text-gray-300 text-sm mt-1">
                      {config.register_banner_subtext}
                    </p>
                  </div>
                </div>
                <a
                  href={registerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick("click_register", "ingressos_banner")}
                  className="shrink-0 bg-drumond-orange text-[#101820] rounded-full py-3 px-8 font-display text-lg uppercase italic font-bold hover:scale-105 transition-transform shadow-lg"
                >
                  Fazer Inscrição
                </a>
              </div>
            </motion.div>
          )}

          {/* Lotes ativos */}
          {loading ? (
            <div className="mb-12 md:mb-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`${glassStyle} rounded-2xl md:rounded-3xl p-6 md:p-8 text-center`}>
                    <Skeleton className="h-4 w-24 mx-auto mb-2" />
                    <Skeleton className="h-8 w-48 mx-auto mb-4" />
                    <Skeleton className="h-10 w-32 mx-auto mb-4" />
                    <Skeleton className="h-12 w-48 mx-auto rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          ) : activeTiers.length > 0 ? (
            <div className="mb-12 md:mb-16">
              <h2 className="font-display text-xl md:text-2xl text-white/80 text-center mb-6 md:mb-8">
                Ingressos Disponíveis
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
                {activeTiers.map((tier) => {
                  const expiresIn = tier.end_date
                    ? Math.ceil((new Date(tier.end_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                    : null;

                  return (
                    <motion.div
                      key={tier.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className={`${glassStyle} rounded-2xl md:rounded-3xl p-6 md:p-8 text-center border-2 ${
                          tier.highlight
                            ? "border-drumond-orange shadow-[0_0_30px_rgba(248,141,42,0.3)]"
                            : "border-white/20"
                        } relative overflow-hidden h-full flex flex-col`}
                      >
                        {tier.highlight && (
                          <div className="absolute top-0 left-0 bg-drumond-orange text-black px-4 py-1 rounded-br-xl text-xs font-bold uppercase tracking-wider">
                            Mais vendido
                          </div>
                        )}

                        <h2 className="font-display text-2xl md:text-3xl text-white mb-2 mt-2">
                          {tier.name}
                        </h2>
                        <div className="text-3xl md:text-4xl font-bold text-drumond-orange my-3 md:my-4">
                          {formatCurrency(tier.price)}
                        </div>

                        {expiresIn !== null && expiresIn > 0 && (
                          <p className="text-xs text-gray-400 mb-2">
                            {expiresIn} {expiresIn === 1 ? "dia" : "dias"} restantes
                          </p>
                        )}
                        {tier.end_date && (
                          <p className="text-xs text-gray-500 mb-4">
                            Válido até {new Date(tier.end_date).toLocaleDateString("pt-BR")}
                          </p>
                        )}

                        {tier.total_quantity > 0 && (
                          <div className="mb-4">
                            <div className="w-full bg-white/10 rounded-full h-1.5 mb-1">
                              <div
                                className="bg-drumond-orange h-1.5 rounded-full"
                                style={{
                                  width: `${Math.min(100, (tier.sold_quantity / tier.total_quantity) * 100)}%`,
                                }}
                              />
                            </div>
                            <p className="text-xs text-gray-400">
                              {tier.sold_quantity} de {tier.total_quantity} vendidos
                            </p>
                          </div>
                        )}

                        <div className="mt-auto">
                          {tier.purchase_link ? (
                            <a
                              href={tier.purchase_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => {
                                trackClick("click_buy_ticket", tier.name);
                              }}
                              className="inline-block bg-drumond-orange text-black px-8 md:px-12 py-3 md:py-4 rounded-full font-display text-lg md:text-xl uppercase italic font-bold hover:scale-105 transition-transform"
                            >
                              Comprar Agora
                            </a>
                          ) : (
                            <button
                              disabled
                              className="bg-white/10 text-white/50 px-8 md:px-12 py-3 md:py-4 rounded-full font-display text-lg md:text-xl uppercase italic cursor-not-allowed"
                            >
                              Link indisponível
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 mb-12 md:mb-16">
              Nenhum lote disponível no momento.
            </div>
          )}

          {/* Próximos lotes */}
          {futureTiers.length > 0 && (
            <div>
              <h2 className="font-display text-xl md:text-2xl text-white/80 text-center mb-6 md:mb-8">
                Próximos Lotes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
                {futureTiers.map((tier) => {
                  const unlockDate = tier.unlock_date
                    ? new Date(tier.unlock_date)
                    : null;
                  return (
                    <div
                      key={tier.id}
                      className={`${glassStyle} rounded-2xl md:rounded-3xl p-6 md:p-8 text-center opacity-80`}
                    >
                      <h3 className="font-display text-lg md:text-xl text-white mb-2">
                        {tier.name}
                      </h3>
                      <div className="text-xl md:text-2xl font-bold text-drumond-orange my-2 md:my-3">
                        {formatCurrency(tier.price)}
                      </div>
                      <p className="text-xs md:text-sm text-gray-400 mb-3 md:mb-4">
                        {unlockDate
                          ? `Disponível a partir de ${unlockDate.toLocaleDateString("pt-BR")}`
                          : "Em breve"}
                      </p>
                      <button
                        disabled
                        className="bg-white/10 text-white/50 py-1.5 md:py-2 px-4 md:px-6 rounded-full text-sm md:text-base cursor-not-allowed"
                      >
                        Em breve
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!loading && activeTiers.length === 0 && futureTiers.length === 0 && (
            <div className="text-center text-gray-400 py-12 md:py-20">
              Nenhum lote disponível no momento.
            </div>
          )}
        </div>
      </main>
    </>
  );
}