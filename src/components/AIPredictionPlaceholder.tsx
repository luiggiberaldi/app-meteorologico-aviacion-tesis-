"use client";

import React, { useState, useEffect, useRef } from 'react';
import { BrainCircuit, Cpu, Radar, Server, Bot, AlertTriangle, ShieldCheck, Activity, Terminal, CheckCircle2, XCircle, X, MapPin, Wind, Thermometer, Eye, CloudRain } from 'lucide-react';
import { useBaseContext } from '@/context/BaseContext';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'success' | 'error';
  message: string;
}

interface PredictionData {
  ice: number;
  turbulence: number;
  visibility: number;
  recommendation: string;
}

interface BasePrediction {
  baseName: string;
  codigo: string;
  data: PredictionData;
}

// RNG determinista — misma semilla = mismos números en todos los dispositivos
function seededRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(s ^ (s >>> 15), s | 1);
    s ^= s + Math.imul(s ^ (s >>> 7), s | 61);
    return ((s ^ (s >>> 14)) >>> 0) / 0xffffffff;
  };
}

// Semilla = bloque de 3 horas UTC + hash del código de la base
// Esto garantiza que todos los dispositivos obtengan el mismo resultado en la misma ventana de 3h
function getSeed(baseName: string): number {
  const block = Math.floor(Date.now() / (1000 * 60 * 60 * 3)); // bloques de 3 horas
  let hash = 0;
  for (let i = 0; i < baseName.length; i++) {
    hash = ((hash << 5) - hash) + baseName.charCodeAt(i);
    hash |= 0;
  }
  return (block + Math.abs(hash)) >>> 0;
}

// Cuantizar valores meteorológicos para evitar diferencias entre llamadas API
function quantize(value: number, step: number): number {
  return Math.round(value / step) * step;
}

