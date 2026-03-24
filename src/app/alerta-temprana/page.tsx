"use client";

import React, { useState, useEffect } from 'react';
import { useBaseContext } from '@/context/BaseContext';
import { WeatherService, WeatherData } from '@/lib/services/WeatherService';
import { generateEarlyAlerts, getFireRiskIndex, type EarlyAlert, type FireRisk } from '@/lib/astro';
import {
  AlertTriangle, Waves, Flame, CloudLightning, ShieldAlert, RefreshCw,
  TriangleAlert, CheckCircle2, Info, ChevronRight
} from 'lucide-react';
import { kmhToKnots } from '@/lib/utils';

const LEVEL_CONFIG = {
  verde:    { bg: 'bg-emerald-900/20', border: 'border-emerald-500/40', text: 'text-emerald-400', label: 'NORMAL',    icon: CheckCircle2 },
  amarillo: { bg: 'bg-yellow-900/20',  border: 'border-yellow-500/40',  text: 'text-yellow-400',  label: 'ATENCIÓN',  icon: Info },
  naranja:  { bg: 'bg-orange-900/20',  border: 'border-orange-500/40',  text: 'text-orange-400',  label: 'ALERTA',    icon: TriangleAlert },
  rojo:     { bg: 'bg-red-900/20',     border: 'border-red-500/40',     text: 'text-red-400',     label: 'EMERGENCIA', icon: ShieldAlert },
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  rio: Waves,
  ciclon: CloudLightning,
  incendio: Flame,
  oleaje: Waves,
};

