"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plane, Menu, X, LayoutDashboard, CloudSun, AlertTriangle, BarChart3, FileText, ChevronDown, Map, Navigation, Satellite } from "lucide-react";
import { useBaseContext } from "@/context/BaseContext";

export default function Topbar() {
  const [timeUTC, setTimeUTC] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { selectedBase, setSelectedBase, bases } = useBaseContext();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeUTC(
        now.toISOString().substring(11, 19) + " UTC"
      );
    };
    
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="h-16 bg-[#1e293b] border-b border-gray-700 flex items-center justify-between px-4 lg:px-6 shadow-md shrink-0">
        {/* Logo & Titulo */}
        <div className="flex items-center space-x-3">
          <button 
            className="md:hidden text-gray-300 hover:text-white p-1"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </button>
          
          <div className="hidden md:flex bg-[#10b981] p-2 rounded-md">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide">
              SERMETAVIA <span className="hidden md:inline-block font-normal text-gray-400 mx-1">|</span> <span className="hidden md:inline-block text-gray-300 font-medium tracking-normal text-sm">Red Meteorológica Nacional</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Base Selector */}
          <div className="relative hidden sm:block">
            <select 
              className="appearance-none bg-[#0f172a] text-white text-xs sm:text-sm font-medium border border-gray-600 rounded-lg px-2 sm:px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-[#10b981]"
              value={selectedBase?.id || ""}
              onChange={(e) => {
                const id = e.target.value;
                if (!id) setSelectedBase(null);
                else setSelectedBase(bases.find(b => b.id.toString() === id) || null);
              }}
            >
              <option value="">Todas las Bases (Nacional)</option>
              {bases.map(b => (
                <option key={b.id} value={b.id}>{b.nombre}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Reloj UTC */}
          <div className="flex items-center space-x-2 bg-black/30 px-2 sm:px-3 py-1.5 rounded border border-gray-600">
            <span className="hidden sm:inline-block text-xs text-gray-400 font-mono">HORA ZULU</span>
            <span className="text-xs sm:text-sm font-bold text-[#f59e0b] font-mono tracking-widest">{timeUTC || "00:00:00 UTC"}</span>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          
          {/* Menu */}
          <div className="relative w-64 bg-[#0f172a] h-full flex flex-col border-r border-gray-800 shadow-xl animate-in slide-in-from-left-full duration-200">
             <div className="p-4 py-6 border-b border-gray-800 flex justify-between items-center">
               <div>
                 <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Panel</p>
                 <p className="text-xl font-bold text-white mt-1">SERMETAVIA</p>
               </div>
               <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white p-1 bg-gray-800 rounded">
                 <X size={20} />
               </button>
             </div>
             
             <nav className="flex-1 overflow-y-auto py-4">
               <ul className="space-y-1 px-3">
                 <li>
                   <Link href="/#pronostico" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-[#1e293b] hover:text-white transition-colors">
                     <LayoutDashboard size={20} />
                     <span className="font-medium text-sm">Pronóstico Actual</span>
                   </Link>
                 </li>
                 <li>
                   <Link href="/#mapa" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-[#1e293b] hover:text-white transition-colors">
                     <Map size={20} />
                     <span className="font-medium text-sm">Mapa Nacional</span>
                   </Link>
                 </li>
                 <li>
                   <Link href="/imagenes-satelitales" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-[#1e293b] hover:text-white transition-colors">
                     <Satellite size={20} />
                     <span className="font-medium text-sm">Imágenes Satelitales</span>
                   </Link>
                 </li>
                 <li>
                   <Link href="/#mapa" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-[#1e293b] hover:text-white transition-colors">
                     <Map size={20} />
                     <span className="font-medium text-sm">Mapa Nacional</span>
                   </Link>
                 </li>
                 <li>
                   <Link href="/#planificacion" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-[#1e293b] hover:text-white transition-colors">
                     <Navigation size={20} />
                     <span className="font-medium text-sm">Planificación de Vuelos</span>
                   </Link>
                 </li>
                 <li>
                   <Link href="/#metar" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-[#1e293b] hover:text-white transition-colors">
                     <CloudSun size={20} />
                     <span className="font-medium text-sm">METAR / TAF / GAMET</span>
                   </Link>
                 </li>
                 <li>
                   <Link href="/#alertas" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-[#1e293b] hover:text-white transition-colors">
                     <AlertTriangle size={20} />
                     <span className="font-medium text-sm">Alertas Operacionales</span>
                   </Link>
                 </li>
                 <li>
                   <Link href="/#efectividad" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-[#1e293b] hover:text-white transition-colors">
                     <BarChart3 size={20} />
                     <span className="font-medium text-sm">Efectividad Operacional</span>
                   </Link>
                 </li>
                 <li>
                   <Link href="/#operaciones" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-[#1e293b] hover:text-white transition-colors">
                     <Plane size={20} />
                     <span className="font-medium text-sm">Gestión de Operaciones</span>
                   </Link>
                 </li>
                 <li>
                   <Link href="/#reportes" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-[#1e293b] hover:text-white transition-colors">
                     <FileText size={20} />
                     <span className="font-medium text-sm">Reportes</span>
                   </Link>
                 </li>
               </ul>
             </nav>
             
             <div className="p-4 border-t border-gray-800 text-center">
               <p className="text-[10px] text-gray-500">SERMETAVIA V 1.0.0-alpha</p>
             </div>
          </div>
        </div>
      )}
    </>
  );
}
