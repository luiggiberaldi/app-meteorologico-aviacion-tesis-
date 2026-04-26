"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CloudSun,
  AlertTriangle,
  BarChart3,
  FileText,
  Map,
  Navigation,
  Satellite,
  BrainCircuit,
  Newspaper,
  BookOpen,
  ShieldCheck,
  Users,
  Settings,
  Moon,
  Flame,
  Waves
} from "lucide-react";
import { useTranslation } from "@/i18n";

const mainNav = [
  { href: "/", labelKey: 'commandCenter' as const, icon: LayoutDashboard },
  { href: "/alertas", labelKey: 'weatherAlerts' as const, icon: AlertTriangle },
  { href: "/sensores", labelKey: 'specializedSensors' as const, icon: Map },
  { href: "/planificacion", labelKey: 'flightPlanning' as const, icon: Navigation },
  { href: "/imagenes-satelitales", labelKey: 'satelliteImages' as const, icon: Satellite },
  { href: "/estadisticas", labelKey: 'statistics' as const, icon: BarChart3 },
  { href: "/historico", labelKey: 'historicalData' as const, icon: FileText },
  { href: "/prediccion-ia", labelKey: 'aiPrediction' as const, icon: BrainCircuit },
  { href: "/astronomia", labelKey: 'astronomy' as const, icon: Moon },
  { href: "/alerta-temprana", labelKey: 'earlyWarning' as const, icon: Flame },
  { href: "/oleaje", labelKey: 'maritimeWaves' as const, icon: Waves },
];

const systemNav = [
  { href: "/noticias", labelKey: 'news' as const, icon: Newspaper },
  { href: "/manual", labelKey: 'userManual' as const, icon: BookOpen },
  { href: "/seguridad", labelKey: 'cyberSecurity' as const, icon: ShieldCheck },
  { href: "/usuarios", labelKey: 'users' as const, icon: Users },
  { href: "/configuracion", labelKey: 'settings' as const, icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation('sidebar');

  const isActivePath = (href: string) => {
    const normalizedPathname = pathname?.replace(/\/+$/, '') || '';
    const normalizedHref = href.replace(/\/+$/, '') || '';
    return normalizedPathname === normalizedHref;
  };

  const linkClass = (href: string) => {
    return `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
      isActivePath(href)
        ? "bg-[#1e293b] text-white border-l-4 border-[#10b981]"
        : "text-gray-400 hover:bg-[#1e293b] hover:text-white"
    }`;
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0f172a] border-r border-gray-800 h-full shrink-0">
      <div className="p-4 py-6 border-b border-gray-800 flex flex-col items-center justify-center">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.25em] mb-2">{t('controlPanel')}</p>
        <img src="/1.png" alt="Aerometrix Logo" className="h-[72px] w-auto object-contain" />
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <p className="px-6 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">{t('operations')}</p>
        <ul className="space-y-1 px-3">
          {mainNav.map(item => (
            <li key={item.href}>
              <Link href={item.href} className={linkClass(item.href)}>
                <item.icon size={20} className={isActivePath(item.href) ? "text-[#10b981]" : ""} />
                <span className="font-medium text-sm">{t(item.labelKey)}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="my-4 mx-6 border-t border-gray-800"></div>

        <p className="px-6 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">{t('system')}</p>
        <ul className="space-y-1 px-3">
          {systemNav.map(item => (
            <li key={item.href}>
              <Link href={item.href} className={linkClass(item.href)}>
                <item.icon size={20} className={isActivePath(item.href) ? "text-[#10b981]" : ""} />
                <span className="font-medium text-sm">{t(item.labelKey)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="bg-[#1e293b] rounded p-3 flex flex-col items-center justify-center text-center border border-gray-700">
          <div className="w-2 h-2 rounded-full bg-[#10b981] mb-2 animate-pulse"></div>
          <p className="text-xs text-gray-300">{t('systemActive')}</p>
          <p className="text-[10px] text-gray-500 mt-1">V 2.0.0</p>
        </div>
      </div>
    </aside>
  );
}
