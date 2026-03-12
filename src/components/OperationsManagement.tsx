"use client";

import React, { useState, useEffect } from 'react';
import { Plane, Wrench, CalendarClock, Settings, ShieldAlert, CheckCircle2, ChevronRight, Activity, CloudFog } from 'lucide-react';
import { useBaseContext } from '@/context/BaseContext';

// Catálogo maestro de aviones simulados
const ALL_FLEET_DATA = [
  { id: 'YV-0101', type: 'Cessna 208 Caravan', baseCode: 'SVFM', status: 'ACTIVE', nextMaint: '15 días' },
  { id: 'YV-0102', type: 'Cessna 208 Caravan', baseCode: 'SVMI', status: 'MAINTENANCE', nextMaint: 'En curso' },
  { id: 'FAV-0245', type: 'C-130 Hercules', baseCode: 'SVBL', status: 'ACTIVE', nextMaint: '45 días' },
  { id: 'FAV-0246', type: 'C-130 Hercules', baseCode: 'SVMI', status: 'STANDBY', nextMaint: '12 días' },
  { id: 'YV-0305', type: 'Diamond DA42', baseCode: 'SVCS', status: 'ACTIVE', nextMaint: '60 días' },
  { id: 'FAV-3101', type: 'Su-30MK2', baseCode: 'SVBM', status: 'ACTIVE', nextMaint: '90 días' },
  { id: 'YV-9011', type: 'Cessna 182', baseCode: '', status: 'STANDBY', nextMaint: '25 días' }, // Base vacía para comodín
];

const ALL_MISSIONS = [
  { id: 'M-101', title: 'Apoyo Logístico', dest: 'Base Aérea Libertador', time: '14:30 HLV', baseCode: 'SVMI', originalStatus: 'ON_TIME' as const },
  { id: 'M-102', title: 'Entrenamiento IF', dest: 'Local (Maracay)', time: '16:00 HLV', baseCode: 'SVBL', originalStatus: 'ON_TIME' as const },
  { id: 'M-103', title: 'Reconocimiento', dest: 'Frontera Sur', time: '08:00 HLV', baseCode: 'SVCS', originalStatus: 'SCHEDULED' as const },
  { id: 'M-104', title: 'Patrullaje Costero', dest: 'Zona Económica Exclusiva', time: '09:30 HLV', baseCode: 'SVMG', originalStatus: 'ON_TIME' as const },
  { id: 'M-105', title: 'Vuelo VFR Corto', dest: 'Aeropuerto Caracas', time: '11:00 HLV', baseCode: 'SVFM', originalStatus: 'ON_TIME' as const },
];

