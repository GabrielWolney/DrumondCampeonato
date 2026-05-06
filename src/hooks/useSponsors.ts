"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { compressAndUpload } from "@/lib/imageUploader";

export interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  link: string;
  ordem: number;
}

let cachedSponsors: Sponsor[] | null = null;

export function useSponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>(cachedSponsors || []);
  const [loading, setLoading] = useState(!cachedSponsors);
  const [error, setError] = useState<string | null>(null);
  const cancelledRef = useRef(false);
  const fetchStartedRef = useRef(false);

  const fetchSponsors = useCallback(async (force = false) => {
    if (!force && cachedSponsors) {
      if (!cancelledRef.current) setLoading(false);
      return;
    }

    console.log("[useSponsors] Iniciando fetch...");
    const safeTimeout = setTimeout(() => {
      if (!cancelledRef.current) {
        console.warn("[useSponsors] Timeout após 10s");
        setLoading(false);
        setError("Tempo limite ao carregar patrocinadores. Verifique sua conexão.");
      }
    }, 10000);

    try {
      const { data, error: err } = await supabase
        .from("sponsors")
        .select("*")
        .order("ordem", { ascending: true });

      clearTimeout(safeTimeout);

      if (err) throw new Error(err.message);

      cachedSponsors = data || [];
      if (!cancelledRef.current) {
        console.log("[useSponsors] Dados recebidos:", cachedSponsors.length);
        setSponsors(cachedSponsors);
        setError(null);
      }
    } catch (err: unknown) {
      clearTimeout(safeTimeout);
      const message = err instanceof Error ? err.message : "Erro ao carregar patrocinadores";
      console.error("[useSponsors] Erro:", message);
      if (!cancelledRef.current) {
        setError(message);
        setSponsors([]);
      }
    } finally {
      clearTimeout(safeTimeout);
      if (!cancelledRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    cancelledRef.current = false;
    // Evita múltiplos fetches em desenvolvimento (React Strict Mode)
    if (fetchStartedRef.current) return;
    fetchStartedRef.current = true;

    if (!cachedSponsors) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchSponsors();
    } else {
      setLoading(false);
    }

    return () => {
      cancelledRef.current = true;
    };
  }, [fetchSponsors]);

  const saveSponsor = async (sponsor: Partial<Sponsor>, logoFile?: File) => {
    try {
      let logoUrl: string | undefined = sponsor.logo_url;
      if (logoFile) {
        const uploadedUrl = await compressAndUpload(logoFile, "sponsors", 400);
        if (!uploadedUrl) throw new Error("Falha no upload da logo");
        logoUrl = uploadedUrl;
      }
      if (!logoUrl) throw new Error("Logo é obrigatória");

      const sponsorData = {
        name: sponsor.name!,
        link: sponsor.link!,
        logo_url: logoUrl,
        ordem: sponsor.ordem ?? sponsors.length,
      };

      if (sponsor.id) {
        await supabase.from("sponsors").update(sponsorData).eq("id", sponsor.id);
      } else {
        await supabase.from("sponsors").insert([sponsorData]);
      }
      cachedSponsors = null;
      await fetchSponsors(true);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteSponsor = async (id: string) => {
    await supabase.from("sponsors").delete().eq("id", id);
    cachedSponsors = null;
    await fetchSponsors(true);
  };

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchStartedRef.current = true;
    fetchSponsors(true);
  }, [fetchSponsors]);

  return { sponsors, loading, error, saveSponsor, deleteSponsor, retry };
}