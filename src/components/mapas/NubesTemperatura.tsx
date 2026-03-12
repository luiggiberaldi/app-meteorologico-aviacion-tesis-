"use client";

import { useState } from 'react';
import { useBaseContext } from '@/context/BaseContext';

export default function NubesTemperatura() {
  const [capaActiva, setCapaActiva] = useState<'clouds' | 'temp'>('clouds');
  const { selectedBase } = useBaseContext();
  
  const lat = selectedBase ? selectedBase.latitud : 8.0;
  const lon = selectedBase ? selectedBase.longitud : -66.0;
  const zoom = selectedBase ? 8 : 6;

  // URL del iframe de Windy configurado para Nubes o Temperatura
  const windyUrl = `https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=%C2%B0C&metricWind=km/h&zoom=${zoom}&overlay=${capaActiva}&product=ecmwf&level=surface&lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&marker=true&message=true`;

  return (
    <div className="relative h-[600px] w-full bg-[#252d3d] overflow-hidden rounded-xl border border-[#364156]">
      <iframe 
        key={capaActiva} // Forzar re-render cuando cambia la capa
        className="w-full h-full border-none"
        src={windyUrl}
        title="Windy Nubes y Temperatura"
        loading="lazy"
        allow="fullscreen"
      ></iframe>
      
      {/* Controles Flotantes para cambiar capa */}
      <div className="absolute top-4 right-4 z-10 bg-[#1a1f2e]/90 backdrop-blur-md p-2 rounded-xl border border-[#364156] shadow-2xl flex flex-col gap-2">
        <button
          onClick={() => setCapaActiva('clouds')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
            capaActiva === 'clouds' 
            ? 'bg-[#00d4aa] text-[#1a1f2e] shadow-[0_0_10px_rgba(0,212,170,0.3)]' 
            : 'bg-[#252d3d] text-gray-300 hover:bg-[#364156]'
          }`}
        >
          Cobertura Nubosa
        </button>
        <button
          onClick={() => setCapaActiva('temp')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
            capaActiva === 'temp' 
            ? 'bg-[#00d4aa] text-[#1a1f2e] shadow-[0_0_10px_rgba(0,212,170,0.3)]' 
            : 'bg-[#252d3d] text-gray-300 hover:bg-[#364156]'
          }`}
        >
          Mapa Térmico
        </button>
      </div>

      {/* Indicador de Capa */}
      <div className="absolute top-4 left-4 z-10 bg-[#1a1f2e]/90 backdrop-blur-md px-4 py-2 rounded-lg border border-[#364156] shadow-lg pointer-events-none">
        <h3 className="text-white font-bold text-sm flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${capaActiva === 'clouds' ? 'bg-gray-400' : 'bg-red-500'} animate-pulse`}></span>
          {capaActiva === 'clouds' ? 'Modelo Nuboso Global' : 'Temperaturas de Superficie'}
        </h3>
      </div>
    </div>
  );
}
