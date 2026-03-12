"use client";

import FlightPlanning from "@/components/FlightPlanning";
import dynamic from "next/dynamic";

const CompareBases = dynamic(() => import("@/components/CompareBases"), {
  loading: () => <div className="h-64 bg-[#1e293b] rounded-xl border border-gray-700 animate-pulse flex items-center justify-center"><p className="text-gray-500">Cargando comparativa nacional...</p></div>
});

export default function PlanificacionPage() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-1">PLANIFICACIÓN DE VUELOS</h2>
        <p className="text-gray-400 text-sm">Calculadora de rutas aéreas con distancia Haversine, tiempos estimados y análisis de viento cruzado para operaciones tácticas.</p>
      </div>

      <FlightPlanning />

      <CompareBases />
    </div>
  );
}
