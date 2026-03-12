"use client";

import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const secciones = [
  {
    titulo: "¿Qué es SERMETAVIA?",
    contenido: "SERMETAVIA (Servicio Meteorológico de la Aviación) es una plataforma PWA de pronóstico meteorológico diseñada para el control y la efectividad de las operaciones aéreas a nivel nacional de la República Bolivariana de Venezuela. Integra datos en tiempo real de múltiples estaciones meteorológicas, análisis predictivo basado en Inteligencia Artificial y herramientas de planificación de vuelos."
  },
  {
    titulo: "Centro de Mando (Dashboard)",
    contenido: "Es la pantalla principal del sistema. Muestra la Situación General del día, el Pronóstico Actual de la base seleccionada, el Mapa Meteorológico Nacional interactivo con datos en vivo de cada estación, y las Alertas Operacionales vigentes. Desde aquí se obtiene una visión global del estado meteorológico del país."
  },
  {
    titulo: "Planificación de Vuelos",
    contenido: "Módulo que permite calcular rutas aéreas entre bases. Utiliza la Fórmula de Haversine para calcular distancias exactas en Millas Náuticas (NM), estima el Tiempo en Ruta (ETE) basándose en la velocidad de la aeronave, calcula el consumo de combustible estimado, y analiza las condiciones de viento cruzado (Crosswind) para determinar la seguridad del despegue y aterrizaje."
  },
  {
    titulo: "Imágenes Satelitales",
    contenido: "Módulo de monitoreo satelital en tiempo real integrado con Windy.com. Permite visualizar capas de Radar de Precipitación, Cobertura de Nubes, Temperatura, Vientos y Presión Atmosférica. Los datos se actualizan en tiempo real y se sincronizan con la base aérea seleccionada."
  },
  {
    titulo: "Estadísticas y Operaciones",
    contenido: "Panel que muestra métricas de Efectividad Operacional (porcentaje de misiones completadas vs. canceladas por clima), la Gestión de Operaciones activas, y los reportes meteorológicos estándar METAR, TAF y GAMET de cada estación."
  },
  {
    titulo: "IA Predictiva",
    contenido: "Módulo avanzado que utiliza modelos de lenguaje de gran escala (LLM) integrados con datos de sensores meteorológicos. Genera una Matriz de Riesgo Cuantitativa con porcentajes de peligro de Engelamiento, Turbulencia y Pérdida de Visibilidad, acompañada de una recomendación operativa táctica generada por la IA."
  },
  {
    titulo: "Glosario Aeronáutico",
    contenido: "• METAR: Informe meteorológico aeronáutico de rutina (Meteorological Aerodrome Report).\n• TAF: Pronóstico de aeródromo (Terminal Aerodrome Forecast), válido por 24-30 horas.\n• GAMET: Pronóstico de área para vuelos a baja altitud.\n• VFR: Reglas de Vuelo Visual (Visual Flight Rules). Requiere visibilidad mínima de 5km.\n• IFR: Reglas de Vuelo por Instrumentos (Instrument Flight Rules). Se activa cuando las condiciones VFR no se cumplen.\n• QNH: Presión atmosférica ajustada al nivel del mar.\n• NOTAM: Aviso a los aviadores (Notice to Airmen).\n• SIGMET: Información meteorológica significativa para la seguridad de las aeronaves.\n• ETE: Tiempo Estimado en Ruta (Estimated Time Enroute).\n• NM: Milla Náutica (1.852 km)."
  },
];

export default function ManualPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-1">MANUAL DE USUARIO</h2>
        <p className="text-gray-400 text-sm">Guía completa del sistema SERMETAVIA. Consulte cada sección para entender las funcionalidades disponibles y el glosario aeronáutico.</p>
      </div>

      <div className="space-y-3">
        {secciones.map((seccion, index) => (
          <div key={index} className="bg-[#1e293b] border border-gray-700 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-4 hover:bg-[#263548] transition-colors"
            >
              <div className="flex items-center gap-3">
                <BookOpen size={18} className="text-[#10b981] shrink-0" />
                <span className="text-white font-semibold text-sm text-left">{seccion.titulo}</span>
              </div>
              {openIndex === index ? (
                <ChevronUp size={18} className="text-gray-400 shrink-0" />
              ) : (
                <ChevronDown size={18} className="text-gray-400 shrink-0" />
              )}
            </button>
            
            {openIndex === index && (
              <div className="px-4 pb-4 border-t border-gray-700/50">
                <p className="text-gray-300 text-xs leading-relaxed mt-3 whitespace-pre-line">{seccion.contenido}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
