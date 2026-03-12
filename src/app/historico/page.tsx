"use client";

import dynamic from "next/dynamic";

const HistoricalData = dynamic(() => import("@/components/HistoricalData"), {
  loading: () => <div className="h-64 bg-[#1e293b] rounded-xl border border-gray-700 animate-pulse flex items-center justify-center"><p className="text-gray-500">Cargando datos históricos...</p></div>
});

const ReportDashboard = dynamic(() => import("@/components/ReportDashboard"), {
  loading: () => <div className="h-64 bg-[#1e293b] rounded-xl border border-gray-700 animate-pulse flex items-center justify-center"><p className="text-gray-500">Cargando panel de reportes...</p></div>
});

export default function HistoricoPage() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-1">DATOS HISTÓRICOS Y REPORTES</h2>
        <p className="text-gray-400 text-sm">Análisis de tendencias climáticas pasadas y generación de reportes meteorológicos para investigación y auditoría.</p>
      </div>

      <HistoricalData />

      <ReportDashboard />
    </div>
  );
}
