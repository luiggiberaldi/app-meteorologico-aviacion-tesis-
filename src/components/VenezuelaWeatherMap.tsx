"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Loader2, Satellite } from "lucide-react";

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
      <div className="p-4 md:p-5 border-b border-gray-700 bg-[#0f172a] flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500/20 p-2 rounded-lg">
            <span className="text-xl">🇻🇪</span>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg leading-tight">Mapa Meteorológico Nacional</h3>
            <p className="text-xs text-gray-400 mt-0.5">20 estaciones con datos en tiempo real</p>
          </div>
        </div>
        <Link 
          href="/imagenes-satelitales" 
          className="flex items-center gap-2 bg-[#00d4aa]/10 hover:bg-[#00d4aa]/20 text-[#00d4aa] px-4 py-2 rounded-lg border border-[#00d4aa]/30 transition-all group text-sm font-semibold"
        >
          <Satellite className="w-4 h-4 group-hover:animate-pulse" />
          <span>Abrir Centro Satelital</span>
        </Link>
      </div>
      
      <div className="p-0 relative z-0">
        <MapContent />
      </div>
    </div>
  );
}
