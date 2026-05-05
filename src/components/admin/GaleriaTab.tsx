"use client";

import { useState } from "react";
import { useFotos } from "@/hooks/useFotos";
import Image from "next/image";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

export function GaleriaTab() {
  const { fotos, loading, error, updateOrdem, uploadFotos, deleteFoto, retry } = useFotos();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploading(true);
    await uploadFotos(Array.from(e.target.files));
    setUploading(false);
    e.target.value = "";
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(fotos);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    updateOrdem(items);
  };

  const glassStyle = "bg-[#101820]/80 backdrop-blur-md border border-white/20 shadow-xl rounded-[30px] p-8";

  if (loading) return <div className="text-white p-8">Carregando galeria...</div>;

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display text-white">Organizar Carrossel</h2>
        <label className="bg-drumond-orange text-black px-6 py-2 rounded-full cursor-pointer font-bold">
          {uploading ? "Enviando..." : "+ Adicionar Fotos"}
          <input type="file" multiple hidden accept="image/*" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {fotos.length === 0 ? (
        <div className="text-center py-16 text-gray-400 border border-dashed">Nenhuma foto ainda.</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="galeria" direction="vertical">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                {fotos.map((foto, idx) => (
                  <Draggable key={foto.id} draggableId={foto.id} index={idx}>
                    {(providedDrag) => (
                      <div ref={providedDrag.innerRef} {...providedDrag.draggableProps} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl">
                        <div {...providedDrag.dragHandleProps} className="cursor-grab p-2">≡</div>
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                          <Image src={foto.image_url} fill className="object-cover" alt="" />
                        </div>
                        <div className="flex-1">Ordem: {idx + 1}</div>
                        <button onClick={() => deleteFoto(foto.id)} className="text-red-400">Remover</button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}