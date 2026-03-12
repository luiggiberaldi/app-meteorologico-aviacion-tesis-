"use client";

import dynamic from "next/dynamic";
import CurrentForecast from "@/components/CurrentForecast";
import OperationalAlerts from "@/components/OperationalAlerts";
import GeneralSituation from "@/components/GeneralSituation";

// Lazy loading para el mapa (componente pesado)
const VenezuelaWeatherMap = dynamic(() => import("@/components/VenezuelaWeatherMap"), { 
  ssr: false, 
  loading: () => <div className="h-96 bg-[#1e293b] rounded-xl border border-gray-700 animate-pulse flex items-center justify-center"><p className="text-gray-500">Cargando mapa interactivo...</p></div> 
});

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Página */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-1">CENTRO DE MANDO</h2>
        <p className="text-gray-400 text-sm">Plataforma de pronóstico meteorológico para el control y efectividad de las aeronaves a nivel nacional de la República Bolivariana de Venezuela.</p>
      </div>

      {/* Situación General */}
      <GeneralSituation />

      {/* Pronóstico Actual */}
      <CurrentForecast />

      {/* Mapa Meteorológico Nacional */}
      <VenezuelaWeatherMap />

      {/* Alertas Operacionales */}
      <OperationalAlerts />

    </div>
  );
}
