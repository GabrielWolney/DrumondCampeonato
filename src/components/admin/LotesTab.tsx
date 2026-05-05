"use client";

import { useState } from "react";
import { useTicketTiers, TicketTier } from "@/hooks/useTicketTiers";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

export function LotesTab() {
  const { tiers, loading, error, saveTier, deleteTier, updateOrdem, retry } = useTicketTiers();
  const [editing, setEditing] = useState<Partial<TicketTier> | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const payload = {
        ...editing,
        price: editing.price ? Number(editing.price) : 0,
        highlight: editing.highlight || false,
      };
      await saveTier(payload);
      setEditing(null);
    } catch (err) {
      // Erro tratado no hook
    } finally {
      setSaving(false);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(tiers);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    updateOrdem(items);
  };

  const glassStyle = "bg-[#101820]/80 backdrop-blur-md border border-white/20 shadow-xl rounded-[30px] p-8";

  if (loading) return <div className="text-white p-8">Carregando lotes...</div>;

  if (error) {
    return (
      <div className={glassStyle + " text-center"}>
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={retry} className="bg-drumond-orange text-black px-6 py-3 rounded-full font-bold">
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className={glassStyle}>
      <h2 className="text-2xl font-display text-white mb-6">Gerenciar Lotes de Ingressos</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 p-6 rounded-2xl">
          <h3 className="text-lg font-display text-white mb-4">
            {editing?.id ? "Editar Lote" : "Novo Lote"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              placeholder="Nome"
              value={editing?.name || ""}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white"
              required
            />
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Preço (R$)"
              value={editing?.price ?? ""}
              onChange={(e) =>
                setEditing({ ...editing, price: e.target.value === "" ? 0 : Number(e.target.value) })
              }
              className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white"
              required
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing?.is_active ?? true}
                onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                className="rounded"
              />{" "}
              Ativo
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing?.highlight || false}
                onChange={(e) => setEditing({ ...editing, highlight: e.target.checked })}
                className="rounded"
              />{" "}
              Destacar como mais vendido
            </label>
            <div>
              <label className="block text-xs text-gray-400">Início (desbloqueio)</label>
              <input
                type="datetime-local"
                value={editing?.unlock_date?.slice(0, 16) || ""}
                onChange={(e) =>
                  setEditing({ ...editing, unlock_date: e.target.value || null })
                }
                className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400">Fim (opcional)</label>
              <input
                type="datetime-local"
                value={editing?.end_date?.slice(0, 16) || ""}
                onChange={(e) =>
                  setEditing({ ...editing, end_date: e.target.value || null })
                }
                className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400">Link de compra</label>
              <input
                type="url"
                placeholder="https://..."
                value={editing?.purchase_link || ""}
                onChange={(e) =>
                  setEditing({ ...editing, purchase_link: e.target.value })
                }
                className="w-full p-2 rounded-lg bg-black/30 border border-white/20 text-white"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="bg-drumond-orange text-black px-6 py-2 rounded-full font-bold disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
            {editing?.id && (
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="ml-2 bg-gray-700 text-white px-6 py-2 rounded-full"
              >
                Cancelar
              </button>
            )}
          </form>
        </div>

        <div>
          <h3 className="text-lg font-display text-white mb-4">Lotes (arraste para ordenar)</h3>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="tiers" direction="vertical">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {tiers.map((tier, idx) => (
                    <Draggable key={tier.id} draggableId={tier.id} index={idx}>
                      {(providedDrag) => (
                        <div
                          ref={providedDrag.innerRef}
                          {...providedDrag.draggableProps}
                          className="bg-white/10 rounded-xl p-3 flex justify-between items-center"
                        >
                          <div className="flex items-center gap-3">
                            <div {...providedDrag.dragHandleProps} className="cursor-grab">
                              ≡
                            </div>
                            <div>
                              <p className="font-bold text-white">
                                {tier.name}
                                {tier.highlight && (
                                  <span className="ml-2 text-xs bg-drumond-orange text-black px-2 py-0.5 rounded-full">
                                    Destaque
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-drumond-orange">R$ {tier.price}</p>
                              <p className="text-xs text-gray-400">
                                {tier.unlock_date
                                  ? `De: ${new Date(tier.unlock_date).toLocaleDateString("pt-BR")}`
                                  : "Sem início"}
                                {tier.end_date
                                  ? ` até ${new Date(tier.end_date).toLocaleDateString("pt-BR")}`
                                  : ""}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditing(tier)}
                              className="text-drumond-orange text-xs px-3 py-1 rounded-lg bg-orange-500/20"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => deleteTier(tier.id)}
                              className="text-red-400 text-xs px-3 py-1 rounded-lg bg-red-500/20"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}