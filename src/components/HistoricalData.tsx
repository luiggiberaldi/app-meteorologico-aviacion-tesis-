"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useBaseContext } from '@/context/BaseContext';
import { History, ThermometerSun, CloudRain, Search, Calendar } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ComposedChart, Line
} from 'recharts';

function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default function HistoricalData() {
  const { selectedBase, bases } = useBaseContext();
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);

  // Rango de fechas — por defecto últimos 7 días
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const [startDate, setStartDate] = useState(formatDateISO(sevenDaysAgo));
  const [endDate, setEndDate] = useState(formatDateISO(today));
  const [activeRange, setActiveRange] = useState<{ start: string; end: string }>({ start: formatDateISO(sevenDaysAgo), end: formatDateISO(today) });

  // Si no hay base seleccionada (Todas las bases), usamos la capital (SVMI) como referencia histórica nacional.
  const activeBase = selectedBase || bases.find(b => b.codigo === 'SVMI') || bases[0];

  const fetchHistory = useCallback(async (start: string, end: string) => {
    setLoading(true);
    try {
      // Determinar si usamos la API de forecast (datos recientes) o archive (históricos)
      const diffDays = Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
      const daysAgo = Math.ceil((today.getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));

      let url: string;
      if (daysAgo <= 10) {
        // Datos recientes — usar forecast con past_days
        url = `https://api.open-meteo.com/v1/forecast?latitude=${activeBase.latitud}&longitude=${activeBase.longitud}&start_date=${start}&end_date=${end}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
      } else {
        // Datos históricos — usar archive API
        url = `https://archive-api.open-meteo.com/v1/archive?latitude=${activeBase.latitud}&longitude=${activeBase.longitud}&start_date=${start}&end_date=${end}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("API Error");
      const json = await res.json();

      if (json.daily) {
        const formatted = json.daily.time.map((dateStr: string, index: number) => {
          const dateObj = new Date(dateStr + "T12:00:00Z");
          // Formato corto para rangos largos, detallado para rangos cortos
          const label = diffDays <= 14
            ? dateObj.toLocaleDateString('es-VE', { weekday: 'short', day: '2-digit' })
            : dateObj.toLocaleDateString('es-VE', { day: '2-digit', month: 'short' });
          return {
            date: label,
            tempMax: json.daily.temperature_2m_max[index],
            tempMin: json.daily.temperature_2m_min[index],
            precip: json.daily.precipitation_sum[index]
          };
        });
        setHistoryData(formatted);
      }
    } catch (e) {
      console.error('Error fetching historical data:', e);
    } finally {
      setLoading(false);
    }
  }, [activeBase]);

  useEffect(() => {
    fetchHistory(activeRange.start, activeRange.end);
  }, [activeBase, activeRange, fetchHistory]);

  const handleSearch = () => {
    if (startDate && endDate && startDate <= endDate) {
      setActiveRange({ start: startDate, end: endDate });
    }
  };

  // Presets rápidos
  const setPreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    const s = formatDateISO(start);
    const e = formatDateISO(end);
    setStartDate(s);
    setEndDate(e);
    setActiveRange({ start: s, end: e });
  };

  return (
    <section className="bg-[#1e293b] rounded-xl border border-gray-700 p-5 flex flex-col shadow-lg h-full">
      <div className="mb-4 border-b border-gray-700 pb-2 flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-md font-semibold text-white flex items-center">
          <History size={18} className="mr-2 text-[#8b5cf6]" />
          Análisis de Datos Históricos
        </h3>
        <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-1 rounded border border-purple-500/50">
          {selectedBase ? activeBase.nombre : `Referencia Nacional (${activeBase.codigo})`}
        </span>
      </div>

      {/* Buscador por fecha */}
      <div className="mb-4 p-3 bg-[#0f172a] rounded-lg border border-gray-700/50">
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={14} className="text-purple-400" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Buscar por fecha</span>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 uppercase">Desde</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate}
              className="bg-[#1e293b] border border-gray-600 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 uppercase">Hasta</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              max={formatDateISO(today)}
              className="bg-[#1e293b] border border-gray-600 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !startDate || !endDate || startDate > endDate}
            className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          >
            <Search size={12} />
            Buscar
          </button>
        </div>
        {/* Presets rápidos */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {[
            { label: '7 días', days: 7 },
            { label: '15 días', days: 15 },
            { label: '30 días', days: 30 },
            { label: '90 días', days: 90 },
          ].map(p => (
            <button
              key={p.days}
              onClick={() => setPreset(p.days)}
              className="text-[10px] px-2 py-0.5 rounded bg-gray-700/50 hover:bg-purple-600/30 text-gray-400 hover:text-purple-300 border border-gray-600/50 hover:border-purple-500/50 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
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
