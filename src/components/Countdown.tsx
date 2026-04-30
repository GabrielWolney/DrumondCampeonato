"use client";

import { useState, useEffect } from "react";
import { useConfig } from "@/hooks/useConfig";

const Separator = () => (
  <div className="w-[1px] h-[30px] bg-white/20 self-center mx-[5px]" />
);

export default function Countdown() {
  const { config, loading: configLoading } = useConfig();
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  useEffect(() => {
    const mountTimeout = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(mountTimeout);
  }, []);

  useEffect(() => {
    if (!mounted || configLoading || !config.event_date) return;

    const eventDate = new Date(config.event_date).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const gap = eventDate - now;

      if (gap < 0) {
        setTimeLeft((prev) => ({ ...prev, isOver: true }));
        return;
      }

      setTimeLeft({
        days: Math.floor(gap / (1000 * 60 * 60 * 24)),
        hours: Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((gap % (1000 * 60)) / 1000),
        isOver: false,
      });
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, [mounted, configLoading, config.event_date]);

  if (!mounted || configLoading) {
    return <div className="h-[60px] opacity-0" />;
  }

  if (timeLeft.isOver) {
    return (
      <div className="text-center font-display text-2xl md:text-4xl text-drumond-orange uppercase italic">
        O Campeonato Começou!
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center gap-2 md:gap-4">
      <div className="flex flex-col items-center min-w-[55px] md:min-w-[70px]">
        <span className="font-display text-3xl md:text-5xl text-white leading-none">
          {timeLeft.days}
        </span>
        <span className="text-[0.65rem] md:text-[0.7rem] font-bold tracking-[0.2em] text-drumond-orange mt-1 uppercase">
          Dias
        </span>
      </div>
      <Separator />
      <div className="flex flex-col items-center min-w-[55px] md:min-w-[70px]">
        <span className="font-display text-3xl md:text-5xl text-white leading-none">
          {timeLeft.hours.toString().padStart(2, "0")}
        </span>
        <span className="text-[0.65rem] md:text-[0.7rem] font-bold tracking-[0.2em] text-drumond-orange mt-1 uppercase">
          Horas
        </span>
      </div>
      <Separator />
      <div className="flex flex-col items-center min-w-[55px] md:min-w-[70px]">
        <span className="font-display text-3xl md:text-5xl text-white leading-none">
          {timeLeft.minutes.toString().padStart(2, "0")}
        </span>
        <span className="text-[0.65rem] md:text-[0.7rem] font-bold tracking-[0.2em] text-drumond-orange mt-1 uppercase">
          Min
        </span>
      </div>
      <Separator />
      <div className="flex flex-col items-center min-w-[55px] md:min-w-[70px]">
        <span className="font-display text-3xl md:text-5xl text-white leading-none">
          {timeLeft.seconds.toString().padStart(2, "0")}
        </span>
        <span className="text-[0.65rem] md:text-[0.7rem] font-bold tracking-[0.2em] text-drumond-orange mt-1 uppercase">
          Seg
        </span>
      </div>
    </div>
  );
}