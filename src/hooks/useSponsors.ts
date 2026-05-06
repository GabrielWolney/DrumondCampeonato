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

let cache: { data: Sponsor[]; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export function useSponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>(cache?.data || []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(null);
  const cancelledRef = useRef(false);
  const fetchStartedRef = useRef(false);

  const fetchSponsors = useCallback(async (force = false) => {
    if (!force && fetchStartedRef.current) return;
    fetchStartedRef.current = true;

    if (!force && cache && Date.now() - cache.timestamp < CACHE_TTL) {
      if (!cancelledRef.current) {
        setSponsors(cache.data);
        setLoading(false);
        setError(null);
      }
      return;
    }

    setLoading(true);

    const safeTimeout = setTimeout(() => {
      if (!cancelledRef.current) {
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

      const items = data || [];
      cache = { data: items, timestamp: Date.now() };

      if (!cancelledRef.current) {
        setSponsors(items);
        setError(null);
        setLoading(false);
      }
    } catch (err: unknown) {
      clearTimeout(safeTimeout);
      const message = err instanceof Error ? err.message : "Erro ao carregar patrocinadores";
      if (!cancelledRef.current) {
        setError(message);
        setSponsors([]);
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    cancelledRef.current = false;
    if (!fetchStartedRef.current) {
      fetchSponsors();
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
      cache = null;
      fetchStartedRef.current = false;
      await fetchSponsors(true);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteSponsor = async (id: string) => {
    await supabase.from("sponsors").delete().eq("id", id);
    cache = null;
    fetchStartedRef.current = false;
    await fetchSponsors(true);
  };

  const retry = useCallback(() => {
    fetchStartedRef.current = false;
    cache = null;
    fetchSponsors(true);
  }, [fetchSponsors]);

  return { sponsors, loading, error, saveSponsor, deleteSponsor, retry };
}