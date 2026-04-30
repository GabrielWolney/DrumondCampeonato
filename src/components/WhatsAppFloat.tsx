"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

interface Config {
  whatsapp_number: string;
  whatsapp_message: string;
}

export default function WhatsAppFloat() {
  const [config, setConfig] = useState<Config | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      const { data, error } = await supabase
        .from("site_config")
        .select("key, value")
        .in("key", ["whatsapp_number", "whatsapp_message"]);

      if (error) {
        console.error("Erro ao carregar WhatsApp config:", error);
        return;
      }

      const configObj: Record<string, string> = {};
      data?.forEach((item) => {
        configObj[item.key] = item.value;
      });

      if (configObj.whatsapp_number) {
        setConfig({
          whatsapp_number: configObj.whatsapp_number,
          whatsapp_message:
            configObj.whatsapp_message ||
            "Olá! Gostaria de mais informações sobre o Nacional de Sinuca.",
        });
      }
    }
    loadConfig();
  }, []);

  if (!config?.whatsapp_number) return null;

  const encodedMessage = encodeURIComponent(config.whatsapp_message);
  const whatsappLink = `https://wa.me/${config.whatsapp_number}?text=${encodedMessage}`;

  // Estilo glass consistente com o restante do site
  const glassStyle =
    "bg-[#101820]/80 backdrop-blur-xl border border-white/10 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.8)]";

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2">
      {/* Card que aparece quando o botão é clicado */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`${glassStyle} rounded-2xl px-5 py-4 max-w-[220px] relative`}
          >
            {/* Seta inferior apontando para o botão */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-[#101820]/80 backdrop-blur-xl border-r border-b border-white/10 rotate-45" />
            <p className="text-white text-sm leading-relaxed">
              Falar com a organização
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors w-fit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.032 2.014c-5.504 0-9.972 4.468-9.972 9.972 0 1.755.458 3.476 1.318 4.98L2.02 21.99l5.133-1.274c1.468.802 3.12 1.228 4.822 1.228 5.504 0 9.972-4.468 9.972-9.973 0-5.503-4.468-9.97-9.972-9.97zm-.005 15.165c-1.356 0-2.672-.365-3.801-1.05l-3.182.845.894-3.105c-.737-1.16-1.124-2.48-1.124-3.86 0-4.298 3.497-7.795 7.795-7.795 4.3 0 7.796 3.497 7.796 7.795 0 4.3-3.497 7.797-7.796 7.797zm4.233-5.977c-.234-.116-1.395-.688-1.61-.766-.216-.08-.373-.116-.53.116-.157.233-.607.766-.744.924-.137.157-.273.177-.51.058-.236-.117-.997-.367-1.897-1.172-.702-.627-1.174-1.4-1.312-1.637-.137-.236-.014-.365.104-.484.107-.107.236-.28.354-.42.117-.14.157-.234.236-.39.078-.156.039-.293-.02-.41-.058-.117-.53-1.278-.726-1.748-.192-.46-.386-.39-.53-.398-.136-.008-.293-.008-.45-.008-.156 0-.41.058-.625.293-.215.234-.82.8-.82 1.953 0 1.153.84 2.266.958 2.424.117.157 1.645 2.514 3.99 3.523.558.24.993.383 1.332.49.56.18 1.07.155 1.474.094.45-.068 1.396-.57 1.594-1.122.197-.55.197-1.02.138-1.118-.058-.098-.215-.157-.45-.273z" />
              </svg>
              WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão flutuante com vidro escuro, sem pulso */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`${glassStyle} rounded-full p-4 transition-all flex items-center justify-center`}
        aria-label="Abrir WhatsApp"
        aria-expanded={isOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="#25D366"
        >
          <path d="M12.032 2.014c-5.504 0-9.972 4.468-9.972 9.972 0 1.755.458 3.476 1.318 4.98L2.02 21.99l5.133-1.274c1.468.802 3.12 1.228 4.822 1.228 5.504 0 9.972-4.468 9.972-9.973 0-5.503-4.468-9.97-9.972-9.97zm-.005 15.165c-1.356 0-2.672-.365-3.801-1.05l-3.182.845.894-3.105c-.737-1.16-1.124-2.48-1.124-3.86 0-4.298 3.497-7.795 7.795-7.795 4.3 0 7.796 3.497 7.796 7.795 0 4.3-3.497 7.797-7.796 7.797zm4.233-5.977c-.234-.116-1.395-.688-1.61-.766-.216-.08-.373-.116-.53.116-.157.233-.607.766-.744.924-.137.157-.273.177-.51.058-.236-.117-.997-.367-1.897-1.172-.702-.627-1.174-1.4-1.312-1.637-.137-.236-.014-.365.104-.484.107-.107.236-.28.354-.42.117-.14.157-.234.236-.39.078-.156.039-.293-.02-.41-.058-.117-.53-1.278-.726-1.748-.192-.46-.386-.39-.53-.398-.136-.008-.293-.008-.45-.008-.156 0-.41.058-.625.293-.215.234-.82.8-.82 1.953 0 1.153.84 2.266.958 2.424.117.157 1.645 2.514 3.99 3.523.558.24.993.383 1.332.49.56.18 1.07.155 1.474.094.45-.068 1.396-.57 1.594-1.122.197-.55.197-1.02.138-1.118-.058-.098-.215-.157-.45-.273z" />
        </svg>
      </motion.button>
    </div>
  );
}