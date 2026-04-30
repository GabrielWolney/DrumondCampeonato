"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { GaleriaTab } from "./GaleriaTab";
import { PatrocinadoresTab } from "./PatrocinadoresTab";
import { ConfiguracoesTab } from "./ConfiguracoesTab";
import { LotesTab } from "./LotesTab";
import { ProgramacaoTab } from "./ProgramacaoTab";

const tabs = [
  { id: "fotos", label: "Galeria", component: GaleriaTab },
  { id: "patrocinadores", label: "Patrocinadores", component: PatrocinadoresTab },
  { id: "configuracoes", label: "Configurações", component: ConfiguracoesTab },
  { id: "lotes", label: "Lotes", component: LotesTab },
  { id: "programacao", label: "Programação", component: ProgramacaoTab },
] as const;

export function AdminTabs() {
  const [activeTab, setActiveTab] = useState<string>("fotos");
  const { logout } = useAuth();

  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component;

  return (
    <div className="pt-28 md:pt-36 max-w-6xl mx-auto px-4 md:px-6">
      {/* Barra de navegação das abas */}
      <div className="flex items-center justify-between gap-3 mb-8 md:mb-10">
        {/* Desktop: pílulas */}
        <div className="hidden md:flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-drumond-orange text-black shadow-lg"
                  : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile: dropdown + botão sair */}
        <div className="flex md:hidden items-center gap-2 w-full">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="flex-1 bg-[#101820]/90 backdrop-blur-md border border-white/20 rounded-full px-4 py-2.5 text-white text-sm font-bold appearance-none cursor-pointer text-center"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 16px center",
              paddingRight: "2.5rem",
            }}
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => logout()}
            className="px-4 py-2.5 rounded-full bg-red-600/80 text-white text-xs font-bold hover:bg-red-700 transition shrink-0"
          >
            Sair
          </button>
        </div>

        {/* Desktop: botão sair */}
        <div className="hidden md:block">
          <button
            onClick={() => logout()}
            className="px-5 py-2.5 rounded-full bg-red-600/80 text-white text-sm font-bold hover:bg-red-700 transition"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Conteúdo da aba ativa */}
      {ActiveComponent && <ActiveComponent />}
    </div>
  );
}