export default function OperationsManagement() {
  const { selectedBase } = useBaseContext();
  const [activeTab, setActiveTab] = useState<'FLEET' | 'MISSIONS'>('FLEET');
  
  const [weatherRestricted, setWeatherRestricted] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // 1. Filtrar flota y misiones usando TODA la data simulada + comodines
  // Si un elemento tiene baseCode coincidente con selectedBase.codigo, se muestra.
  // También añadimos algunos elementos fijos/comodines para que nunca se vea vacío (demo).
  const baseCode = selectedBase?.codigo || 'SVMI';
  
  const filteredFleet = ALL_FLEET_DATA.filter(f => f.baseCode === baseCode || f.baseCode === '');
  const baseFleet = filteredFleet.length > 0 ? filteredFleet : ALL_FLEET_DATA.slice(0, 3);

  const filteredMissions = ALL_MISSIONS.filter(m => m.baseCode === baseCode);
  const baseMissions = filteredMissions.length > 0 ? filteredMissions : [
    { id: `M-${Math.floor(Math.random() * 900) + 100}`, title: 'Operación Local Standard', dest: 'Entrenamiento Local', time: '12:00 HLV', originalStatus: 'ON_TIME' as const }
  ];

  // 2. Efecto para consultar el clima real (Open-Meteo) y determinar restricciones (Cierre/Retraso METEO)
  useEffect(() => {
    let mounted = true;
    async function checkWeatherRestrictions() {
      if (!selectedBase) return;
      setLoadingWeather(true);
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${selectedBase.latitud}&longitude=${selectedBase.longitud}&current=visibility,cloud_cover,wind_speed_10m`
        );
        if (!res.ok) throw new Error("API Error");
        const json = await res.json();
        
        if (mounted) {
          const visKm = (json.current.visibility ?? 10000) / 1000;
          const clouds = json.current.cloud_cover ?? 0;
          const wind = json.current.wind_speed_10m ?? 0;
          
          // Si Vis < 5km, Nubes > 80% o Viento > 40km/h => Restringido por METEO
          const isRestricted = visKm < 5 || clouds > 80 || wind > 40;
          setWeatherRestricted(isRestricted);
          setLoadingWeather(false);
        }
      } catch (e) {
        if (mounted) setLoadingWeather(false);
      }
    }
    checkWeatherRestrictions();
    return () => { mounted = false; };
  }, [selectedBase]);

  // 3. Aplicar dinámicamente el clima a las misiones
  const dynamicMissions = baseMissions.map(m => {
    if (weatherRestricted && (m.originalStatus === 'ON_TIME' || m.originalStatus === 'SCHEDULED')) {
      return { ...m, currentStatus: 'DELAYED' as const };
    }
    return { ...m, currentStatus: m.originalStatus };
  });

  // Contadores dinámicos
  const activeCount = baseFleet.filter(f => f.status === 'ACTIVE').length;
  const maintCount = baseFleet.filter(f => f.status === 'MAINTENANCE').length;
  const standbyCount = baseFleet.filter(f => f.status === 'STANDBY').length;
  
  return (
    <section className="bg-[#0f172a] rounded-xl border border-gray-700 overflow-hidden flex flex-col h-full shadow-lg relative">
      
      {/* Banner de restricción meteorológica (dinámico) */}
      {weatherRestricted && (
        <div className="absolute top-0 left-0 right-0 bg-red-600/90 text-white text-xs font-bold py-1.5 px-4 z-10 flex items-center justify-center gap-2 animate-pulse">
          <CloudFog size={14} /> 
          RESTRICCIÓN OPERATIVA POR CONDICIONES METEOROLÓGICAS (IFR CERRADO)
        </div>
      )}

      {/* Header */}
      <div className={`bg-[#1e293b] p-5 border-b border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${weatherRestricted ? 'pt-8' : ''}`}>
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Plane className="text-[#3b82f6]" />
            Gestión de Operaciones
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            {selectedBase ? `Flota y misiones en ${selectedBase.nombre}` : 'Control de flota y misiones programadas.'}
          </p>
        </div>
        
        {/* Pestañas (Tabs) */}
        <div className="bg-gray-800 p-1 rounded-lg flex gap-1 self-stretch sm:self-auto shrink-0">
          <button 
            onClick={() => setActiveTab('FLEET')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'FLEET' ? 'bg-[#3b82f6] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
          >
            Estado de Flota
          </button>
          <button 
            onClick={() => setActiveTab('MISSIONS')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'MISSIONS' ? 'bg-[#3b82f6] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
          >
            Misiones
          </button>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-6">
        
        {/* KPIs (Métricas Rápidas) */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#1e293b] rounded-lg p-3 border border-gray-700/50 flex flex-col items-center justify-center text-center">
             <div className="bg-blue-500/20 text-blue-400 p-2 rounded-full mb-2"><Activity size={20} /></div>
             <p className="text-2xl font-bold text-white">{activeCount}</p>
             <p className="text-[10px] uppercase text-gray-400 font-medium">EN VUELO / ACTIVAS</p>
          </div>
          <div className="bg-[#1e293b] rounded-lg p-3 border border-gray-700/50 flex flex-col items-center justify-center text-center">
             <div className="bg-gray-700/50 text-gray-300 p-2 rounded-full mb-2"><CheckCircle2 size={20} /></div>
             <p className="text-2xl font-bold text-white">{standbyCount}</p>
             <p className="text-[10px] uppercase text-gray-400 font-medium">DISPONIBLES</p>
          </div>
          <div className="bg-[#1e293b] rounded-lg p-3 border border-gray-700/50 flex flex-col items-center justify-center text-center">
             <div className="bg-orange-500/20 text-orange-400 p-2 rounded-full mb-2"><Wrench size={20} /></div>
             <p className="text-2xl font-bold text-white">{maintCount}</p>
             <p className="text-[10px] uppercase text-gray-400 font-medium">MANTENIMIENTO</p>
          </div>
        </div>

        {/* Contenido Dinámico por Pestaña */}
        <div className="flex-1 bg-[#1e293b]/50 rounded-lg border border-gray-700/30 overflow-hidden flex flex-col">
          
          {activeTab === 'FLEET' && (
            <div className="p-4 overflow-y-auto" style={{ maxHeight: '250px' }}>
              <h4 className="text-sm font-bold text-gray-300 uppercase mb-4 flex items-center gap-2">
                <Settings size={16}/> Estatus por Aeronave
              </h4>
              <div className="space-y-3">
                {baseFleet.map((aircraft) => (
                  <div key={aircraft.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-md bg-[#1e293b] border border-gray-700 hover:border-gray-600 transition-colors">
                    <div>
                      <p className="text-white font-bold">{aircraft.id}</p>
                      <p className="text-[11px] text-gray-400">{aircraft.type}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 sm:mt-0">
                      <div className="text-right">
                        <p className="text-[10px] text-gray-500 uppercase">Prox. Mantenimiento</p>
                        <p className="text-xs font-mono text-gray-300">{aircraft.nextMaint}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                        aircraft.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' :
                        aircraft.status === 'MAINTENANCE' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {aircraft.status === 'ACTIVE' ? 'ACTIVA' : aircraft.status === 'MAINTENANCE' ? 'TALLER' : 'STANDBY'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'MISSIONS' && (
            <div className="p-4 overflow-y-auto" style={{ maxHeight: '250px' }}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                  <CalendarClock size={16}/> Programación de Vuelos
                  {loadingWeather && <span className="ml-2 text-[10px] text-blue-400 animate-pulse">(Validando METEO...)</span>}
                </h4>
              </div>
              
              <div className="space-y-3">
                {dynamicMissions.map((mission) => (
                  <div key={mission.id} className="flex flex-col sm:flex-row justify-between p-3 rounded-md bg-[#1e293b] border border-gray-700 border-l-4" style={{
                    borderLeftColor: mission.currentStatus === 'ON_TIME' ? '#10b981' : mission.currentStatus === 'DELAYED' ? '#ef4444' : '#6b7280'
                  }}>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-bold text-sm">{mission.id}</p>
                        <span className="text-[10px] text-gray-400 px-1.5 py-0.5 bg-gray-800 rounded font-mono">{mission.time}</span>
                      </div>
                      <p className="text-xs font-medium text-blue-400 mt-0.5">{mission.title}</p>
                      <p className="text-[10px] text-gray-400 flex items-center mt-1">
                        <ChevronRight size={12} className="mr-0.5"/> Dest: {mission.dest}
                      </p>
                    </div>
                    <div className="mt-3 sm:mt-0 flex items-center shrink-0">
                      {mission.currentStatus === 'ON_TIME' && <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-900/20 px-2 py-1 rounded"><CheckCircle2 size={12}/> A TIEMPO</span>}
                      {mission.currentStatus === 'DELAYED' && <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-900/20 px-2 py-1 rounded"><ShieldAlert size={12}/> CANCELADA / METEO</span>}
                      {mission.currentStatus === 'SCHEDULED' && <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-800 px-2 py-1 rounded">PROGRAMADA</span>}
                    </div>
                  </div>
                ))}
                
                {dynamicMissions.length === 0 && (
                  <div className="text-center py-6 text-gray-500 text-xs">No hay misiones programadas para esta base.</div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
      
    </section>
  );
}
