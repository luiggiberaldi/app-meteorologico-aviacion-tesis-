"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, LayersControl, LayerGroup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import Link from "next/link";
import { Satellite, Wind, Thermometer, Cloud } from "lucide-react";

const bases = [
  // BASES MILITARES (5 Principales solicitadas)
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
  html: '<div style="background: #10b981; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">✈️</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const civilIcon = L.divIcon({
  className: "custom-icon",
  html: '<div style="background: #3b82f6; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">🛫</div>',
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

// Componente hijo encargado de buscar e inyectar datos del clima al clickear un pop-up en el mapa
function LiveWeatherPopup({ lat, lon }: { lat: number, lon: number }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m,cloud_cover&wind_speed_unit=kn`);
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

  if (loading) return <div className="text-center py-2 text-xs text-blue-500 animate-pulse">Analizando Sensores...</div>;
  if (!data) return <div className="text-center py-2 text-xs text-red-500">Error en Sensor</div>;

  return (
    <div className="grid grid-cols-2 gap-2 mt-2 bg-gray-50 p-2 rounded border">
      <div className="flex items-center gap-1 text-[11px] font-medium text-gray-700">
        <Thermometer className="w-3 h-3 text-red-500" /> {data.temperature_2m}°C
      </div>
      <div className="flex items-center gap-1 text-[11px] font-medium text-gray-700">
        <Wind className="w-3 h-3 text-blue-500" /> {Math.round(data.wind_speed_10m)} KT
      </div>
      <div className="flex items-center gap-1 text-[11px] font-medium text-gray-700 col-span-2">
        <Cloud className="w-3 h-3 text-gray-400" /> Nubosidad {data.cloud_cover}%
      </div>
    </div>
  );
}

export default function MapContent() {
  const [showMilitary, setShowMilitary] = useState(true);
  const [showCivil, setShowCivil] = useState(true);

  const filteredBases = bases.filter(b => 
    (b.type === 'militar' && showMilitary) || 
    (b.type === 'civil' && showCivil)
  );

  return (
    <div className="relative">
      <MapContainer 
        center={[6.4238, -66.5897]} 
        zoom={6}
        className="w-full h-[600px] z-0"
        maxBounds={[[0.6, -73.4], [12.2, -59.8]]}
        minZoom={5}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Mapa Base (OSM)">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Terreno/Satélite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri"
            />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay checked name="Bases y Aeropuertos">
            <LayerGroup>
              {filteredBases.map((base, index) => (
                <Marker 
                  key={index} 
                  position={[base.lat, base.lon]}
                  icon={base.type === 'militar' ? militaryIcon : civilIcon}
                >
                  <Popup className="custom-popup">
                    <div className="p-1 min-w-[200px]">
                      <h3 className="font-bold text-gray-800 text-sm mb-1">{base.name}</h3>
                      <div className="text-xs text-gray-600 mb-2 border-b pb-2">
                        <span className="bg-gray-100 px-2 py-0.5 rounded mr-1">
                          {base.city}
                        </span>
                        <span className="block mt-1">{base.lat.toFixed(2)}N, {Math.abs(base.lon).toFixed(2)}W</span>
                      </div>
                      
                      <div className="mb-2">
                        <p className="text-xs font-semibold mb-1">Estado Operacional:</p>
                        <p className={`text-[13px] font-bold ${getStatusColor(base.status)}`}>{base.status}</p>
                      </div>

                      {/* Inyector de Datos Satelitales Locales (Open-Meteo) */}
                      <LiveWeatherPopup lat={base.lat} lon={base.lon} />

                      <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition text-xs font-medium">
                        Ver METAR / TAF Completo
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>

      {/* Controles flotantes */}
      <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur rounded-lg shadow-lg p-3 border border-gray-200">
        <h4 className="text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">Filtros Activos</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-gray-100 p-1 rounded">
            <input 
              type="checkbox" 
              checked={showMilitary} 
              onChange={(e) => setShowMilitary(e.target.checked)}
              className="rounded text-green-500 focus:ring-green-500"
            />
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#10b981]"></span>
              Bases Militares
            </span>
          </label>
          <label className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-gray-100 p-1 rounded">
            <input 
              type="checkbox" 
              checked={showCivil} 
              onChange={(e) => setShowCivil(e.target.checked)}
              className="rounded text-blue-500 focus:ring-blue-500"
            />
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#3b82f6]"></span>
              Aeropuertos Civiles (Contexto)
            </span>
          </label>
        </div>
      </div>

      {/* Acceso Directo a Satélites */}
      <div className="absolute top-4 right-4 z-[1000]">
        <Link href="/imagenes-satelitales" className="flex items-center gap-2 bg-[#1a1f2e]/90 hover:bg-[#252d3d] text-white px-4 py-2.5 rounded-xl border border-[#364156] shadow-[0_0_15px_rgba(0,212,170,0.3)] transition-all transform hover:scale-105 group backdrop-blur-md">
          <Satellite className="w-5 h-5 text-[#00d4aa] group-hover:animate-pulse" />
          <span className="text-sm font-bold tracking-wide">Abrir Centro Satelital</span>
        </Link>
      </div>
    </div>
  );
}
