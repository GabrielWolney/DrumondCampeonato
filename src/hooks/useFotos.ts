"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { compressAndUpload } from "@/lib/imageUploader";
/* eslint-disable react-hooks/set-state-in-effect */
interface Foto {
  id: string;
  image_url: string;
  ordem: number;
}

let cachedFotos: Foto[] | null = null;

export function useFotos() {
  const [fotos, setFotos] = useState<Foto[]>(cachedFotos || []);
  const [loading, setLoading] = useState(!cachedFotos);
  const [error, setError] = useState<string | null>(null);
  const cancelledRef = useRef(false);

  const fetchFotos = useCallback(async (force = false) => {
    if (!force && cachedFotos) return;

    try {
      const { data, error: err } = await supabase
        .from("galeria")
        .select("*")
        .order("ordem", { ascending: true });

      if (err) throw new Error(err.message);

      cachedFotos = data || [];
      if (!cancelledRef.current) {
        setFotos(cachedFotos);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao carregar fotos";
      if (!cancelledRef.current) {
        setError(message);
        setFotos([]);
      }
    } finally {
      if (!cancelledRef.current) {
        setLoading(false);
      }
    }
  }, []);

      useEffect(() => {
    cancelledRef.current = false;
    if (!cachedFotos) {
      fetchFotos();
    }
    return () => {
      cancelledRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateOrdem = async (items: Foto[]) => {
    try {
      const updates = items.map((item, index) =>
        supabase.from("galeria").update({ ordem: index }).eq("id", item.id)
      );
      await Promise.all(updates);
      cachedFotos = items;
      if (!cancelledRef.current) setFotos(items);
    } catch (err) {
      console.error("Erro ao salvar ordem:", err);
      cachedFotos = null;
      await fetchFotos(true);
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
    cachedFotos = null;
    await fetchFotos(true);
  };

  const deleteFoto = async (id: string) => {
    await supabase.from("galeria").delete().eq("id", id);
    cachedFotos = null;
    await fetchFotos(true);
  };

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchFotos(true);
  }, [fetchFotos]);

  return { fotos, loading, error, fetchFotos: retry, updateOrdem, uploadFotos, deleteFoto, retry };
}