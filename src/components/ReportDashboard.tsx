"use client";

import { useState, useEffect } from "react";
import { Printer } from "lucide-react";
import WeatherHistory from "./WeatherHistory";
import SurveyResults from "./SurveyResults";

export default function ReportDashboard() {
  const [printDate, setPrintDate] = useState<string>("");

  useEffect(() => {
    setPrintDate(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`);
  }, []);

  const handlePrint = () => {
    setPrintDate(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`);
    // Pequeño timeout para permitir que React renderice la nueva fecha antes de imprimir
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <section className="bg-[#0f172a] rounded-xl border border-gray-700 overflow-hidden print:border-none print:bg-transparent">
      
      {/* Encabezado del módulo */}
      <div className="bg-[#1e293b] print:bg-white p-5 border-b border-gray-700 print:border-b-2 print:border-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white print:text-black">
            Reportes y Exportación
          </h3>
          <p className="text-sm text-gray-400 print:text-gray-600 mt-1">
            Histórico de Condiciones Meteorológicas y Resultados de la Encuesta.
          </p>
        </div>
        
        <button
          onClick={handlePrint}
          className="print-hidden flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 px-4 py-2 rounded-md transition-colors text-sm font-medium"
        >
          <Printer size={16} />
          <span>Imprimir Reporte</span>
        </button>
      </div>

      {/* Contenido (Alineado en cuadrícula) */}
      <div className="p-5 print:p-0 print:py-5 grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Historial Meteorológico -> Ocupa 2 espacios en pantallas grandes */}
        <div className="xl:col-span-2 space-y-4">
          <div className="print:hidden">
            <p className="text-sm text-gray-400 mb-2">Registro de las últimas lecturas almacenadas en Base de Datos.</p>
          </div>
          <WeatherHistory />
        </div>

        {/* Resultados Encuesta -> Ocupa 1 espacio */}
        <div className="xl:col-span-1 space-y-4 print:mt-8 xl:print:mt-0">
          <div className="print:hidden">
            <p className="text-sm text-gray-400 mb-2">Conteo de las métricas dicotómicas recolectadas (Sí/No).</p>
          </div>
          <SurveyResults />
        </div>

      </div>

      {/* Footer solo para versión de impresión */}
      <div className="hidden print:block text-center pt-8 border-t-2 border-black mt-8 text-xs text-gray-500">
        <p>Generado automáticamente - Sistema Meteorológico BARAGUA</p>
        <p>Fecha de Impresión: {printDate}</p>
      </div>

    </section>
  );
}