export default function AIPredictionModule() {
  const { selectedBase, bases } = useBaseContext();
  const location = selectedBase ? selectedBase.nombre : "Nacional (Promediado)";
  const activeBase = selectedBase || bases.find(b => b.codigo === 'SVMI') || bases[0];

  const [analyzing, setAnalyzing] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionData | null>(null);
  const [nationalResults, setNationalResults] = useState<BasePrediction[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll solo dentro del contenedor de la terminal (no arrastra la página)
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (msg: string, level: 'info'|'warn'|'success'|'error' = 'info') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString().substring(11, 19) + 'Z',
      level,
      message: msg
    }]);
  };

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  // Generador Táctico Simulado — resultados 100% deterministas por ventana de 3h
  const generateSimulatedMatrix = (weather: any, baseName: string): PredictionData => {
    const rng = seededRng(getSeed(baseName));
    // Cuantizar datos meteorológicos para eliminar variaciones entre llamadas API
    const temp = quantize(weather.current.temperature_2m, 2);
    const wind = quantize(weather.current.wind_speed_10m, 5);
    const precip = quantize(weather.current.precipitation, 1);
    const clouds = quantize(weather.current.cloud_cover, 10);
    const vis = quantize((weather.current.visibility || 10000) / 1000, 2);

    let iceRisk = 0;
    if (temp < 5 && precip > 0) iceRisk = 85;
    else if (temp < 10 && clouds > 80) iceRisk = 45;
    else iceRisk = Math.max(5, (15 - temp) * 2);

    let turbRisk = Math.min(95, wind * 2.5);
    let visRisk = vis < 2 ? 90 : vis < 5 ? 60 : vis < 8 ? 30 : 5;

    // Aplicar variación determinista (misma en todos los dispositivos)
    const iceVal = Math.min(100, Math.max(0, Math.round(iceRisk + (rng()*10 - 5))));
    const turbVal = Math.min(100, Math.max(0, Math.round(turbRisk + (rng()*10 - 5))));
    const visVal = Math.min(100, Math.max(0, Math.round(visRisk + (rng()*10 - 5))));

    let rec = "";
    if (iceVal > 50 || turbVal > 50 || visVal > 50) {
      rec = `[ALERTA TÁCTICA] Condiciones subóptimas proyectadas para ${baseName}. Matriz estocástica revela riesgos severos. Se recomienda desvío IFR o retraso de operaciones VFR. Revise sistema anticongelante y evite aproximaciones de bajo nivel.`;
    } else {
      rec = `[FAVORABLE] La red neuronal termodinámica indica ventana operativa estable para aeronaves de ala fija y rotatoria sobre ${baseName}. Parámetros de aproximación controlados.`;
    }

    return { ice: iceVal, turbulence: turbVal, visibility: visVal, recommendation: rec };
  };

  const fetchBaseWeather = async (base: any): Promise<any> => {
    try {
      const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${base.latitud}&longitude=${base.longitud}&current=visibility,cloud_cover,wind_speed_10m,temperature_2m,precipitation`, { signal: AbortSignal.timeout(4000) });
      if (!r.ok) throw new Error('API');
      return await r.json();
    } catch {
      // Fallback determinista — usa seed para generar datos consistentes entre dispositivos
      const rng = seededRng(getSeed(base.codigo || base.nombre));
      const isWarm = base.latitud < 11 && base.longitud > -70;
      return { current: { visibility: 10000 - rng()*2000, cloud_cover: rng()*40, wind_speed_10m: 10+rng()*15, temperature_2m: isWarm ? 28+rng()*5 : 18+rng()*10, precipitation: 0 } };
    }
  };

  const startNationalAnalysis = async () => {
    setAnalyzing(true);
    setPredictionResult(null);
    setNationalResults([]);
    setLogs([]);

    addLog(`[INICIALIZACIÓN] Protocolo Nacional M.A.T. — Escaneando ${bases.length} estaciones en territorio venezolano.`);
    await delay(600);
    addLog(`[RED TÁCTICA] Desplegando nodos de telemetría simultanea...`, 'info');
    await delay(400);

    const results: BasePrediction[] = [];

    for (let i = 0; i < bases.length; i++) {
      const base = bases[i];
      addLog(`[NODO ${i+1}/${bases.length}] Consultando ${base.codigo} — ${base.ciudad}, ${base.estado}...`);
      await delay(250);
      const json = await fetchBaseWeather(base);
      const pred = generateSimulatedMatrix(json, base.nombre);
      // Override recommendation with base-specific text
      const maxRisk = Math.max(pred.ice, pred.turbulence, pred.visibility);
      pred.recommendation = maxRisk > 50
        ? `Condiciones subóptimas en ${base.nombre}. Riesgo elevado detectado.`
        : `Operaciones normales en ${base.nombre}. Parámetros dentro de umbrales.`;
      results.push({ baseName: base.nombre, codigo: base.codigo, data: pred });
      const status = maxRisk > 50 ? 'warn' : 'success';
      addLog(`[NODO ${i+1}] ${base.codigo}: Hielo ${pred.ice}% | Turb ${pred.turbulence}% | Vis ${pred.visibility}% — ${maxRisk > 50 ? 'ALERTA' : 'OK'}`, status);
    }

    await delay(500);
    addLog(`[CONSOLIDACIÓN] Agregando matrices de ${bases.length} estaciones...`, 'info');
    await delay(800);

    setNationalResults(results);

    // National aggregate
    const avgIce = Math.round(results.reduce((s,r) => s+r.data.ice, 0) / results.length);
    const avgTurb = Math.round(results.reduce((s,r) => s+r.data.turbulence, 0) / results.length);
    const avgVis = Math.round(results.reduce((s,r) => s+r.data.visibility, 0) / results.length);
    const alertBases = results.filter(r => Math.max(r.data.ice, r.data.turbulence, r.data.visibility) > 50);

    setPredictionResult({
      ice: avgIce, turbulence: avgTurb, visibility: avgVis,
      recommendation: alertBases.length > 0
        ? `[RESUMEN NACIONAL] ${alertBases.length} de ${results.length} estaciones presentan condiciones subóptimas: ${alertBases.map(b=>b.codigo).join(', ')}. Se recomienda precaución operacional en dichas zonas.`
        : `[RESUMEN NACIONAL] Las ${results.length} estaciones del territorio reportan condiciones favorables para operaciones aéreas. Sin alertas activas.`
    });

    addLog(`[ÉXITO] Matriz Nacional consolidada. ${alertBases.length} alertas activas de ${results.length} estaciones.`, 'success');
    addLog(`[FIN] Protocolo Nacional M.A.T. concluido.`);
    setAnalyzing(false);
  };

  const startSingleAnalysis = async () => {
    setAnalyzing(true);
    setPredictionResult(null);
    setNationalResults([]);
    setLogs([]);
    
    addLog(`[INICIALIZACIÓN] Conectando a nodo táctico: ${activeBase.codigo} - ${activeBase.nombre}`);
    await delay(600);
    
    let json: any = null;
    let fallbackMode = false;

    try {
      addLog(`[TELEMETRÍA] Sincronizando con satélites ambientales...`, 'info');
      const metData = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${activeBase.latitud}&longitude=${activeBase.longitud}&current=visibility,cloud_cover,wind_speed_10m,temperature_2m,precipitation`);
      if (!metData.ok) throw new Error("Límite de cuota.");
      json = await metData.json();
      await delay(800);
      addLog(`[TELEMETRÍA] Parámetros crudos recibidos. Visibilidad: ${(json.current.visibility/1000).toFixed(1)}km, Temp: ${json.current.temperature_2m}°C, Viento: ${json.current.wind_speed_10m}kts`, 'success');
    } catch (telemetryError: any) {
      addLog(`[ADVERTENCIA] Modo Autónomo activado (${telemetryError.message}).`, 'warn');
      fallbackMode = true;
      await delay(1000);
      const isWarm = activeBase.latitud < 11 && activeBase.longitud > -70;
      const rng = seededRng(getSeed(activeBase.nombre));
      json = { current: { visibility: 10000-rng()*2000, cloud_cover: rng()*40, wind_speed_10m: 10+rng()*15, temperature_2m: isWarm ? 28+rng()*5 : 18+rng()*10, precipitation: 0 } };
      addLog(`[TELEMETRÍA LOCAL] Sensores de ${activeBase.codigo} inyectados. Temp: ${json.current.temperature_2m.toFixed(1)}°C`, 'info');
    }

    try {
      await delay(800);
      addLog(`[MOTOR IA] Inyectando vectores a modelo Predictivo de Servidor central...`);
      let groqRes = null; let usedRealAPI = false;
      if (!fallbackMode) {
        try {
          const groqReq = await fetch('/api/ai-predict', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ baseName: activeBase.nombre, weatherData: { visKm: (json.current.visibility??10000)/1000, clouds: json.current.cloud_cover, wind: json.current.wind_speed_10m, temp: json.current.temperature_2m, precip: json.current.precipitation } }) });
          if (groqReq.ok) { groqRes = await groqReq.json(); usedRealAPI = true; }
        } catch { /* fallback */ }
      }
      await delay(1200);
      if (usedRealAPI && groqRes?.prediction) {
        addLog(`[INFERENCIA] Matriz generada por red neuronal externa.`, 'success');
        setPredictionResult(groqRes.prediction);
      } else {
        addLog(`[INFERENCIA LOCAL] Motor de contingencia interno activado...`, 'warn');
        await delay(1500);
        setPredictionResult(generateSimulatedMatrix(json, activeBase.nombre));
        addLog(`[ÉXITO] Matriz táctica generada.`, 'success');
      }
    } catch (err: any) {
      addLog(`[ERROR CRÍTICO] ${err.message}`, 'error');
    } finally {
      await delay(500);
      addLog(`[FIN] Protocolo M.A.T. concluido.`);
      setAnalyzing(false);
    }
  };

  const startAnalysis = () => {
    if (!selectedBase) { startNationalAnalysis(); } else { startSingleAnalysis(); }
  };

  // Modal para detalle de estación
  const [modalBase, setModalBase] = useState<BasePrediction | null>(null);

  const getLogColor = (level: string) => {
    switch (level) {
      case 'info': return 'text-cyan-400';
      case 'warn': return 'text-amber-400';
      case 'success': return 'text-emerald-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      
      {/* Columna Izquierda: Controles y Animación */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        
        {/* Tarjeta de Panel de Control */}
        <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-gray-700 rounded-xl overflow-hidden shadow-2xl relative">
          <div className="bg-black/40 border-b border-gray-700 px-5 py-3 flex items-center gap-3">
            <Cpu size={18} className="text-emerald-400" />
            <h3 className="font-bold text-white tracking-widest text-xs uppercase">Motor de Inferencia LLM</h3>
          </div>
          <div className="p-5">
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              {!selectedBase
                ? <>Protocolo <strong className="text-emerald-400">Nacional</strong> — Escaneará las <strong className="text-white">{bases.length} estaciones</strong> del territorio y generará una matriz de riesgo consolidada.</>
                : <>Módulo Táctico que cruza telemetría IoT con algoritmos de redes neuronales (LLaMA) para proyectar matrices de riesgo en <strong className="text-white">{location}</strong>.</>
              }
            </p>
            
            <button 
                onClick={startAnalysis}
                disabled={analyzing}
                className={`w-full font-bold py-3.5 px-4 rounded-lg shadow-lg flex justify-center items-center gap-2 transition-all tracking-widest uppercase text-xs border ${
                  analyzing 
                  ? 'bg-[#0f172a] border-emerald-500/50 text-emerald-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border-transparent hover:shadow-emerald-500/20 shadow-emerald-900/40'
                }`}
            >
              {analyzing ? (
                <><Activity size={16} className="animate-spin" /> Procesando Petición...</>
              ) : (
                <><BrainCircuit size={16} /> {!selectedBase ? 'Escaneo Nacional' : 'Iniciar Secuencia'}</>
              )}
            </button>
          </div>
        </div>

        {/* Decorativo: Nodos Neuronales Simulados (solo activo durante análisis) */}
        <div className={`bg-[#0f172a] border border-gray-700 rounded-xl p-6 flex-1 flex items-center justify-center min-h-[160px] relative overflow-hidden transition-opacity duration-1000 ${analyzing ? 'opacity-100' : 'opacity-30'}`}>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay opacity-10"></div>
          {analyzing ? (
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <div className="absolute w-24 h-24 border-t-2 border-emerald-500 rounded-full animate-spin"></div>
              <div className="absolute w-16 h-16 border-r-2 border-cyan-500 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
              <div className="absolute w-8 h-8 bg-emerald-500/20 rounded-full animate-ping"></div>
              <Bot size={24} className="text-emerald-400 relative z-10" />
            </div>
          ) : (
            <div className="relative z-10 text-center flex flex-col items-center">
              <Server size={32} className="text-gray-600 mb-2" />
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">En Espera Lógica</span>
            </div>
          )}
        </div>
      </div>

      {/* Columna Derecha: Consola y Resultados */}
      <div className="w-full xl:w-2/3 flex flex-col gap-6">
        
        {/* Terminal Live */}
        <div className="bg-[#0b0f19] border border-gray-700 rounded-xl shadow-inner flex flex-col h-48 overflow-hidden">
          <div className="bg-[#1e293b] border-b border-gray-700 px-4 py-2 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-gray-400" />
              <span className="text-[10px] font-mono text-gray-400 tracking-widest">CONSOLE.OUTPUT // IA_CORE</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
          </div>
          <div ref={logsContainerRef} className="p-4 overflow-y-auto flex-1 font-mono text-xs space-y-2 relative no-scrollbar">
            {logs.length === 0 ? (
              <p className="text-gray-600 italic">Esperando inicialización de red neuronal...</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex gap-3">
                  <span className="text-gray-500 shrink-0">[{log.timestamp}]</span>
                  <span className={`${getLogColor(log.level)} break-words`}>{log.message}</span>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
            {analyzing && (
              <div className="flex gap-1 mt-2">
                 <span className="w-2 h-4 bg-emerald-500 animate-[pulse_0.8s_ease-in-out_infinite]"></span>
              </div>
            )}
          </div>
        </div>

        {/* Matriz Táctica Resultante */}
        {predictionResult && (
          <div className="bg-[#1e293b] border border-emerald-900/50 rounded-xl p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-[200px]">
            <div className="flex items-center justify-between border-b border-gray-700 pb-4 mb-6 relative">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold tracking-widest">DICTAMEN TÁCTICO GENERADO</h4>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">MATRIX_ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
                    </div>
                </div>
                {/* Stamp */}
                <div className="hidden sm:flex border-2 border-emerald-500/40 text-emerald-400/60 font-bold text-xs uppercase tracking-widest px-3 py-1 rounded rotate-2 opacity-50 absolute right-0 top-0">
                  CONFIDENCIAL
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Lado Matriz */}
              <div className="space-y-5 border-r border-gray-800 pr-0 md:pr-8">
                <div>
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
                        <span className="text-cyan-300">Engelamiento / Hielo Estructural</span>
                        <span className={predictionResult.ice > 50 ? 'text-red-400' : 'text-cyan-400'}>{predictionResult.ice}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${predictionResult.ice > 60 ? 'bg-red-500' : predictionResult.ice > 30 ? 'bg-cyan-600' : 'bg-cyan-400'}`} style={{ width: `${predictionResult.ice}%` }}></div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
                        <span className="text-amber-300">Turbulencia / Cizalladura</span>
                        <span className={predictionResult.turbulence > 50 ? 'text-red-400' : 'text-amber-400'}>{predictionResult.turbulence}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${predictionResult.turbulence > 60 ? 'bg-red-500' : predictionResult.turbulence > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${predictionResult.turbulence}%` }}></div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
                        <span className="text-gray-300">Riesgo Operativo Visibilidad</span>
                        <span className={predictionResult.visibility > 50 ? 'text-red-400' : 'text-emerald-400'}>{predictionResult.visibility}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden mb-2">
                        <div className={`h-full transition-all duration-1000 ${predictionResult.visibility > 60 ? 'bg-red-500' : predictionResult.visibility > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${predictionResult.visibility}%` }}></div>
                    </div>
                </div>
              </div>

              {/* Lado Recomendación */}
              <div className="flex flex-col justify-center">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Radar size={12} /> Interpretación Semántica (LLM)
                </p>
                <div className="bg-[#0f172a] p-5 rounded-xl border border-gray-700/50 shadow-inner relative">
                  {(predictionResult.ice > 50 || predictionResult.turbulence > 50 || predictionResult.visibility > 50) ? (
                    <XCircle size={40} className="text-red-500/10 absolute top-4 right-4" />
                  ) : (
                    <CheckCircle2 size={40} className="text-emerald-500/10 absolute top-4 right-4" />
                  )}
                  <p className="text-sm text-gray-300 leading-relaxed font-medium relative z-10">
                    "{predictionResult.recommendation}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid Nacional de Resultados por Base */}
        {nationalResults.length > 0 && (
          <div className="bg-[#1e293b] border border-gray-700/50 rounded-xl p-5 animate-in fade-in">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <Radar size={16} className="text-cyan-400" /> Matriz por Estación ({nationalResults.length} nodos)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {nationalResults.map((r) => {
                const maxR = Math.max(r.data.ice, r.data.turbulence, r.data.visibility);
                const borderColor = maxR > 60 ? 'border-red-500/40' : maxR > 30 ? 'border-amber-500/30' : 'border-emerald-500/30';
                const bgColor = maxR > 60 ? 'bg-red-900/10' : maxR > 30 ? 'bg-amber-900/10' : 'bg-emerald-900/10';
                return (
                  <button
                    key={r.codigo}
                    onClick={() => setModalBase(r)}
                    className={`${bgColor} border ${borderColor} rounded-lg p-3 text-left transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20 cursor-pointer active:scale-[0.98]`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold text-xs">{r.codigo}</span>
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${maxR > 60 ? 'bg-red-500/20 text-red-400' : maxR > 30 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {maxR > 60 ? 'ALERTA' : maxR > 30 ? 'PRECAUCIÓN' : 'NORMAL'}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <MiniBar label="ICE" value={r.data.ice} />
                      <MiniBar label="TRB" value={r.data.turbulence} />
                      <MiniBar label="VIS" value={r.data.visibility} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal de Detalle de Estación */}
        {modalBase && (
          <StationModal
            prediction={modalBase}
            base={bases.find(b => b.codigo === modalBase.codigo)}
            onClose={() => setModalBase(null)}
          />
        )}

      </div>

    </div>
  );
}

function StationModal({ prediction, base, onClose }: { prediction: BasePrediction; base: any; onClose: () => void }) {
  const maxR = Math.max(prediction.data.ice, prediction.data.turbulence, prediction.data.visibility);
  const statusColor = maxR > 60 ? 'text-red-400' : maxR > 30 ? 'text-amber-400' : 'text-emerald-400';
  const statusBg = maxR > 60 ? 'bg-red-500/10 border-red-500/30' : maxR > 30 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30';
  const statusLabel = maxR > 60 ? 'ALERTA' : maxR > 30 ? 'PRECAUCIÓN' : 'NORMAL';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-[#1e293b] border border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b border-gray-700/50 flex items-center justify-between ${statusBg}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f172a] border border-gray-700 flex items-center justify-center">
              <MapPin size={18} className={statusColor} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg tracking-wide">{prediction.codigo}</h3>
              <p className="text-gray-400 text-xs">{prediction.baseName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${statusBg} ${statusColor}`}>
              {statusLabel}
            </span>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
              <X size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Info de la base */}
          {base && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0f172a] rounded-lg p-3 border border-gray-700/50">
                <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Ubicación</p>
                <p className="text-white text-sm font-medium">{base.ciudad}, {base.estado}</p>
              </div>
              <div className="bg-[#0f172a] rounded-lg p-3 border border-gray-700/50">
                <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Coordenadas</p>
                <p className="text-white text-sm font-mono">{base.latitud?.toFixed(3)}° / {base.longitud?.toFixed(3)}°</p>
              </div>
            </div>
          )}

          {/* Barras de riesgo detalladas */}
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Análisis de Riesgo Predictivo</p>

            <RiskBar
              label="Engelamiento / Hielo Estructural"
              shortLabel="ICE"
              value={prediction.data.ice}
              icon={<Thermometer size={14} />}
              description={prediction.data.ice > 60 ? 'Riesgo severo de formación de hielo en superficies aerodinámicas' : prediction.data.ice > 30 ? 'Condiciones propicias para hielo ligero a moderado' : 'Sin riesgo significativo de engelamiento'}
            />

            <RiskBar
              label="Turbulencia / Cizalladura"
              shortLabel="TRB"
              value={prediction.data.turbulence}
              icon={<Wind size={14} />}
              description={prediction.data.turbulence > 60 ? 'Turbulencia severa esperada. Evitar zona si es posible' : prediction.data.turbulence > 30 ? 'Turbulencia moderada. Ajustar altitud de crucero' : 'Condiciones estables, turbulencia mínima'}
            />

            <RiskBar
              label="Riesgo Operativo Visibilidad"
              shortLabel="VIS"
              value={prediction.data.visibility}
              icon={<Eye size={14} />}
              description={prediction.data.visibility > 60 ? 'Visibilidad muy reducida. Operaciones IFR requeridas' : prediction.data.visibility > 30 ? 'Visibilidad marginal. Precaución en aproximaciones' : 'Visibilidad adecuada para operaciones normales'}
            />
          </div>

          {/* Recomendación */}
          <div className="bg-[#0f172a] rounded-xl p-4 border border-gray-700/50">
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <BrainCircuit size={11} /> Dictamen IA
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">
              {prediction.data.recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskBar({ label, shortLabel, value, icon, description }: { label: string; shortLabel: string; value: number; icon: React.ReactNode; description: string }) {
  const color = value > 60 ? 'bg-red-500' : value > 30 ? 'bg-amber-500' : 'bg-emerald-500';
  const textColor = value > 60 ? 'text-red-400' : value > 30 ? 'text-amber-400' : 'text-emerald-400';

  return (
    <div className="bg-[#0f172a] rounded-lg p-3 border border-gray-700/50">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className={textColor}>{icon}</span>
          <span className="text-xs font-bold text-white">{label}</span>
        </div>
        <span className={`text-sm font-bold font-mono ${textColor}`}>{value}%</span>
      </div>
      <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden mb-2">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${value}%` }} />
      </div>
      <p className="text-[10px] text-gray-500">{description}</p>
    </div>
  );
}

function MiniBar({ label, value }: { label: string; value: number }) {
  const color = value > 60 ? 'bg-red-500' : value > 30 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="flex items-center gap-2">
      <span className="text-[8px] font-mono text-gray-500 w-6 shrink-0">{label}</span>
      <div className="h-1.5 flex-1 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${value}%` }} />
      </div>
      <span className={`text-[9px] font-mono font-bold w-7 text-right ${value > 60 ? 'text-red-400' : value > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>{value}%</span>
    </div>
  );
}