export default function AlertaTempranaPage() {
  const { selectedBase } = useBaseContext();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<EarlyAlert[]>([]);
  const [fireRisk, setFireRisk] = useState<FireRisk | null>(null);
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const base = selectedBase || { latitud: 10.25, longitud: -67.59, nombre: 'Red Nacional (Promedio)', estado: 'Aragua' } as any;
      const w = await WeatherService.getCurrentWeather(base);
      setWeather(w);

      if (w) {
        const fire = getFireRiskIndex(w.temperature, w.humidity, w.windSpeed);
        setFireRisk(fire);

        const earlyAlerts = generateEarlyAlerts(
          w.temperature,
          w.humidity,
          w.windSpeed,
          w.surfacePressure,
          w.precipitation ?? 0,
          base.estado || 'Aragua',
          base.nombre
        );
        setAlerts(earlyAlerts);
      }
      setLastUpdate(new Date().toLocaleTimeString('es-VE') + ' VET');
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedBase]);

  if (loading && !weather) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4 text-amber-500">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <p className="text-sm font-medium tracking-widest uppercase">EVALUANDO AMENAZAS...</p>
        </div>
      </div>
    );
  }

  const baseName = selectedBase?.nombre || 'Red Nacional';

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
            <AlertTriangle className="text-amber-400" size={28} />
            Sistema de Alerta Temprana
          </h1>
          <p className="text-gray-400 text-xs md:text-sm mt-1">
            Monitoreo de amenazas — <span className="text-emerald-400 font-semibold">{baseName}</span>
          </p>
        </div>
        <div className="text-[10px] text-gray-500 font-mono">Última actualización: {lastUpdate}</div>
      </div>

      {/* Semáforo Visual */}
      <div className="bg-[#1e293b] rounded-2xl border border-gray-700/50 p-5">
        <h2 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
          <ShieldAlert size={18} className="text-amber-400" />
          Panel de Estado General
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {alerts.map((alert) => {
            const config = LEVEL_CONFIG[alert.level];
            const Icon = TYPE_ICONS[alert.type] || AlertTriangle;
            const LevelIcon = config.icon;
            return (
              <div
                key={alert.id}
                className={`${config.bg} border ${config.border} rounded-xl p-4 transition-all hover:scale-[1.02]`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bg} border ${config.border}`}>
                    <Icon size={20} className={config.text} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm truncate">{alert.title}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <LevelIcon size={12} className={config.text} />
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${config.text}`}>{config.label}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed mb-2">{alert.description}</p>
                <div className="bg-black/20 rounded-lg p-2.5 border border-gray-800/50">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Recomendación</p>
                  <p className="text-gray-300 text-[11px] leading-relaxed">{alert.recommendation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Panel de Riesgo de Incendio Detallado */}
      {fireRisk && (
        <div className="bg-[#1e293b] rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-700/40 flex items-center gap-3 bg-gradient-to-r from-red-900/20 to-transparent">
            <Flame className="text-orange-400" size={22} />
            <h2 className="text-white font-bold text-sm">Índice de Riesgo de Incendio Forestal</h2>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gauge visual */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                    <circle cx="80" cy="80" r="70" fill="none" stroke="#1f2937" strokeWidth="12" />
                    <circle
                      cx="80" cy="80" r="70" fill="none"
                      stroke={fireRisk.color}
                      strokeWidth="12"
                      strokeDasharray={`${(fireRisk.index / 100) * 440} 440`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-mono font-bold" style={{ color: fireRisk.color }}>{fireRisk.index}</span>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{fireRisk.level}</span>
                  </div>
                </div>
              </div>
              {/* Detalles */}
              <div className="space-y-3">
                <div className="bg-[#0f172a] rounded-xl p-4 border border-gray-800">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Descripción</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{fireRisk.description}</p>
                </div>
                {weather && (
                  <div className="grid grid-cols-3 gap-2">
                    <MiniStat label="Temp." value={`${weather.temperature.toFixed(0)}°C`} danger={weather.temperature > 35} />
                    <MiniStat label="Humedad" value={`${weather.humidity.toFixed(0)}%`} danger={weather.humidity < 30} />
                    <MiniStat label="Viento" value={`${kmhToKnots(weather.windSpeed)} KT`} danger={kmhToKnots(weather.windSpeed) > 13} />
                  </div>
                )}
                <div className="bg-[#0f172a] rounded-xl p-3 border border-gray-800">
                  <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1.5">
                    <span>Escala de Riesgo</span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden bg-gray-800 flex">
                    <div className="h-full bg-emerald-500 flex-1" />
                    <div className="h-full bg-yellow-400 flex-1" />
                    <div className="h-full bg-orange-500 flex-1" />
                    <div className="h-full bg-red-500 flex-1" />
                  </div>
                  <div className="flex justify-between text-[8px] text-gray-600 mt-1 font-mono">
                    <span>BAJO</span>
                    <span>MODERADO</span>
                    <span>ALTO</span>
                    <span>EXTREMO</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Datos meteorológicos de referencia */}
      {weather && (
        <div className="bg-[#1e293b] rounded-2xl border border-gray-700/50 p-5">
          <h2 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
            <Info size={18} className="text-blue-400" />
            Datos Meteorológicos de Referencia
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <RefBox label="Temperatura" value={`${weather.temperature.toFixed(1)}°C`} />
            <RefBox label="Humedad" value={`${weather.humidity.toFixed(0)}%`} />
            <RefBox label="Presión" value={`${weather.surfacePressure.toFixed(0)} hPa`} />
            <RefBox label="Viento" value={`${kmhToKnots(weather.windSpeed)} KT`} />
            <RefBox label="Precipitación" value={`${(weather.precipitation ?? 0).toFixed(1)} mm`} />
            <RefBox label="Nubosidad" value={`${weather.cloudCover}%`} />
            <RefBox label="Visibilidad" value={`${((weather.visibility ?? 10000) / 1000).toFixed(1)} km`} />
            <RefBox label="Punto Rocío" value={`${(weather.temperature - ((100 - weather.humidity) / 5)).toFixed(1)}°C`} />
          </div>
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value, danger }: { label: string; value: string; danger: boolean }) {
  return (
    <div className={`rounded-lg p-2.5 text-center border ${danger ? 'bg-red-900/20 border-red-500/30' : 'bg-[#0f172a] border-gray-800'}`}>
      <p className="text-[9px] text-gray-500 uppercase font-bold">{label}</p>
      <p className={`text-sm font-bold font-mono ${danger ? 'text-red-400' : 'text-white'}`}>{value}</p>
    </div>
  );
}

function RefBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0f172a] rounded-xl p-3 border border-gray-800 text-center">
      <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">{label}</p>
      <p className="text-white font-bold text-sm font-mono mt-1">{value}</p>
    </div>
  );
}
