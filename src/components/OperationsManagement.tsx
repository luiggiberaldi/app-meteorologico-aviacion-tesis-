"use client";

import React, { useState, useEffect } from 'react';
import { Plane, Wrench, CalendarClock, Settings, ShieldAlert, CheckCircle2, ChevronRight, Activity, CloudFog } from 'lucide-react';
import { useBaseContext } from '@/context/BaseContext';

// Catálogo maestro de aviones simulados
const ALL_FLEET_DATA = [
  { id: 'FAV-0245', type: 'Lockheed C-130H Hercules', baseCode: 'SVBL', status: 'ACTIVE', nextMaint: '45 días' },
  { id: 'FAV-0246', type: 'Lockheed C-130H Hercules', baseCode: 'SVMI', status: 'STANDBY', nextMaint: '12 días' },
  { id: 'FAV-3101', type: 'Sukhoi Su-30MK2 Flanker-G', baseCode: 'SVBM', status: 'ACTIVE', nextMaint: '90 días' },
  { id: 'FAV-3105', type: 'Sukhoi Su-30MK2 Flanker-G', baseCode: 'SVBL', status: 'MAINTENANCE', nextMaint: 'En curso' },
  { id: 'FAV-2101', type: 'F-16A Block 15 Fighting Falcon', baseCode: 'SVBL', status: 'ACTIVE', nextMaint: '30 días' },
  { id: 'FAV-1401', type: 'K-8W Karakorum', baseCode: 'SVFM', status: 'ACTIVE', nextMaint: '15 días' },
  { id: 'FAV-1405', type: 'K-8W Karakorum', baseCode: 'SVMG', status: 'STANDBY', nextMaint: '60 días' },
  { id: 'FAV-5101', type: 'Shaanxi Y-8F-200W', baseCode: 'SVMI', status: 'ACTIVE', nextMaint: '120 días' },
  { id: 'FAV-8101', type: 'Mil Mi-17V-5', baseCode: 'SVFM', status: 'ACTIVE', nextMaint: '25 días' },
  { id: 'FAV-8201', type: 'AS-532AC Cougar', baseCode: 'SVMI', status: 'STANDBY', nextMaint: '40 días' },
  { id: 'FAV-0101', type: 'Cessna 208B Grand Caravan', baseCode: 'SVCS', status: 'ACTIVE', nextMaint: '10 días' },
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
  // Si no hay selectedBase (Nacional), se muestra TODO el parque aeronáutico.
  const isNational = !selectedBase;
  const baseCode = selectedBase?.codigo || '';
  
  const baseFleet = isNational 
    ? ALL_FLEET_DATA 
    : ALL_FLEET_DATA.filter(f => f.baseCode === baseCode || f.baseCode === '');

  const baseMissions = isNational 
    ? ALL_MISSIONS 
    : ALL_MISSIONS.filter(m => m.baseCode === baseCode);

  // Si filtró pero está vacío localmente, generamos uno de prueba para que no se vea vacío el demo local de base
  const finalMissions = (!isNational && baseMissions.length === 0) ? [
    { id: `M-${Math.floor(Math.random() * 900) + 100}`, title: 'Operación Local Standard', dest: 'Local', time: '12:00 HLV', baseCode, originalStatus: 'ON_TIME' as const }
  ] : baseMissions;

  // 2. Efecto para consultar el clima real (Open-Meteo) y determinar restricciones (Cierre/Retraso METEO)
  useEffect(() => {
    let mounted = true;
    async function checkWeatherRestrictions() {
      // Si estamos a nivel nacional, apagamos alertas locales
      if (!selectedBase) {
        setWeatherRestricted(false);
        setLoadingWeather(false);
        return;
      }

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
  const dynamicMissions = finalMissions.map(m => {
    if (weatherRestricted && !isNational && (m.originalStatus === 'ON_TIME' || m.originalStatus === 'SCHEDULED')) {
      return { ...m, currentStatus: 'DELAYED' as const };
    }
    return { ...m, currentStatus: m.originalStatus };
  });

  // Contadores dinámicos
  const activeCount = baseFleet.filter(f => f.status === 'ACTIVE').length;
  const maintCount = baseFleet.filter(f => f.status === 'MAINTENANCE').length;
  const standbyCount = baseFleet.filter(f => f.status === 'STANDBY').length;
  
  return (
    <section className="bg-[#0f172a] rounded-xl border border-gray-700 flex flex-col h-full shadow-lg relative overflow-hidden">
      
      {/* Banner de restricción meteorológica (dinámico) */}
      {weatherRestricted && (
        <div className="bg-red-600/90 text-white text-xs font-bold py-1.5 px-4 z-10 flex items-center justify-center gap-2 animate-pulse shrink-0">
          <CloudFog size={14} /> 
          RESTRICCIÓN OPERATIVA POR CONDICIONES METEOROLÓGICAS (IFR CERRADO)
        </div>
      )}

      {/* Header */}
      <div className="bg-[#1e293b] p-5 border-b border-gray-700 flex flex-col gap-4 shrink-0">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Plane className="text-[#3b82f6]" />
            Gestión de Operaciones
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            {selectedBase ? `Flota y misiones en ${selectedBase.nombre}` : 'Control de flota y misiones programadas.'}
          </p>
        </div>
        
        {/* Pestañas (Tabs) ajustadas al 100% de ancho */}
        <div className="bg-gray-800/80 p-1 rounded-lg flex w-full">
          <button 
            onClick={() => setActiveTab('FLEET')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'FLEET' ? 'bg-[#3b82f6] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            Estado de Flota
          </button>
          <button 
            onClick={() => setActiveTab('MISSIONS')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'MISSIONS' ? 'bg-[#3b82f6] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            Misiones
          </button>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-6 overflow-hidden">
        
        {/* KPIs (Métricas Rápidas) shrink-0 asegura que no se encojan */}
        <div className="grid grid-cols-3 gap-3 shrink-0">
          <div className="bg-[#1e293b] rounded-xl p-3 border border-gray-700 flex flex-col items-center justify-center text-center shadow-inner">
             <div className="bg-blue-500/10 text-blue-400 p-2 rounded-full mb-1"><Activity size={18} /></div>
             <p className="text-2xl font-bold text-white leading-none">{activeCount}</p>
             <p className="text-[9px] sm:text-[10px] uppercase text-gray-400 font-bold mt-1 tracking-wider">EN VUELO</p>
          </div>
          <div className="bg-[#1e293b] rounded-xl p-3 border border-gray-700 flex flex-col items-center justify-center text-center shadow-inner">
             <div className="bg-green-500/10 text-green-400 p-2 rounded-full mb-1"><CheckCircle2 size={18} /></div>
             <p className="text-2xl font-bold text-white leading-none">{standbyCount}</p>
             <p className="text-[9px] sm:text-[10px] uppercase text-gray-400 font-bold mt-1 tracking-wider">DISPONIBLES</p>
          </div>
          <div className="bg-[#1e293b] rounded-xl p-3 border border-gray-700 flex flex-col items-center justify-center text-center shadow-inner">
             <div className="bg-orange-500/10 text-orange-400 p-2 rounded-full mb-1"><Wrench size={18} /></div>
             <p className="text-2xl font-bold text-white leading-none">{maintCount}</p>
             <p className="text-[9px] sm:text-[10px] uppercase text-gray-400 font-bold mt-1 tracking-wider">TALLER</p>
          </div>
        </div>

        {/* Contenido Dinámico por Pestaña (Este contenedor CRECE y SCROLLEA) */}
        <div className="flex-1 bg-[#1e293b]/30 rounded-xl border border-gray-700/50 flex flex-col overflow-hidden">
          
          {activeTab === 'FLEET' && (
            <div className="p-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Settings size={14}/> Estatus por Aeronave
              </h4>
              <div className="space-y-2">
                {baseFleet.map((aircraft) => (
                  <div key={aircraft.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg bg-[#1e293b] border border-gray-700/80 hover:border-gray-500 transition-colors shadow-sm">
                    <div>
                      <p className="text-white font-bold text-sm tracking-wide">{aircraft.id}</p>
                      <p className="text-[11px] text-blue-300 font-medium">{aircraft.type}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-3 sm:mt-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Prox. Mante.</p>
                        <p className="text-xs font-mono text-gray-300">{aircraft.nextMaint}</p>
                      </div>
                      <span className={`px-3 py-1.5 rounded-md text-[10px] font-bold tracking-wider border ${
                        aircraft.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                        aircraft.status === 'MAINTENANCE' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                        'bg-gray-800 text-gray-300 border-gray-600'
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
            <div className="p-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <CalendarClock size={14}/> Programación de Vuelos
                  {loadingWeather && <span className="ml-2 text-[10px] text-blue-400 animate-pulse normal-case font-normal">(Validando METEO...)</span>}
                </h4>
              </div>
              
              <div className="space-y-2">
                {dynamicMissions.map((mission) => (
                  <div key={mission.id} className="flex flex-col sm:flex-row justify-between p-3.5 rounded-lg bg-[#1e293b] border border-gray-700/80 border-l-4 shadow-sm" style={{
                    borderLeftColor: mission.currentStatus === 'ON_TIME' ? '#10b981' : mission.currentStatus === 'DELAYED' ? '#ef4444' : '#6b7280'
                  }}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-bold text-sm tracking-wide">{mission.id}</p>
                        <span className="text-[10px] text-gray-300 px-2 py-0.5 bg-[#0f172a] rounded font-mono border border-gray-700">{mission.time}</span>
                      </div>
                      <p className="text-xs font-semibold text-blue-400">{mission.title}</p>
                      <p className="text-[11px] text-gray-400 flex items-center mt-1.5">
                        <ChevronRight size={14} className="mr-0.5 text-gray-500"/> Destino: <span className="text-gray-300 ml-1">{mission.dest}</span>
                      </p>
                    </div>
                    <div className="mt-3 sm:mt-0 flex items-center shrink-0">
                      {mission.currentStatus === 'ON_TIME' && <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1.5 rounded-md"><CheckCircle2 size={14}/> A TIEMPO</span>}
                      {mission.currentStatus === 'DELAYED' && <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-red-500 bg-red-500/10 border border-red-500/20 px-2.5 py-1.5 rounded-md"><ShieldAlert size={14}/> CERRADO / METEO</span>}
                      {mission.currentStatus === 'SCHEDULED' && <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-gray-400 bg-gray-800 border border-gray-700 px-2.5 py-1.5 rounded-md">PROGRAMADA</span>}
                    </div>
                  </div>
                ))}
                
                {dynamicMissions.length === 0 && (
                  <div className="text-center py-10 bg-gray-800/20 rounded-lg border border-gray-700 border-dashed">
                    <Plane size={24} className="mx-auto text-gray-600 mb-2"/>
                    <p className="text-gray-400 text-xs font-medium">No hay misiones programadas para esta base.</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
      
    </section>
  );
}
