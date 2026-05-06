"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101820]">
      <div className="text-center px-4">
        <h2 className="font-display text-2xl md:text-4xl text-white mb-4">Algo deu errado</h2>
        <p className="text-gray-300 mb-8 max-w-md mx-auto">
          Ocorreu um erro inesperado. Por favor, tente novamente.
        </p>
        <button
          onClick={reset}
          className="bg-drumond-orange text-black px-8 py-3 rounded-full font-display text-lg uppercase italic font-bold hover:scale-105 transition-transform"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}