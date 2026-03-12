"use client";

import { useBaseContext } from '@/context/BaseContext';

export default function PresionFrentes() {
  const { selectedBase } = useBaseContext();

  const lat = selectedBase ? selectedBase.latitud : 8.0;
  const lon = selectedBase ? selectedBase.longitud : -66.0;
  const zoom = selectedBase ? 7 : 6;

  // URL del iframe de Windy configurado para Presión Atmosférica MSL
  const windyUrl = `https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=%C2%B0C&metricWind=km/h&zoom=${zoom}&overlay=pressure&product=ecmwf&level=surface&lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&marker=true&message=true`;

  return (
    <div className="relative h-[600px] w-full bg-[#252d3d] overflow-hidden rounded-xl border border-[#364156]">
      <iframe 
        className="w-full h-full border-none"
        src={windyUrl}
        title="Windy Presión Atmosférica"
        loading="lazy"
        allow="fullscreen"
      ></iframe>

      {/* Indicador de Capa */}
      <div className="absolute top-4 left-4 z-10 bg-[#1a1f2e]/90 backdrop-blur-md px-4 py-2 rounded-lg border border-[#364156] shadow-lg pointer-events-none flex flex-col">
        <h3 className="text-white font-bold text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          Presión Atmosférica Superficial (MSL)
        </h3>
        <span className="text-xs text-gray-400 mt-1 ml-4">Isobaras globales para identificación de frentes</span>
      </div>
    </div>
  );
}
