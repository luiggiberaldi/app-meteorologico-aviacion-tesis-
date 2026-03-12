"use client";

import React, { useState, useEffect } from 'react';
import { Plane, Wrench, CalendarClock, Settings, ShieldAlert, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

// Datos simulados para demostración operativa
const FLEET_DATA = [
  { id: 'YV-0101', type: 'Cessna 208 Caravan', status: 'ACTIVE', nextMaint: '15 días' },
  { id: 'YV-0102', type: 'Cessna 208 Caravan', status: 'MAINTENANCE', nextMaint: 'En curso' },
  { id: 'FAV-0245', type: 'C-130 Hercules', status: 'ACTIVE', nextMaint: '45 días' },
  { id: 'FAV-0246', type: 'C-130 Hercules', status: 'STANDBY', nextMaint: '12 días' },
  { id: 'YV-0305', type: 'Diamond DA42', status: 'ACTIVE', nextMaint: '60 días' },
];

const MISSIONS = [
  { id: 'M-101', title: 'Apoyo Logístico', dest: 'Base Aérea Libertador', time: '14:30 HLV', status: 'ON_TIME' },
  { id: 'M-102', title: 'Entrenamiento IF', dest: 'Local (Maracay)', time: '16:00 HLV', status: 'DELAYED' },
  { id: 'M-103', title: 'Reconocimiento', dest: 'Frontera Sur', time: '08:00 HLV (Mañana)', status: 'SCHEDULED' },
];

export default function OperationsManagement() {
  const [activeTab, setActiveTab] = useState<'FLEET' | 'MISSIONS'>('FLEET');
  
  // Contadores
  const activeCount = FLEET_DATA.filter(f => f.status === 'ACTIVE').length;
  const maintCount = FLEET_DATA.filter(f => f.status === 'MAINTENANCE').length;
  const standbyCount = FLEET_DATA.filter(f => f.status === 'STANDBY').length;
  
  return (
    <section className="bg-[#0f172a] rounded-xl border border-gray-700 overflow-hidden flex flex-col h-full shadow-lg">
      
      {/* Header */}
      <div className="bg-[#1e293b] p-5 border-b border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Plane className="text-[#3b82f6]" />
            Gestión de Operaciones
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Control de flota, aeronaves en operación y misiones programadas.
          </p>
        </div>
        
        {/* Pestañas (Tabs) */}
        <div className="bg-gray-800 p-1 rounded-lg flex gap-1 self-stretch sm:self-auto">
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
             <p className="text-xs text-gray-400 font-medium">EN VUELO / ACTIVAS</p>
          </div>
          <div className="bg-[#1e293b] rounded-lg p-3 border border-gray-700/50 flex flex-col items-center justify-center text-center">
             <div className="bg-gray-700/50 text-gray-300 p-2 rounded-full mb-2"><CheckCircle2 size={20} /></div>
             <p className="text-2xl font-bold text-white">{standbyCount}</p>
             <p className="text-xs text-gray-400 font-medium">DISPONIBLES</p>
          </div>
          <div className="bg-[#1e293b] rounded-lg p-3 border border-gray-700/50 flex flex-col items-center justify-center text-center">
             <div className="bg-orange-500/20 text-orange-400 p-2 rounded-full mb-2"><Wrench size={20} /></div>
             <p className="text-2xl font-bold text-white">{maintCount}</p>
             <p className="text-xs text-gray-400 font-medium">MANTENIMIENTO</p>
          </div>
        </div>

        {/* Contenido Dinámico por Pestaña */}
        <div className="flex-1 bg-[#1e293b]/50 rounded-lg border border-gray-700/30 overflow-hidden">
          
          {activeTab === 'FLEET' && (
            <div className="p-4 overflow-y-auto max-h-[300px]">
              <h4 className="text-sm font-bold text-gray-300 uppercase mb-4 flex items-center gap-2">
                <Settings size={16}/> Estatus por Aeronave
              </h4>
              <div className="space-y-3">
                {FLEET_DATA.map((aircraft) => (
                  <div key={aircraft.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-md bg-[#1e293b] border border-gray-700 hover:border-gray-600 transition-colors">
                    <div>
                      <p className="text-white font-bold">{aircraft.id}</p>
                      <p className="text-xs text-gray-400">{aircraft.type}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 sm:mt-0">
                      <div className="text-right">
                        <p className="text-[11px] text-gray-500 uppercase">Prox. Mantenimiento</p>
                        <p className="text-sm font-mono text-gray-300">{aircraft.nextMaint}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded text-xs font-bold ${
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
            <div className="p-4 overflow-y-auto max-h-[300px]">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                  <CalendarClock size={16}/> Programación de Vuelos
                </h4>
              </div>
              
              <div className="space-y-3">
                {MISSIONS.map((mission) => (
                  <div key={mission.id} className="flex flex-col sm:flex-row justify-between p-3 rounded-md bg-[#1e293b] border border-gray-700 border-l-4" style={{
                    borderLeftColor: mission.status === 'ON_TIME' ? '#10b981' : mission.status === 'DELAYED' ? '#ef4444' : '#6b7280'
                  }}>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-bold">{mission.id}</p>
                        <span className="text-xs text-gray-400 px-1.5 py-0.5 bg-gray-800 rounded">{mission.time}</span>
                      </div>
                      <p className="text-sm font-medium text-blue-400 mt-0.5">{mission.title}</p>
                      <p className="text-xs text-gray-400 flex items-center mt-1">
                        <ChevronRight size={14} className="mr-0.5"/> Destino: {mission.dest}
                      </p>
                    </div>
                    <div className="mt-3 sm:mt-0 flex items-center">
                      {mission.status === 'ON_TIME' && <span className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-900/20 px-2 py-1 rounded"><CheckCircle2 size={14}/> A TIEMPO</span>}
                      {mission.status === 'DELAYED' && <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-900/20 px-2 py-1 rounded"><ShieldAlert size={14}/> RETRASADA (METEO)</span>}
                      {mission.status === 'SCHEDULED' && <span className="flex items-center gap-1 text-xs font-bold text-gray-400 bg-gray-800 px-2 py-1 rounded">PROGRAMADA</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      
    </section>
  );
}
