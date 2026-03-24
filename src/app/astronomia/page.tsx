"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useBaseContext } from '@/context/BaseContext';
import {
  getSunTimes, getMoonTimes, getLunarPhase, getSolarDeclination, getSolarElevation,
  getNextEquinoxSolstice, getRainySeasonInfo, getZCITPosition,
  type SunTimes, type LunarPhaseInfo, type MoonTimes, type AstroEvent, type SeasonInfo, type ZCITInfo
} from '@/lib/astro';
import { Sunrise, Sunset, MoonStar, CloudRain, CloudSun, Radar, ArrowDown, ArrowUp, Clock, Orbit, Crosshair, Shield, Eye, Target, ScanLine } from 'lucide-react';

export default function AstronomiaPage() {
  const { selectedBase, bases } = useBaseContext();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000); // actualizar cada 1 min
    return () => clearInterval(t);
  }, []);

  // Usar la base seleccionada o un promedio central de Venezuela
  const base = selectedBase || { latitud: 10.25, longitud: -67.59, nombre: 'Red Nacional (Promedio)', estado: 'Aragua', codigo: 'NAC' } as any;

  const sunData: SunTimes = useMemo(() => getSunTimes(base.latitud, base.longitud, now), [base, now]);
  const moonData: MoonTimes = useMemo(() => getMoonTimes(base.latitud, base.longitud, now), [base, now]);
  const lunarPhase: LunarPhaseInfo = useMemo(() => getLunarPhase(now), [now]);
  const solarDecl: number = useMemo(() => getSolarDeclination(now), [now]);
  const solarElev: number = useMemo(() => getSolarElevation(base.latitud, base.longitud, now), [base, now]);
  const nextEvent: AstroEvent = useMemo(() => getNextEquinoxSolstice(now), [now]);
  const seasonInfo: SeasonInfo = useMemo(() => getRainySeasonInfo(base.estado || 'Aragua', now), [base, now]);
  const zcit: ZCITInfo = useMemo(() => getZCITPosition(now), [now]);

  const cardBase = "bg-[#1e293b] rounded-2xl border border-gray-700/50 overflow-hidden";
  const headerBase = "px-5 py-3 border-b border-gray-700/40 flex items-center gap-3";

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
          <Crosshair className="text-amber-400" size={28} />
          Astronomía y Estaciones
        </h1>
        <p className="text-gray-400 text-xs md:text-sm mt-1">
          Datos astronómicos y climatológicos — <span className="text-emerald-400 font-semibold">{base.nombre}</span>
          {' '}({base.latitud?.toFixed(2)}°N, {base.longitud?.toFixed(2)}°W)
        </p>
      </div>

      {/* TOP ROW: Sol + Luna */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">

        {/* ═══ PANEL SOLAR ═══ */}
        <div className={cardBase}>
          <div className={`${headerBase} bg-gradient-to-r from-amber-900/30 to-transparent`}>
            <Sunrise className="text-amber-400" size={22} />
            <h2 className="text-white font-bold text-sm">Telemetría Solar</h2>
            <span className="ml-auto text-[10px] text-gray-500 uppercase font-bold tracking-widest">TIEMPO REAL</span>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StatBox icon={<Sunrise size={16} className="text-amber-400" />} label="Salida del Sol" value={sunData.sunrise + " UTC"} />
              <StatBox icon={<Sunset size={16} className="text-orange-400" />} label="Puesta del Sol" value={sunData.sunset + " UTC"} />
              <StatBox icon={<Clock size={16} className="text-yellow-300" />} label="Duración del Día" value={`${sunData.dayLengthHours}h ${sunData.dayLengthMinutes}m`} />
              <StatBox icon={<Target size={16} className="text-amber-500" />} label="Mediodía Solar" value={sunData.solarNoon + " UTC"} />
            </div>

            {/* Declinación Solar */}
            <div className="bg-[#0f172a] rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Declinación Solar</span>
                <span className="text-lg font-mono font-bold text-amber-400">{solarDecl.toFixed(2)}°</span>
              </div>
              {/* Barra visual */}
              <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-gradient-to-r from-blue-500 via-amber-400 to-red-500 rounded-full transition-all"
                  style={{ width: `${((solarDecl + 23.5) / 47) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-gray-600 mt-1 font-mono">
                <span>-23.5° (Invierno)</span>
                <span>0° (Equinoccio)</span>
                <span>+23.5° (Verano)</span>
              </div>
            </div>

            {/* Inclinación / Elevación Solar */}
            <div className="bg-[#0f172a] rounded-xl p-4 border border-gray-800 mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Inclinación (Elevación) Solar</span>
                <span className={`text-lg font-mono font-bold ${solarElev > 0 ? 'text-amber-400' : 'text-indigo-400'}`}>
                  {solarElev > 0 ? '+' : ''}{solarElev.toFixed(2)}°
                </span>
              </div>
              {/* Barra visual - Horizonte a Cénit */}
              <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`absolute h-full rounded-full transition-all ${solarElev > 0 ? 'bg-gradient-to-r from-orange-500 to-yellow-300' : 'bg-gradient-to-r from-indigo-900 to-indigo-500'}`}
                  style={{ width: `${Math.max(0, Math.min(100, ((solarElev + 90) / 180) * 100))}%` }}
                />
                {/* Línea del horizonte (0°) */}
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-600/50" />
              </div>
              <div className="flex justify-between text-[9px] text-gray-600 mt-1 font-mono relative">
                <span className="w-1/3 text-left">-90° (Nadir)</span>
                <span className="w-1/3 text-center">0° (Horizonte)</span>
                <span className="w-1/3 text-right">+90° (Cénit)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ PANEL LUNAR ═══ */}
        <div className={cardBase}>
          <div className={`${headerBase} bg-gradient-to-r from-indigo-900/30 to-transparent`}>
            <ScanLine className="text-indigo-300" size={22} />
            <h2 className="text-white font-bold text-sm">Telemetría Lunar</h2>
            <span className="ml-auto text-[10px] text-gray-500 uppercase font-bold tracking-widest">CICLO SINÓDICO</span>
          </div>
          <div className="p-5 space-y-4">
            {/* Fase principal */}
            <div className="flex items-center gap-5">
              {/* Disco lunar estilizado */}
              <div className="relative w-16 h-16 shrink-0">
                <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
                <div
                  className="absolute inset-[3px] rounded-full transition-all duration-700"
                  style={{
                    background: `linear-gradient(90deg, #c7d2fe ${lunarPhase.illumination}%, #1e1b4b ${lunarPhase.illumination}%)`,
                    boxShadow: lunarPhase.illumination > 50 ? '0 0 16px rgba(199,210,254,0.3)' : 'none'
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-mono font-bold text-white drop-shadow-lg">{lunarPhase.illumination}%</span>
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold text-base">{lunarPhase.phase}</h3>
                <p className="text-indigo-300 text-xs font-semibold mt-1">Iluminación: {lunarPhase.illumination}%</p>
                <p className="text-gray-500 text-[11px] mt-0.5">Día {lunarPhase.age} de 29.5 del ciclo</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StatBox icon={<ArrowUp size={16} className="text-indigo-300" />} label="Salida de la Luna" value={moonData.moonrise + " UTC"} />
              <StatBox icon={<ArrowDown size={16} className="text-indigo-400" />} label="Puesta de la Luna" value={moonData.moonset + " UTC"} />
              <StatBox icon={<MoonStar size={16} className="text-blue-300" />} label="Próxima Luna Nueva" value={lunarPhase.nextNewMoon.toLocaleDateString('es-VE', { day: 'numeric', month: 'short' })} />
              <StatBox icon={<Eye size={16} className="text-yellow-200" />} label="Próxima Luna Llena" value={lunarPhase.nextFullMoon.toLocaleDateString('es-VE', { day: 'numeric', month: 'short' })} />
            </div>
          </div>
        </div>
      </div>

      {/* SECOND ROW: Equinoccio + Estaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">

        {/* ═══ EQUINOCCIOS / SOLSTICIOS ═══ */}
        <div className={cardBase}>
          <div className={`${headerBase} bg-gradient-to-r from-purple-900/30 to-transparent`}>
            <Orbit className="text-purple-400" size={22} />
            <h2 className="text-white font-bold text-sm">Equinoccios y Solsticios</h2>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-5 mb-4">
              <div className="w-14 h-14 shrink-0 rounded-full bg-purple-500/10 border-2 border-purple-500/30 flex items-center justify-center">
                <Orbit size={24} className="text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base">{nextEvent.name}</h3>
                <p className="text-gray-400 text-sm mt-1">{nextEvent.date.toLocaleDateString('es-VE', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="text-purple-400 font-bold text-sm mt-1">
                  {nextEvent.daysUntil === 0 ? '¡Hoy!' : `Faltan ${nextEvent.daysUntil} días`}
                </p>
              </div>
            </div>
            {/* Progreso del año */}
            <div className="bg-[#0f172a] rounded-xl p-4 border border-gray-800">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block mb-2">Progreso del Año Solar</span>
              <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-gradient-to-r from-green-500 via-yellow-400 via-orange-400 to-blue-500 rounded-full transition-all"
                  style={{ width: `${(dayOfYearHelper(now) / 365) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-gray-600 mt-1">
                <span>🌱 Mar 20</span>
                <span>☀️ Jun 21</span>
                <span>🍂 Sep 22</span>
                <span>❄️ Dic 21</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ PERÍODO LLUVIOSO / SECO ═══ */}
        <div className={cardBase}>
          <div className={`${headerBase} bg-gradient-to-r ${seasonInfo.currentSeason === 'lluvioso' ? 'from-blue-900/30' : seasonInfo.currentSeason === 'seco' ? 'from-orange-900/30' : 'from-teal-900/30'} to-transparent`}>
            {seasonInfo.currentSeason === 'lluvioso' ? <CloudRain className="text-blue-400" size={22} /> : <Shield className="text-orange-400" size={22} />}
            <h2 className="text-white font-bold text-sm">Período Climatológico Operacional</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 shrink-0 rounded-full border-2 flex items-center justify-center ${seasonInfo.currentSeason === 'lluvioso' ? 'bg-blue-500/10 border-blue-500/30' : seasonInfo.currentSeason === 'seco' ? 'bg-orange-500/10 border-orange-500/30' : 'bg-teal-500/10 border-teal-500/30'}`}>
                {seasonInfo.currentSeason === 'lluvioso' ? <CloudRain size={20} className="text-blue-400" /> : <Shield size={20} className="text-orange-400" />}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{seasonInfo.seasonLabel}</h3>
                <p className="text-gray-400 text-xs">
                  Próximo cambio: <span className="text-emerald-400 font-semibold">{seasonInfo.nextSeasonLabel}</span> en {seasonInfo.daysUntilChange} días
                </p>
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="bg-[#0f172a] rounded-xl p-4 border border-gray-800">
              <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">
                <span>Progreso de la Estación</span>
                <span>{seasonInfo.progressPercent}%</span>
              </div>
              <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`absolute h-full rounded-full transition-all ${seasonInfo.currentSeason === 'lluvioso' ? 'bg-blue-500' : seasonInfo.currentSeason === 'seco' ? 'bg-orange-400' : 'bg-teal-400'}`}
                  style={{ width: `${seasonInfo.progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 mt-2">
                <span>🌧️ Lluvias: {seasonInfo.rainyStart} — {seasonInfo.rainyEnd}</span>
                <span>☀️ Seco: {seasonInfo.dryStart} — {seasonInfo.dryEnd}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* THIRD ROW: ZCIT */}
      <div className={cardBase}>
        <div className={`${headerBase} bg-gradient-to-r from-cyan-900/30 to-transparent`}>
          <Radar className="text-cyan-400" size={22} />
          <h2 className="text-white font-bold text-sm">Zona de Convergencia Intertropical (ZCIT)</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0f172a] rounded-xl p-4 border border-gray-800 text-center">
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">Posición Estimada</p>
              <p className="text-3xl font-mono font-bold text-cyan-400">{zcit.estimatedLatitude}°N</p>
              <p className="text-[10px] text-gray-500 mt-1">Latitud sobre el Atlántico Occidental</p>
            </div>
            <div className="md:col-span-2 bg-[#0f172a] rounded-xl p-4 border border-gray-800">
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">Influencia sobre Venezuela</p>
              <p className="text-sm text-gray-300 leading-relaxed">{zcit.influenceOnVenezuela}</p>
              <p className="text-xs text-gray-500 mt-3 italic">{zcit.description}</p>
            </div>
          </div>
          {/* Barra visual de posición */}
          <div className="mt-4 bg-[#0f172a] rounded-xl p-4 border border-gray-800">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block mb-2">Rango anual de la ZCIT (Atlántico Occidental)</span>
            <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all"
                style={{ width: `${((zcit.estimatedLatitude) / 14) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-gray-600 mt-1 font-mono">
              <span>0°N (Ecuador)</span>
              <span>5°N (Sur VEN)</span>
              <span>10°N (Centro VEN)</span>
              <span>14°N (Caribe)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mini Componente ──────────────────────────────
function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-[#0f172a] rounded-xl p-3 border border-gray-800">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">{label}</span>
      </div>
      <p className="text-white font-bold text-sm font-mono">{value}</p>
    </div>
  );
}

function dayOfYearHelper(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86400000);
}
