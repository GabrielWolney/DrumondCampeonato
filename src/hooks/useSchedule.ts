"use client";

import { useState, useEffect, useCallback } from "react";
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

export function useSchedule() {
  const { showToast } = useToast();
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedule = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("event_schedule").select("*").order("day_number", { ascending: true });
      if (error) throw error;
      setSchedule(data || []);
    } catch (err) {
      console.error("Erro ao buscar programação:", err);
      showToast("Erro ao carregar programação", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const { data, error } = await supabase.from("event_schedule").select("*").order("day_number", { ascending: true });
        if (error) throw error;
        if (isMounted) {
          setSchedule(data || []);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          showToast("Erro ao carregar programação", "error");
          setLoading(false);
        }
      }
    };
    load();
    return () => { isMounted = false; };
  }, [showToast]);

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
      await fetchSchedule();
    } catch (err) {
      console.error(err);
      showToast("Erro ao salvar programação", "error");
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      await supabase.from("event_schedule").delete().eq("id", id);
      showToast("Dia removido com sucesso!", "success");
      await fetchSchedule();
    } catch (err) {
      console.error(err);
      showToast("Erro ao remover dia", "error");
    }
  };

  return { schedule, loading, saveSchedule, deleteSchedule, fetchSchedule };
}