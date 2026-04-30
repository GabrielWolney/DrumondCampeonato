"use client";

import { useState } from "react";
import { useSchedule, ScheduleItem } from "@/hooks/useSchedule";

export function ProgramacaoTab() {
  const { schedule, loading, saveSchedule, deleteSchedule } = useSchedule();
  const [editing, setEditing] = useState<Partial<ScheduleItem> | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    // Garante que os campos obrigatórios existam antes de salvar
    if (!editing.day_number || !editing.date || !editing.title || !editing.start_time || !editing.end_time) {
      alert("Preencha dia, data, título e horários.");
      return;
    }
    await saveSchedule(editing);
    setEditing(null);
  };

  const glassStyle = "bg-[#101820]/80 backdrop-blur-md border border-white/20 shadow-xl rounded-[30px] p-8";

  if (loading) return <div>Carregando...</div>;

  return (
    <div className={glassStyle}>
      <h2 className="text-2xl font-display text-white mb-6">Programação do Evento</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 p-6 rounded-2xl">
          <h3 className="text-lg font-display text-white mb-4">{editing?.id ? "Editar Dia" : "Adicionar Dia"}</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="number" placeholder="Dia (1..4)" value={editing?.day_number || ""} onChange={(e) => setEditing({ ...editing, day_number: parseInt(e.target.value) })} className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
            <input type="date" value={editing?.date || ""} onChange={(e) => setEditing({ ...editing, date: e.target.value })} className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
            <input type="text" placeholder="Título" value={editing?.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
            <textarea placeholder="Descrição" rows={3} value={editing?.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
            <div className="flex gap-2">
              <input type="time" value={editing?.start_time || ""} onChange={(e) => setEditing({ ...editing, start_time: e.target.value })} className="w-1/2 p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
              <input type="time" value={editing?.end_time || ""} onChange={(e) => setEditing({ ...editing, end_time: e.target.value })} className="w-1/2 p-2 rounded-lg bg-black/30 border border-white/20 text-white" />
            </div>
            <button type="submit" className="bg-drumond-orange text-black px-6 py-2 rounded-full font-bold">Salvar</button>
            {editing?.id && <button type="button" onClick={() => setEditing(null)} className="ml-2 bg-gray-700 text-white px-6 py-2 rounded-full">Cancelar</button>}
          </form>
        </div>

        <div>
          <h3 className="text-lg font-display text-white mb-4">Dias cadastrados</h3>
          <div className="space-y-3">
            {schedule.map(day => (
              <div key={day.id} className="bg-white/10 rounded-xl p-4 flex flex-wrap justify-between items-center">
                <div>
                  <p className="font-bold text-white">Dia {day.day_number} – {new Date(day.date).toLocaleDateString('pt-BR')}</p>
                  <p className="text-drumond-orange">{day.title}</p>
                  <p className="text-sm">{day.start_time.slice(0,5)} – {day.end_time.slice(0,5)}</p>
                  <p className="text-xs text-gray-300">{day.description}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(day)} className="text-drumond-orange text-xs px-3 py-1 rounded-lg bg-orange-500/20">Editar</button>
                  <button onClick={() => deleteSchedule(day.id)} className="text-red-400 text-xs px-3 py-1 rounded-lg bg-red-500/20">Excluir</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}