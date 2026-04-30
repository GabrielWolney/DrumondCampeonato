"use client";

import { useState, useEffect, useCallback } from "react";
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
}

export function useConfig() {
  const [config, setConfig] = useState<Config>({
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
    hero_title_image: "/titulo-nacional.png",
    hero_title_image_mobile: "/titulo-nacional.png",
    navbar_logo: "/logo-barra.png",
    section_about_title: "Sobre o Evento",
    section_schedule_title: "Programação",
    section_location_title: "Local do Evento",
    section_sponsors_title: "Patrocinadores",
    footer_text: "Drumond Sports",
    footer_subtext: "Brasília . 2026",
    ingressos_title: "Escolha seu Ingresso",
    ingressos_description: "Selecione a melhor opção para você e garanta sua vaga no maior evento de sinuca do Brasil.",
    patrocinador_title: "Seja um Patrocinador",
    patrocinador_intro: "Posicione sua marca ao lado do maior evento de sinuca do Brasil e conecte-se a um público apaixonado por esporte e entretenimento.",
  });
  const [loading, setLoading] = useState(true);

  const fetchConfig = useCallback(async () => {
    const { data } = await supabase.from("site_config").select("key, value");
    const configObj: Record<string, string> = {};
    data?.forEach((item) => { configObj[item.key] = item.value; });
    setConfig({
      event_date: configObj.event_date || "",
      about_text: configObj.about_text || "",
      ticket_link: configObj.ticket_link || "",
      register_link: configObj.register_link || "",
      whatsapp_number: configObj.whatsapp_number || "",
      whatsapp_message: configObj.whatsapp_message || "",
      meta_pixel_id: configObj.meta_pixel_id || "",
      google_analytics_id: configObj.google_analytics_id || "",
      google_ads_id: configObj.google_ads_id || "",
      partner_link: configObj.partner_link || "",
      instagram_url: configObj.instagram_url || "",
      facebook_url: configObj.facebook_url || "",
      tiktok_url: configObj.tiktok_url || "",
      event_location_name: configObj.event_location_name || "",
      event_address: configObj.event_address || "",
      maps_link: configObj.maps_link || "",
      waze_link: configObj.waze_link || "",
      maps_embed_link: configObj.maps_embed_link || "",
      hero_title_image: configObj.hero_title_image || "/titulo-nacional.png",
      hero_title_image_mobile: configObj.hero_title_image_mobile || "/titulo-nacional.png",
      navbar_logo: configObj.navbar_logo || "/logo-barra.png",
      section_about_title: configObj.section_about_title || "Sobre o Evento",
      section_schedule_title: configObj.section_schedule_title || "Programação",
      section_location_title: configObj.section_location_title || "Local do Evento",
      section_sponsors_title: configObj.section_sponsors_title || "Patrocinadores",
      footer_text: configObj.footer_text || "Drumond Sports",
      footer_subtext: configObj.footer_subtext || "Brasília . 2026",
      ingressos_title: configObj.ingressos_title || "Escolha seu Ingresso",
      ingressos_description: configObj.ingressos_description || "Selecione a melhor opção para você e garanta sua vaga no maior evento de sinuca do Brasil.",
      patrocinador_title: configObj.patrocinador_title || "Seja um Patrocinador",
      patrocinador_intro: configObj.patrocinador_intro || "Posicione sua marca ao lado do maior evento de sinuca do Brasil e conecte-se a um público apaixonado por esporte e entretenimento.",
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const { data } = await supabase.from("site_config").select("key, value");
      if (!isMounted) return;
      const configObj: Record<string, string> = {};
      data?.forEach((item) => { configObj[item.key] = item.value; });
      setConfig({
        event_date: configObj.event_date || "",
        about_text: configObj.about_text || "",
        ticket_link: configObj.ticket_link || "",
        register_link: configObj.register_link || "",
        whatsapp_number: configObj.whatsapp_number || "",
        whatsapp_message: configObj.whatsapp_message || "",
        meta_pixel_id: configObj.meta_pixel_id || "",
        google_analytics_id: configObj.google_analytics_id || "",
        google_ads_id: configObj.google_ads_id || "",
        partner_link: configObj.partner_link || "",
        instagram_url: configObj.instagram_url || "",
        facebook_url: configObj.facebook_url || "",
        tiktok_url: configObj.tiktok_url || "",
        event_location_name: configObj.event_location_name || "",
        event_address: configObj.event_address || "",
        maps_link: configObj.maps_link || "",
        waze_link: configObj.waze_link || "",
        maps_embed_link: configObj.maps_embed_link || "",
        hero_title_image: configObj.hero_title_image || "/titulo-nacional.png",
        hero_title_image_mobile: configObj.hero_title_image_mobile || "/titulo-nacional.png",
        navbar_logo: configObj.navbar_logo || "/logo-barra.png",
        section_about_title: configObj.section_about_title || "Sobre o Evento",
        section_schedule_title: configObj.section_schedule_title || "Programação",
        section_location_title: configObj.section_location_title || "Local do Evento",
        section_sponsors_title: configObj.section_sponsors_title || "Patrocinadores",
        footer_text: configObj.footer_text || "Drumond Sports",
        footer_subtext: configObj.footer_subtext || "Brasília . 2026",
        ingressos_title: configObj.ingressos_title || "Escolha seu Ingresso",
        ingressos_description: configObj.ingressos_description || "Selecione a melhor opção para você e garanta sua vaga no maior evento de sinuca do Brasil.",
        patrocinador_title: configObj.patrocinador_title || "Seja um Patrocinador",
        patrocinador_intro: configObj.patrocinador_intro || "Posicione sua marca ao lado do maior evento de sinuca do Brasil e conecte-se a um público apaixonado por esporte e entretenimento.",
      });
      setLoading(false);
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const updateConfig = async (key: keyof Config, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const saveConfig = async () => {
    const updates = Object.entries(config).map(([key, value]) =>
      supabase.from("site_config").upsert({ key, value }, { onConflict: "key" })
    );
    await Promise.all(updates);
  };

  return { config, loading, updateConfig, saveConfig, fetchConfig };
}