"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, LayerGroup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Wind, Thermometer, Cloud, Map, Globe } from "lucide-react";
import { useBaseContext, basesAereasDisponibles } from "@/context/BaseContext";

const bases = [
  // BASES MILITARES (5 Principales)
  { id: 1, name: 'Base Aérea Logística Baragua', lat: 10.2475, lon: -67.5953, type: 'militar', status: 'Abierto', city: 'Maracay, Aragua' },
  { id: 2, name: 'Base Aérea Libertador', lat: 10.1833, lon: -67.5500, type: 'militar', status: 'Abierto', city: 'Palo Negro, Aragua' },
  { id: 3, name: 'Base Aérea Gral. Francisco de Miranda', lat: 10.4833, lon: -66.8500, type: 'militar', status: 'Abierto', city: 'Caracas, Miranda' },
  { id: 4, name: 'Base Aérea Mayor Gral. Rafael Urdaneta', lat: 10.5500, lon: -71.7333, type: 'militar', status: 'Precaución', city: 'Maracaibo, Zulia' },
  { id: 5, name: 'Base Aérea Mariscal Sucre', lat: 10.1167, lon: -64.6833, type: 'militar', status: 'Abierto', city: 'Barcelona, Anzoátegui' },
  
  // AEROPUERTOS CIVILES PRINCIPALES DE VENEZUELA
  { id: 6, name: 'Aeropuerto Intl. Simón Bolívar (Maiquetía)', lat: 10.6031, lon: -66.9904, type: 'civil', status: 'Abierto', city: 'Maiquetía, La Guaira' },
  { id: 7, name: 'Aeropuerto Intl. Arturo Michelena', lat: 10.1500, lon: -67.9283, type: 'civil', status: 'Abierto', city: 'Valencia, Carabobo' },
  { id: 8, name: 'Aeropuerto Intl. La Chinita', lat: 10.5561, lon: -71.7280, type: 'civil', status: 'Abierto', city: 'Maracaibo, Zulia' },
  { id: 9, name: 'Aeropuerto Intl. General José Antonio Anzoátegui', lat: 10.1130, lon: -64.6852, type: 'civil', status: 'Abierto', city: 'Barcelona, Anzoátegui' },
  { id: 10, name: 'Aeropuerto Intl. Santiago Mariño', lat: 10.9130, lon: -63.9669, type: 'civil', status: 'Abierto', city: 'Porlamar, Nueva Esparta' },
  { id: 11, name: 'Aeropuerto Intl. Jacinto Lara', lat: 9.0435, lon: -69.3586, type: 'civil', status: 'Abierto', city: 'Barquisimeto, Lara' },
  { id: 12, name: 'Aeropuerto Intl. Manuel Carlos Piar', lat: 8.2882, lon: -62.7705, type: 'civil', status: 'Abierto', city: 'Ciudad Guayana, Bolívar' },
  { id: 13, name: 'Aeropuerto Intl. Mayor Buenaventura Vivas', lat: 7.5658, lon: -72.0353, type: 'civil', status: 'Abierto', city: 'Santo Domingo, Táchira' },
  { id: 14, name: 'Aeropuerto Intl. Juan Pablo Pérez Alfonzo', lat: 8.6256, lon: -71.6775, type: 'civil', status: 'Abierto', city: 'El Vigía, Mérida' },
  { id: 15, name: 'Aeropuerto Intl. Antonio José de Sucre', lat: 10.4503, lon: -64.1308, type: 'civil', status: 'Abierto', city: 'Cumaná, Sucre' },
  { id: 16, name: 'Aeropuerto Nacional Los Roques', lat: 11.9472, lon: -66.6738, type: 'civil', status: 'Precaución', city: 'Los Roques, Dep. Federales' },
  { id: 17, name: 'Aeropuerto Nacional Cacique Aramare', lat: 5.6033, lon: -67.5938, type: 'civil', status: 'Abierto', city: 'Puerto Ayacucho, Amazonas' },
  { id: 18, name: 'Aeropuerto Nacional Las Flecheras', lat: 7.8504, lon: -67.4566, type: 'civil', status: 'Abierto', city: 'San Fernando de Apure, Apure' },
  { id: 19, name: 'Aeropuerto Intl. Josefa Camejo', lat: 11.7766, lon: -70.1506, type: 'civil', status: 'Abierto', city: 'Las Piedras, Falcón' },
  { id: 20, name: 'Aeropuerto Nacional de San Antonio del Táchira', lat: 7.8306, lon: -72.4363, type: 'civil', status: 'Cerrado', city: 'San Antonio, Táchira' },
];

