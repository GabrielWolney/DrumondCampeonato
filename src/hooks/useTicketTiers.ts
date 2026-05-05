"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";
/* eslint-disable react-hooks/set-state-in-effect */
export interface TicketTier {
  id: string;
  name: string;
  price: number;
  total_quantity: number;
  sold_quantity: number;
  is_active: boolean;
  unlock_date: string | null;
  end_date: string | null;
  purchase_link: string | null;
  ordem: number;
  highlight?: boolean; // NOVO
}

let cachedTiers: TicketTier[] | null = null;

export function useTicketTiers() {
  const { showToast } = useToast();
  const [tiers, setTiers] = useState<TicketTier[]>(cachedTiers || []);
  const [loading, setLoading] = useState(!cachedTiers);
  const [error, setError] = useState<string | null>(null);
  const cancelledRef = useRef(false);

  const fetchTiers = useCallback(async (force = false) => {
    if (!force && cachedTiers) return;

    try {
      const { data, error: err } = await supabase
        .from("ticket_tiers")
        .select("*")
        .order("ordem", { ascending: true });

      if (err) throw new Error(err.message);

      cachedTiers = data || [];
      if (!cancelledRef.current) {
        setTiers(cachedTiers);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao carregar lotes";
      showToast(message, "error");
      if (!cancelledRef.current) {
        setError(message);
        setTiers([]);
      }
    } finally {
      if (!cancelledRef.current) {
        setLoading(false);
      }
    }
  }, [showToast]);

      useEffect(() => {
    cancelledRef.current = false;
    if (!cachedTiers) {
      fetchTiers();
    }
    return () => {
      cancelledRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveTier = async (tier: Partial<TicketTier>) => {
    const price = typeof tier.price === "number" && !isNaN(tier.price) ? tier.price : 0;
    const tierData = {
      name: tier.name || "",
      price,
      total_quantity: tier.total_quantity ?? 0,
      sold_quantity: tier.sold_quantity ?? 0,
      is_active: tier.is_active ?? true,
      unlock_date: tier.unlock_date || null,
      end_date: tier.end_date || null,
      purchase_link: tier.purchase_link || null,
      ordem: tier.ordem ?? tiers.length,
    };

    try {
      if (tier.id) {
        const { error } = await supabase
          .from("ticket_tiers")
          .update(tierData)
          .eq("id", tier.id);
        if (error) throw error;
        showToast("Lote atualizado com sucesso!", "success");
      } else {
        const { error } = await supabase
          .from("ticket_tiers")
          .insert([tierData]);
        if (error) throw error;
        showToast("Lote criado com sucesso!", "success");
      }
      cachedTiers = null;
      await fetchTiers(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido ao salvar lote";
      showToast(message, "error");
    }
  };

  const deleteTier = async (id: string) => {
    try {
      const { error } = await supabase.from("ticket_tiers").delete().eq("id", id);
      if (error) throw error;
      showToast("Lote removido com sucesso!", "success");
      cachedTiers = null;
      await fetchTiers(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao remover lote";
      showToast(message, "error");
    }
  };

  const updateOrdem = async (items: TicketTier[]) => {
    try {
      const updates = items.map((item, idx) =>
        supabase.from("ticket_tiers").update({ ordem: idx }).eq("id", item.id)
      );
      await Promise.all(updates);
      cachedTiers = items;
      if (!cancelledRef.current) {
        setTiers(items);
        showToast("Ordem atualizada com sucesso!", "success");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao salvar ordem";
      showToast(message, "error");
      cachedTiers = null;
      await fetchTiers(true);
    }
  };

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchTiers(true);
  }, [fetchTiers]);

  return { tiers, loading, error, saveTier, deleteTier, updateOrdem, fetchTiers: retry, retry };
}