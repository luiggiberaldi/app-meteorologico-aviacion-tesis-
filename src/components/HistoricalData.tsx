"use client";

import React, { useState, useEffect } from 'react';
import { useBaseContext } from '@/context/BaseContext';
import { History, ThermometerSun, CloudRain } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ComposedChart, Line
} from 'recharts';

export default function HistoricalData() {
  const { selectedBase, bases } = useBaseContext();
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);

  // Si no hay base seleccionada (Todas las bases), usamos la capital (SVMI) como referencia histórica nacional.
  const activeBase = selectedBase || bases.find(b => b.codigo === 'SVMI') || bases[0];

  useEffect(() => {
    let mounted = true;
    async function fetchHistory() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${activeBase.latitud}&longitude=${activeBase.longitud}&past_days=7&forecast_days=1&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
        );
        if (!res.ok) throw new Error("API Error");
        const json = await res.json();
        
        if (mounted && json.daily) {
          const formatted = json.daily.time.slice(0, 7).map((dateStr: string, index: number) => {
            // Ajustar zona horaria local simple
            const dateObj = new Date(dateStr + "T12:00:00Z");
            return {
              date: dateObj.toLocaleDateString('es-VE', { weekday: 'short', day: '2-digit' }),
              tempMax: json.daily.temperature_2m_max[index],
              tempMin: json.daily.temperature_2m_min[index],
              precip: json.daily.precipitation_sum[index]
            };
          });
          setHistoryData(formatted);
          setLoading(false);
        }
      } catch (e) {
        if (mounted) setLoading(false);
      }
    }
    
    fetchHistory();
    return () => { mounted = false; };
  }, [activeBase]);

  return (
    <section className="bg-[#1e293b] rounded-xl border border-gray-700 p-5 flex flex-col shadow-lg h-full">
      <div className="mb-4 border-b border-gray-700 pb-2 flex items-center justify-between">
        <h3 className="text-md font-semibold text-white flex items-center">
          <History size={18} className="mr-2 text-[#8b5cf6]" />
          Análisis de Datos Históricos (Últimos 7 días)
        </h3>
        <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-1 rounded border border-purple-500/50">
          {selectedBase ? activeBase.nombre : `Referencia Nacional (${activeBase.codigo})`}
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-5">
        {loading ? (
          <div className="flex-1 flex justify-center items-center py-10">
            <div className="w-8 h-8 border-4 border-[#8b5cf6]/30 border-t-[#8b5cf6] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Gráfico de Temperaturas */}
            <div className="h-64 w-full bg-[#0f172a] p-3 rounded-lg border border-gray-700/50 shadow-inner flex flex-col">
              <h4 className="text-xs text-gray-400 mb-3 flex items-center gap-1 font-bold uppercase">
                <ThermometerSun size={14} className="text-amber-400"/> Evolución Térmica (°C)
              </h4>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} domain={['dataMin - 2', 'dataMax + 2']} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '8px', fontSize: '12px' }}
                      itemStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Area type="monotone" dataKey="tempMax" fill="#f59e0b" stroke="#f59e0b" fillOpacity={0.1} name="Máxima" />
                    <Line type="monotone" dataKey="tempMin" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3, fill: '#38bdf8', strokeWidth: 0 }} name="Mínima" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gráfico de Precipitaciones */}
            <div className="h-64 w-full bg-[#0f172a] p-3 rounded-lg border border-gray-700/50 shadow-inner flex flex-col">
               <h4 className="text-xs text-gray-400 mb-3 flex items-center gap-1 font-bold uppercase">
                <CloudRain size={14} className="text-blue-400"/> Lluvia Registrada (mm)
              </h4>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '8px', fontSize: '12px' }}
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    />
                    <Bar dataKey="precip" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Precipitación" maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
