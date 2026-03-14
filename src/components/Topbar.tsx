"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Plane, Menu, X, LayoutDashboard, BarChart3, FileText, ChevronDown, 
  Navigation, Satellite, BrainCircuit, Newspaper, BookOpen, ShieldCheck, Users, Settings, LogOut, Bell
} from "lucide-react";
import { useBaseContext } from "@/context/BaseContext";
import { useAuth } from "@/context/AuthContext";

type Notificacion = {
  id: string;
  titulo: string;
  descripcion: string;
  tiempo: string;
  colorBorder: string;
};

const INITIAL_NOTIFICATIONS: Notificacion[] = [
  { id: 'n1', titulo: 'Tormenta Severa Detectada', descripcion: 'Alto nivel CAPE en aproximación sureste. Posible cancelación de despegues.', tiempo: 'Hace 2 min', colorBorder: 'border-l-red-500' },
  { id: 'n2', titulo: 'Descenso de Isoterma', descripcion: 'Nivel de congelamiento (0°C) ha descendido a 2,500m. Precaución por engelamiento.', tiempo: 'Hace 15 min', colorBorder: 'border-l-amber-500' },
  { id: 'n3', titulo: 'Alerta Evaporativa Agrícola', descripcion: 'Sensores TDA reportan evapotranspiración anómala en llanos centrales.', tiempo: 'Hace 1 hora', colorBorder: 'border-l-blue-500' }
];

