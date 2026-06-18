"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, PanInfo } from "framer-motion";
import { useLightbox } from "@/context/LightboxContext";

export interface Foto {
  id: string;
  image_url: string;
  ordem: number;
}

function CarouselImage({ url, index, isPriority }: { url: string; index: number; isPriority: boolean }) {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <>
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#101820] overflow-hidden z-10 rounded-2xl">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-drumond-orange/20 to-transparent" />
        </div>
      )}
      <Image
        src={url}
        alt={`Estrutura - Foto ${index + 1}`}
        fill
        className={`object-cover rounded-2xl transition-opacity duration-700 pointer-events-none ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        sizes="(max-width: 768px) 65vw, 260px"
        priority={isPriority}
        loading={isPriority ? "eager" : "lazy"}
        onLoad={() => setIsLoaded(true)}
      />
    </>
  );
}

interface PhotoCarouselProps {
  fotos: Foto[];
}

export default function PhotoCarousel({ fotos }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { open } = useLightbox();

  if (!fotos || fotos.length === 0) return null;

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % fotos.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + fotos.length) % fotos.length);

  const handleSwipe = (_e: Event, { offset }: PanInfo) => {
    if (offset.x < -40) nextSlide();
    if (offset.x > 40) prevSlide();
  };

  const variants = {
    center:      { x: "0%",    scale: 1,    zIndex: 50, opacity: 1,   rotateY: 0  },
    right1:      { x: "70%",   scale: 0.85, zIndex: 40, opacity: 1,   rotateY: -15 },
    left1:       { x: "-70%",  scale: 0.85, zIndex: 40, opacity: 1,   rotateY: 15  },
    right2:      { x: "130%",  scale: 0.7,  zIndex: 30, opacity: 0.6, rotateY: -25 },
    left2:       { x: "-130%", scale: 0.7,  zIndex: 30, opacity: 0.6, rotateY: 25  },
    hiddenRight: { x: "160%",  scale: 0.5,  zIndex: 10, opacity: 0,   rotateY: -30 },
    hiddenLeft:  { x: "-160%", scale: 0.5,  zIndex: 10, opacity: 0,   rotateY: 30  },
  };

  return (
    <div className="relative w-full max-w-[100vw] overflow-hidden group py-10">
      <div
        className="relative w-full h-[360px] md:h-[400px] flex items-center justify-center"
        style={{ perspective: "1000px" }}
      >
        {fotos.map((item, idx) => {
          let diff = idx - currentIndex;
          const n = fotos.length;
          if (diff > Math.floor(n / 2)) diff -= n;
          else if (diff < -Math.floor(n / 2)) diff += n;

          let variant = "center";
          if (diff === 1) variant = "right1";
          else if (diff === -1) variant = "left1";
          else if (diff === 2) variant = "right2";
          else if (diff === -2) variant = "left2";
          else if (diff > 2) variant = "hiddenRight";
          else if (diff < -2) variant = "hiddenLeft";
          const isCenter = diff === 0;

          return (
            <motion.div
              key={item.id}
              variants={variants}
              animate={variant}
              initial={false}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              drag={isCenter ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={isCenter ? handleSwipe : undefined}
              onClick={() => {
                if (!isCenter) {
                  setCurrentIndex(idx);
                }
              }}
              onDoubleClick={() => {
                if (isCenter) {
                  open(fotos.map(f => f.image_url), currentIndex);
                }
              }}
              className={`absolute shadow-[0_15px_40px_rgba(0,0,0,0.4)] border-2 border-drumond-orange/40 bg-[#101820] rounded-2xl overflow-hidden ${
                isCenter ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
              }`}
              style={{ width: "min(65vw, 260px)", aspectRatio: "3/4" }}
            >
              <CarouselImage url={item.image_url} index={idx} isPriority={Math.abs(diff) <= 1} />
              {isCenter && (
                <div className="absolute bottom-3 right-3 z-20 pointer-events-none">
                  <span className="hidden md:inline text-[10px] text-white/40 font-medium tracking-wider">
                    2× para ampliar
                  </span>
                  <span className="md:hidden text-[10px] text-white/40 font-medium tracking-wider">
                    toque 2×
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-[#101820]/90 border border-drumond-orange/50 backdrop-blur-sm text-drumond-orange rounded-full items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-drumond-orange hover:text-[#101820] hover:scale-110"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-[#101820]/90 border border-drumond-orange/50 backdrop-blur-sm text-drumond-orange rounded-full items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-drumond-orange hover:text-[#101820] hover:scale-110"
      >
        ›
      </button>
    </div>
  );
}