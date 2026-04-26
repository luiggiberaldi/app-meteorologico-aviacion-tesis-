"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Plane, Menu, X, LayoutDashboard, BarChart3, FileText, ChevronDown,
  Navigation, Satellite, BrainCircuit, Newspaper, BookOpen, ShieldCheck, Users, Settings, LogOut, Bell,
  Moon, Flame, Waves
} from "lucide-react";
import { useBaseContext } from "@/context/BaseContext";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { useTranslation } from "@/i18n";

type Notificacion = {
  id: string;
  titulo: string;
  descripcion: string;
  tiempo: string;
  colorBorder: string;
};

const mainNavKeys = [
  { href: "/", labelKey: 'commandCenter' as const, icon: LayoutDashboard },
  { href: "/planificacion", labelKey: 'flightPlanning' as const, icon: Navigation },
  { href: "/imagenes-satelitales", labelKey: 'satelliteImages' as const, icon: Satellite },
  { href: "/estadisticas", labelKey: 'statistics' as const, icon: BarChart3 },
  { href: "/historico", labelKey: 'historicalData' as const, icon: FileText },
  { href: "/prediccion-ia", labelKey: 'aiPrediction' as const, icon: BrainCircuit },
  { href: "/astronomia", labelKey: 'astronomy' as const, icon: Moon },
  { href: "/alerta-temprana", labelKey: 'earlyWarning' as const, icon: Flame },
  { href: "/oleaje", labelKey: 'maritimeWaves' as const, icon: Waves },
];

const systemNavKeys = [
  { href: "/noticias", labelKey: 'news' as const, icon: Newspaper },
  { href: "/manual", labelKey: 'userManual' as const, icon: BookOpen },
  { href: "/seguridad", labelKey: 'cyberSecurity' as const, icon: ShieldCheck },
  { href: "/usuarios", labelKey: 'users' as const, icon: Users },
  { href: "/configuracion", labelKey: 'settings' as const, icon: Settings },
];