const DYNAMIC_ALERTS_POOL = [
  { titulo: 'Cizalladura de Viento', descripcion: 'Reporte de windshear en capa baja (LLWS) cerca de umbral de pista.', colorBorder: 'border-l-amber-500' },
  { titulo: 'Aproximación IFR Requerida', descripcion: 'Techo de nubes descendiendo rápidamente. Obligatorio operaciones por instrumentos.', colorBorder: 'border-l-red-500' },
  { titulo: 'Anomalía de Presión', descripcion: 'Sensores barométricos indican caída súbita de presión. Posible formación ciclónica.', colorBorder: 'border-l-red-500' },
  { titulo: 'Restablecimiento de GOES', descripcion: 'Recepción de barrido satelital normalizada en banda infrarroja.', colorBorder: 'border-l-emerald-500' },
  { titulo: 'Humedad del Suelo Crítica', descripcion: 'Sensores en cabecera de pista detectan saturación 95%. Riesgo moderado de aquaplaning.', colorBorder: 'border-l-blue-500' },
  { titulo: 'Ráfagas de Viento Fuertes', descripcion: 'Vientos cruzados exceden 25 nudos. Precaución aeronaves ligeras en aproximación.', colorBorder: 'border-l-amber-500' }
];

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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>(INITIAL_NOTIFICATIONS);
  const [unreadCount, setUnreadCount] = useState(3);
  const [isAnimatingBell, setIsAnimatingBell] = useState(false);

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

  useEffect(() => {
    // Generador Táctico Dinámico de Notificaciones
    const tick = () => {
      const template = DYNAMIC_ALERTS_POOL[Math.floor(Math.random() * DYNAMIC_ALERTS_POOL.length)];
      const newNotif: Notificacion = {
        id: Math.random().toString(36).substr(2, 9),
        titulo: template.titulo,
        descripcion: template.descripcion,
        tiempo: 'Justo ahora',
        colorBorder: template.colorBorder
      };

      setNotificaciones(prev => {
        // Envejecer el tiempo artificialmente para darle efecto real
        const next = [newNotif, ...prev].map(n => {
           if (n.tiempo === 'Justo ahora') return { ...n, tiempo: 'Hace ' + Math.floor(Math.random() * 5 + 1) + ' min' };
           return n;
        });
        next[0].tiempo = 'Justo ahora';
        if (next.length > 8) next.pop(); // Max 8 notificaciones en la vista superior
        return next;
      });

      setUnreadCount(prev => prev + 1);
      
      // Animación de llegada
      setIsAnimatingBell(true);
      setTimeout(() => setIsAnimatingBell(false), 2000);

      const nextDelay = 15000 + Math.random() * 25000; // Entre 15 y 40 segundos
      timeoutId = setTimeout(tick, nextDelay);
    };

    let timeoutId = setTimeout(tick, 12000);
    return () => clearTimeout(timeoutId);
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
      <header className="h-16 bg-[#1e293b] border-b border-gray-700 flex items-center justify-between px-3 lg:px-6 shadow-md shrink-0 relative z-40">
        {/* Mobile Menu Icon & Logo */}
        <div className="flex items-center space-x-2">
          <button 
            className="md:hidden text-gray-300 hover:text-white p-2 rounded-md hover:bg-gray-800"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={22} />
          </button>
          
          <div className="hidden sm:flex items-center">
            <img src="/2.png" alt="Sermetavia Logo" className="h-[38px] w-auto object-contain mr-2" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide truncate max-w-[150px] sm:max-w-none">
              <span className="hidden xl:inline-block text-gray-300 font-medium tracking-normal mr-1">Red Meteorológica Nacional</span>
              <span className="xl:hidden">SERMETAVIA</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Base Selector */}
          <div className="relative hidden lg:block">
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

          {/* Notificaciones */}
          <div className="relative">
            <button 
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                if (!isNotificationsOpen) setUnreadCount(0); // Marcar como leidas al abrir
              }}
              className={`relative p-2 transition-colors rounded-full hover:bg-gray-800 focus:outline-none ${isAnimatingBell ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Bell size={20} className={isAnimatingBell ? "animate-[bell_0.5s_ease-out_forwards] text-emerald-400" : ""} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center min-w-[14px] h-[14px] px-1 bg-red-500 rounded-full text-[9px] text-white font-bold border border-[#1e293b] shadow-lg animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Estilo local para animación customizada de la campana */}
            <style jsx>{`
              @keyframes bell {
                0% { transform: rotate(0deg); }
                20% { transform: rotate(15deg) scale(1.1); }
                40% { transform: rotate(-15deg) scale(1.1); }
                60% { transform: rotate(10deg) scale(1.1); }
                80% { transform: rotate(-10deg) scale(1.1); }
                100% { transform: rotate(0deg) scale(1); }
              }
            `}</style>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-[#0f172a] border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden text-left">
                <div className="bg-[#1e293b] px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Alertas Activas</span>
                  {unreadCount > 0 ? (
                    <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/30">
                      {unreadCount} NUEVA{unreadCount > 1 ? 'S' : ''}
                    </span>
                  ) : (
                     <span className="text-[10px] text-gray-500 monospace">Al día</span>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notificaciones.map((notif, index) => (
                    <div 
                      key={notif.id} 
                      className={`px-4 py-3 border-b border-gray-800/50 hover:bg-[#1e293b]/50 transition-colors cursor-pointer border-l-2 ${notif.colorBorder} ${index < unreadCount ? 'bg-[#1e293b]/30' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-0.5">
                         <p className="text-xs font-bold text-white">{notif.titulo}</p>
                         {index < unreadCount && <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shadow-[0_0_5px_red]"></span>}
                      </div>
                      <p className="text-[11px] text-gray-400 leading-relaxed">{notif.descripcion}</p>
                      <p className="text-[9px] text-gray-500 font-mono mt-1">{notif.tiempo}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-[#1e293b]/80 px-4 py-2 text-center">
                  <Link href="/alertas" onClick={() => setIsNotificationsOpen(false)} className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-widest cursor-pointer">
                    Ver Central de Alertas
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User & Logout */}
          {user && (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex w-7 h-7 rounded-full bg-emerald-900/50 border border-emerald-600/40 items-center justify-center text-emerald-300 text-[10px] font-bold">
                {(user.displayName || user.username || 'U').charAt(0).toUpperCase()}
              </div>
              <button
                onClick={() => signOut()}
                className="text-gray-400 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-gray-800"
                title="Cerrar Sesión"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MOBILE MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Fondo oscuro overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Menú Sidebar */}
          <aside className="relative flex flex-col w-[260px] bg-[#0f172a] h-full shadow-2xl animate-[slideRight_0.3s_ease-out]">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
               <div>
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Red Meteorológica</p>
                 <img src="/2.png" alt="Logo" className="h-[28px] w-auto object-contain" />
               </div>
               <button 
                 onClick={() => setIsMobileMenuOpen(false)}
                 className="p-2 text-gray-400 hover:text-white bg-gray-800/50 rounded-full"
               >
                 <X size={20} />
               </button>
            </div>

            {/* Selector de base EN EL MENU MOVIL */}
            <div className="p-4 border-b border-gray-800 lg:hidden">
              <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Estación Activa</label>
              <div className="relative">
                <select 
                  className="w-full appearance-none bg-[#1e293b] text-white text-xs font-medium border border-gray-600 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-[#10b981]"
                  value={selectedBase?.id || ""}
                  onChange={(e) => {
                    const id = e.target.value;
                    if (!id) setSelectedBase(null);
                    else setSelectedBase(bases.find(b => b.id.toString() === id) || null);
                    setIsMobileMenuOpen(false); // Cerrar menú al elegir base
                  }}
                >
                  <option value="">Nacional</option>
                  {bases.map(b => (
                    <option key={b.id} value={b.id}>{b.nombre}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-2">
              <p className="px-5 text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-2 mb-2">Operaciones</p>
              <ul className="space-y-1 px-2">
                {mainNav.map(item => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={linkClass(item.href)}>
                      <item.icon size={18} className={pathname === item.href ? "text-[#10b981]" : ""} />
                      <span className="font-medium text-sm">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="my-4 mx-5 border-t border-gray-800"></div>

              <p className="px-5 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Sistema</p>
              <ul className="space-y-1 px-2">
                {systemNav.map(item => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={linkClass(item.href)}>
                      <item.icon size={18} className={pathname === item.href ? "text-[#10b981]" : ""} />
                      <span className="font-medium text-sm">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-4 border-t border-gray-800 text-center">
               <p className="text-[10px] text-gray-500">SERMETAVIA V 2.0.0</p>
            </div>
          </aside>

          <style jsx>{`
            @keyframes slideRight {
              from { transform: translateX(-100%); }
              to { transform: translateX(0); }
            }
          `}</style>
        </div>
      )}

    </>
  );
}
