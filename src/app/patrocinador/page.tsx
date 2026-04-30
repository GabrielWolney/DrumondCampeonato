import { Metadata } from "next";
import Link from "next/link";
import { FaTrophy, FaBroadcastTower, FaUsers, FaMedal, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

export const metadata: Metadata = {
  title: "Seja um Patrocinador | Nacional de Sinuca",
  description:
    "Associe sua marca ao maior evento de sinuca do Brasil. Confira nossos diferenciais e fale com a organização.",
};

const diferenciais = [
  {
    icon: <FaTrophy className="text-xl" />,
    titulo: "Estrutura Profissional",
    descricao:
      "Arena montada com padrões internacionais, mesas oficiais e equipamentos de última geração, garantindo a melhor performance para os atletas e espetáculo visual.",
  },
  {
    icon: <FaBroadcastTower className="text-xl" />,
    titulo: "Transmissão ao Vivo",
    descricao:
      "Cobertura completa com transmissão de alta qualidade para canais digitais, ampliando o alcance da sua marca para todo o território nacional.",
  },
  {
    icon: <FaUsers className="text-xl" />,
    titulo: "Público Engajado",
    descricao:
      "A sinuquinha é um fenômeno popular no Brasil. Conecte sua marca a um público apaixonado, diversificado e altamente engajado nas redes sociais.",
  },
  {
    icon: <FaMedal className="text-xl" />,
    titulo: "Premiação Recorde",
    descricao:
      "A maior premiação da história da modalidade, atraindo os melhores jogadores do Brasil e gerando mídia espontânea significativa.",
  },
  {
    icon: <MdVerified className="text-xl" />,
    titulo: "Selo Drumond Sports",
    descricao:
      "Organização impecável com a chancela de quem possui mais de 50 anos de excelência na realização de grandes eventos esportivos.",
  },
  {
    icon: <FaMapMarkerAlt className="text-xl" />,
    titulo: "Localização Estratégica",
    descricao:
      "Realizado em Brasília/DF, o centro do poder e decisões do país, facilitando o networking corporativo e governamental de alto nível.",
  },
];

export default function PatrocinadorPage() {
  const glassStyle =
    "bg-white/10 backdrop-blur-[12px] border border-white/20 shadow-[0_20px_50px_0_rgba(0,0,0,0.3),inset_1px_1px_2px_0_rgba(255,255,255,0.1)]";

  return (
    <>
      {/* Fundo ambiente (idêntico ao das outras páginas) */}
      <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 70% 50% at 10% 10%, rgba(248,141,42,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 30%, rgba(255,255,255,0.03) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 20% 80%, rgba(248,141,42,0.05) 0%, transparent 60%), radial-gradient(ellipse 65% 55% at 85% 85%, rgba(255,255,255,0.02) 0%, transparent 60%), #101820`,
          }}
        />
      </div>

      <main className="relative z-10 min-h-screen pt-28 md:pt-44 pb-16 md:pb-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <section className="text-center mb-12 md:mb-20">
            <h1 className="font-display text-4xl md:text-7xl text-white uppercase italic leading-tight mb-4">
              Seja um <span className="text-drumond-orange">Patrocinador</span>
            </h1>
            <div className="w-16 h-[2px] bg-drumond-orange/60 mx-auto mb-6" />
            <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Posicione sua marca ao lado do maior evento de sinuca do Brasil e conecte-se a um público apaixonado por esporte e entretenimento.
            </p>

            {/* Botão WhatsApp no hero (restaurado) */}
            <div className="mt-8 flex justify-center">
              <a
                href="https://wa.me/5561992958172?text=Olá!%20Tenho%20interesse%20em%20patrocinar%20o%201º%20Nacional%20de%20Sinuquinha."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-display text-lg uppercase italic tracking-wider transition-colors shadow-lg"
              >
                <FaWhatsapp className="text-xl" />
                Falar com a organização
              </a>
            </div>
          </section>

          {/* Diferenciais */}
          <section className="mb-12 md:mb-20">
            <h2 className="font-display text-2xl md:text-3xl text-white text-center uppercase italic mb-8 md:mb-12">
              Diferenciais do Evento
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {diferenciais.map((item) => (
                <div
                  key={item.titulo}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 hover:border-drumond-orange/40 transition-all duration-300 group"
                >
                  <div className="w-8 h-[2px] bg-drumond-orange mb-4 group-hover:w-12 transition-all duration-300" />
                  <div className="flex items-start gap-3">
                    <span className="text-drumond-orange mt-0.5 shrink-0">{item.icon}</span>
                    <div>
                      <h3 className="font-display text-lg md:text-xl text-white mb-2">{item.titulo}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{item.descricao}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contato final – glass style consistente */}
          <section className="max-w-3xl mx-auto mb-12 md:mb-20">
            <div className={`${glassStyle} rounded-[40px] p-8 md:p-10 text-center`}>
              <h2 className="font-display text-2xl md:text-3xl text-white uppercase italic mb-4">
                Pronto para patrocinar?
              </h2>
              <p className="text-gray-300 text-sm md:text-base mb-8 max-w-xl mx-auto">
                Fale diretamente com nossa equipe e descubra as cotas disponíveis para sua marca.
              </p>
              <a
                href="https://wa.me/5561992958172?text=Olá!%20Tenho%20interesse%20em%20patrocinar%20o%201º%20Nacional%20de%20Sinuquinha."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-full font-display text-lg md:text-xl uppercase italic tracking-wider transition-colors shadow-lg"
              >
                <FaWhatsapp className="text-2xl" />
                WhatsApp
              </a>
            </div>
          </section>

          {/* Voltar – botão discreto com borda */}
          <div className="flex justify-start max-w-6xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 border border-white/30 hover:bg-white/10 text-white px-5 py-2 rounded-full text-sm uppercase tracking-wider transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Início
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}