"use client";

import { useState, useRef, useCallback } from "react";
import { useConfig } from "@/hooks/useConfig";
import { compressAndUpload } from "@/lib/imageUploader";
import { useToast } from "@/components/ui/Toast";
import Image from "next/image";

export function ConfiguracoesTab() {
  const { config, updateConfig, saveConfig, loading, error, retry } = useConfig();
  const { showToast } = useToast();
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const extractMapsEmbedUrl = useCallback((value: string): string => {
    if (!value) return "";
    if (value.startsWith("http")) return value;
    const srcMatch = value.match(/src=["']([^"']+)["']/);
    return srcMatch ? srcMatch[1] : value;
  }, []);

  if (loading) return <div className="text-white p-8">Carregando configurações...</div>;

  if (error) {
    return (
      <div className="bg-[#101820]/80 backdrop-blur-md border border-white/20 rounded-[30px] p-8 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={retry}
          className="bg-drumond-orange text-black px-6 py-3 rounded-full font-bold"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const handleChange = (key: keyof typeof config, value: string) => {
    if (key === "maps_embed_link") {
      value = extractMapsEmbedUrl(value);
    }
    updateConfig(key, value);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveConfig();
      showToast("Configurações salvas com sucesso!", "success");
    } catch (err) {
      showToast("Erro ao salvar configurações", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (key: "hero_title_image" | "hero_title_image_mobile" | "navbar_logo" | "navbar_logo_scrolled") => {
    const input = fileInputRefs.current[key];
    if (!input?.files?.[0]) return;
    setUploading(key);
    try {
      const url = await compressAndUpload(input.files[0], "config", key === "navbar_logo" || key === "navbar_logo_scrolled" ? 400 : 1080);
      if (url) {
        updateConfig(key, url);
        showToast("Imagem carregada com sucesso!", "success");
      } else {
        showToast("Falha no upload da imagem", "error");
      }
    } catch (err) {
      showToast("Erro ao fazer upload", "error");
    } finally {
      setUploading(null);
      input.value = "";
    }
  };

  const glassStyle = "bg-[#101820]/80 backdrop-blur-md border border-white/20 shadow-xl rounded-[30px] p-8";

  return (
    <div className={glassStyle}>
      <h2 className="text-2xl font-display text-white mb-6">Configurações Gerais</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Imagens */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-display text-white mb-4">Imagens do Site</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Logo Navbar */}
            <div className="bg-white/5 p-4 rounded-xl">
              <label className="block text-sm font-bold text-gray-300 mb-2">Logo da Navbar</label>
              <div className="w-full h-20 relative rounded-lg overflow-hidden bg-gray-800 mb-2">
                <Image src={config.navbar_logo} alt="Logo Navbar" fill className="object-contain p-1" />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={config.navbar_logo}
                  onChange={(e) => handleChange("navbar_logo", e.target.value)}
                  className="flex-1 p-2 rounded-lg bg-black/30 border border-white/20 text-white text-xs"
                  placeholder="URL da logo"
                />
                <label className="bg-drumond-orange text-black px-3 py-2 rounded-lg cursor-pointer text-xs font-bold flex items-center">
                  {uploading === "navbar_logo" ? "..." : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={(el) => { fileInputRefs.current.navbar_logo = el; }}
                    onChange={() => handleImageUpload("navbar_logo")}
                  />
                </label>
              </div>
            </div>

            {/* Logo Navbar (Scroll) */}
            <div className="bg-white/5 p-4 rounded-xl">
              <label className="block text-sm font-bold text-gray-300 mb-2">Logo Navbar (Scroll)</label>
              <div className="w-full h-20 relative rounded-lg overflow-hidden bg-gray-800 mb-2">
                <Image src={config.navbar_logo_scrolled} alt="Logo Navbar Scroll" fill className="object-contain p-1" />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={config.navbar_logo_scrolled}
                  onChange={(e) => handleChange("navbar_logo_scrolled", e.target.value)}
                  className="flex-1 p-2 rounded-lg bg-black/30 border border-white/20 text-white text-xs"
                  placeholder="URL da logo"
                />
                <label className="bg-drumond-orange text-black px-3 py-2 rounded-lg cursor-pointer text-xs font-bold flex items-center">
                  {uploading === "navbar_logo_scrolled" ? "..." : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={(el) => { fileInputRefs.current.navbar_logo_scrolled = el; }}
                    onChange={() => handleImageUpload("navbar_logo_scrolled")}
                  />
                </label>
              </div>
            </div>

            {/* Título Home Desktop */}
            <div className="bg-white/5 p-4 rounded-xl">
              <label className="block text-sm font-bold text-gray-300 mb-2">Título (Desktop)</label>
              <div className="w-full h-20 relative rounded-lg overflow-hidden bg-gray-800 mb-2">
                <Image src={config.hero_title_image} alt="Título Desktop" fill className="object-contain p-1" />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={config.hero_title_image}
                  onChange={(e) => handleChange("hero_title_image", e.target.value)}
                  className="flex-1 p-2 rounded-lg bg-black/30 border border-white/20 text-white text-xs"
                  placeholder="URL"
                />
                <label className="bg-drumond-orange text-black px-3 py-2 rounded-lg cursor-pointer text-xs font-bold flex items-center">
                  {uploading === "hero_title_image" ? "..." : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={(el) => { fileInputRefs.current.hero_title_image = el; }}
                    onChange={() => handleImageUpload("hero_title_image")}
                  />
                </label>
              </div>
            </div>

            {/* Título Home Mobile */}
            <div className="bg-white/5 p-4 rounded-xl">
              <label className="block text-sm font-bold text-gray-300 mb-2">Título (Mobile)</label>
              <div className="w-full h-20 relative rounded-lg overflow-hidden bg-gray-800 mb-2">
                <Image src={config.hero_title_image_mobile} alt="Título Mobile" fill className="object-contain p-1" />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={config.hero_title_image_mobile}
                  onChange={(e) => handleChange("hero_title_image_mobile", e.target.value)}
                  className="flex-1 p-2 rounded-lg bg-black/30 border border-white/20 text-white text-xs"
                  placeholder="URL"
                />
                <label className="bg-drumond-orange text-black px-3 py-2 rounded-lg cursor-pointer text-xs font-bold flex items-center">
                  {uploading === "hero_title_image_mobile" ? "..." : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={(el) => { fileInputRefs.current.hero_title_image_mobile = el; }}
                    onChange={() => handleImageUpload("hero_title_image_mobile")}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Datas e títulos */}
        <div>
          <label className="block text-sm font-bold text-gray-300">Data do Evento</label>
          <input type="datetime-local" value={config.event_date.slice(0, 16)} onChange={(e) => handleChange("event_date", new Date(e.target.value).toISOString())} className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">Título Seção Sobre</label>
          <input type="text" value={config.section_about_title} onChange={(e) => handleChange("section_about_title", e.target.value)} className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">Título Seção Programação</label>
          <input type="text" value={config.section_schedule_title} onChange={(e) => handleChange("section_schedule_title", e.target.value)} className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">Título Seção Local</label>
          <input type="text" value={config.section_location_title} onChange={(e) => handleChange("section_location_title", e.target.value)} className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">Título Seção Patrocinadores</label>
          <input type="text" value={config.section_sponsors_title} onChange={(e) => handleChange("section_sponsors_title", e.target.value)} className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">Nome do Local</label>
          <input type="text" value={config.event_location_name} onChange={(e) => handleChange("event_location_name", e.target.value)} className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">Endereço</label>
          <input type="text" value={config.event_address} onChange={(e) => handleChange("event_address", e.target.value)} className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">Google Maps Link</label>
          <input type="url" value={config.maps_link} onChange={(e) => handleChange("maps_link", e.target.value)} className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">Waze Link</label>
          <input type="url" value={config.waze_link} onChange={(e) => handleChange("waze_link", e.target.value)} className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-300">Link do Mapa (embed para o site)</label>
          <input
            type="text"
            value={config.maps_embed_link}
            onChange={(e) => handleChange("maps_embed_link", e.target.value)}
            placeholder="https://www.google.com/maps/embed?... ou cole o iframe completo"
            className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white"
          />
          <p className="text-xs text-gray-500 mt-1">
            Cole o link de incorporação do Google Maps (URL ou iframe completo). O sistema extrai a URL automaticamente.
          </p>
        </div>
        <div className="md:col-span-2">
          <hr className="border-white/20 my-4" />
          <h3 className="text-lg font-display text-white mb-4">WhatsApp</h3>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">Número Principal</label>
          <input type="text" value={config.whatsapp_number} onChange={(e) => handleChange("whatsapp_number", e.target.value)} className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">Mensagem Principal</label>
          <input type="text" value={config.whatsapp_message} onChange={(e) => handleChange("whatsapp_message", e.target.value)} className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
        </div>
        <div className="md:col-span-2">
          <hr className="border-white/20 my-2" />
          <h4 className="text-md font-display text-white/80 mb-2">Patrocinador (página específica)</h4>
          <p className="text-xs text-gray-400 mb-4">Se vazio, será usado o número e mensagem principal.</p>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">Número Patrocinador</label>
          <input type="text" value={config.whatsapp_number_patrocinador} onChange={(e) => handleChange("whatsapp_number_patrocinador", e.target.value)} placeholder="Usa principal se vazio" className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">Mensagem Patrocinador</label>
          <input type="text" value={config.whatsapp_message_patrocinador} onChange={(e) => handleChange("whatsapp_message_patrocinador", e.target.value)} placeholder="Usa principal se vazio" className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
        </div>
        <div className="md:col-span-2">
          <hr className="border-white/20 my-4" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-300">Texto &quot;Sobre o Evento&quot;</label>
          <textarea rows={4} value={config.about_text} onChange={(e) => handleChange("about_text", e.target.value)} className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
        </div>
        <div className="md:col-span-2">
          <hr className="border-white/20 my-4" />
          <h3 className="text-lg font-display text-white mb-4">Páginas Específicas</h3>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">Título Página Ingressos</label>
          <input type="text" value={config.ingressos_title} onChange={(e) => handleChange("ingressos_title", e.target.value)} className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">Descrição Página Ingressos</label>
          <input type="text" value={config.ingressos_description} onChange={(e) => handleChange("ingressos_description", e.target.value)} className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">Título Página Patrocinador</label>
          <input type="text" value={config.patrocinador_title} onChange={(e) => handleChange("patrocinador_title", e.target.value)} className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">Introdução Patrocinador</label>
          <input type="text" value={config.patrocinador_intro} onChange={(e) => handleChange("patrocinador_intro", e.target.value)} className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">Link de Inscrição (jogadores)</label>
          <input
            type="url"
            value={config.register_link}
            onChange={(e) => handleChange("register_link", e.target.value)}
            className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white"
            placeholder="https://..."
          />
        </div>
        <div className="md:col-span-2">
          <hr className="border-white/20 my-4" />
          <h3 className="text-lg font-display text-white mb-4">Rodapé</h3>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">Texto Principal Rodapé</label>
          <input type="text" value={config.footer_text} onChange={(e) => handleChange("footer_text", e.target.value)} className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">Texto Secundário Rodapé</label>
          <input type="text" value={config.footer_subtext} onChange={(e) => handleChange("footer_subtext", e.target.value)} className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
        </div>
        <div className="md:col-span-2">
          <hr className="border-white/20 my-4" />
          <h3 className="text-lg font-display text-white mb-2">Marketing</h3>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">Meta Pixel ID</label>
          <input type="text" value={config.meta_pixel_id} onChange={(e) => handleChange("meta_pixel_id", e.target.value)} className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">Google Analytics ID</label>
          <input type="text" value={config.google_analytics_id} onChange={(e) => handleChange("google_analytics_id", e.target.value)} className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">Google Ads ID</label>
          <input type="text" value={config.google_ads_id} onChange={(e) => handleChange("google_ads_id", e.target.value)} className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
        </div>
        <div className="md:col-span-2">
          <hr className="border-white/20 my-2" />
          <h3 className="text-lg font-display text-white mb-2">Redes Sociais</h3>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">Instagram URL</label>
          <input
            type="text"
            value={config.instagram_url}
            onChange={(e) => handleChange("instagram_url", e.target.value)}
            className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">Facebook URL</label>
          <input
            type="text"
            value={config.facebook_url}
            onChange={(e) => handleChange("facebook_url", e.target.value)}
            className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">TikTok URL</label>
          <input
            type="text"
            value={config.tiktok_url}
            onChange={(e) => handleChange("tiktok_url", e.target.value)}
            className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white"
          />
        </div>
        {/* Banner de Inscrição */}
        <div className="md:col-span-2">
          <hr className="border-white/20 my-2" />
          <h3 className="text-lg font-display text-white mb-2">Banner de Inscrição</h3>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm font-bold text-gray-300">Ativar banner</label>
          <select
            value={config.register_banner_enabled}
            onChange={(e) => handleChange("register_banner_enabled", e.target.value)}
            className="p-2 rounded-lg bg-black/30 border border-white/20 text-white"
          >
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">Título do banner</label>
          <input
            type="text"
            value={config.register_banner_text}
            onChange={(e) => handleChange("register_banner_text", e.target.value)}
            className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300">Subtítulo do banner</label>
          <input
            type="text"
            value={config.register_banner_subtext}
            onChange={(e) => handleChange("register_banner_subtext", e.target.value)}
            className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white"
          />
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-drumond-orange text-black px-8 py-3 rounded-full font-bold disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar Configurações"}
        </button>
      </div>
    </div>
  );
}