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

let cache: { data: ScheduleItem[]; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export function useSchedule() {
  const { showToast } = useToast();
  const [schedule, setSchedule] = useState<ScheduleItem[]>(cache?.data || []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(null);
  const cancelledRef = useRef(false);
  const fetchStartedRef = useRef(false);

  const fetchSchedule = useCallback(async (force = false) => {
    if (!force && fetchStartedRef.current) return;
    fetchStartedRef.current = true;

    if (!force && cache && Date.now() - cache.timestamp < CACHE_TTL) {
      if (!cancelledRef.current) {
        setSchedule(cache.data);
        setLoading(false);
        setError(null);
      }
      return;
    }

    setLoading(true);

    const safeTimeout = setTimeout(() => {
      if (!cancelledRef.current) {
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

      const items = data || [];
      cache = { data: items, timestamp: Date.now() };

      if (!cancelledRef.current) {
        setSchedule(items);
        setError(null);
        setLoading(false);
      }
    } catch (err: unknown) {
      clearTimeout(safeTimeout);
      const message = err instanceof Error ? err.message : "Erro ao carregar programação";
      showToast(message, "error");
      if (!cancelledRef.current) {
        setError(message);
        setSchedule([]);
        setLoading(false);
      }
    }
  }, [showToast]);

  useEffect(() => {
    cancelledRef.current = false;
    if (!fetchStartedRef.current) {
      fetchSchedule();
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
      cache = null;
      fetchStartedRef.current = false;
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
      cache = null;
      fetchStartedRef.current = false;
      await fetchSchedule(true);
    } catch (err) {
      console.error(err);
      showToast("Erro ao remover dia", "error");
    }
  };

  const retry = useCallback(() => {
    fetchStartedRef.current = false;
    cache = null;
    fetchSchedule(true);
  }, [fetchSchedule]);

  return { schedule, loading, error, saveSchedule, deleteSchedule, retry };
}