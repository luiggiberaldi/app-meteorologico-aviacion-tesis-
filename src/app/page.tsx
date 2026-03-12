"use client";

import dynamic from "next/dynamic";
import CurrentForecast from "@/components/CurrentForecast";
import MetarTafGamet from "@/components/MetarTafGamet";
import OperationalAlerts from "@/components/OperationalAlerts";
import GeneralSituation from "@/components/GeneralSituation";
import OperationsManagement from "@/components/OperationsManagement";
import FlightPlanning from "@/components/FlightPlanning";
import AIPredictionPlaceholder from "@/components/AIPredictionPlaceholder";

// Lazy loading para componentes pesados (mapas, gráficos, comparativas)
const VenezuelaWeatherMap = dynamic(() => import("@/components/VenezuelaWeatherMap"), { 
  ssr: false, 
  loading: () => <div className="h-96 bg-[#1e293b] rounded-xl border border-gray-700 animate-pulse flex items-center justify-center"><p className="text-gray-500">Cargando mapa interactivo...</p></div> 
});
const CompareBases = dynamic(() => import("@/components/CompareBases"), {
  loading: () => <div className="h-64 bg-[#1e293b] rounded-xl border border-gray-700 animate-pulse flex items-center justify-center"><p className="text-gray-500">Cargando comparativa nacional...</p></div>
});
const OperationalEffectiveness = dynamic(() => import("@/components/OperationalEffectiveness"), {
  loading: () => <div className="h-64 bg-[#1e293b] rounded-xl border border-gray-700 animate-pulse flex items-center justify-center"><p className="text-gray-500">Cargando efectividad operacional...</p></div>
});
const ReportDashboard = dynamic(() => import("@/components/ReportDashboard"), {
  loading: () => <div className="h-64 bg-[#1e293b] rounded-xl border border-gray-700 animate-pulse flex items-center justify-center"><p className="text-gray-500">Cargando panel de reportes...</p></div>
});

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Página */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-1">SITUACIÓN GENERAL</h2>
        <p className="text-gray-400 text-sm">Plataforma de pronóstico meteorológico para el control y efectividad de las aeronaves a nivel nacional de la República Bolivariana de Venezuela.</p>
      </div>

      {/* Módulo General Situation */}
      <div id="general" className="scroll-mt-6">
        <GeneralSituation />
      </div>

      {/* Módulo 1: Pronóstico Actual (Conectado a API y DB) */}
      <div id="pronostico" className="scroll-mt-6">
        <CurrentForecast />
      </div>

      {/* Mapa Meteorológico Nacional */}
      <div id="mapa" className="scroll-mt-6">
        <VenezuelaWeatherMap />
      </div>

      {/* Vista Comparativa Nacional */}
      <div id="comparativa" className="scroll-mt-6">
        <CompareBases />
      </div>

      {/* Planificación de Vuelos */}
      <div id="planificacion" className="scroll-mt-6">
        <FlightPlanning />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Módulo 2: METAR / TAF / GAMET */}
        <div id="metar" className="scroll-mt-6">
          <MetarTafGamet />
        </div>

        {/* Módulo 3: Alertas Operacionales */}
        <div id="alertas" className="scroll-mt-6">
          <OperationalAlerts />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Módulo 4: Efectividad Operacional (Nacional) */}
        <div id="efectividad" className="lg:col-span-2 scroll-mt-6">
          <OperationalEffectiveness />
        </div>

        {/* Nuevo Módulo: Gestión de Operaciones */}
        <div id="operaciones" className="lg:col-span-1 scroll-mt-6">
          <OperationsManagement />
        </div>

        {/* Módulo 5: Reportes y Exportación */}
        <div id="reportes" className="lg:col-span-3 scroll-mt-6">
          <ReportDashboard />
        </div>

      </div>

      {/* Placeholders de Fase 2 Documental (Tesis) */}
      <div className="mt-8">
        <AIPredictionPlaceholder />
      </div>

    </div>
  );
}
