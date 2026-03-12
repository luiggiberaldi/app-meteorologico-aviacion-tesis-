"use client";

import { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useBaseContext } from '@/context/BaseContext';

export default function NubesTemperatura() {
  const [capaActiva, setCapaActiva] = useState<'nubes' | 'temperatura'>('nubes');
  const [opacidad, setOpacidad] = useState(80);
  const { selectedBase } = useBaseContext();
  const mapCenter: [number, number] = selectedBase ? [selectedBase.latitud, selectedBase.longitud] : [8.0, -66.0];

  const API_KEY = process.env.NEXT_PUBLIC_OWM_API_KEY || 'b6907d289e10d714a6e88b30761fae22'; // Clave demo, se debe cambiar en entorno real.

  return (
    <div className="relative h-[600px] w-full bg-[#252d3d] overflow-hidden">
      <MapContainer
        key={selectedBase ? selectedBase.id : 'nacional'}
        center={mapCenter}
        zoom={selectedBase ? 9 : 6}
        className="h-full w-full z-0"
        zoomControl={true}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OSM contributors &copy; CARTO'
        />
        
        {/* Capa Condicional de OpenWeatherMap */}
        {capaActiva === 'nubes' ? (
          <TileLayer
            key="nubes"
            url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
            opacity={opacidad / 100}
            zIndex={10}
            attribution='Map data &copy; OpenWeatherMap'
          />
        ) : (
          <TileLayer
            key="temperatura"
            url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
            opacity={opacidad / 100}
            zIndex={10}
            attribution='Map data &copy; OpenWeatherMap'
          />
        )}
      </MapContainer>

      {/* Panel de Controles Flotante */}
      <div className="absolute top-4 right-4 z-[400] bg-[#1a1f2e]/90 backdrop-blur-md p-4 rounded-xl border border-[#364156] shadow-2xl w-64">
        <h3 className="text-white font-bold mb-4">Selector de Capa</h3>

        {/* Tipo de capa */}
        <div className="flex rounded-lg overflow-hidden border border-[#364156] mb-4">
          <button
            onClick={() => setCapaActiva('nubes')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${capaActiva === 'nubes' ? 'bg-[#00d4aa] text-[#1a1f2e]' : 'bg-[#252d3d] text-gray-400 hover:text-white'}`}
          >
            Nubosidad
          </button>
          <button
            onClick={() => setCapaActiva('temperatura')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${capaActiva === 'temperatura' ? 'bg-[#00d4aa] text-[#1a1f2e]' : 'bg-[#252d3d] text-gray-400 hover:text-white'}`}
          >
            Temperatura
          </button>
        </div>

        {/* Opacidad */}
        <div>
          <label className="text-sm text-gray-400 flex justify-between mb-1">
            <span>Opacidad</span>
            <span className="text-[#00d4aa]">{opacidad}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={opacidad}
            onChange={(e) => setOpacidad(Number(e.target.value))}
            className="w-full h-1.5 bg-[#252d3d] rounded-lg appearance-none cursor-pointer accent-[#00d4aa]"
          />
        </div>
        
        {!process.env.NEXT_PUBLIC_OWM_API_KEY && (
          <div className="mt-4 text-xs text-[#fbbf24] bg-[#fbbf24]/10 p-2 rounded border border-[#fbbf24]/30">
            <strong>Nota:</strong> Usando API Key de demostración. Configura NEXT_PUBLIC_OWM_API_KEY en tu entorno.
          </div>
        )}
      </div>

      {/* Leyendas Condicionales */}
      {capaActiva === 'temperatura' && (
        <div className="absolute bottom-6 mx-auto left-0 right-0 w-[450px] z-[400] bg-[#1a1f2e]/90 backdrop-blur-md p-3 rounded-xl border border-[#364156] shadow-2xl flex flex-col items-center">
          <h3 className="text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Temperatura (°C)</h3>
          <div className="w-full flex h-3 rounded overflow-hidden">
            <div className="flex-1 bg-purple-600" title="< -40°C"></div>
            <div className="flex-1 bg-blue-500" title="-40°C a 0°C"></div>
            <div className="flex-1 bg-green-500" title="0°C a 15°C"></div>
            <div className="flex-1 bg-yellow-400" title="15°C a 25°C"></div>
            <div className="flex-1 bg-orange-500" title="25°C a 35°C"></div>
            <div className="flex-1 bg-red-600" title="> 35°C"></div>
          </div>
          <div className="w-full flex justify-between text-[10px] text-gray-400 mt-1 px-1">
            <span>-40</span>
            <span>0</span>
            <span>15</span>
            <span>25</span>
            <span>35</span>
            <span>40+</span>
          </div>
        </div>
      )}
      
      {capaActiva === 'nubes' && (
        <div className="absolute bottom-6 mx-auto left-0 right-0 w-[300px] z-[400] bg-[#1a1f2e]/90 backdrop-blur-md p-3 rounded-xl border border-[#364156] shadow-2xl flex flex-col items-center">
          <h3 className="text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Densidad de Nubosidad (%)</h3>
          <div className="w-full flex h-3 rounded overflow-hidden">
            <div className="flex-1 bg-gray-600/20" title="0%"></div>
            <div className="flex-1 bg-gray-500/50" title="50%"></div>
            <div className="flex-1 bg-gray-300" title="100%"></div>
          </div>
          <div className="w-full flex justify-between text-[10px] text-gray-400 mt-1 px-1">
            <span>Despejado</span>
            <span>Parcial</span>
            <span>Cubierto</span>
          </div>
        </div>
      )}
    </div>
  );
}
