"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import the Map component that uses window/leaflet
const MapContent = dynamic(() => import("./MapContent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-900 rounded-xl flex items-center justify-center border border-gray-800">
      <div className="flex flex-col items-center gap-4 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p>Cargando Mapa Nacional...</p>
      </div>
    </div>
  ),
});

export default function VenezuelaWeatherMap() {
  return (
    <div className="bg-[#1e293b] border border-gray-700 rounded-xl overflow-hidden shadow-lg">
      <div className="p-5 border-b border-gray-700 bg-[#0f172a] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500/20 p-2 rounded-lg">
            <span className="text-xl">🇻🇪</span>
          </div>
          <h3 className="font-bold text-white text-lg">Mapa Meteorológico Nacional</h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#10b981]"></span> Militar</span>
          <span className="flex items-center gap-1 ml-2"><span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span> Civil</span>
        </div>
      </div>
      
      <div className="p-0 relative z-0">
        <MapContent />
      </div>
    </div>
  );
}