export default function Topbar() {
  const [timeUTC, setTimeUTC] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [unreadCount, setUnreadCount] = useState(3);
  const [isAnimatingBell, setIsAnimatingBell] = useState(false);

  const { selectedBase, setSelectedBase, bases } = useBaseContext();
  const { user, signOut } = useAuth();
  const { settings } = useSettings();
  const pathname = usePathname();
  const { t } = useTranslation('topbar');
  const { t: tSidebar } = useTranslation('sidebar');

  // Initialize notifications with translations
  useEffect(() => {
    setNotificaciones([
      { id: 'n1', titulo: t('notifSevereStorm'), descripcion: t('notifSevereStormDesc'), tiempo: t('ago2min'), colorBorder: 'border-l-red-500' },
      { id: 'n2', titulo: t('notifIsotherm'), descripcion: t('notifIsothermDesc'), tiempo: t('ago15min'), colorBorder: 'border-l-amber-500' },
      { id: 'n3', titulo: t('notifEvaporative'), descripcion: t('notifEvaporativeDesc'), tiempo: t('ago1hour'), colorBorder: 'border-l-blue-500' }
    ]);
  }, [t]);

  const DYNAMIC_ALERTS_POOL_KEYS = [
    { tituloKey: 'notifWindShear' as const, descKey: 'notifWindShearDesc' as const, colorBorder: 'border-l-amber-500' },
    { tituloKey: 'notifIFR' as const, descKey: 'notifIFRDesc' as const, colorBorder: 'border-l-red-500' },
    { tituloKey: 'notifPressure' as const, descKey: 'notifPressureDesc' as const, colorBorder: 'border-l-red-500' },
    { tituloKey: 'notifGOES' as const, descKey: 'notifGOESDesc' as const, colorBorder: 'border-l-emerald-500' },
    { tituloKey: 'notifHumidity' as const, descKey: 'notifHumidityDesc' as const, colorBorder: 'border-l-blue-500' },
    { tituloKey: 'notifGusts' as const, descKey: 'notifGustsDesc' as const, colorBorder: 'border-l-amber-500' },
  ];

  const isActivePath = (href: string) => {
    const normalizedPathname = pathname?.replace(/\/+$/, '') || '';
    const normalizedHref = href.replace(/\/+$/, '') || '';
    return normalizedPathname === normalizedHref;
  };

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
    if (!settings.notificationsEnabled) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    let bellTimeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const template = DYNAMIC_ALERTS_POOL_KEYS[Math.floor(Math.random() * DYNAMIC_ALERTS_POOL_KEYS.length)];
      const newNotif: Notificacion = {
        id: Math.random().toString(36).substr(2, 9),
        titulo: t(template.tituloKey),
        descripcion: t(template.descKey),
        tiempo: t('justNow'),
        colorBorder: template.colorBorder
      };

      setNotificaciones(prev => {
        const next = [newNotif, ...prev].map((n, i) => {
           if (i > 0 && n.tiempo === t('justNow')) return { ...n, tiempo: t('agoMin').replace('{n}', String(Math.floor(Math.random() * 5 + 1))) };
           return n;
        });
        next[0].tiempo = t('justNow');
        if (next.length > 8) next.pop();
        return next;
      });

      setUnreadCount(prev => prev + 1);
      setIsAnimatingBell(true);
      bellTimeoutId = setTimeout(() => setIsAnimatingBell(false), 2000);

      const nextDelay = 15000 + Math.random() * 25000;
      timeoutId = setTimeout(tick, nextDelay);
    };

    timeoutId = setTimeout(tick, 12000);
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(bellTimeoutId);
    };
  }, [settings.notificationsEnabled, t]);

  const linkClass = (href: string) => {
    return `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
      isActivePath(href)
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
            aria-label={t('openMenu')}
          >
            <Menu size={22} />
          </button>

          <div className="hidden sm:flex items-center">
            <img src="/2.png" alt="Aerometrix Logo" className="h-[38px] w-auto object-contain mr-2" />
          </div>

          <div className="flex flex-1 sm:hidden items-center ml-2 mr-2">
            <img src="/2.png" alt="Aerometrix Mobile" className="h-[36px] w-auto object-contain" />
          </div>

          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-white tracking-wide truncate max-w-[150px] sm:max-w-none">
              <span className="hidden xl:inline-block text-gray-300 font-medium tracking-normal mr-1">{t('nationalNetwork')}</span>
              <span className="xl:hidden">AEROMETRIX</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Base Selector Desktop */}
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
              <option value="">{t('allBases')}</option>
              {bases.map(b => (
                <option key={b.id} value={b.id}>{b.nombre}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Base Selector Mobile */}
          <div className="lg:hidden flex items-center">
            <button
               onClick={() => setIsBottomSheetOpen(true)}
               className="bg-[#0f172a] hover:bg-gray-800 text-white text-xs font-bold border border-gray-600 rounded-full px-3 py-1.5 flex items-center gap-1.5 transition-colors shadow-inner"
            >
               <span className="truncate max-w-[90px]">{selectedBase?.nombre || t('national')}</span>
               <ChevronDown size={12} className="text-emerald-400 shrink-0" />
            </button>
          </div>

          {/* Reloj UTC */}
          <div className="flex items-center space-x-2 bg-black/30 px-2 sm:px-3 py-1.5 rounded border border-gray-600">
            <span className="hidden sm:inline-block text-xs text-gray-400 font-mono">{t('zuluTime')}</span>
            <span className="text-xs sm:text-sm font-bold text-[#f59e0b] font-mono tracking-widest">{timeUTC || "00:00:00 UTC"}</span>
          </div>

          {/* Notificaciones */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                if (!isNotificationsOpen) setUnreadCount(0);
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
                  <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{t('activeAlerts')}</span>
                  {unreadCount > 0 ? (
                    <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/30">
                      {unreadCount} {unreadCount > 1 ? t('newPlural') : t('newSingular')}
                    </span>
                  ) : (
                     <span className="text-[10px] text-gray-500 monospace">{t('upToDate')}</span>
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
                    {t('viewAlertCenter')}
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
                title={t('closeSession')}
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
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          <aside className="relative flex flex-col w-[260px] bg-[#0f172a] h-full shadow-2xl animate-[slideRight_0.3s_ease-out]">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
               <div>
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">{tSidebar('metNetwork')}</p>
                 <img src="/1.png" alt="Aerometrix Logo" className="h-[48px] w-auto object-contain" />
               </div>
               <button
                 onClick={() => setIsMobileMenuOpen(false)}
                 className="p-2 text-gray-400 hover:text-white bg-gray-800/50 rounded-full"
               >
                 <X size={20} />
               </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-2">
              <p className="px-5 text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-2 mb-2">{tSidebar('operations')}</p>
              <ul className="space-y-1 px-2">
                {mainNavKeys.map(item => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={linkClass(item.href)}>
                      <item.icon size={18} className={isActivePath(item.href) ? "text-[#10b981]" : ""} />
                      <span className="font-medium text-sm">{tSidebar(item.labelKey)}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="my-4 mx-5 border-t border-gray-800"></div>

              <p className="px-5 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">{tSidebar('system')}</p>
              <ul className="space-y-1 px-2">
                {systemNavKeys.map(item => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={linkClass(item.href)}>
                      <item.icon size={18} className={isActivePath(item.href) ? "text-[#10b981]" : ""} />
                      <span className="font-medium text-sm">{tSidebar(item.labelKey)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-4 border-t border-gray-800 text-center">
               <p className="text-[10px] text-gray-500">AEROMETRIX V 2.0.0</p>
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

      {/* BOTTOM SHEET SELECTOR DE BASE (MOBILE) */}
      {isBottomSheetOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsBottomSheetOpen(false)}
          ></div>

          <div className="relative bg-[#0f172a] rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-gray-700 p-5 mt-20 animate-[slideUp_0.3s_ease-out] flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between mb-4 mt-1 px-1">
              <div>
                <h3 className="text-white font-bold text-lg tracking-wide">{t('operationalArea')}</h3>
                <p className="text-gray-400 text-xs mt-0.5">{t('selectStation')}</p>
              </div>
              <button
                onClick={() => setIsBottomSheetOpen(false)}
                className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pb-6 px-1 hide-scrollbar">
              <button
                onClick={() => { setSelectedBase(null); setIsBottomSheetOpen(false); }}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors text-left ${!selectedBase ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-[#1e293b] border-gray-700 hover:bg-gray-800'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${!selectedBase ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-400'}`}>
                    <LayoutDashboard size={18} />
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm ${!selectedBase ? 'text-emerald-400' : 'text-white'}`}>{t('nationalNetwork2')}</h4>
                    <p className="text-[10px] text-gray-500 uppercase mt-0.5 font-bold tracking-widest">{t('countryAverage')}</p>
                  </div>
                </div>
                {!selectedBase && <div className="w-2.5 h-2.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />}
              </button>

              {bases.map(b => {
                const isSelected = selectedBase?.id === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => { setSelectedBase(b); setIsBottomSheetOpen(false); }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors text-left ${isSelected ? 'bg-blue-900/30 border-blue-500/50' : 'bg-[#1e293b] border-gray-800 hover:bg-gray-800'}`}
                  >
                    <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold text-[11px] border ${isSelected ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                         {b.codigo}
                       </div>
                       <div className="min-w-0 pr-2">
                         <h4 className={`font-bold text-sm truncate ${isSelected ? 'text-blue-400' : 'text-gray-200'}`}>{b.nombre}</h4>
                         <p className="text-[10px] text-gray-500 font-mono mt-1">Lat: {b.latitud.toFixed(2)} / Lon: {b.longitud.toFixed(2)}</p>
                       </div>
                    </div>
                    {isSelected && <div className="w-2.5 h-2.5 shrink-0 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />}
                  </button>
                );
              })}
            </div>
          </div>
          <style jsx>{`
            @keyframes slideUp {
              from { transform: translateY(100%); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </div>
      )}

    </>
  );
}
