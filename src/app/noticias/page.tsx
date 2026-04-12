"use client";

import React, { useState, useEffect } from 'react';
import { Newspaper, AlertTriangle, Info, Radio, Zap, Wind, Satellite } from "lucide-react";

type Noticia = {
  id: string;
  titulo: string;
  fecha: string;
  categoria: string;
  categoriaColor: string;
  icon: React.ElementType;
  contenido: string;
};

const INITIAL_NEWS: Noticia[] = [
  {
    id: "hist-1",
    titulo: "Alerta Meteorológica: Frente Frío en Región Noroccidental",
    fecha: "12 Mar 2026 14:00z",
    categoria: "Alerta",
    categoriaColor: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: AlertTriangle,
    contenido: "Se pronostica el ingreso de un frente frío desde el Caribe que afectará las operaciones VFR en las bases SVBM y SVMT durante las próximas 48 horas. Se recomienda precaución extrema y monitoreo constante."
  },
  {
    id: "hist-2",
    titulo: "Actualización del Sistema SERMETAVIA V2.0",
    fecha: "12 Mar 2026 09:30z",
    categoria: "Informativo",
    categoriaColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: Info,
    contenido: "Se ha implementado la nueva arquitectura modular del sistema, incluyendo el módulo de Inteligencia Artificial Predictiva y la reestructuración de navegación por secciones independientes."
  },
  {
    id: "hist-3",
    titulo: "Mantenimiento Programado: Radar Meteorológico Base Baragua",
    fecha: "11 Mar 2026 18:45z",
    categoria: "Operacional",
    categoriaColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: Radio,
    contenido: "El radar meteorológico de la Base Aérea Logística Baragua entrará en mantenimiento preventivo el día 15 de marzo de 2026. Durante este periodo, los datos de precipitación se obtendrán exclusivamente vía satélite."
  },
  {
    id: "hist-4",
    titulo: "Incorporación de Nuevas Estaciones Meteorológicas",
    fecha: "10 Mar 2026 11:15z",
    categoria: "Informativo",
    categoriaColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: Info,
    contenido: "Se han integrado al sistema las estaciones meteorológicas de Porlamar (SVPM) y Puerto Ordaz (SVPR), ampliando la cobertura del servicio meteorológico nacional a 12 bases aéreas."
  },
];

