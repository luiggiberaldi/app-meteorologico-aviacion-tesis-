"use client";

import React, { useEffect, useState } from 'react';
import { useBaseContext } from '@/context/BaseContext';
import { WeatherService, WeatherData } from '@/lib/services/WeatherService';
import { AlertTriangle, CloudLightning, Snowflake, Tornado, RefreshCw, ShieldAlert, Zap, ThermometerSnowflake } from 'lucide-react';
import { kmhToKnots } from '@/lib/utils';

export default function AlertasPage() {
  const { selectedBase } = useBaseContext();
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const baseToFetch = selectedBase || { latitud: 10.4833, longitud: -66.8500, nombre: "Red Nacional (Promedio)" } as any;
      const weather = await WeatherService.getCurrentWeather(baseToFetch);
      setData(weather);
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedBase]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4 text-red-500">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <p className="text-sm font-bold tracking-widest uppercase">ESCANENADO FENÓMENOS ADVERSOS...</p>
        </div>
      </div>
    );
  }

  // --- LÓGICA DE ALERTAS BASADA EN DATOS REALES ---
  
  // 1. Ciclones / Vientos Severos
  const gustsKT = kmhToKnots(data?.windGusts || 0);
  const isHighWind = gustsKT > 27; // KT
  const cycloneLevel = isHighWind ? 'PELIGRO' : gustsKT > 16 ? 'ADVERTENCIA' : 'NORMAL';
  const cycloneColor = isHighWind ? 'text-red-500 border-red-500/50 bg-red-500/10' : gustsKT > 16 ? 'text-amber-500 border-amber-500/50 bg-amber-500/10' : 'text-emerald-500 border-emerald-500/50 bg-emerald-500/10';

  // 2. Relámpagos / Actividad Eléctrica (Usando CAPE - Convective Available Potential Energy)
  const cape = data?.cape || 0; 
  const isStorm = cape > 2000;
  const stormLevel = isStorm ? 'PELIGRO (TORMENTA SEVERA)' : cape > 1000 ? 'ADVERTENCIA (RIESGO ELÉCTRICO)' : 'NORMAL';
  const stormColor = isStorm ? 'text-red-500 border-red-500/50 bg-red-500/10' : cape > 1000 ? 'text-amber-500 border-amber-500/50 bg-amber-500/10' : 'text-emerald-500 border-emerald-500/50 bg-emerald-500/10';

  // 3. Nieve / Congelamiento (Basado en Isoterma Cero)
  const freezing = data?.freezingLevel || 4000;
  const isIcing = freezing < 2000; // Si la isoterma baja de 2000m en Venezuela hay riesgo real en páramos o en vuelo bajo
  const icingLevel = isIcing ? 'PELIGRO (HIELO EN ALAS)' : freezing < 3000 ? 'ADVERTENCIA (ISOTERMA BAJA)' : 'NORMAL';
  const icingColor = isIcing ? 'text-cyan-400 border-cyan-400/50 bg-cyan-400/10' : freezing < 3000 ? 'text-amber-300 border-amber-400/50 bg-amber-400/10' : 'text-gray-400 border-gray-700/50 bg-gray-800/50';

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-red-500 mb-1 flex items-center gap-3">
            <ShieldAlert className="text-red-500" /> VIGILANCIA DE FENÓMENOS ADVERSOS
          </h2>
          <p className="text-gray-400 text-sm">
            Sistema de Alertas Tempranas. Monitoreo: <span className="text-white font-medium">{selectedBase?.nombre || "Territorio Nacional"}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* PANEL CICLONES Y VIENTOS */}
        <div className={`rounded-xl border p-5 ${cycloneColor} flex flex-col justify-between relative overflow-hidden`}>
          <div className="absolute right-0 top-0 opacity-10">
            <Tornado size={120} className="animate-[spin_4s_linear_infinite]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Tornado size={24} />
              <h3 className="font-bold tracking-widest text-sm">VÓRTICES / CICLONES</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-xs opacity-80 font-bold uppercase mb-1">Estado de amenaza</p>
              <p className="text-xl font-black tracking-widest">{cycloneLevel}</p>
            </div>

            <div className="bg-black/30 rounded p-3 border border-black/20">
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-80 font-mono text-xs">Ráfagas Máximas:</span>
                <span className="font-bold font-mono text-lg">{gustsKT} KT</span>
              </div>
            </div>
            
            <p className="text-[10px] opacity-70 mt-3 leading-tight">Mide el desarrollo de sistemas ciclónicos basándose en rachas sostenidas y diferenciales de presión isobárica superficial.</p>
          </div>
        </div>

        {/* PANEL RELÁMPAGOS */}
        <div className={`rounded-xl border p-5 ${stormColor} flex flex-col justify-between relative overflow-hidden`}>
          <div className="absolute -right-4 top-4 opacity-10">
            <CloudLightning size={120} className={isStorm ? "animate-pulse" : ""} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={24} />
              <h3 className="font-bold tracking-widest text-sm">ACTIVIDAD ELÉCTRICA</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-xs opacity-80 font-bold uppercase mb-1">Estado de amenaza</p>
              <p className="text-xl font-black tracking-widest">{stormLevel}</p>
            </div>

            <div className="bg-black/30 rounded p-3 border border-black/20">
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-80 font-mono text-xs">Índice CAPE:</span>
                <span className="font-bold font-mono text-lg">{cape.toFixed(0)} J/kg</span>
              </div>
            </div>
            
            <p className="text-[10px] opacity-70 mt-3 leading-tight">El índice CAPE (Energía Potencial Disponible Convectiva) mide la inestabilidad atmosférica. &gt;1000 J/kg indica riesgo de relámpagos severos.</p>
          </div>
        </div>

        {/* PANEL NIEVE E HIELO */}
        <div className={`rounded-xl border p-5 ${icingColor} flex flex-col justify-between relative overflow-hidden`}>
          <div className="absolute right-0 top-0 opacity-10">
            <Snowflake size={120} className="animate-[spin_10s_linear_infinite]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <ThermometerSnowflake size={24} />
              <h3 className="font-bold tracking-widest text-sm">ENGELAMIENTO / NIEVE</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-xs opacity-80 font-bold uppercase mb-1">Estado de amenaza</p>
              <p className="text-xl font-black tracking-widest">{icingLevel}</p>
            </div>

            <div className="bg-black/30 rounded p-3 border border-black/20">
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-80 font-mono text-xs">Isoterma Cero:</span>
                <span className="font-bold font-mono text-lg">{freezing.toFixed(0)} m</span>
              </div>
            </div>
            
            <p className="text-[10px] opacity-70 mt-3 leading-tight">Elevación donde la temperatura desciende a 0°C. Alertas críticas de formación de hielo en aeronaves para vuelos por encima de este umbral.</p>
          </div>
        </div>

      </div>

      <div className="mt-8 border-t border-gray-800 pt-6">
         <div className="bg-[#1e293b] border border-gray-700 p-4 rounded-xl flex items-start gap-4">
            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-bold text-sm tracking-wide mb-1">PROCEDIMIENTO DE ALERTA TEMPRANA</h4>
              <p className="text-xs text-gray-400 leading-relaxed">Las variables mostradas en esta central táctica son calculadas en base a predicciones algorítmicas de la red global de posicionamiento meteorológico. En caso de detectarse un evento catalogado como PELIGRO (Rojo), comuníquese de inmediato vía UHF/VHF con el control de aproximación de la pista correspondiente e inicie protocolos de desvío METAR según los manuales aeronáuticos de la República Bolivariana de Venezuela.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