const militaryIcon = L.divIcon({
  className: "custom-icon",
  html: '<div style="background: #10b981; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 2px 8px rgba(16,185,129,0.5);">✈️</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const civilIcon = L.divIcon({
  className: "custom-icon",
  html: '<div style="background: #3b82f6; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 2px 8px rgba(59,130,246,0.5);">🛫</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const getStatusColor = (status: string) => {
  switch(status) {
    case 'Abierto': return 'text-green-500';
    case 'Precaución': return 'text-yellow-500';
    case 'Restringido': return 'text-orange-500';
    case 'Cerrado': return 'text-red-500';
    default: return 'text-gray-500';
  }
};

const getStatusDot = (status: string) => {
  switch(status) {
    case 'Abierto': return 'bg-green-500';
    case 'Precaución': return 'bg-yellow-500';
    case 'Restringido': return 'bg-orange-500';
    case 'Cerrado': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

// Sub-componente enriquecido para datos meteorológicos en vivo
function LiveWeatherPopup({ lat, lon }: { lat: number, lon: number }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m,cloud_cover,visibility,relative_humidity_2m&wind_speed_unit=kn`);
        if (!res.ok) throw new Error("API Error");
        const json = await res.json();
        if (mounted) {
          setData(json.current);
          setLoading(false);
        }
      } catch (e) {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    return () => { mounted = false; };
  }, [lat, lon]);

  if (loading) return <div className="text-center py-3 text-xs text-blue-500 animate-pulse">⏳ Consultando sensores...</div>;
  if (!data) return <div className="text-center py-2 text-xs text-red-500">⚠️ Sin datos del sensor</div>;

  const visKm = (data.visibility ?? 10000) / 1000;
  const windKt = Math.round(data.wind_speed_10m ?? 0);
  const cloudPct = data.cloud_cover ?? 0;

  // Determinar condición de vuelo
  const getFlightCat = () => {
    if (visKm > 8 && cloudPct < 50) return { label: 'VFR', color: 'bg-green-500', text: 'text-green-700' };
    if (visKm > 5) return { label: 'MVFR', color: 'bg-yellow-500', text: 'text-yellow-700' };
    if (visKm > 1.6) return { label: 'IFR', color: 'bg-red-500', text: 'text-red-700' };
    return { label: 'LIFR', color: 'bg-purple-600', text: 'text-purple-700' };
  };

  // Dirección del viento como brújula
  const getWindDir = (deg: number) => {
    const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
    return dirs[Math.round(deg / 22.5) % 16];
  };

  const fc = getFlightCat();

  return (
    <div className="mt-2 space-y-1.5">
      {/* Badge VFR/IFR */}
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${fc.color}`}>
          ✈ {fc.label}
        </span>
        <span className="text-[10px] text-gray-400">Vis: {visKm.toFixed(1)} km</span>
      </div>

      {/* Grid de métricas */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 bg-slate-50 p-2 rounded-lg border border-slate-200">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-700">
          <Thermometer className="w-3 h-3 text-red-500 shrink-0" /> {data.temperature_2m}°C
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-700">
          <Wind className="w-3 h-3 text-blue-500 shrink-0" /> {windKt} KT {getWindDir(data.wind_direction_10m ?? 0)}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-700">
          <Cloud className="w-3 h-3 text-gray-400 shrink-0" /> {cloudPct}% nub.
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-700">
          💧 {data.relative_humidity_2m ?? '--'}% hum.
        </div>
      </div>
    </div>
  );
}

export default function MapContent() {
  const { setSelectedBase } = useBaseContext();
  const [showMilitary, setShowMilitary] = useState(true);
  const [showCivil, setShowCivil] = useState(true);
  const [capaBase, setCapaBase] = useState<'osm' | 'satelite'>('osm');

  const handleMonitorear = (base: typeof bases[0]) => {
    const match = basesAereasDisponibles.find(b =>
      Math.abs(b.latitud - base.lat) < 0.1 && Math.abs(b.longitud - base.lon) < 0.1
    );
    if (match) setSelectedBase(match);
    // Scroll al inicio del dashboard donde está la Situación General
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const militaryCount = bases.filter(b => b.type === 'militar').length;
  const civilCount = bases.filter(b => b.type === 'civil').length;

  const filteredBases = bases.filter(b => 
    (b.type === 'militar' && showMilitary) || 
    (b.type === 'civil' && showCivil)
  );

  const tileUrl = capaBase === 'osm'
    ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

  const tileAttribution = capaBase === 'osm'
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    : 'Tiles &copy; Esri';

  return (
    <div className="relative">
      <MapContainer 
        center={[6.4238, -66.5897]} 
        zoom={6}
        className="w-full h-[600px] z-0"
        maxBounds={[[0.6, -73.4], [12.2, -59.8]]}
        minZoom={5}
        zoomControl={true}
      >
        <TileLayer
          key={capaBase}
          url={tileUrl}
          attribution={tileAttribution}
        />

        <LayerGroup>
          {filteredBases.map((base) => (
            <Marker 
              key={base.id} 
              position={[base.lat, base.lon]}
              icon={base.type === 'militar' ? militaryIcon : civilIcon}
            >
              <Popup className="custom-popup" maxWidth={290} autoPan={true} autoPanPadding={[40, 80]} keepInView={true}>
                <div className="p-1.5 min-w-[250px]">
                  {/* Header de la estación */}
                  <div className="flex items-start gap-2 mb-2">
                    <span className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${getStatusDot(base.status)}`}></span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-[13px] leading-tight">{base.name}</h3>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-[10px] text-gray-500">{base.city}</span>
                        <span className={`text-[10px] font-bold ${getStatusColor(base.status)}`}>{base.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Coordenadas */}
                  <div className="text-[9px] text-gray-400 mb-1 font-mono">{base.lat.toFixed(4)}N, {Math.abs(base.lon).toFixed(4)}W</div>

                  {/* Datos Meteorológicos en Vivo (con VFR/IFR) */}
                  <LiveWeatherPopup lat={base.lat} lon={base.lon} />

                  {/* Botón: Monitorear esta Estación */}
                  <button
                    onClick={() => handleMonitorear(base)}
                    className="w-full mt-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg transition text-[11px] font-bold tracking-wide shadow-sm flex items-center justify-center gap-1.5"
                  >
                    📡 Monitorear esta Estación
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </LayerGroup>
      </MapContainer>

      {/* ═══════ Panel de Control Unificado (Dark Theme) ═══════ */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-[#0f172a]/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700/60 w-56 overflow-hidden">
        {/* Título del panel */}
        <div className="px-3 py-2 border-b border-gray-700/50">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Filtros del Mapa</h4>
        </div>

        {/* Filtros de estaciones */}
        <div className="px-3 py-2.5 space-y-2">
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#10b981] shadow-[0_0_6px_rgba(16,185,129,0.5)]"></span>
              <span className="text-xs text-gray-200 font-medium group-hover:text-white transition-colors">Bases Militares</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-500 font-mono">{militaryCount}</span>
              <input 
                type="checkbox" 
                checked={showMilitary} 
                onChange={(e) => setShowMilitary(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-[#10b981] focus:ring-[#10b981] focus:ring-offset-0 cursor-pointer"
              />
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#3b82f6] shadow-[0_0_6px_rgba(59,130,246,0.5)]"></span>
              <span className="text-xs text-gray-200 font-medium group-hover:text-white transition-colors">Aeropuertos Civiles</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-500 font-mono">{civilCount}</span>
              <input 
                type="checkbox" 
                checked={showCivil} 
                onChange={(e) => setShowCivil(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-[#3b82f6] focus:ring-[#3b82f6] focus:ring-offset-0 cursor-pointer"
              />
            </div>
          </label>
        </div>

        {/* Separador */}
        <div className="border-t border-gray-700/50"></div>

        {/* Selector de capa base */}
        <div className="px-3 py-2.5">
          <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Capa Base</h5>
          <div className="flex gap-1.5">
            <button
              onClick={() => setCapaBase('osm')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                capaBase === 'osm'
                  ? 'bg-[#00d4aa]/20 text-[#00d4aa] border border-[#00d4aa]/40'
                  : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-gray-200'
              }`}
            >
              <Map className="w-3.5 h-3.5" /> Mapa
            </button>
            <button
              onClick={() => setCapaBase('satelite')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                capaBase === 'satelite'
                  ? 'bg-[#00d4aa]/20 text-[#00d4aa] border border-[#00d4aa]/40'
                  : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-gray-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> Satélite
            </button>
          </div>
        </div>

        {/* Footer: Contador */}
        <div className="px-3 py-1.5 bg-gray-800/50 border-t border-gray-700/50">
          <p className="text-[10px] text-gray-500 text-center">
            Mostrando <span className="text-gray-300 font-bold">{filteredBases.length}</span> de {bases.length} estaciones
          </p>
        </div>
      </div>
    </div>
  );
}
