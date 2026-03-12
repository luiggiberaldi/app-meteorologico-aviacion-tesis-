"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AlertCircle, RefreshCw, CalendarDays, Wind, Eye, Thermometer, Cloud, Gauge } from "lucide-react";

interface WeatherLog {
  id: string;
  created_at: string;
  wind_speed: number | null;
  wind_direction: number | null;
  visibility: number | null;
  temperature: number | null;
  pressure_qnh: number | null;
  cloud_cover: string | null;
}

export default function WeatherHistory() {
  const [logs, setLogs] = useState<WeatherLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: dbError } = await supabase
        .from("weather_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (dbError) throw dbError;
      setLogs(data || []);
    } catch (err: any) {
      setError(err.message || "Error al cargar historial meteorológico");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="bg-[#1e293b] rounded-xl border border-gray-700 p-5 print:bg-white print:border-gray-300 print:shadow-none print:text-black">
      <div className="flex items-center justify-between mb-4 border-b border-gray-700 print:border-gray-300 pb-3">
        <h3 className="text-md font-semibold text-white print:text-black flex items-center">
          <CalendarDays size={18} className="mr-2 text-[#10b981] print:text-gray-800" />
          Historial Meteorológico (BARAGUA)
        </h3>
        <button 
          onClick={fetchHistory}
          disabled={loading}
          className="print:hidden flex items-center space-x-2 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading ? (
        <div className="py-8 flex justify-center items-center flex-col space-y-3">
           <div className="w-8 h-8 border-4 border-[#10b981]/30 border-t-[#10b981] rounded-full animate-spin"></div>
           <p className="text-sm text-gray-400">Cargando registros...</p>
        </div>
      ) : error ? (
        <div className="bg-red-900/40 border border-red-500/50 p-4 rounded-md flex items-start space-x-3 mb-4">
          <AlertCircle className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm text-red-200">{error}</p>
        </div>
      ) : logs.length === 0 ? (
        <p className="text-center text-sm text-gray-500 py-6">No hay registros meteorológicos almacenados todavía.</p>
      ) : (
        <div className="space-y-4">
          
          {/* Tarjetas de Tendencias */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-[#0f172a] p-3 rounded-lg border border-gray-700 print:bg-gray-100 print:border-gray-300">
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">Tendencia Temp</p>
              <div className="flex items-end gap-2">
                <span className="text-xl font-bold text-white print:text-black">
                  {logs[0]?.temperature || '-'}°C
                </span>
                {logs.length > 1 && logs[0].temperature && logs[logs.length-1].temperature && (
                  <span className={`text-xs font-bold mb-1 ${logs[0].temperature > logs[logs.length-1].temperature! ? 'text-red-400' : 'text-blue-400'}`}>
                    {logs[0].temperature > logs[logs.length-1].temperature! ? '↑ Sube' : '↓ Baja'}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-[#0f172a] p-3 rounded-lg border border-gray-700 print:bg-gray-100 print:border-gray-300">
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">Promedio Viento (24h)</p>
              <div className="flex items-end gap-2">
                <span className="text-xl font-bold text-white print:text-black">
                  {Math.round(logs.reduce((acc, curr) => acc + (curr.wind_speed || 0), 0) / logs.length)} KT
                </span>
                <span className="text-xs text-gray-500 mb-1">Prom. Histórico</span>
              </div>
            </div>

            <div className="bg-[#0f172a] p-3 rounded-lg border border-gray-700 print:bg-gray-100 print:border-gray-300">
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">Ráfaga Max</p>
              <div className="flex items-end gap-2">
                <span className="text-xl font-bold text-orange-400">
                  {Math.max(...logs.map(l => l.wind_speed || 0))} KT
                </span>
              </div>
            </div>

            <div className="bg-[#0f172a] p-3 rounded-lg border border-gray-700 print:bg-gray-100 print:border-gray-300">
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">Presión QNH Prom.</p>
              <div className="flex items-end gap-2">
                <span className="text-xl font-bold text-blue-300">
                  {Math.round(logs.reduce((acc, curr) => acc + (curr.pressure_qnh || 0), 0) / logs.length)} hPa
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-md border border-gray-700 print:border-gray-300">
          <table className="w-full min-w-[600px] text-sm text-left">
            <thead className="bg-[#0f172a] print:bg-gray-100 text-gray-300 print:text-gray-700 text-xs uppercase font-semibold">
              <tr>
                <th className="px-4 py-3 border-b border-gray-700 print:border-gray-300">Fecha / Hora</th>
                <th className="px-4 py-3 border-b border-gray-700 print:border-gray-300">
                  <div className="flex items-center space-x-1"><Wind size={14}/><span>Viento</span></div>
                </th>
                <th className="px-4 py-3 border-b border-gray-700 print:border-gray-300">
                  <div className="flex items-center space-x-1"><Eye size={14}/><span>Visibilidad</span></div>
                </th>
                <th className="px-4 py-3 border-b border-gray-700 print:border-gray-300">
                  <div className="flex items-center space-x-1"><Thermometer size={14}/><span>Temp.</span></div>
                </th>
                <th className="px-4 py-3 border-b border-gray-700 print:border-gray-300">
                  <div className="flex items-center space-x-1"><Gauge size={14}/><span>QNH</span></div>
                </th>
                <th className="px-4 py-3 border-b border-gray-700 print:border-gray-300">
                  <div className="flex items-center space-x-1"><Cloud size={14}/><span>Nubes</span></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 print:divide-gray-200 text-gray-300 print:text-gray-800">
              {logs.map((log) => {
                const date = new Date(log.created_at);
                return (
                  <tr key={log.id} className="hover:bg-gray-800/50 print:hover:bg-transparent transition-colors">
                    <td className="px-4 py-2.5 font-mono text-xs">
                      {date.toLocaleDateString()} <br /> {date.toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-2.5">
                      {log.wind_speed !== null ? `${log.wind_speed}KT` : '-'}
                      {log.wind_direction !== null ? ` ${log.wind_direction}°` : ''}
                    </td>
                    <td className="px-4 py-2.5 font-mono">
                      {log.visibility !== null ? `${(log.visibility / 1000).toFixed(1)} km` : '-'}
                    </td>
                    <td className="px-4 py-2.5">
                      {log.temperature !== null ? `${log.temperature}°C` : '-'}
                    </td>
                    <td className="px-4 py-2.5 font-mono">
                      {log.pressure_qnh !== null ? `${log.pressure_qnh}` : '-'}
                    </td>
                    <td className="px-4 py-2.5 font-mono">
                      {log.cloud_cover || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
