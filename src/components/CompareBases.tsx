"use client";

import React, { useEffect, useState } from 'react';
import { useBaseContext, BaseAerea } from '@/context/BaseContext';
import { Activity, Thermometer, Wind, Eye, Gauge, CloudLightning, Loader2 } from 'lucide-react';
import { kmhToKnots, degreesToCardinal } from '@/lib/utils';

interface WeatherSnapshot {
  temperature_2m: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  visibility: number;
  surface_pressure: number;
  cloud_cover: number;
}

interface BaseWeatherStatus {
  base: BaseAerea;
  weather: WeatherSnapshot | null;
  loading: boolean;
  error: boolean;
}

export default function CompareBases() {
  const { bases } = useBaseContext();
  const [comparisons, setComparisons] = useState<BaseWeatherStatus[]>([]);
  const [loadingAll, setLoadingAll] = useState(true);

  useEffect(() => {
    // Inicializar estado
    const initStatuses = bases.map(b => ({
      base: b,
      weather: null,
      loading: true,
      error: false
    }));
    setComparisons(initStatuses);

    // Función para obtener clima de una base específica
    const fetchBaseWeather = async (base: BaseAerea) => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${base.latitud}&longitude=${base.longitud}&current=temperature_2m,wind_speed_10m,wind_direction_10m,visibility,surface_pressure,cloud_cover`);
        if (!res.ok) throw new Error("Error fetching weather");
        
        const json = await res.json();
        
        setComparisons(prev => prev.map(c => {
          if (c.base.id === base.id) {
            return {
              ...c,
              loading: false,
              error: false,
              weather: {
                temperature_2m: json.current.temperature_2m,
                wind_speed_10m: json.current.wind_speed_10m,
                wind_direction_10m: json.current.wind_direction_10m,
                visibility: json.current.visibility,
                surface_pressure: json.current.surface_pressure,
                cloud_cover: json.current.cloud_cover
              }
            };
          }
          return c;
        }));
      } catch (err) {
        setComparisons(prev => prev.map(c => 
          c.base.id === base.id ? { ...c, loading: false, error: true } : c
        ));
      }
    };

    // Lanzar peticiones en paralelo
    Promise.all(bases.map(b => fetchBaseWeather(b))).finally(() => {
      setLoadingAll(false);
    });
  }, [bases]);

  // Función para determinar el estado visual
  const getSimulatedStatus = (weather: WeatherSnapshot | null) => {
    if (!weather) return { text: "DESCONOCIDO", bg: "bg-gray-700", textCol: "text-gray-300" };
    
    const visKm = weather.visibility ? weather.visibility / 1000 : 10;
    
    if (visKm > 8 && weather.wind_speed_10m < 20) {
      return { text: "ÓPTIMO", bg: "bg-green-500/20", textCol: "text-green-400" };
    } else if (visKm > 5 && weather.wind_speed_10m < 30) {
      return { text: "PRECAUCIÓN", bg: "bg-yellow-500/20", textCol: "text-yellow-400" };
    } else {
      return { text: "RESTRINGIDO", bg: "bg-red-500/20", textCol: "text-red-400" };
    }
  };

  return (
    <section id="comparar" className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <span className="w-1.5 h-5 bg-[#3b82f6] rounded mr-2"></span>
          Comparativa Nacional en Tiempo Real
        </h3>
        {loadingAll && (
          <span className="text-xs text-blue-400 flex items-center gap-1">
            <Loader2 size={12} className="animate-spin" /> Actualizando...
          </span>
        )}
      </div>

      <div className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0f172a] text-xs text-gray-400 uppercase tracking-wider border-b border-gray-700">
                <th className="px-4 py-3 font-medium">Base Aérea</th>
                <th className="px-4 py-3 font-medium text-center">Temp <Thermometer size={14} className="inline ml-1" /></th>
                <th className="px-4 py-3 font-medium text-center">Viento <Wind size={14} className="inline ml-1" /></th>
                <th className="px-4 py-3 font-medium text-center">Visib <Eye size={14} className="inline ml-1" /></th>
                <th className="px-4 py-3 font-medium text-center">Presión <Gauge size={14} className="inline ml-1" /></th>
                <th className="px-4 py-3 font-medium text-center">Nubes <CloudLightning size={14} className="inline ml-1" /></th>
                <th className="px-4 py-3 font-medium text-center">Operatividad <Activity size={14} className="inline ml-1" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {comparisons.map((item) => {
                const status = getSimulatedStatus(item.weather);
                
                return (
                  <tr key={item.base.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-200 text-sm">{item.base.nombre}</div>
                      <div className="text-xs text-gray-500">{item.base.ciudad}, {item.base.estado}</div>
                    </td>
                    
                    {item.loading ? (
                      <td colSpan={6} className="px-4 py-3 text-center text-gray-500 text-sm">
                        <Loader2 size={16} className="animate-spin inline mr-2 text-blue-500" /> Cargando telesensor...
                      </td>
                    ) : item.error ? (
                      <td colSpan={6} className="px-4 py-3 text-center text-red-500/70 text-sm">
                        Sin conexión con la estación
                      </td>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-center font-mono text-sm text-gray-300">
                          {item.weather?.temperature_2m}°C
                        </td>
                        <td className="px-4 py-3 text-center font-mono text-sm text-gray-300">
                          <div className="flex flex-col items-center">
                            <span>{item.weather && item.weather.wind_speed_10m !== undefined ? kmhToKnots(item.weather.wind_speed_10m) : '--'} <span className="text-xs text-gray-500">KT</span></span>
                            {item.weather && item.weather.wind_direction_10m !== undefined && (
                              <span className="text-[10px] text-gray-500 block leading-tight">{degreesToCardinal(item.weather.wind_direction_10m)}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center font-mono text-sm text-gray-300">
                          {item.weather?.visibility ? (item.weather.visibility / 1000).toFixed(1) : '--'} <span className="text-xs text-gray-500">km</span>
                        </td>
                        <td className="px-4 py-3 text-center font-mono text-sm text-gray-300">
                          {item.weather?.surface_pressure} <span className="text-xs text-gray-500">hPa</span>
                        </td>
                        <td className="px-4 py-3 text-center font-mono text-sm text-gray-300">
                          {item.weather?.cloud_cover}%
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2.5 py-1 rounded inline-flex items-center text-xs font-bold leading-none ${status.bg} ${status.textCol}`}>
                            {status.text}
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
