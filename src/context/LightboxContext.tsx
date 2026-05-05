"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface LightboxContextType {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  open: (images: string[], index?: number) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
}

const LightboxContext = createContext<LightboxContextType | undefined>(undefined);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const open = (imgs: string[], index = 0) => {
    setImages(imgs);
    setCurrentIndex(index);
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);
  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <LightboxContext.Provider value={{ isOpen, images, currentIndex, open, close, next, prev }}>
      {children}
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox must be used within LightboxProvider");
  return ctx;
}