// Pool de noticias dinámicas para inyectar realismo
const DYNAMIC_NEWS_POOL = [
  {
    titulo: "Actualización TAF SVMI",
    categoria: "Informativo",
    categoriaColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: Newspaper,
    contenido: "Nuevo Pronóstico de Aeródromo (TAF) válido para Maiquetía. Techo de nubes estimado en 2500 ft, visibilidad > 10km. Vientos variables."
  },
  {
    titulo: "Reporte PIREP: Turbulencia Ligera",
    categoria: "Operacional",
    categoriaColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: Wind,
    contenido: "Aeronave C-208 reporta turbulencia en aire claro (CAT) ligera a FL100 cerca de la vertical de San Carlos. Procedan con precaución."
  },
  {
    titulo: "ACTIVIDAD ELÉCTRICA: Cúmulonimbos en Desarrollo",
    categoria: "Alerta",
    categoriaColor: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: Zap,
    contenido: "Radares doppler detectan rápida formación convectiva (CB) en la cordillera de la costa Sur de Maracay. Evitar operaciones tácticas cerca de estas formaciones."
  },
  {
    titulo: "SIGMET Emitido: Cordillera Andina",
    categoria: "Alerta",
    categoriaColor: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: AlertTriangle,
    contenido: "Información Meteorológica Significativa (SIGMET) activa. Probabilidad de engelamiento moderado entre FL140 y FL180 sobre Los Andes venezolanos."
  },
  {
    titulo: "Enlace Satelital Restablecido GOES-16",
    categoria: "Informativo",
    categoriaColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    icon: Satellite,
    contenido: "El flujo de imágenes en infrarrojo y banda visible del satélite principal ha sido restablecido al 100% de operatividad en todo el territorio."
  },
  {
    titulo: "Aviso a los Aviadores (NOTAM) Cierre Temporal",
    categoria: "Operacional",
    categoriaColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: Info,
    contenido: "Runway 09/27 de Base Aérea Libertador cerrada por barrido de FOD en franja horaria 1400Z-1600Z. Uso exclusivo de calles de rodaje externas."
  }
];

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>(INITIAL_NEWS);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Timer estocástico para simular llegadas de boletines aleatorios
    // En producción podría ser Websockets, aquí lo simulamos entre 15s y 45s
    const tick = () => {
      setIsUpdating(true);
      
      const randomNewsTemplate = DYNAMIC_NEWS_POOL[Math.floor(Math.random() * DYNAMIC_NEWS_POOL.length)];
      
      const newDato: Noticia = {
        id: Math.random().toString(36).substr(2, 9),
        titulo: randomNewsTemplate.titulo,
        fecha: new Date().toLocaleTimeString('es-VE') + ' ' + new Date().toLocaleDateString('es-VE'),
        categoria: randomNewsTemplate.categoria,
        categoriaColor: randomNewsTemplate.categoriaColor,
        icon: randomNewsTemplate.icon,
        contenido: randomNewsTemplate.contenido
      };

      setNoticias(prev => {
        const next = [newDato, ...prev];
        // Mantener el feed corto y limpio, ej max 10
        if (next.length > 10) next.pop(); 
        return next;
      });

      setTimeout(() => setIsUpdating(false), 2000);
      
      // Programar la próxima actualización entre 10 y 20 segundos
      const nextDelay = 10000 + Math.random() * 10000;
      timeoutId = setTimeout(tick, nextDelay);
    };

    // Primera ejecución simulada a los 8 segundos de cargar
    let timeoutId = setTimeout(tick, 8000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-1 flex items-center gap-2">
            NOTICIAS Y BOLETINES
            {isUpdating && <Radio size={18} className="text-emerald-500 animate-[pulse_0.5s_cubic-bezier(0.4,0,0.6,1)_infinite]" />}
          </h2>
          <p className="text-gray-400 text-sm">Avisos institucionales, alertas meteorológicas y boletines operacionales del Servicio Meteorológico de la Aviación en <span className="text-emerald-400 font-bold">Tiempo Real</span>.</p>
        </div>
      </div>

      <div className="space-y-4">
        {noticias.map((noticia, index) => (
          <article 
            key={noticia.id} 
            className={`bg-[#1e293b] border border-gray-700 rounded-xl p-5 hover:border-gray-500 transition-all duration-700 ${index === 0 && isUpdating ? 'ring-2 ring-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)] translate-y-0 opacity-100' : 'translate-y-0 opacity-100'}`}
            style={{ 
               // Pequeña animación de entrada para el primer elemento
               animation: index === 0 ? 'slideDown 0.5s ease-out forwards' : 'none'
            }}
          >
            <div className="flex items-start gap-4">
              <div className="bg-[#0f172a] p-3 rounded-lg border border-gray-700 shrink-0">
                <noticia.icon size={22} className="text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${noticia.categoriaColor}`}>
                      {noticia.categoria}
                    </span>
                    {index === 0 && isUpdating && (
                      <span className="text-[10px] text-emerald-400 font-bold animate-pulse px-2 bg-emerald-500/20 rounded">NUEVO</span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-500 font-mono">{noticia.fecha}</span>
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{noticia.titulo}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{noticia.contenido}</p>
              </div>
            </div>
            
            <style jsx>{`
              @keyframes slideDown {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
          </article>
        ))}
      </div>
      
      <div className="text-center pt-4">
         <span className="text-xs text-gray-600 font-mono tracking-widest uppercase flex items-center justify-center gap-2">
           <Zap size={10} /> Recibiendo telemetría vía enlace Datalink
         </span>
      </div>
    </div>
  );
}
