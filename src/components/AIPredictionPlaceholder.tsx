"use client";

import React, { useState } from 'react';
import { BrainCircuit, Cpu, Radar, Server, Bot, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useBaseContext } from '@/context/BaseContext';

export default function AIPredictionModule() {
  const { selectedBase, bases } = useBaseContext();
  const location = selectedBase ? selectedBase.nombre : "Nacional (Promediado)";
  
  // Usamos SVMI si está en Nacional, o la base actual
  const activeBase = selectedBase || bases.find(b => b.codigo === 'SVMI') || bases[0];

  const [analyzing, setAnalyzing] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [predictionResult, setPredictionResult] = useState<string | null>(null);
  const [errorDesc, setErrorDesc] = useState<string | null>(null);

  const steps = [
    "Iniciando recolección de telemetría IoT...",
    "Procesando modelos de regresión estocástica...",
    "Corriendo redes neuronales sobre datos climáticos...",
    "Generando recomendaciones operativas y de seguridad..."
  ];

  const startAnalysis = async () => {
    setAnalyzing(true);
    setPredictionResult(null);
    setErrorDesc(null);
    setProgressStep(0);

    // 1. Simular UX de procesamiento
    for (let i = 0; i < steps.length; i++) {
        setProgressStep(i);
        await new Promise(resolve => setTimeout(resolve, i === steps.length - 1 ? 1500 : 800)); // Simula un retraso analítico
    }

    // 2. Fetch de datos climáticos reales (simplificado) para mandar al LLM
    try {
        const metData = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${activeBase.latitud}&longitude=${activeBase.longitud}&current=visibility,cloud_cover,wind_speed_10m,temperature_2m,precipitation`);
        if (!metData.ok) throw new Error("Fallo en Open-Meteo");
        const json = await metData.json();

        // 3. Llamar a nuestro Endpoint de Next.js (que habla con Groq de forma segura)
        const groqReq = await fetch('/api/ai-predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                baseName: activeBase.nombre,
                weatherData: {
                    visKm: (json.current.visibility ?? 10000) / 1000,
                    clouds: json.current.cloud_cover,
                    wind: json.current.wind_speed_10m,
                    temp: json.current.temperature_2m,
                    precip: json.current.precipitation
                }
            })
        });

        if (!groqReq.ok) {
           throw new Error("El modelo de IA no pudo procesar la solicitud (Revise API Key / Límites).");
        }

        const groqRes = await groqReq.json();
        setPredictionResult(groqRes.prediction);

    } catch (err: any) {
        setErrorDesc(err.message || "Error desconocido");
    } finally {
        setAnalyzing(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] rounded-xl border border-indigo-500/50 overflow-hidden shadow-2xl relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      
      <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center justify-between relative z-10">
        
        {/* Text Section */}
        <div className="flex-1 space-y-4 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/50 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <BrainCircuit size={14} className="animate-pulse" /> Inteligencia Artificial Predictiva
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
            Asistente Meteorológico Táctico
          </h3>
          
          <p className="text-indigo-200/80 text-sm md:text-base max-w-2xl leading-relaxed">
            Módulo simulado (Prueba de Concepto Tesis). Unifica los sensores telemétricos con modelos de lenguaje de gran escala (LLM) para arrojar diagnósticos en lenguaje natural sobre la estación {location}.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-black/30 border border-indigo-500/30 p-4 rounded-lg flex gap-3 items-start backdrop-blur-sm">
              <div className="bg-indigo-500/20 p-2 rounded-md"><Radar className="text-indigo-400" size={20}/></div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Sensores Virtualizados</h4>
                <p className="text-xs text-indigo-200/60">Cruzando Open-Meteo con algoritmos Llama-3 a 70 billones de parámetros.</p>
              </div>
            </div>
            
            <div className="bg-black/30 border border-purple-500/30 p-4 rounded-lg flex gap-3 items-start backdrop-blur-sm">
              <div className="bg-purple-500/20 p-2 rounded-md"><Cpu className="text-purple-400" size={20}/></div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Inferencia en Tiempo Real</h4>
                <p className="text-xs text-purple-200/60">Procesamiento cognitivo aplicado a decisiones de vuelo militar y civil.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action / Result Section */}
        <div className="shrink-0 w-full md:w-80 bg-black/50 border border-indigo-500/30 rounded-xl p-5 text-center flex flex-col items-center justify-center min-h-[220px]">
           
           {!analyzing && !predictionResult && !errorDesc && (
               <div className="flex flex-col items-center gap-3 w-full">
                   <Server size={40} className="text-indigo-400/50 mb-2" />
                   <h4 className="text-white font-bold text-sm uppercase tracking-widest">Motor Desconectado</h4>
                   <p className="text-xs text-gray-400 mb-2 px-2">Presione para inyectar datos climáticos en la Red Neuronal.</p>
                   <button 
                       onClick={startAnalysis}
                       className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-2.5 px-4 rounded-lg shadow-lg shadow-indigo-500/30 transition-all flex justify-center items-center gap-2"
                   >
                     <Cpu size={18} /> Iniciar Secuencia
                   </button>
               </div>
           )}

           {analyzing && (
               <div className="flex flex-col items-center gap-4 w-full">
                    {/* DNA Loader o Spinner Tech */}
                    <div className="flex gap-1 items-end h-10 mb-2">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="w-1.5 bg-indigo-500 rounded-t-full animate-bounce" style={{ height: `${Math.max(20, Math.random() * 100)}%`, animationDelay: `${i * 0.15}s` }}></div>
                      ))}
                    </div>
                   <h4 className="text-indigo-300 font-bold text-xs uppercase tracking-widest animate-pulse">Analizando Red Táctica</h4>
                   <p className="text-[10px] text-gray-400 max-w-[200px] h-8">{steps[progressStep]}</p>
                   <div className="w-full bg-gray-800 rounded-full h-1 mt-2">
                       <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500" style={{ width: `${((progressStep + 1) / steps.length) * 100}%` }}></div>
                   </div>
               </div>
           )}

           {predictionResult && !analyzing && (
               <div className="flex flex-col items-start gap-3 w-full text-left bg-indigo-950/40 p-3 rounded-lg border border-indigo-500/20 max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-transparent">
                  <div className="flex items-center gap-2 text-indigo-300 mb-1 border-b border-indigo-500/30 pb-2 w-full">
                      <Bot size={16} /> 
                      <span className="text-[10px] font-bold uppercase tracking-widest">Consejo Táctico (LLaMA-3)</span>
                  </div>
                  <p className="text-xs text-indigo-100 leading-relaxed italic border-l-2 border-indigo-400 pl-2">
                    "{predictionResult}"
                  </p>
                  
                  <button onClick={startAnalysis} className="text-[10px] text-gray-400 hover:text-white underline mt-2 self-center">
                      Recalcular Situación
                  </button>
               </div>
           )}

           {errorDesc && !analyzing && (
              <div className="flex flex-col items-center gap-2 w-full">
                   <AlertTriangle size={32} className="text-red-500 mb-2" />
                   <h4 className="text-red-400 font-bold text-xs uppercase tracking-widest">Fallo en Conexión AI</h4>
                   <p className="text-[10px] text-gray-400">{errorDesc}</p>
                   <button onClick={startAnalysis} className="mt-2 text-xs bg-gray-800 hover:bg-gray-700 text-white py-1 px-3 rounded">Reintentar</button>
              </div>
           )}

        </div>

      </div>
    </section>
  );
}
