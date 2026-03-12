"use client";

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useBaseContext } from '@/context/BaseContext';

export default function RadarPrecipitacion() {
  const [frames, setFrames] = useState<number[]>([]);
  const [frameActual, setFrameActual] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [opacidad, setOpacidad] = useState(70);
  const [velocidad, setVelocidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const { selectedBase } = useBaseContext();
  const mapCenter: [number, number] = selectedBase ? [selectedBase.latitud, selectedBase.longitud] : [8.0, -66.0];

  // Fetch timestamps de RainViewer
  useEffect(() => {
    async function fetchTimestamps() {
      try {
        const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        const data = await res.json();
        const past = data.radar.past || [];
        const nowcast = data.radar.nowcast || [];
        const allFrames = past.concat(nowcast).map((f: any) => f.time);
        setFrames(allFrames);
        setFrameActual(past.length - 1); // Empezar en el frame actual (último del pasado)
        setLoading(false);
      } catch (error) {
        console.error("Error fetching radar data:", error);
        setLoading(false);
      }
    }
    fetchTimestamps();
  }, []);

  // Animación automática
  useEffect(() => {
    if (!playing || frames.length === 0) return;
    const interval = setInterval(() => {
      setFrameActual(prev => (prev + 1) % frames.length);
    }, 1000 / velocidad);
    return () => clearInterval(interval);
  }, [playing, frames.length, velocidad]);

  const formatearHora = (timestamp: number) => {
    const d = new Date(timestamp * 1000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="h-[600px] w-full flex flex-col items-center justify-center bg-[#252d3d] animate-pulse">
        <p className="text-[#00d4aa] mb-2 font-semibold">Conectando con Servidores Satelitales...</p>
        <p className="text-gray-500 text-sm">Cargando frames del radar RainViewer</p>
      </div>
    );
  }

  return (
    <div className="relative h-[600px] w-full bg-[#252d3d] overflow-hidden">
      {/* Mapa */}
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
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {/* Renderizamos todos los frames pasados y ocultamos los que no tocan para pre-cachearlos visualmente (si lo deseamos, o solo el actual para performance) */}
        {frames.length > 0 && frames[frameActual] && (
          <TileLayer
            key={frames[frameActual]}
            url={`https://tilecache.rainviewer.com/v2/radar/${frames[frameActual]}/256/{z}/{x}/{y}/2/1_1.png`}
            opacity={opacidad / 100}
            zIndex={10}
          />
        )}
      </MapContainer>

      {/* Panel de Controles Flotante */}
      <div className="absolute top-4 right-4 z-[400] bg-[#1a1f2e]/90 backdrop-blur-md p-4 rounded-xl border border-[#364156] shadow-2xl w-72">
        <h3 className="text-white font-bold mb-4 flex items-center justify-between">
          Control de Radar
          {frames[frameActual] && (
            <span className="text-[#00d4aa] text-sm bg-[#00d4aa]/10 px-2 py-1 rounded">
              {formatearHora(frames[frameActual])}
            </span>
          )}
        </h3>

        {/* Reproductor */}
        <div className="flex items-center justify-center gap-4 mb-5">
          <button 
            onClick={() => setFrameActual(Math.max(0, frameActual - 1))}
            className="p-2 bg-[#252d3d] hover:bg-[#364156] rounded-full text-gray-300 transition-colors"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setPlaying(!playing)}
            className="p-4 bg-[#00d4aa] hover:bg-[#00f5c3] rounded-full text-[#1a1f2e] transition-colors shadow-[0_0_15px_rgba(0,212,170,0.4)]"
          >
            {playing ? <Pause className="w-6 h-6 border-transparent fill-current" /> : <Play className="w-6 h-6 ml-1 border-transparent fill-current" />}
          </button>
          <button 
            onClick={() => setFrameActual(Math.min(frames.length - 1, frameActual + 1))}
            className="p-2 bg-[#252d3d] hover:bg-[#364156] rounded-full text-gray-300 transition-colors"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Timeline slider */}
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{frames.length > 0 ? formatearHora(frames[0]) : ''}</span>
              <span>{frames.length > 0 ? formatearHora(frames[frames.length - 1]) : ''}</span>
            </div>
            <input
              type="range"
              min="0"
              max={frames.length - 1}
              value={frameActual}
              onChange={(e) => {
                setFrameActual(Number(e.target.value));
                setPlaying(false);
              }}
              className="w-full h-2 bg-[#252d3d] rounded-lg appearance-none cursor-pointer accent-[#00d4aa]"
            />
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

          {/* Velocidad */}
          <div className="flex justify-between items-center bg-[#252d3d] rounded-lg p-1">
            {[0.5, 1, 2].map(vel => (
              <button
                key={vel}
                onClick={() => setVelocidad(vel)}
                className={`flex-1 py-1 text-xs font-semibold rounded-md transition-colors ${velocidad === vel ? 'bg-[#364156] text-white' : 'text-gray-400 hover:text-gray-200'}`}
              >
                {vel}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leyenda de Intensidad */}
      <div className="absolute bottom-6 mx-auto left-0 right-0 w-[450px] z-[400] bg-[#1a1f2e]/90 backdrop-blur-md p-3 rounded-xl border border-[#364156] shadow-2xl flex flex-col items-center">
        <h3 className="text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Intensidad de Precipitación (mm/h)</h3>
        <div className="w-full flex h-3 rounded overflow-hidden">
          <div className="flex-1 bg-[#87CEEB]" title="Ligera: 0-2 mm/h"></div>
          <div className="flex-1 bg-[#4169E1]" title="Moderada: 2-10 mm/h"></div>
          <div className="flex-1 bg-[#32CD32]" title="Fuerte: 10-30 mm/h"></div>
          <div className="flex-1 bg-[#FFD700]" title="Muy Fuerte: 30-50 mm/h"></div>
          <div className="flex-1 bg-[#FF8C00]" title="Intensa: 50-80 mm/h"></div>
          <div className="flex-1 bg-[#FF0000]" title="Torrencial: >80 mm/h"></div>
        </div>
        <div className="w-full flex justify-between text-[10px] text-gray-400 mt-1 px-1">
          <span>0.1</span>
          <span>2.0</span>
          <span>10</span>
          <span>30</span>
          <span>50</span>
          <span>80+</span>
        </div>
      </div>
    </div>
  );
}
