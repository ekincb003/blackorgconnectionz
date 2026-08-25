'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

export default function LiveCampusClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return (
      <div className="flex items-center gap-2 text-xs text-neutral-400 animate-pulse">
        <Clock className="w-3.5 h-3.5 text-gold-400" /> Loading campus time...
      </div>
    );
  }

  // Format: "Sunday, August 23, 2026"
  const dayName = time.toLocaleDateString(undefined, { weekday: 'long' });
  const monthName = time.toLocaleDateString(undefined, { month: 'long' });
  const numericDate = time.getDate();
  const year = time.getFullYear();

  // Format: "8:15:30 PM"
  const timeString = time.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-medium text-neutral-300 bg-black/40 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-white/10 shadow-sm backdrop-blur-md">
      <div className="flex items-center gap-1 text-gold-400 font-semibold truncate">
        <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold-400 shrink-0" />
        <span>
          <span className="hidden md:inline">{dayName}, </span>
          <span>{monthName.slice(0, 3)} {numericDate}</span>
          <span className="hidden sm:inline">, {year}</span>
        </span>
      </div>
      <span className="text-neutral-500">•</span>
      <div className="flex items-center gap-1 text-white font-bold font-mono shrink-0">
        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold-400 shrink-0" />
        <span>{timeString}</span>
      </div>
    </div>
  );
}
