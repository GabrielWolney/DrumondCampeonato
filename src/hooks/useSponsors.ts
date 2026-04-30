"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { compressAndUpload } from "@/lib/imageUploader";

export interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  link: string;
  ordem: number;
}

export function useSponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSponsors = useCallback(async () => {
    const { data } = await supabase.from("sponsors").select("*").order("ordem", { ascending: true });
    setSponsors(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const { data } = await supabase.from("sponsors").select("*").order("ordem", { ascending: true });
      if (isMounted) {
        setSponsors(data || []);
        setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
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
      await fetchSponsors(); // recarrega a lista
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteSponsor = async (id: string) => {
    await supabase.from("sponsors").delete().eq("id", id);
    await fetchSponsors();
  };

  return { sponsors, loading, saveSponsor, deleteSponsor, fetchSponsors };
}