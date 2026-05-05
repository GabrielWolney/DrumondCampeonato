/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { compressAndUpload } from "@/lib/imageUploader";
import { useToast } from "@/components/ui/Toast";

interface Foto {
  id: string;
  image_url: string;
  ordem: number;
}

export function useFotos() {
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchFotos = useCallback(async () => {
    try {
      const { data, error: err } = await supabase
        .from("galeria")
        .select("*")
        .order("ordem", { ascending: true });
      if (err) throw err;
      setFotos(data || []);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar galeria";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchFotos();
  }, [fetchFotos]);

  const updateOrdem = async (items: Foto[]) => {
    try {
      const updates = items.map((item, index) =>
        supabase.from("galeria").update({ ordem: index }).eq("id", item.id)
      );
      await Promise.all(updates);
      setFotos(items);
    } catch (err) {
      console.error("Erro ao salvar ordem:", err);
      showToast("Erro ao reordenar fotos", "error");
      await fetchFotos();
    }
  };

  const uploadFotos = async (files: File[]) => {
    const currentLength = fotos.length;
    let algumErro = false;
    for (let i = 0; i < files.length; i++) {
      const publicUrl = await compressAndUpload(files[i], "galeria");
      if (!publicUrl) {
        showToast(`Falha no upload da imagem ${i + 1}`, "error");
        algumErro = true;
        continue;
      }
      const { error: insertErr } = await supabase
        .from("galeria")
        .insert({ image_url: publicUrl, ordem: currentLength + i });
      if (insertErr) {
        console.error("Erro ao inserir foto no banco:", insertErr);
        showToast("Erro ao salvar foto no banco", "error");
        algumErro = true;
      }
    }
    await fetchFotos();
    if (!algumErro) {
      showToast("Upload concluído!", "success");
    }
  };

  const deleteFoto = async (id: string) => {
    try {
      const { error: delErr } = await supabase.from("galeria").delete().eq("id", id);
      if (delErr) throw delErr;
      showToast("Foto removida", "success");
      await fetchFotos();
    } catch (err) {
      console.error("Erro ao deletar foto:", err);
      showToast("Erro ao remover foto", "error");
    }
  };

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchFotos();
  }, [fetchFotos]);

  return { fotos, loading, error, updateOrdem, uploadFotos, deleteFoto, retry, fetchFotos };
}