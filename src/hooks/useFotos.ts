"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { compressAndUpload } from "@/lib/imageUploader";

interface Foto {
  id: string;
  image_url: string;
  ordem: number;
}

export function useFotos() {
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFotos = useCallback(async () => {
    const { data } = await supabase.from("galeria").select("*").order("ordem", { ascending: true });
    setFotos(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const { data } = await supabase.from("galeria").select("*").order("ordem", { ascending: true });
      if (isMounted) {
        setFotos(data || []);
        setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const updateOrdem = async (items: Foto[]) => {
    try {
      const updates = items.map((item, index) =>
        supabase.from("galeria").update({ ordem: index }).eq("id", item.id)
      );
      await Promise.all(updates);
      setFotos(items);
    } catch (err) {
      console.error("Erro ao salvar ordem:", err);
      // recarregar para garantir consistência
      const { data } = await supabase.from("galeria").select("*").order("ordem", { ascending: true });
      setFotos(data || []);
    }
  };

  const uploadFotos = async (files: File[]) => {
    const currentLength = fotos.length;
    for (let i = 0; i < files.length; i++) {
      const publicUrl = await compressAndUpload(files[i], "galeria");
      if (publicUrl) {
        await supabase
          .from("galeria")
          .insert({ image_url: publicUrl, ordem: currentLength + i });
      }
    }
    // recarregar após todos uploads
    const { data } = await supabase.from("galeria").select("*").order("ordem", { ascending: true });
    setFotos(data || []);
  };

  const deleteFoto = async (id: string) => {
    await supabase.from("galeria").delete().eq("id", id);
    const { data } = await supabase.from("galeria").select("*").order("ordem", { ascending: true });
    setFotos(data || []);
  };

  return { fotos, loading, fetchFotos, updateOrdem, uploadFotos, deleteFoto };
}