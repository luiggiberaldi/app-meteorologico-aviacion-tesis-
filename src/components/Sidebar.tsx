"use client";

import Link from "next/link";
import { 
  LayoutDashboard, 
  CloudSun, 
  AlertTriangle, 
  BarChart3, 
  FileText,
  Map,
  Plane,
  Navigation,
  Satellite
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0f172a] border-r border-gray-800 h-full shrink-0">
      <div className="p-4 py-6 border-b border-gray-800">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Panel de Control</p>
        <p className="text-xl font-bold text-white mt-1">SERMETAVIA</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          <li>
            <Link href="/#pronostico" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-[#1e293b] text-white border-l-4 border-[#10b981] transition-colors hover:bg-gray-800">
              <LayoutDashboard size={20} className="text-[#10b981]" />
              <span className="font-medium text-sm">Pronóstico Actual</span>
            </Link>
          </li>
          <li>
            <Link href="/#mapa" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-[#1e293b] hover:text-white transition-colors">
              <Map size={20} />
              <span className="font-medium text-sm">Mapa Nacional</span>
            </Link>
          </li>
          <li>
            <Link href="/imagenes-satelitales" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-[#1e293b] hover:text-white transition-colors">
              <Satellite size={20} />
              <span className="font-medium text-sm">Imágenes Satelitales</span>
            </Link>
          </li>
          <li>
            <Link href="/#planificacion" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-[#1e293b] hover:text-white transition-colors">
              <Navigation size={20} />
              <span className="font-medium text-sm">Planificación de Vuelos</span>
            </Link>
          </li>
          <li>
            <Link href="/#metar" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-[#1e293b] hover:text-white transition-colors">
              <CloudSun size={20} />
              <span className="font-medium text-sm">METAR / TAF / GAMET</span>
            </Link>
          </li>
          <li>
            <Link href="/#alertas" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-[#1e293b] hover:text-white transition-colors">
              <AlertTriangle size={20} />
              <span className="font-medium text-sm">Alertas Operacionales</span>
            </Link>
          </li>
          <li>
            <Link href="/#estadisticas-operativas" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-[#1e293b] hover:text-white transition-colors">
              <BarChart3 size={20} />
              <span className="font-medium text-sm">Efectividad Operacional</span>
            </Link>
          </li>
          <li>
            <Link href="/#estadisticas-operativas" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-[#1e293b] hover:text-white transition-colors">
              <Plane size={20} />
              <span className="font-medium text-sm">Gestión de Operaciones</span>
            </Link>
          </li>
          <li>
            <Link href="/#reportes" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-[#1e293b] hover:text-white transition-colors">
              <FileText size={20} />
              <span className="font-medium text-sm">Reportes</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="bg-[#1e293b] rounded p-3 flex flex-col items-center justify-center text-center border border-gray-700">
          <div className="w-2 h-2 rounded-full bg-[#10b981] mb-2 animate-pulse"></div>
          <p className="text-xs text-gray-300">Sistema Activo</p>
          <p className="text-[10px] text-gray-500 mt-1">V 1.0.0-alpha</p>
        </div>
      </div>
    </aside>
  );
}
