"use client";

import React, { useState, useEffect } from 'react';
import { useBaseContext, BaseAerea } from '@/context/BaseContext';
import { Route, Navigation, Timer, Fuel, Wind, TrendingUp, Sun, CloudRain, PlaneTakeoff, PlaneLanding, Plane, AlertTriangle } from 'lucide-react';

// Aeronaves disponibles con sus velocidades de crucero típicas en nudos (kt) y consumo aprox lbs/h
const AIRCRAFT_DB = [
  { id: 'C208', name: 'Cessna 208 Caravan', speedKt: 180, fuelLbsH: 350 },
  { id: 'C130', name: 'Lockheed C-130 Hercules', speedKt: 290, fuelLbsH: 5000 },
  { id: 'MI17', name: 'Mil Mi-17 (Helicóptero)', speedKt: 130, fuelLbsH: 1400 },
  { id: 'F16', name: 'F-16 Fighting Falcon', speedKt: 500, fuelLbsH: 8000 }
];

// Fórmula de Haversine para distancia en Millas Náuticas (NM)
function calculateDistanceNM(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3440.065; // Radio de la Tierra en Millas Náuticas
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

export default function FlightPlanning() {
  const { selectedBase, bases } = useBaseContext();
  
  const [originId, setOriginId] = useState<number>(bases[0].id);
  const [destId, setDestId] = useState<number>(bases[2].id);
  const [aircraftId, setAircraftId] = useState<string>('C208');
  
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState<number>(0);
  const [eteMin, setEteMin] = useState<number>(0);
  const [fuelEst, setFuelEst] = useState<number>(0);
  
  // Clima en el origen para chequear viento cruzado
  const [originWind, setOriginWind] = useState<{ speed: number; dir: number } | null>(null);
  const [windWarning, setWindWarning] = useState<string | null>(null);

  useEffect(() => {
    // Si el usuario cambia el contexto global, actualizamos el origen si es una base específica
    if (selectedBase) {
      setOriginId(selectedBase.id);
      if (selectedBase.id === destId) {
        // Evitar origen y destino iguales por defecto
        const newDest = bases.find(b => b.id !== selectedBase.id);
        if (newDest) setDestId(newDest.id);
      }
    }
  }, [selectedBase, bases, destId]);

  useEffect(() => {
    async function calculateFlight() {
      setLoading(true);
      const origin = bases.find(b => b.id === originId);
      const dest = bases.find(b => b.id === destId);
      const aircraft = AIRCRAFT_DB.find(a => a.id === aircraftId);

      if (origin && dest && aircraft) {
        // 1. Calcular Distancia
        const distNM = calculateDistanceNM(origin.latitud, origin.longitud, dest.latitud, dest.longitud);
        setDistance(distNM);

        // 2. Calcular ETE (Estimated Time Enroute) en minutos
        const timeMin = (distNM / aircraft.speedKt) * 60;
        setEteMin(timeMin);

        // 3. Calcular Fuel (lbs) ( + reserva de 45 mins)
        const totalTimeHours = (timeMin + 45) / 60; 
        setFuelEst(totalTimeHours * aircraft.fuelLbsH);

        // 4. Fetch Clima Real del Origen (Open-Meteo) para advertencias de viento
        try {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${origin.latitud}&longitude=${origin.longitud}&current=wind_speed_10m,wind_direction_10m`);
          if (res.ok) {
            const data = await res.json();
            const wSpeed = data.current.wind_speed_10m; // km/h
            const wSpeedKt = wSpeed / 1.852; // a nudos
            setOriginWind({ speed: wSpeedKt, dir: data.current.wind_direction_10m });

            // Lógica simple de advertencia de viento
            if (wSpeedKt > 30) {
              setWindWarning(`PELIGRO: Vientos severos en origen (${wSpeedKt.toFixed(1)} KT). Operaciones suspendidas.`);
            } else if (wSpeedKt > 15) {
              setWindWarning(`PRECAUCIÓN: Posible viento cruzado fuerte (${wSpeedKt.toFixed(1)} KT). Evaluar límites de la aeronave.`);
            } else {
              setWindWarning(null);
            }
          }
        } catch (error) {
          console.error("Error fetching wind data", error);
        }
      }
      setLoading(false);
    }

    calculateFlight();
  }, [originId, destId, aircraftId, bases]);

  // Formatear ETE (e.g. 1h 25m)
  const formatETE = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <section className="bg-[#1e293b] rounded-xl border border-gray-700 p-5 flex flex-col shadow-lg">
      <div className="mb-4 border-b border-gray-700 pb-2 flex items-center justify-between">
        <h3 className="text-md font-semibold text-white flex items-center">
          <Route size={18} className="mr-2 text-[#8b5cf6]" />
          Planificador de Vuelos
        </h3>
        <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-1 rounded border border-purple-500/50">Cálculos en Vivo</span>
      </div>

      <div className="flex-1 flex flex-col gap-5">
        
        {/* FORMULARIO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] uppercase text-gray-400 font-bold mb-1 flex items-center gap-1">
              <PlaneTakeoff size={12}/> Origen
            </label>
            <select 
              value={originId} 
              onChange={(e) => setOriginId(Number(e.target.value))}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-md p-2 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
            >
              {bases.map(b => <option key={b.id} value={b.id}>{b.codigo} - {b.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase text-gray-400 font-bold mb-1 flex items-center gap-1">
              <PlaneLanding size={12}/> Destino
            </label>
            <select 
              value={destId} 
              onChange={(e) => setDestId(Number(e.target.value))}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-md p-2 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
            >
              {bases.map(b => <option key={b.id} value={b.id}>{b.codigo} - {b.nombre}</option>)}
            </select>
          </div>
          <div>
             <label className="text-[10px] uppercase text-gray-400 font-bold mb-1 flex items-center gap-1">
              <Plane size={12}/> Aeronave
            </label>
            <select 
              value={aircraftId} 
              onChange={(e) => setAircraftId(e.target.value)}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-md p-2 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
            >
              {AIRCRAFT_DB.map(a => <option key={a.id} value={a.id}>{a.name} ({a.speedKt} kt)</option>)}
            </select>
          </div>
        </div>

        {/* CÁLCULOS / RESULTADOS */}
        {loading ? (
            <div className="flex-1 flex justify-center items-center py-6">
              <div className="w-8 h-8 border-4 border-[#8b5cf6]/30 border-t-[#8b5cf6] rounded-full animate-spin"></div>
            </div>
        ) : (
          <div className="flex flex-col gap-4">
            
            {/* ALERTAS */}
            {originWind && (
               <div className={`p-3 rounded-lg border flex gap-3 items-center ${windWarning ? (windWarning.includes('PELIGRO') ? 'bg-red-900/20 border-red-500/50' : 'bg-yellow-900/20 border-yellow-500/50') : 'bg-green-900/20 border-green-500/50'}`}>
                 {windWarning ? <AlertTriangle className={windWarning.includes('PELIGRO') ? 'text-red-400' : 'text-yellow-400'} size={20} shrink-0="true"/> : <Wind className="text-green-400" size={20} shrink-0="true"/>}
                 <div>
                   <p className={`text-xs font-bold ${windWarning ? (windWarning.includes('PELIGRO') ? 'text-red-400' : 'text-yellow-400') : 'text-green-400'} uppercase`}>
                     Viento en Origen: {originWind.speed.toFixed(1)} KT / {originWind.dir}°
                   </p>
                   <p className="text-xs text-gray-300">
                     {windWarning || 'Condiciones de viento seguras para despegue.'}
                   </p>
                 </div>
               </div>
            )}

            {/* METRICAS */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#0f172a] border border-gray-700/50 p-3 rounded-lg text-center shadow-inner">
                <Navigation size={18} className="text-[#8b5cf6] mx-auto mb-1" />
                <p className="text-[10px] font-bold text-gray-500 uppercase">Distancia (Dist)</p>
                <p className="text-lg text-white font-bold mt-1">{distance.toFixed(0)} <span className="text-xs text-gray-400">NM</span></p>
              </div>
              <div className="bg-[#0f172a] border border-gray-700/50 p-3 rounded-lg text-center shadow-inner">
                <Timer size={18} className="text-blue-400 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-gray-500 uppercase">Tiempo Est. (ETE)</p>
                <p className="text-lg text-white font-bold mt-1">{formatETE(eteMin)}</p>
              </div>
              <div className="bg-[#0f172a] border border-gray-700/50 p-3 rounded-lg text-center shadow-inner">
                <Fuel size={18} className="text-emerald-400 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-gray-500 uppercase">Bloque Comb.</p>
                <p className="text-lg text-white font-bold mt-1">{fuelEst.toFixed(0)} <span className="text-xs text-gray-400">Lbs</span></p>
              </div>
            </div>

            <p className="text-[10px] text-gray-500 text-center italic mt-2">
              * Combustible incluye reserva IFR de 45 minutos. Ruteo asume línea recta (Ortodrómica).
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
