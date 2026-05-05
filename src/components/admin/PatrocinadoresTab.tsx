"use client";

import { useState, useEffect } from "react";
import { useSponsors, Sponsor } from "@/hooks/useSponsors";
import Image from "next/image";
import { useToast } from "@/components/ui/Toast";

export function PatrocinadoresTab() {
  const { sponsors, loading, error, saveSponsor, deleteSponsor, retry } = useSponsors();
  const { showToast } = useToast();
  const [editing, setEditing] = useState<Sponsor | null>(null);
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (loading) return <div className="text-white p-8">Carregando patrocinadores...</div>;

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveSponsor({ id: editing?.id, name, link }, logoFile || undefined);
      showToast(editing ? "Patrocinador atualizado!" : "Patrocinador criado!", "success");
      setName("");
      setLink("");
      setLogoFile(null);
      setPreviewUrl(null);
      setEditing(null);
    } catch (err) {
      showToast("Erro ao salvar patrocinador", "error");
    }
  };

  const handleEdit = (sponsor: Sponsor) => {
    setEditing(sponsor);
    setName(sponsor.name);
    setLink(sponsor.link);
    setLogoFile(null);
    setPreviewUrl(null);
  };

  const glassStyle = "bg-[#101820]/80 backdrop-blur-md border border-white/20 shadow-xl rounded-[30px] p-8";

  const imageSrc = previewUrl || editing?.logo_url || "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className={glassStyle}>
        <h3 className="text-xl mb-6 font-display text-white">{editing ? "Editar" : "Novo"} Patrocinador</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl">
            {(previewUrl || editing?.logo_url) && (
              <div className="w-14 h-14 relative rounded-lg overflow-hidden bg-gray-700 shrink-0">
                <Image
                  src={imageSrc}
                  fill
                  className="object-contain"
                  sizes="56px"
                  alt="Preview"
                />
              </div>
            )}
            {!previewUrl && !editing?.logo_url && (
              <div className="w-14 h-14 bg-gray-800 rounded-lg flex items-center justify-center text-xs text-gray-400 border border-dashed">
                Logo
              </div>
            )}
            <label className="bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer text-xs w-full text-center hover:bg-gray-600 transition">
              {logoFile ? "Arquivo selecionado" : editing?.logo_url ? "Trocar Logo" : "Enviar Logo"}
              <input type="file" accept="image/*" hidden onChange={handleFileChange} />
            </label>
          </div>
          <input
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl border border-white/20 bg-black/30 text-white"
          />
          <input
            placeholder="Link (https://...)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full p-3 rounded-xl border border-white/20 bg-black/30 text-white"
          />
          <button type="submit" className="w-full bg-drumond-orange text-black py-3 rounded-full font-bold">Salvar</button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setName("");
                setLink("");
                setLogoFile(null);
                setPreviewUrl(null);
              }}
              className="w-full bg-gray-700 text-white py-3 rounded-full"
            >
              Cancelar
            </button>
          )}
        </form>
      </div>

      <div className="lg:col-span-2 space-y-4">
        {sponsors.map((s) => (
          <div key={s.id} className="bg-white/10 p-4 rounded-2xl flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-gray-800">
                <Image src={s.logo_url} fill className="object-contain" alt={s.name} />
              </div>
              <div>
                <p className="font-bold text-white">{s.name}</p>
                <a href={s.link} target="_blank" rel="noopener noreferrer" className="text-xs text-drumond-orange underline">
                  {s.link}
                </a>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(s)}
                className="text-drumond-orange text-xs px-3 py-1 rounded-lg bg-orange-500/20"
              >
                Editar
              </button>
              <button
                onClick={() => {
                  if (confirm("Tem certeza?")) deleteSponsor(s.id);
                }}
                className="text-red-400 text-xs px-3 py-1 rounded-lg bg-red-500/20"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}