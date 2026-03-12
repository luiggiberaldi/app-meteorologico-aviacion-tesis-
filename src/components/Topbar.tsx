"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Plane, Menu, X, LayoutDashboard, BarChart3, FileText, ChevronDown, 
  Navigation, Satellite, BrainCircuit, Newspaper, BookOpen, ShieldCheck, Users, Settings, LogOut 
} from "lucide-react";
import { useBaseContext } from "@/context/BaseContext";
import { useAuth } from "@/context/AuthContext";

const mainNav = [
  { href: "/", label: "Centro de Mando", icon: LayoutDashboard },
  { href: "/planificacion", label: "Planificación de Vuelos", icon: Navigation },
  { href: "/imagenes-satelitales", label: "Imágenes Satelitales", icon: Satellite },
  { href: "/estadisticas", label: "Estadísticas y Operaciones", icon: BarChart3 },
  { href: "/historico", label: "Datos Históricos", icon: FileText },
  { href: "/prediccion-ia", label: "IA Predictiva", icon: BrainCircuit },
];

const systemNav = [
  { href: "/noticias", label: "Noticias", icon: Newspaper },
  { href: "/manual", label: "Manual de Usuario", icon: BookOpen },
  { href: "/seguridad", label: "Seguridad Cibernética", icon: ShieldCheck },
  { href: "/usuarios", label: "Usuarios", icon: Users },
  { href: "/configuracion", label: "Configuración", icon: Settings },
];

export default function Topbar() {
  const [timeUTC, setTimeUTC] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { selectedBase, setSelectedBase, bases } = useBaseContext();
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeUTC(now.toISOString().substring(11, 19) + " UTC");
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const linkClass = (href: string) => {
    const isActive = pathname === href;
    return `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
      isActive
        ? "bg-[#1e293b] text-white border-l-4 border-[#10b981]"
        : "text-gray-400 hover:bg-[#1e293b] hover:text-white"
    }`;
  };

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
          
          <div className="hidden md:flex items-center">
            <img src="/2.png" alt="Sermetavia Logo" className="h-[42px] w-auto object-contain mr-3" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide">
              <span className="hidden md:inline-block text-gray-300 font-medium tracking-normal text-sm">Red Meteorológica Nacional</span>
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

          {/* User & Logout */}
          {user && (
            <div className="hidden md:flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-900/50 border border-emerald-600/40 flex items-center justify-center text-emerald-300 text-[10px] font-bold">
                {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
              </div>
              <button
                onClick={() => signOut()}
                className="text-gray-400 hover:text-red-400 transition-colors p-1"
                title="Cerrar Sesión"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          
          <div className="relative w-64 bg-[#0f172a] h-full flex flex-col border-r border-gray-800 shadow-xl animate-in slide-in-from-left-full duration-200">
             <div className="p-4 py-6 border-b border-gray-800 flex justify-between items-start">
               <div className="flex flex-col">
                 <img src="/1.png" alt="Sermetavia Logo" className="h-[72px] w-auto object-contain mb-2 self-start" />
               </div>
               <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white p-1 bg-gray-800 rounded self-start">
                 <X size={20} />
               </button>
             </div>
             
             <nav className="flex-1 overflow-y-auto py-4">
               <p className="px-6 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Operaciones</p>
               <ul className="space-y-1 px-3">
                 {mainNav.map(item => (
                   <li key={item.href}>
                     <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={linkClass(item.href)}>
                       <item.icon size={20} className={pathname === item.href ? "text-[#10b981]" : ""} />
                       <span className="font-medium text-sm">{item.label}</span>
                     </Link>
                   </li>
                 ))}
               </ul>

               <div className="my-4 mx-6 border-t border-gray-800"></div>

               <p className="px-6 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Sistema</p>
               <ul className="space-y-1 px-3">
                 {systemNav.map(item => (
                   <li key={item.href}>
                     <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={linkClass(item.href)}>
                       <item.icon size={20} className={pathname === item.href ? "text-[#10b981]" : ""} />
                       <span className="font-medium text-sm">{item.label}</span>
                     </Link>
                   </li>
                 ))}
               </ul>
             </nav>
             
             <div className="p-4 border-t border-gray-800 text-center">
               <p className="text-[10px] text-gray-500">SERMETAVIA V 2.0.0</p>
             </div>
          </div>
        </div>
      )}
    </>
  );
}
