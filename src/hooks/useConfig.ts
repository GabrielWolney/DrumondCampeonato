/* eslint-disable react-hooks/set-state-in-effect */
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
  // Banner de inscrição
  register_banner_enabled: string; // "true" | "false"
  register_banner_text: string;
  register_banner_subtext: string;
}

let cachedConfig: Config | null = null;
let fetchPromise: Promise<Config> | null = null;

function parseConfig(data: { key: string; value: string }[]): Config {
  const obj: Record<string, string> = {};
  data.forEach((item) => {
    obj[item.key] = item.value;
  });
  return {
    event_date: obj.event_date || "",
    about_text: obj.about_text || "",
    ticket_link: obj.ticket_link || "",
    register_link: obj.register_link || "",
    whatsapp_number: obj.whatsapp_number || "",
    whatsapp_message: obj.whatsapp_message || "",
    meta_pixel_id: obj.meta_pixel_id || "",
    google_analytics_id: obj.google_analytics_id || "",
    google_ads_id: obj.google_ads_id || "",
    partner_link: obj.partner_link || "",
    instagram_url: obj.instagram_url || "",
    facebook_url: obj.facebook_url || "",
    tiktok_url: obj.tiktok_url || "",
    event_location_name: obj.event_location_name || "",
    event_address: obj.event_address || "",
    maps_link: obj.maps_link || "",
    waze_link: obj.waze_link || "",
    maps_embed_link: obj.maps_embed_link || "",
    hero_title_image: obj.hero_title_image || "",
    hero_title_image_mobile: obj.hero_title_image_mobile || "",
    navbar_logo: obj.navbar_logo || "",
    navbar_logo_scrolled: obj.navbar_logo_scrolled || "",
    section_about_title: obj.section_about_title || "Sobre o Evento",
    section_schedule_title: obj.section_schedule_title || "Programação",
    section_location_title: obj.section_location_title || "Local do Evento",
    section_sponsors_title: obj.section_sponsors_title || "Patrocinadores",
    footer_text: obj.footer_text || "Drumond Sports",
    footer_subtext: obj.footer_subtext || "Brasília . 2026",
    ingressos_title: obj.ingressos_title || "Escolha seu Ingresso",
    ingressos_description:
      obj.ingressos_description ||
      "Selecione a melhor opção para você e garanta sua vaga no maior evento de sinuca do Brasil.",
    patrocinador_title: obj.patrocinador_title || "Seja um Patrocinador",
    patrocinador_intro:
      obj.patrocinador_intro ||
      "Posicione sua marca ao lado do maior evento de sinuca do Brasil e conecte-se a um público apaixonado por esporte e entretenimento.",
    register_banner_enabled: obj.register_banner_enabled || "true",
    register_banner_text: obj.register_banner_text || "Quer jogar o campeonato?",
    register_banner_subtext:
      obj.register_banner_subtext || "Garanta sua vaga como atleta e participe da disputa.",
  };
}

export function useConfig() {
  const [config, setConfig] = useState<Config>(
    cachedConfig || {
      event_date: "",
      about_text: "",
      ticket_link: "",
      register_link: "",
      whatsapp_number: "",
      whatsapp_message: "",
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
    }
  );
  const [loading, setLoading] = useState(!cachedConfig);
  const [error, setError] = useState<string | null>(null);
  const cancelledRef = useRef(false);

  const fetchConfig = useCallback(async (force = false) => {
    if (!force && cachedConfig) return;

    if (!force && fetchPromise) {
      await fetchPromise;
      return;
    }

    const load = async (): Promise<Config> => {
      const { data, error: err } = await supabase.from("site_config").select("key, value");
      if (err) throw new Error(err.message);
      return parseConfig(data || []);
    };

    fetchPromise = load();

    try {
      const parsed = await fetchPromise;
      cachedConfig = parsed;
      if (!cancelledRef.current) {
        setConfig(parsed);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao carregar configurações";
      if (!cancelledRef.current) {
        setError(message);
      }
    } finally {
      fetchPromise = null;
      if (!cancelledRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    cancelledRef.current = false;
    if (!cachedConfig) {
      fetchConfig();
    }
    return () => {
      cancelledRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateConfig = useCallback((key: keyof Config, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  const saveConfig = useCallback(async () => {
    const updates = Object.entries(config).map(([key, value]) =>
      supabase.from("site_config").upsert({ key, value }, { onConflict: "key" })
    );
    await Promise.all(updates);
    cachedConfig = null;
    fetchPromise = null;
  }, [config]);

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchConfig(true);
  }, [fetchConfig]);

  return { config, loading, error, updateConfig, saveConfig, fetchConfig: retry, retry };
}