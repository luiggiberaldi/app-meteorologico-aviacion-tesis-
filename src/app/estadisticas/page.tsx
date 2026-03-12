"use client";

import MetarTafGamet from "@/components/MetarTafGamet";
import dynamic from "next/dynamic";

const OperationalEffectiveness = dynamic(() => import("@/components/OperationalEffectiveness"), {
  loading: () => <div className="h-64 bg-[#1e293b] rounded-xl border border-gray-700 animate-pulse flex items-center justify-center"><p className="text-gray-500">Cargando efectividad operacional...</p></div>
});

const OperationsManagement = dynamic(() => import("@/components/OperationsManagement"), {
  loading: () => <div className="h-64 bg-[#1e293b] rounded-xl border border-gray-700 animate-pulse flex items-center justify-center"><p className="text-gray-500">Cargando gestión de operaciones...</p></div>
});

export default function EstadisticasPage() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-1">ESTADÍSTICAS Y OPERACIONES</h2>
        <p className="text-gray-400 text-sm">Efectividad operacional, gestión de misiones y reportes METAR/TAF/GAMET para la toma de decisiones estratégicas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OperationalEffectiveness />
        </div>
        <div className="lg:col-span-1">
          <OperationsManagement />
        </div>
      </div>

      <MetarTafGamet />
    </div>
  );
}
