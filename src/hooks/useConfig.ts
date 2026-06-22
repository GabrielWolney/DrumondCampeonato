"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";

export interface Config {
  event_date: string;
  about_text: string;
  ticket_link: string;
  register_link: string;
  whatsapp_number: string;
  whatsapp_message: string;
  whatsapp_number_patrocinador: string;
  whatsapp_message_patrocinador: string;
  meta_pixel_id: string;
  google_analytics_id: string;
  google_ads_id: string;
  partner_link: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  event_location_name: string;
  event_address: string;
  maps_link: string;
  waze_link: string;
  maps_embed_link: string;
  hero_title_image: string;
  hero_title_image_mobile: string;
  navbar_logo: string;
  navbar_logo_scrolled: string;
  section_about_title: string;
  section_schedule_title: string;
  section_location_title: string;
  section_sponsors_title: string;
  footer_text: string;
  footer_subtext: string;
  ingressos_title: string;
  ingressos_description: string;
  patrocinador_title: string;
  patrocinador_intro: string;
  register_banner_enabled: string;
  register_banner_text: string;
  register_banner_subtext: string;
  ingressos_em_breve: string;
}

const defaultConfig: Config = {
  event_date: "",
  about_text: "",
  ticket_link: "",
  register_link: "",
  whatsapp_number: "",
  whatsapp_message: "",
  whatsapp_number_patrocinador: "",
  whatsapp_message_patrocinador: "",
  meta_pixel_id: "",
  google_analytics_id: "",
  google_ads_id: "",
  partner_link: "",
  instagram_url: "",
  facebook_url: "",
  tiktok_url: "",
  event_location_name: "",
  event_address: "",
  maps_link: "",
  waze_link: "",
  maps_embed_link: "",
  hero_title_image: "",
  hero_title_image_mobile: "",
  navbar_logo: "",
  navbar_logo_scrolled: "",
  section_about_title: "Sobre o Evento",
  section_schedule_title: "Programação",
  section_location_title: "Local do Evento",
  section_sponsors_title: "Patrocinadores",
  footer_text: "Drumond Sports",
  footer_subtext: "Brasília . 2026",
  ingressos_title: "Escolha seu Ingresso",
  ingressos_description:
    "Selecione a melhor opção para você e garanta sua vaga no maior evento de sinuca do Brasil.",
  patrocinador_title: "Seja um Patrocinador",
  patrocinador_intro:
    "Posicione sua marca ao lado do maior evento de sinuca do Brasil e conecte-se a um público apaixonado por esporte e entretenimento.",
  register_banner_enabled: "true",
  register_banner_text: "Quer jogar o campeonato?",
  register_banner_subtext: "Garanta sua vaga como atleta e participe da disputa.",
  ingressos_em_breve: "false",
};

function parseConfig(data: { key: string; value: string }[]): Config {
  const obj: Record<string, string> = {};
  data.forEach((item) => {
    obj[item.key] = item.value;
  });
  return {
    ...defaultConfig,
    ...Object.fromEntries(Object.entries(obj)),
  };
}

let cache: { data: Config; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export function useConfig() {
  const [config, setConfig] = useState<Config>(cache?.data || defaultConfig);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(null);
  const cancelledRef = useRef(false);
  const fetchStartedRef = useRef(false);

  const fetchConfig = useCallback(async (force = false) => {
    if (!force && fetchStartedRef.current) return;
    fetchStartedRef.current = true;

    // Retorna cache se válido
    if (!force && cache && Date.now() - cache.timestamp < CACHE_TTL) {
      if (!cancelledRef.current) {
        setConfig(cache.data);
        setLoading(false);
        setError(null);
      }
      return;
    }

    setLoading(true);

    const safeTimeout = setTimeout(() => {
      if (!cancelledRef.current) {
        setLoading(false);
        setError("Tempo limite ao carregar configurações. Verifique sua conexão.");
      }
    }, 10000);

    try {
      const { data, error: err } = await supabase.from("site_config").select("key, value");
      clearTimeout(safeTimeout);

      if (err) throw new Error(err.message);

      const parsed = parseConfig(data || []);
      cache = { data: parsed, timestamp: Date.now() };

      if (!cancelledRef.current) {
        setConfig(parsed);
        setError(null);
        setLoading(false);
      }
    } catch (err: unknown) {
      clearTimeout(safeTimeout);
      const message = err instanceof Error ? err.message : "Erro ao carregar configurações";
      if (!cancelledRef.current) {
        setError(message);
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    cancelledRef.current = false;
    if (!fetchStartedRef.current) {
      fetchConfig();
    }
    return () => {
      cancelledRef.current = true;
    };
  }, [fetchConfig]);

  const updateConfig = useCallback((key: keyof Config, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  const saveConfig = useCallback(async () => {
    const updates = Object.entries(config).map(([key, value]) =>
      supabase.from("site_config").upsert({ key, value }, { onConflict: "key" })
    );
    await Promise.all(updates);
    // Invalida cache
    cache = null;
    fetchStartedRef.current = false;
    await fetchConfig(true);
  }, [config, fetchConfig]);

  const retry = useCallback(() => {
    fetchStartedRef.current = false;
    cache = null;
    fetchConfig(true);
  }, [fetchConfig]);

  return { config, loading, error, updateConfig, saveConfig, retry };
}