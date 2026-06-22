import { supabase } from "@/lib/supabase";
import IngressosClient from "@/components/IngressosClient";
import { Config } from "@/hooks/useConfig";

export const revalidate = 60; // ISR cache for 60 seconds

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

function parseConfig(data: { key: string; value: string }[] | null): Config {
  const obj: Record<string, string> = {};
  if (data) {
    data.forEach((item) => {
      obj[item.key] = item.value;
    });
  }
  return {
    ...defaultConfig,
    ...Object.fromEntries(Object.entries(obj)),
  };
}

export default async function Page() {
  const [
    { data: configData },
    { data: tiersData }
  ] = await Promise.all([
    supabase.from("site_config").select("key, value"),
    supabase.from("ticket_tiers").select("*").eq("is_active", true).order("ordem", { ascending: true })
  ]);

  const config = parseConfig(configData);
  
  // Garantir que pelo menos um tem highlight se nenhum tiver (lógica legada, mantida)
  const hasHighlight = (tiersData || []).some((t) => t.highlight);
  const enhancedTiers = (tiersData || []).map((t, i) => ({
    ...t,
    highlight: hasHighlight ? t.highlight : i === 0,
  }));

  return (
    <IngressosClient
      config={config}
      tiers={enhancedTiers}
    />
  );
}