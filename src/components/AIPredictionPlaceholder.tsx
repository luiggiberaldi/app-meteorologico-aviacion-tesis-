"use client";

import React from 'react';
import { BrainCircuit, Cpu, Radar, Server, Lock } from 'lucide-react';
import { useBaseContext } from '@/context/BaseContext';

export default function AIPredictionPlaceholder() {
  const { selectedBase } = useBaseContext();
  const location = selectedBase ? selectedBase.nombre : "Nacional";

  return (
    <section className="bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] rounded-xl border border-indigo-500/30 overflow-hidden shadow-2xl relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      
      <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center justify-between relative z-10">
        
        {/* Text Section */}
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/50 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <BrainCircuit size={14} /> Fase 2 Documental
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
            Inteligencia Artificial y Sensores
          </h3>
          
          <p className="text-indigo-200/80 text-sm md:text-base max-w-2xl leading-relaxed">
            Como parte de las metas a largo plazo definidas en la investigación, la plataforma está diseñada con una arquitectura escalable para integrar modelos de Machine Learning y conexiones directas con hardware meteorológico local.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-black/20 border border-indigo-500/20 p-4 rounded-lg flex gap-3 items-start">
              <div className="bg-indigo-500/20 p-2 rounded-md"><Radar className="text-indigo-400" size={20}/></div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Red de Sensores Locales</h4>
                <p className="text-xs text-indigo-200/60">Integración con telemetría en tiempo real desde estaciones {location}.</p>
              </div>
            </div>
            
            <div className="bg-black/20 border border-purple-500/20 p-4 rounded-lg flex gap-3 items-start">
              <div className="bg-purple-500/20 p-2 rounded-md"><Cpu className="text-purple-400" size={20}/></div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Modelos Predictivos IA</h4>
                <p className="text-xs text-purple-200/60">Regresiones lineales para predecir mantenimiento y optimizar consumo.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="shrink-0 md:w-64 bg-black/40 border border-gray-700/50 rounded-xl p-5 text-center flex flex-col items-center justify-center">
           <div className="relative mb-4">
             <Server size={48} className="text-gray-500" />
             <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black p-1.5 rounded-full ring-4 ring-[#0f172a]">
               <Lock size={12} className="font-bold" />
             </div>
           </div>
           
           <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-1">Módulos en Desarrollo</h4>
           <p className="text-xs text-gray-400 mb-4">Próximamente disponibles según cronograma de escalabilidad.</p>
           
           <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
             <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-1/3 h-full animate-pulse"></div>
           </div>
           <p className="text-[10px] text-gray-500 mt-2 font-mono uppercase">Infraestructura Lista</p>
        </div>

      </div>
    </section>
  );
}
