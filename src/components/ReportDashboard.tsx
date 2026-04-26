"use client";

import { useState, useEffect } from "react";
import { Printer, MapPin } from "lucide-react";
import WeatherHistory from "./WeatherHistory";
import { useBaseContext } from "@/context/BaseContext";

export default function ReportDashboard() {
  const { selectedBase } = useBaseContext();
  const [printDate, setPrintDate] = useState<string>("");

  useEffect(() => {
    setPrintDate(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`);
  }, []);

  const handlePrint = () => {
    setPrintDate(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`);
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
            Reporte de Condiciones Meteorológicas
          </h3>
          <p className="text-sm text-gray-400 print:text-gray-600 mt-1">
            {selectedBase ? `Documento Operacional - ${selectedBase.nombre}` : 'Red Nacional (Promediado)'}
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

      {/* Info Header de Impresión Solo Visible al imprimir */}
      {selectedBase && (
        <div className="hidden print:flex justify-between items-center py-4 border-b border-gray-300 mb-4">
           <div>
             <p className="font-bold text-lg">{selectedBase.nombre}</p>
             <p className="text-sm text-gray-700">{selectedBase.ciudad}, {selectedBase.estado} - Venezuela</p>
           </div>
           <div className="text-right text-sm">
             <p><strong>OACI:</strong> {selectedBase.codigo}</p>
             <p><strong>Coordenadas:</strong> {selectedBase.latitud.toFixed(4)}N, {Math.abs(selectedBase.longitud).toFixed(4)}W</p>
           </div>
        </div>
      )}

      {/* Contenido */}
      <div className="p-5 print:p-0 print:py-2">
        <div className="space-y-4">
          <div className="print:hidden">
            <p className="text-sm text-gray-400 mb-2">Registro de las últimas lecturas almacenadas en Base de Datos.</p>
          </div>
          <WeatherHistory />
        </div>
      </div>

      {/* Footer solo para versión de impresión */}
      <div className="hidden print:block text-center pt-8 border-t-2 border-black mt-8 text-xs text-gray-500">
        <p>Generado automáticamente - Sistema Meteorológico AEROMETRIX</p>
        <p>Fecha de Impresión: {printDate} UTC-4</p>
        <p className="mt-1">DOCUMENTO USO OFICIAL</p>
      </div>

    </section>
  );
}
