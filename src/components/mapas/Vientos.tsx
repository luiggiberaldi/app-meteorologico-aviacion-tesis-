"use client";

import { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useBaseContext } from '@/context/BaseContext';

export default function Vientos() {
  const [altura, setAltura] = useState<'superficie' | '850.0' | '500.0' | '200.0'>('superficie');
  const [opacidad, setOpacidad] = useState(80);
  const { selectedBase } = useBaseContext();
  const mapCenter: [number, number] = selectedBase ? [selectedBase.latitud, selectedBase.longitud] : [8.0, -66.0];

  const API_KEY = process.env.NEXT_PUBLIC_OWM_API_KEY || 'b6907d289e10d714a6e88b30761fae22';

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
        
        {/* Capa de Vientos */}
        <TileLayer
          key={`vientos-${altura}`}
          url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
          opacity={opacidad / 100}
          zIndex={10}
          attribution='Map data &copy; OpenWeatherMap'
        />
      </MapContainer>

      {/* Panel de Controles Flotante */}
      <div className="absolute top-4 right-4 z-[400] bg-[#1a1f2e]/90 backdrop-blur-md p-4 rounded-xl border border-[#364156] shadow-2xl w-64">
        <h3 className="text-white font-bold mb-4">Corrientes de Viento</h3>

        {/* Altura */}
        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-300 mb-2 block">Nivel de Presión / Altura</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setAltura('superficie')}
              className={`py-1.5 text-xs font-medium rounded transition-colors ${altura === 'superficie' ? 'bg-[#00d4aa] text-[#1a1f2e]' : 'bg-[#252d3d] text-gray-400 border border-[#364156] hover:text-white'}`}
            >
              Superficie
            </button>
            <button
              onClick={() => setAltura('850.0')}
              className={`py-1.5 text-xs font-medium rounded transition-colors ${altura === '850.0' ? 'bg-[#00d4aa] text-[#1a1f2e]' : 'bg-[#252d3d] text-gray-400 border border-[#364156] hover:text-white'}`}
            >
              850 hPa
            </button>
            <button
              onClick={() => setAltura('500.0')}
              className={`py-1.5 text-xs font-medium rounded transition-colors ${altura === '500.0' ? 'bg-[#00d4aa] text-[#1a1f2e]' : 'bg-[#252d3d] text-gray-400 border border-[#364156] hover:text-white'}`}
            >
              500 hPa
            </button>
            <button
              onClick={() => setAltura('200.0')}
              className={`py-1.5 text-xs font-medium rounded transition-colors ${altura === '200.0' ? 'bg-[#00d4aa] text-[#1a1f2e]' : 'bg-[#252d3d] text-gray-400 border border-[#364156] hover:text-white'}`}
            >
              200 hPa
            </button>
          </div>
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
      </div>

      {/* Leyenda Condicional */}
      <div className="absolute bottom-6 mx-auto left-0 right-0 w-[450px] z-[400] bg-[#1a1f2e]/90 backdrop-blur-md p-3 rounded-xl border border-[#364156] shadow-2xl flex flex-col items-center">
        <h3 className="text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Velocidad del Viento (km/h)</h3>
        <div className="w-full flex h-3 rounded overflow-hidden">
          <div className="flex-1 bg-green-500" title="0-10 km/h (Calma)"></div>
          <div className="flex-1 bg-yellow-400" title="10-30 km/h (Brisa)"></div>
          <div className="flex-1 bg-orange-500" title="30-50 km/h (Moderado)"></div>
          <div className="flex-1 bg-red-600" title="50-70 km/h (Fuerte)"></div>
          <div className="flex-1 bg-purple-700" title=">70 km/h (Muy Fuerte)"></div>
        </div>
        <div className="w-full flex justify-between text-[10px] text-gray-400 mt-1 px-1">
          <span>0</span>
          <span>10</span>
          <span>30</span>
          <span>50</span>
          <span>70+</span>
        </div>
      </div>
    </div>
  );
}
