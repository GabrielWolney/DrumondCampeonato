"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLightbox } from "@/context/LightboxContext";

export default function PhotoLightbox() {
  const { isOpen, images, currentIndex, close, next, prev } = useLightbox();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, close, next, prev]);

  if (!isOpen || images.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-sm flex items-center justify-center"
        onClick={close}
      >
        <motion.div
          className="relative max-w-[90vw] max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
        >
          <Image
            src={images[currentIndex]}
            alt={`Foto ${currentIndex + 1}`}
            width={1200}
            height={800}
            className="object-contain max-h-[85vh] rounded-2xl"
            priority
          />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-drumond-orange transition"
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-drumond-orange transition"
              >
                ›
              </button>
            </>
          )}
          <button
            onClick={close}
            className="absolute top-2 right-2 bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-600"
          >
            ✕
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}