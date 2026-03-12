"use client";

import { useState } from 'react';
import { useBaseContext } from '@/context/BaseContext';

export default function Vientos() {
  // Windy soporta 'surface', '850h', '500h', '250h', etc. Usamos las equivalencias
  const [altura, setAltura] = useState<'surface' | '850h' | '500h' | '250h'>('surface');
  const { selectedBase } = useBaseContext();

  const lat = selectedBase ? selectedBase.latitud : 8.0;
  const lon = selectedBase ? selectedBase.longitud : -66.0;
  const zoom = selectedBase ? 7 : 6;

  // URL del iframe de Windy configurado para Vientos
  const windyUrl = `https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=%C2%B0C&metricWind=kt&zoom=${zoom}&overlay=wind&product=ecmwf&level=${altura}&lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&marker=true&message=true`;

  return (
    <div className="relative h-[600px] w-full bg-[#252d3d] overflow-hidden rounded-xl border border-[#364156]">
      <iframe 
        key={altura} // Re-render rápido al cambiar altura 
        className="w-full h-full border-none"
        src={windyUrl}
        title="Windy Corrientes de Viento"
        loading="lazy"
        allow="fullscreen"
      ></iframe>

      {/* Control Altitud */}
      <div className="absolute top-4 right-4 z-[400] bg-[#1a1f2e]/90 backdrop-blur-md p-3 rounded-xl border border-[#364156] shadow-2xl flex flex-col gap-2 w-48">
        <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-1">Nivel de Vuelo (Altitud)</h3>
        
        <div className="space-y-2 flex flex-col">
          {[
            { id: 'surface', label: 'Superficie', info: 'SFC' },
            { id: '850h', label: '850 hPa', info: '~FL050' },
            { id: '500h', label: '500 hPa', info: '~FL180' },
            { id: '250h', label: '250 hPa', info: '~FL340' }
          ].map((alt) => (
            <button
              key={alt.id}
              onClick={() => setAltura(alt.id as any)}
              className={`flex justify-between items-center px-3 py-2 rounded-lg transition-colors text-sm ${
                altura === alt.id 
                  ? 'bg-[#00d4aa] text-[#1a1f2e] shadow-[0_0_10px_rgba(0,212,170,0.3)] font-bold' 
                  : 'bg-[#252d3d] text-gray-300 hover:bg-[#364156]'
              }`}
            >
              <span>{alt.label}</span>
              <span className={`text-[10px] ${altura === alt.id ? 'text-[#1a1f2e]' : 'text-gray-500'}`}>{alt.info}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Indicador de Capa */}
      <div className="absolute top-4 left-4 z-10 bg-[#1a1f2e]/90 backdrop-blur-md px-4 py-2 rounded-lg border border-[#364156] shadow-lg pointer-events-none">
        <h3 className="text-white font-bold text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00d4aa] animate-pulse"></span>
          Corrientes de Viento Animadas
        </h3>
      </div>
    </div>
  );
}
