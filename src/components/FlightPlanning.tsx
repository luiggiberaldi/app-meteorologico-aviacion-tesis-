"use client";

import React, { useState, useEffect } from 'react';
import { useBaseContext } from '@/context/BaseContext';
import { Route, Navigation, Timer, Fuel, Wind, TrendingUp, Sun, CloudRain } from 'lucide-react';

interface FlightRoute {
  id: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  fuelEst: string;
  windFactor: string;
  optimal: boolean;
}

export default function FlightPlanning() {
  const { selectedBase } = useBaseContext();
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState<FlightRoute[]>([]);
  
  const generateMockRoutes = () => {
    // Simulando cálculo basado en el Contexto Actual
    const baseName = selectedBase ? selectedBase.nombre : "Base Nacional";
    
    setTimeout(() => {
      setRoutes([
        { 
          id: 'FLT-01A', from: baseName, to: 'Maracaibo (MAR)', 
          departure: '08:00', arrival: '09:15', fuelEst: '1,200 Lbs', 
          windFactor: 'Viento en cola (+15 KT)', optimal: true 
        },
        { 
          id: 'FLT-02B', from: baseName, to: 'Barcelona (BLA)', 
          departure: '12:30', arrival: '13:40', fuelEst: '1,450 Lbs', 
          windFactor: 'Viento cruzado (22 KT)', optimal: false 
        },
        { 
          id: 'FLT-03C', from: baseName, to: 'Los Roques (LRV)', 
          departure: '16:00', arrival: '16:45', fuelEst: '800 Lbs', 
          windFactor: 'Viento de cara (-10 KT)', optimal: true 
        }
      ]);
      setLoading(false);
    }, 1200);
  };

  useEffect(() => {
    setLoading(true);
    generateMockRoutes();
  }, [selectedBase]);

  return (
    <section className="bg-[#1e293b] rounded-xl border border-gray-700 p-5 flex flex-col shadow-lg">
      <div className="mb-4 border-b border-gray-700 pb-2 flex items-center justify-between">
        <h3 className="text-md font-semibold text-white flex items-center">
          <Route size={18} className="mr-2 text-[#8b5cf6]" />
          Planificación de Vuelos
        </h3>
        <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-1 rounded border border-purple-500/50">Ventanas Óptimas</span>
      </div>

      <div className="flex-1">
        {loading ? (
           <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-[#8b5cf6]/30 border-t-[#8b5cf6] rounded-full animate-spin"></div>
           </div>
        ) : (
          <div className="space-y-4">
            
            {/* Pronóstico de Ventanas de Despegue */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-green-900/20 border border-green-500/30 p-3 rounded-lg text-center">
                <Sun size={20} className="text-green-400 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-gray-400 uppercase">MAÑANA (06:00 - 11:00)</p>
                <p className="text-sm text-green-400 font-bold mt-1">ÓPTIMO</p>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-500/30 p-3 rounded-lg text-center">
                <Wind size={20} className="text-yellow-400 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-gray-400 uppercase">TARDE (12:00 - 17:00)</p>
                <p className="text-sm text-yellow-400 font-bold mt-1">TURBULENCIA RAC</p>
              </div>
              <div className="bg-red-900/20 border border-red-500/30 p-3 rounded-lg text-center">
                <CloudRain size={20} className="text-red-400 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-gray-400 uppercase">NOCHE (18:00 - 23:00)</p>
                <p className="text-sm text-red-400 font-bold mt-1">NO RECOMENDADO</p>
              </div>
            </div>

            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Navigation size={14} /> Rutas Sugeridas {selectedBase ? `desde ${selectedBase.nombre}` : ''}
            </h4>

            {routes.map(route => (
              <div key={route.id} className="bg-[#0f172a] p-4 rounded-lg border border-gray-700 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white bg-gray-800 px-2 py-1 rounded">{route.id}</span>
                    <p className="text-sm text-gray-300">{route.from} <span className="text-gray-500">➔</span> {route.to}</p>
                  </div>
                  {route.optimal ? (
                     <span className="text-xs font-bold text-green-400 bg-green-900/20 px-2 py-0.5 rounded border border-green-500/30">RUTA ÓPTIMA</span>
                  ) : (
                     <span className="text-xs font-bold text-yellow-400 bg-yellow-900/20 px-2 py-0.5 rounded border border-yellow-500/30">CON RESTRICCIONES</span>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase flex items-center gap-1"><Timer size={12}/> ETD / ETA</p>
                    <p className="text-xs font-bold text-gray-300 mt-1">{route.departure} - {route.arrival}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase flex items-center gap-1"><Wind size={12}/> Factor Viento</p>
                    <p className="text-xs font-bold text-gray-300 mt-1">{route.windFactor}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase flex items-center gap-1"><Fuel size={12}/> Combustible Est.</p>
                    <p className="text-xs font-bold text-blue-400 mt-1">{route.fuelEst}</p>
                  </div>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </section>
  );
}
