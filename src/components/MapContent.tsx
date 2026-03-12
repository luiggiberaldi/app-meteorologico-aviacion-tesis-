"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, LayersControl, LayerGroup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// OWM key can be configured via Env, fallback to placeholder if needed for demonstration
const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OWM_API_KEY || "demo";

const bases = [
  { id: 1, name: 'Base Aérea Logística Baragua', lat: 10.2475, lon: -67.5953, type: 'militar', status: 'Abierto', city: 'Maracay, Aragua' },
  { id: 2, name: 'Base Aérea Libertador', lat: 10.1833, lon: -67.5500, type: 'militar', status: 'Abierto', city: 'Palo Negro, Aragua' },
  { id: 3, name: 'Base Aérea Gral. Francisco de Miranda', lat: 10.4833, lon: -66.8500, type: 'militar', status: 'Abierto', city: 'Caracas, Miranda' },
  { id: 4, name: 'Base Aérea Mayor Gral. Rafael Urdaneta', lat: 10.5500, lon: -71.7333, type: 'militar', status: 'Precaución', city: 'Maracaibo, Zulia' },
  { id: 5, name: 'Base Aérea Mariscal Sucre', lat: 10.1167, lon: -64.6833, type: 'militar', status: 'Abierto', city: 'Barcelona, Anzoátegui' },
  // Civiles principales para contexto
  { id: 6, name: 'Aeropuerto Simón Bolívar (Maiquetía)', lat: 10.6000, lon: -66.9900, type: 'civil', status: 'Abierto', city: 'Maiquetía, La Guaira' },
  { id: 7, name: 'Aeropuerto Arturo Michelena', lat: 10.1500, lon: -67.9300, type: 'civil', status: 'Abierto', city: 'Valencia, Carabobo' }
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

          {/* Capas OWM */}
          <LayersControl.Overlay name="🌦️ Precipitación (OWM)">
             <TileLayer
               url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
               opacity={0.6}
             />
          </LayersControl.Overlay>
          
          <LayersControl.Overlay name="☁️ Nubes (OWM)">
             <TileLayer
               url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
               opacity={0.5}
             />
          </LayersControl.Overlay>

          <LayersControl.Overlay name="🌡️ Temperatura (OWM)">
             <TileLayer
               url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
               opacity={0.4}
             />
          </LayersControl.Overlay>

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
                      
                      <div className="mb-3">
                        <p className="text-xs font-semibold mb-1">Estado Operacional:</p>
                        <p className={`text-sm font-bold ${getStatusColor(base.status)}`}>{base.status}</p>
                      </div>

                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition text-xs font-medium">
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
              Aeropuertos Civiles
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
