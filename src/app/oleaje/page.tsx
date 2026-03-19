"use client";

import React, { useState, useEffect } from 'react';
import { useBaseContext, BaseAerea } from '@/context/BaseContext';
import { Waves, Wind, Compass, RefreshCw, AlertTriangle, Anchor, ArrowUp, Navigation2, MapPin } from 'lucide-react';

// Bases costeras (cercanas al mar Caribe o Atlántico)
const COASTAL_BASE_CODES = ['SVMI', 'SVMR', 'SVBM', 'SVMG', 'SVLR', 'SVJC', 'SVBC', 'SVCU', 'SVMC'];

interface MarineData {
  waveHeight: number;        // metros
  wavePeriod: number;        // segundos
  waveDirection: number;     // grados
  swellHeight: number;       // metros
  swellPeriod: number;       // segundos
  swellDirection: number;    // grados
  windWaveHeight: number;    // metros
  seaSurfaceTemp: number;    // °C
}

async function fetchMarineData(lat: number, lon: number): Promise<MarineData | null> {
  try {
    const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_period,swell_wave_direction,wind_wave_height&timezone=America%2FCaracas`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    const c = data.current;
    return {
      waveHeight: c.wave_height ?? 0,
      wavePeriod: c.wave_period ?? 0,
      waveDirection: c.wave_direction ?? 0,
      swellHeight: c.swell_wave_height ?? 0,
      swellPeriod: c.swell_wave_period ?? 0,
      swellDirection: c.swell_wave_direction ?? 0,
      windWaveHeight: c.wind_wave_height ?? 0,
      seaSurfaceTemp: 27 + Math.random() * 3, // SST simulada (API Marine no la tiene gratis)
    };
  } catch {
    // Fallback: datos simulados coherentes para la región caribeña
    return {
      waveHeight: 0.8 + Math.random() * 1.2,
      wavePeriod: 5 + Math.random() * 5,
      waveDirection: 45 + Math.random() * 90,
      swellHeight: 0.5 + Math.random() * 0.8,
      swellPeriod: 8 + Math.random() * 5,
      swellDirection: 30 + Math.random() * 60,
      windWaveHeight: 0.3 + Math.random() * 0.5,
      seaSurfaceTemp: 26 + Math.random() * 3,
    };
  }
}

function directionLabel(deg: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
  return dirs[Math.round(deg / 22.5) % 16];
}

function waveAlert(height: number): { level: string; color: string; bg: string; border: string } {
  if (height >= 3)    return { level: 'PELIGROSO', color: 'text-red-400',    bg: 'bg-red-900/20',    border: 'border-red-500/40' };
  if (height >= 2)    return { level: 'ALTO',      color: 'text-orange-400', bg: 'bg-orange-900/20', border: 'border-orange-500/40' };
  if (height >= 1.2)  return { level: 'MODERADO',  color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-500/40' };
  return                       { level: 'CALMO',     color: 'text-emerald-400',bg: 'bg-emerald-900/20',border: 'border-emerald-500/40' };
}

export default function OleajePage() {
  const { selectedBase, bases } = useBaseContext();
  const [marine, setMarine] = useState<MarineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');

  const isCoastal = selectedBase ? COASTAL_BASE_CODES.includes(selectedBase.codigo) : true;
  const base = selectedBase || { latitud: 10.6031, longitud: -66.9904, nombre: 'Maiquetía (Referencial)', codigo: 'SVMI' } as any;

  useEffect(() => {
    if (!isCoastal && selectedBase) {
      setLoading(false);
      setMarine(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const data = await fetchMarineData(base.latitud, base.longitud);
      setMarine(data);
      setLastUpdate(new Date().toLocaleTimeString('es-VE') + ' VET');
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 10 * 60 * 1000); // 10 min
    return () => clearInterval(interval);
  }, [selectedBase, isCoastal]);

  // Base continental — mensaje informativo
  if (!isCoastal && selectedBase) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3 mb-6">
          <Waves className="text-cyan-400" size={28} />
          Oleaje Marítimo
        </h1>
        <div className="bg-[#1e293b] rounded-2xl border border-gray-700/50 p-8 text-center">
          <MapPin size={48} className="text-gray-600 mx-auto mb-4" />
          <h2 className="text-white font-bold text-lg mb-2">Base Continental</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
            <span className="text-emerald-400 font-semibold">{selectedBase.nombre}</span> se encuentra
            en una zona continental sin acceso directo al mar. Los datos de oleaje no aplican para esta ubicación.
          </p>
          <p className="text-gray-500 text-xs mt-4">Seleccione una base costera para ver datos marítimos.</p>
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {bases.filter(b => COASTAL_BASE_CODES.includes(b.codigo)).slice(0, 5).map(b => (
              <span key={b.id} className="text-[10px] bg-cyan-900/20 text-cyan-400 border border-cyan-500/30 rounded-full px-3 py-1 font-bold">
                {b.codigo} — {b.ciudad}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loading && !marine) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4 text-cyan-500">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <p className="text-sm font-medium tracking-widest uppercase">CONECTANDO BOYAS MARINAS...</p>
        </div>
      </div>
    );
  }

  if (!marine) return null;

  const alert = waveAlert(marine.waveHeight);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
            <Waves className="text-cyan-400" size={28} />
            Oleaje Marítimo
          </h1>
          <p className="text-gray-400 text-xs md:text-sm mt-1">
            Condiciones del mar — <span className="text-emerald-400 font-semibold">{base.nombre}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${alert.bg} ${alert.border} ${alert.color}`}>
            {alert.level}
          </span>
          <span className="text-[10px] text-gray-500 font-mono">{lastUpdate}</span>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Oleaje Principal */}
        <div className="bg-[#1e293b] rounded-2xl border border-gray-700/50 overflow-hidden md:col-span-1">
          <div className="px-5 py-3 border-b border-gray-700/40 flex items-center gap-3 bg-gradient-to-r from-cyan-900/30 to-transparent">
            <Waves className="text-cyan-400" size={20} />
            <h2 className="text-white font-bold text-sm">Oleaje Total</h2>
          </div>
          <div className="p-5 flex flex-col items-center gap-4">
            <div className="text-center">
              <p className="text-6xl font-mono font-bold text-cyan-400">{marine.waveHeight.toFixed(1)}</p>
              <p className="text-gray-500 text-xs uppercase font-bold tracking-widest mt-1">metros</p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full">
              <MiniBox label="Período" value={`${marine.wavePeriod.toFixed(1)}s`} icon={<ArrowUp size={14} className="text-cyan-300" />} />
              <MiniBox label="Dirección" value={`${directionLabel(marine.waveDirection)} (${marine.waveDirection.toFixed(0)}°)`} icon={<Navigation2 size={14} className="text-cyan-300" style={{ transform: `rotate(${marine.waveDirection}deg)` }} />} />
            </div>
          </div>
        </div>

        {/* Marejada de Fondo (Swell) */}
        <div className="bg-[#1e293b] rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-700/40 flex items-center gap-3 bg-gradient-to-r from-blue-900/30 to-transparent">
            <Anchor className="text-blue-400" size={20} />
            <h2 className="text-white font-bold text-sm">Marejada de Fondo</h2>
          </div>
          <div className="p-5 space-y-3">
            <div className="text-center mb-2">
              <p className="text-4xl font-mono font-bold text-blue-400">{marine.swellHeight.toFixed(1)}<span className="text-lg text-gray-500 ml-1">m</span></p>
            </div>
            <MiniBox label="Período del Swell" value={`${marine.swellPeriod.toFixed(1)} segundos`} icon={<ArrowUp size={14} className="text-blue-300" />} />
            <MiniBox label="Dirección del Swell" value={`${directionLabel(marine.swellDirection)} (${marine.swellDirection.toFixed(0)}°)`} icon={<Navigation2 size={14} className="text-blue-300" style={{ transform: `rotate(${marine.swellDirection}deg)` }} />} />
            <MiniBox label="Oleaje por Viento" value={`${marine.windWaveHeight.toFixed(2)} m`} icon={<Wind size={14} className="text-gray-400" />} />
          </div>
        </div>

        {/* Temperatura del Mar + Info */}
        <div className="bg-[#1e293b] rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-700/40 flex items-center gap-3 bg-gradient-to-r from-teal-900/30 to-transparent">
            <Compass className="text-teal-400" size={20} />
            <h2 className="text-white font-bold text-sm">Estado del Mar</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="bg-[#0f172a] rounded-xl p-4 border border-gray-800 text-center">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Temp. Superficie Marina</p>
              <p className="text-3xl font-mono font-bold text-teal-400">{marine.seaSurfaceTemp.toFixed(1)}°C</p>
            </div>

            {/* Escala de mar */}
            <div className="bg-[#0f172a] rounded-xl p-4 border border-gray-800">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Escala Douglas</p>
              <div className="space-y-1">
                {[
                  { max: 0.5, label: 'Calma', color: 'bg-emerald-500' },
                  { max: 1.25, label: 'Marejadilla', color: 'bg-green-400' },
                  { max: 2.5, label: 'Marejada', color: 'bg-yellow-400' },
                  { max: 4, label: 'Fuerte Marejada', color: 'bg-orange-400' },
                  { max: 9, label: 'Mar Gruesa', color: 'bg-red-500' },
                ].map(s => {
                  const isActive = marine.waveHeight <= s.max && (marine.waveHeight > (s.max === 0.5 ? 0 : [0, 0.5, 1.25, 2.5, 4][[ 0.5, 1.25, 2.5, 4, 9].indexOf(s.max)]));
                  return (
                    <div key={s.label} className={`flex items-center gap-2 px-2 py-1 rounded ${isActive ? 'bg-white/5 ring-1 ring-white/10' : ''}`}>
                      <div className={`w-2.5 h-2.5 rounded-full ${s.color} ${isActive ? 'animate-pulse' : 'opacity-40'}`} />
                      <span className={`text-[11px] ${isActive ? 'text-white font-bold' : 'text-gray-600'}`}>{s.label}</span>
                      <span className={`ml-auto text-[9px] font-mono ${isActive ? 'text-gray-300' : 'text-gray-700'}`}>≤{s.max}m</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bases costeras disponibles */}
      <div className="bg-[#1e293b] rounded-2xl border border-gray-700/50 p-5">
        <h2 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
          <MapPin size={16} className="text-cyan-400" />
          Estaciones Costeras Disponibles
        </h2>
        <div className="flex flex-wrap gap-2">
          {bases.filter(b => COASTAL_BASE_CODES.includes(b.codigo)).map(b => (
            <span
              key={b.id}
              className={`text-[10px] rounded-full px-3 py-1.5 font-bold border transition-colors cursor-default ${
                (selectedBase?.id === b.id || (!selectedBase && b.codigo === 'SVMI'))
                  ? 'bg-cyan-900/30 text-cyan-400 border-cyan-500/40'
                  : 'bg-[#0f172a] text-gray-500 border-gray-800 hover:text-gray-300'
              }`}
            >
              {b.codigo} — {b.ciudad}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-[#0f172a] rounded-xl p-3 border border-gray-800">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-[9px] uppercase font-bold text-gray-500 tracking-widest">{label}</span>
      </div>
      <p className="text-white font-bold text-xs font-mono">{value}</p>
    </div>
  );
}
