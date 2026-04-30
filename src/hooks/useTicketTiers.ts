"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";

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
}

export function useTicketTiers() {
  const { showToast } = useToast();
  const [tiers, setTiers] = useState<TicketTier[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTiers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("ticket_tiers")
        .select("*")
        .order("ordem", { ascending: true });
      if (error) throw error;
      setTiers(data || []);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar lotes";
      console.error(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("ticket_tiers")
          .select("*")
          .order("ordem", { ascending: true });
        if (error) throw error;
        if (isMounted) {
          setTiers(data || []);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message =
            err instanceof Error ? err.message : "Erro ao carregar lotes";
          showToast(message, "error");
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const saveTier = async (tier: Partial<TicketTier>) => {
    const price =
      typeof tier.price === "number" && !isNaN(tier.price) ? tier.price : 0;
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
      await fetchTiers();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro desconhecido ao salvar lote";
      console.error(message);
      showToast(message, "error");
    }
  };

  const deleteTier = async (id: string) => {
    try {
      const { error } = await supabase
        .from("ticket_tiers")
        .delete()
        .eq("id", id);
      if (error) throw error;
      showToast("Lote removido com sucesso!", "success");
      await fetchTiers();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao remover lote";
      console.error(message);
      showToast(message, "error");
    }
  };

  const updateOrdem = async (items: TicketTier[]) => {
    try {
      const updates = items.map((item, idx) =>
        supabase.from("ticket_tiers").update({ ordem: idx }).eq("id", item.id)
      );
      await Promise.all(updates);
      setTiers(items);
      showToast("Ordem atualizada com sucesso!", "success");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao salvar ordem";
      console.error(message);
      showToast(message, "error");
      await fetchTiers();
    }
  };

  return { tiers, loading, saveTier, deleteTier, updateOrdem, fetchTiers };
}