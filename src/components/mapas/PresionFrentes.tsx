"use client";

import { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useBaseContext } from '@/context/BaseContext';

export default function PresionFrentes() {
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
        
        {/* Capa de Presión */}
        <TileLayer
          key="presion"
          url={`https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
          opacity={opacidad / 100}
          zIndex={10}
          attribution='Map data &copy; OpenWeatherMap'
        />
      </MapContainer>

      {/* Panel de Controles Flotante */}
      <div className="absolute top-4 right-4 z-[400] bg-[#1a1f2e]/90 backdrop-blur-md p-4 rounded-xl border border-[#364156] shadow-2xl w-64">
        <h3 className="text-white font-bold mb-4">Presión Atmosférica</h3>

        {/* Opacidad */}
        <div>
          <label className="text-sm text-gray-400 flex justify-between mb-1">
            <span>Opacidad Isobaras</span>
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

      {/* Leyenda */}
      <div className="absolute bottom-6 mx-auto left-0 right-0 w-[450px] z-[400] bg-[#1a1f2e]/90 backdrop-blur-md p-3 rounded-xl border border-[#364156] shadow-2xl flex flex-col items-center">
        <h3 className="text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Presión Atmosférica (hPa)</h3>
        <div className="w-full flex h-3 rounded overflow-hidden">
          <div className="flex-1 bg-[#00008B]" title="< 980 hPa (Baja presión)"></div>
          <div className="flex-1 bg-[#ADD8E6]" title="980-1000 hPa"></div>
          <div className="flex-1 bg-[#808080]" title="1000-1020 hPa (Normal)"></div>
          <div className="flex-1 bg-[#FFA500]" title="1020-1040 hPa"></div>
          <div className="flex-1 bg-[#FF0000]" title="> 1040 hPa (Alta presión)"></div>
        </div>
        <div className="w-full flex justify-between text-[10px] text-gray-400 mt-1 px-1">
          <span>{`<980`}</span>
          <span>1000</span>
          <span>1020</span>
          <span>1040</span>
          <span>{`>1040`}</span>
        </div>
      </div>
    </div>
  );
}
