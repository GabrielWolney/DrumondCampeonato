"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";

export interface ScheduleItem {
  id: string;
  day_number: number;
  date: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
}

let cachedSchedule: ScheduleItem[] | null = null;

export function useSchedule() {
  const { showToast } = useToast();
  const [schedule, setSchedule] = useState<ScheduleItem[]>(cachedSchedule || []);
  const [loading, setLoading] = useState(!cachedSchedule);
  const [error, setError] = useState<string | null>(null);
  const cancelledRef = useRef(false);
  const fetchStartedRef = useRef(false);

  const fetchSchedule = useCallback(async (force = false) => {
    if (!force && cachedSchedule) {
      if (!cancelledRef.current) setLoading(false);
      return;
    }

    console.log("[useSchedule] Iniciando fetch...");
    const safeTimeout = setTimeout(() => {
      if (!cancelledRef.current) {
        console.warn("[useSchedule] Timeout após 10s");
        setLoading(false);
        setError("Tempo limite ao carregar programação. Verifique sua conexão.");
      }
    }, 10000);

    try {
      const { data, error: err } = await supabase
        .from("event_schedule")
        .select("*")
        .order("day_number", { ascending: true });

      clearTimeout(safeTimeout);

      if (err) throw new Error(err.message);

      cachedSchedule = data || [];
      if (!cancelledRef.current) {
        console.log("[useSchedule] Dados recebidos:", cachedSchedule.length);
        setSchedule(cachedSchedule);
        setError(null);
      }
    } catch (err: unknown) {
      clearTimeout(safeTimeout);
      const message = err instanceof Error ? err.message : "Erro ao carregar programação";
      console.error("[useSchedule] Erro:", message);
      showToast(message, "error");
      if (!cancelledRef.current) {
        setError(message);
        setSchedule([]);
      }
    } finally {
      clearTimeout(safeTimeout);
      if (!cancelledRef.current) {
        setLoading(false);
      }
    }
  }, [showToast]);

  useEffect(() => {
    cancelledRef.current = false;
    if (fetchStartedRef.current) return;
    fetchStartedRef.current = true;

    if (!cachedSchedule) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchSchedule();
    } else {
      setLoading(false);
    }

    return () => {
      cancelledRef.current = true;
    };
  }, [fetchSchedule]);

  const saveSchedule = async (item: Partial<ScheduleItem>) => {
    const scheduleData = {
      day_number: item.day_number,
      date: item.date,
      title: item.title,
      description: item.description || "",
      start_time: item.start_time,
      end_time: item.end_time,
    };
    try {
      if (item.id) {
        await supabase.from("event_schedule").update(scheduleData).eq("id", item.id);
        showToast("Dia atualizado com sucesso!", "success");
      } else {
        await supabase.from("event_schedule").insert([scheduleData]);
        showToast("Dia adicionado com sucesso!", "success");
      }
      cachedSchedule = null;
      await fetchSchedule(true);
    } catch (err) {
      console.error(err);
      showToast("Erro ao salvar programação", "error");
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      await supabase.from("event_schedule").delete().eq("id", id);
      showToast("Dia removido com sucesso!", "success");
      cachedSchedule = null;
      await fetchSchedule(true);
    } catch (err) {
      console.error(err);
      showToast("Erro ao remover dia", "error");
    }
  };

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchStartedRef.current = true;
    fetchSchedule(true);
  }, [fetchSchedule]);

  return { schedule, loading, error, saveSchedule, deleteSchedule, retry };
}