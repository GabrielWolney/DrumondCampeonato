"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading, isAdmin, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (loading) return null;

  // Se não estiver logado, mostra o formulário de login
  if (!user) {
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await login(email, password);
      } catch {
        alert("Erro no login");
      }
    };
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#101820] p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-[#101820]/80 backdrop-blur-md border border-white/20 rounded-[30px] p-8 w-full max-w-md"
        >
          <h1 className="font-display text-3xl mb-6 text-white">Admin Drumond</h1>
          <input
            type="email"
            placeholder="E-mail"
            className="w-full p-3 rounded-full border border-white/20 bg-black/20 text-white mb-4"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full p-3 rounded-full border border-white/20 bg-black/20 text-white mb-4"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-drumond-orange text-black px-10 py-3 rounded-full w-full font-bold"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  // Se está logado mas NÃO é admin, bloqueia completamente
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#101820] p-6">
        <div className="text-white text-center">
          <h2 className="text-2xl font-display mb-4">Acesso negado</h2>
          <p>Você não tem permissão para acessar esta área.</p>
        </div>
      </div>
    );
  }

  // Admin autenticado
  return <>{children}</>;
}