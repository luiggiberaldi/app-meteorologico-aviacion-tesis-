"use client";

import { useEffect, useState } from "react";
import { Plane } from "lucide-react";

export default function Topbar() {
  const [timeUTC, setTimeUTC] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeUTC(
        now.toISOString().substring(11, 19) + " UTC"
      );
    };
    
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-[#1e293b] border-b border-gray-700 flex items-center justify-between px-4 lg:px-6 shadow-md shrink-0">
      {/* Logo & Titulo */}
      <div className="flex items-center space-x-3">
        <div className="bg-[#10b981] p-2 rounded-md">
          <Plane className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm md:text-base font-bold text-white tracking-wide">
            SERMETAVIA <span className="hidden sm:inline-block font-normal text-gray-400 mx-1">|</span> <span className="hidden sm:inline-block text-gray-300 font-medium tracking-normal text-sm">Base Aérea Logística BARAGUA</span>
          </h1>
          <p className="sm:hidden text-xs text-gray-400">Maracay, Aragua</p>
        </div>
      </div>

      {/* Reloj UTC */}
      <div className="flex items-center space-x-2 bg-black/30 px-3 py-1.5 rounded border border-gray-600">
        <span className="text-xs text-gray-400 font-mono">HORA ZULU</span>
        <span className="text-sm font-bold text-[#f59e0b] font-mono tracking-widest">{timeUTC || "00:00:00 UTC"}</span>
      </div>
    </header>
  );
}
