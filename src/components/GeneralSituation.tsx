"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle2, AlertTriangle, Eye, Cloud, Wind, Thermometer, Droplets, Gauge, RefreshCw } from 'lucide-react';
import { useBaseContext } from '@/context/BaseContext';
import { kmhToKnots, degreesToCardinal } from '@/lib/utils';

interface WeatherData {
  windSpeed: number | null;
  windDirection: number | null;
  visibility: number | null;
  temperature: number | null;
  cloudCover: number | null;
  pressure: number | null;
  humidity: number | null;
}

export default function GeneralSituation() {
  const { selectedBase } = useBaseContext();
  const [weatherData, setWeatherData] = useState<WeatherData>({
    windSpeed: null, windDirection: null, visibility: null,
    temperature: null, cloudCover: null, pressure: null, humidity: null,
  });
  const [realTrend, setRealTrend] = useState<'stable' | 'improving' | 'deteriorating'>('stable');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchWeather() {
      setLoading(true);
      try {
        const lat = selectedBase ? selectedBase.latitud : 10.2475;
        const lon = selectedBase ? selectedBase.longitud : -67.5953;

        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,surface_pressure,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,relative_humidity_2m`
        );
        if (!res.ok) throw new Error("API Error");
        const json = await res.json();
        const c = json.current;

        // Datos pasados (1 hora atrás)
        const resPast = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&past_hours=1&hourly=visibility,cloud_cover&forecast_hours=1`
        );
        let pastVis = null;
        let pastCloud = null;
        if (resPast.ok) {
          const jsonPast = await resPast.json();
          if (jsonPast.hourly && jsonPast.hourly.visibility?.length > 0) {
            pastVis = jsonPast.hourly.visibility[0];
            pastCloud = jsonPast.hourly.cloud_cover[0];
          }
        }

        if (mounted) {
          setWeatherData({
            windSpeed: c.wind_speed_10m,
            windDirection: c.wind_direction_10m,
            visibility: c.visibility,
            temperature: c.temperature_2m,
            cloudCover: c.cloud_cover,
            pressure: c.surface_pressure,
            humidity: c.relative_humidity_2m,
          });

          // Calcular tendencia real comparando hace 1 hora con ahora
          let baseTrend: 'stable' | 'improving' | 'deteriorating' = 'stable';
          // Open-meteo visibility es en metros, cloud en %
          if (pastVis !== null && pastCloud !== null) {
            const visImprov = c.visibility - pastVis;
            const cloudImprov = pastCloud - c.cloud_cover; // menos nubes = mejor
            
            // Si visibilidad mejora por > 2km o nubes bajan > 20%
            if (visImprov > 2000 || cloudImprov > 20) baseTrend = 'improving';
            // Si visibilidad cae por > 2km o nubes suben > 20%
            else if (visImprov < -2000 || cloudImprov < -20) baseTrend = 'deteriorating';
          }

          setRealTrend(baseTrend);
          setLastUpdated(new Date());
          setLoading(false);
        }
      } catch {
        if (mounted) setLoading(false);
      }
    }
    fetchWeather();
    return () => { mounted = false; };
  }, [selectedBase]);

  // Manejo seguro de nulos
  const visibilityKm = (weatherData.visibility ?? 10000) / 1000;
  const windSpeedKmph = weatherData.windSpeed ?? 0;
  const cloudCoverPct = weatherData.cloudCover ?? 0;

  // Calcular estado general basado en datos reales
  const getOverallStatus = () => {
    if (visibilityKm > 8 && windSpeedKmph < 20 && cloudCoverPct < 50) {
      return { status: 'ÓPTIMO', color: 'green', icon: CheckCircle2 };
    } else if (visibilityKm > 5 && windSpeedKmph < 30) {
      return { status: 'ACEPTABLE', color: 'yellow', icon: AlertCircle };
    } else {
      return { status: 'PRECAUCIÓN', color: 'red', icon: AlertTriangle };
    }
  };

  const situation = getOverallStatus();
  const StatusIcon = situation.icon;

  const getTrendIcon = () => {
    if (realTrend === 'improving') return <span title="Mejorando respecto a hace 1 hora"><TrendingUp className="text-green-500" size={20} /></span>;
    if (realTrend === 'deteriorating') return <span title="Deteriorando respecto a hace 1 hora"><TrendingDown className="text-red-500" size={20} /></span>;
    return <span title="Estable"><Minus className="text-gray-400" size={20} /></span>;
  };

  const colorMap: Record<string, { border: string; bg: string; icon: string; badge: string }> = {
    green: { border: 'border-green-500/30', bg: 'bg-green-500/10', icon: 'text-green-500', badge: 'bg-green-500' },
    yellow: { border: 'border-yellow-500/30', bg: 'bg-yellow-500/10', icon: 'text-yellow-500', badge: 'bg-yellow-500' },
    red: { border: 'border-red-500/30', bg: 'bg-red-500/10', icon: 'text-red-500', badge: 'bg-red-500' },
  };
  const colors = colorMap[situation.color] || colorMap['green'];

  return (
    <section className="mb-8">
      <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl border-2 border-gray-700 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${colors.bg} border ${colors.border}`}>
              <StatusIcon className={colors.icon} size={28} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white uppercase">
                SITUACIÓN GENERAL - {selectedBase ? selectedBase.nombre : 'NACIONAL'}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Análisis meteorológico en tiempo real
                {lastUpdated && <span className="ml-2 text-gray-500">· Actualizado {lastUpdated.toLocaleTimeString('es-VE')}</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-500">Tendencia:</span>
            {getTrendIcon()}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 gap-3 text-gray-400">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="text-sm">Consultando sensores de {selectedBase ? selectedBase.nombre : 'Red Nacional'}...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Panel Izquierdo: Estado Operacional */}
            <div className="p-4 rounded-lg bg-[#0f172a] border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400 uppercase tracking-wide">Estado Operacional</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors.badge} text-white`}>
                  {situation.status}
                </span>
              </div>
              <div className="space-y-3 mt-2">
                <StatusItem
                  icon={<Eye size={16} />}
                  label="Visibilidad"
                  value={weatherData.visibility !== null ? `${visibilityKm.toFixed(1)} km` : '---'}
                  status={visibilityKm > 8 ? 'good' : visibilityKm > 5 ? 'warning' : 'danger'}
                />
                <StatusItem
                  icon={<Cloud size={16} />}
                  label="Nubosidad"
                  value={weatherData.cloudCover !== null ? `${weatherData.cloudCover}%` : '---'}
                  status={cloudCoverPct < 50 ? 'good' : cloudCoverPct < 75 ? 'warning' : 'danger'}
                />
                <StatusItem
                  icon={<Wind size={16} />}
                  label="Viento"
                  value={weatherData.windSpeed !== null ? `${kmhToKnots(weatherData.windSpeed)} KT / ${degreesToCardinal(weatherData.windDirection)} (${weatherData.windDirection ?? 0}°) ` : '---'}
                  status={windSpeedKmph < 20 ? 'good' : windSpeedKmph < 30 ? 'warning' : 'danger'}
                />
                <StatusItem
                  icon={<Thermometer size={16} />}
                  label="Temperatura"
                  value={weatherData.temperature !== null ? `${weatherData.temperature}°C` : '---'}
                  status="good"
                />
                <StatusItem
                  icon={<Gauge size={16} />}
                  label="Presión (QNH)"
                  value={weatherData.pressure !== null ? `${weatherData.pressure.toFixed(1)} hPa` : '---'}
                  status="good"
                />
                <StatusItem
                  icon={<Droplets size={16} />}
                  label="Humedad"
                  value={weatherData.humidity !== null ? `${weatherData.humidity}%` : '---'}
                  status={weatherData.humidity !== null && weatherData.humidity > 85 ? 'warning' : 'good'}
                />
              </div>
            </div>

            {/* Panel Derecho: Resumen Clave */}
            <div className="p-4 rounded-lg bg-[#0f172a] border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400 uppercase tracking-wide">Resumen Clave</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Condiciones meteorológicas actuales evaluadas según estándares INAC/OACI.
                La operatividad {selectedBase ? `en ${selectedBase.nombre}` : 'a nivel nacional'} se encuentra en estado <strong className={colors.icon}>{situation.status}</strong> para operaciones VFR regulares basadas en la visibilidad y nubosidad predominante.
              </p>

              <div className="mt-4 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Techo Estimado</h4>
                <p className="text-lg font-bold text-white">
                  {cloudCoverPct < 25 ? 'CAVOK (cielo despejado)' :
                   cloudCoverPct < 50 ? '> 3000 ft (FEW/SCT)' :
                   cloudCoverPct < 75 ? '1500 - 3000 ft (BKN)' :
                   '< 1500 ft (OVC)'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Basado en cobertura nubosa del {cloudCoverPct}%
                </p>
              </div>

              {selectedBase && (
                <div className="mt-4 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Ubicación</h4>
                  <p className="text-sm text-gray-300">
                    {selectedBase.ciudad}, {selectedBase.estado} — 
                    <span className="text-gray-500 ml-1">{selectedBase.latitud.toFixed(4)}N, {Math.abs(selectedBase.longitud).toFixed(4)}W</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Código OACI: {selectedBase.codigo}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function StatusItem({ icon, label, value, status }: { icon: React.ReactNode, label: string, value: string, status: 'good' | 'warning' | 'danger' }) {
  const statusColor = {
    good: 'text-green-400',
    warning: 'text-yellow-400',
    danger: 'text-red-400',
  }[status] || 'text-gray-400';

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0">
      <div className="flex items-center space-x-2 text-gray-400">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className={`text-sm font-semibold ${statusColor}`}>{value}</span>
    </div>
  );
}
