"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { compressAndUpload } from "@/lib/imageUploader";
/* eslint-disable react-hooks/set-state-in-effect */
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

  const fetchSponsors = useCallback(async (force = false) => {
    if (!force && cachedSponsors) return;

    try {
      const { data, error: err } = await supabase
        .from("sponsors")
        .select("*")
        .order("ordem", { ascending: true });

      if (err) throw new Error(err.message);

      cachedSponsors = data || [];
      if (!cancelledRef.current) {
        setSponsors(cachedSponsors);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao carregar patrocinadores";
      if (!cancelledRef.current) {
        setError(message);
        setSponsors([]);
      }
    } finally {
      if (!cancelledRef.current) {
        setLoading(false);
      }
    }
  }, []);

      useEffect(() => {
    cancelledRef.current = false;
    if (!cachedSponsors) {
      fetchSponsors();
    }
    return () => {
      cancelledRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    fetchSponsors(true);
  }, [fetchSponsors]);

  return { sponsors, loading, error, saveSponsor, deleteSponsor, fetchSponsors: retry, retry };
}