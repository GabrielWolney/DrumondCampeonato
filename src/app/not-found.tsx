import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101820]">
      <div className="text-center px-4">
        <h1 className="font-display text-6xl md:text-8xl text-drumond-orange mb-4">404</h1>
        <h2 className="font-display text-2xl md:text-4xl text-white mb-4">Página não encontrada</h2>
        <p className="text-gray-300 mb-8 max-w-md mx-auto">
          A página que você procura não existe ou foi movida.
        </p>
        <Link
          href="/"
          className="bg-drumond-orange text-black px-8 py-3 rounded-full font-display text-lg uppercase italic font-bold hover:scale-105 transition-transform inline-block"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}