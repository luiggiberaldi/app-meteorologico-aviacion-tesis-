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
  Settings
} from "lucide-react";

const mainNav = [
  { href: "/", label: "Centro de Mando", icon: LayoutDashboard },
  { href: "/alertas", label: "Alertas Meteorológicas", icon: AlertTriangle },
  { href: "/sensores", label: "Sensores Especializados", icon: Map },
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

export default function Sidebar() {
  const pathname = usePathname();

  const linkClass = (href: string) => {
    const isActive = pathname === href;
    return `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
      isActive
        ? "bg-[#1e293b] text-white border-l-4 border-[#10b981]"
        : "text-gray-400 hover:bg-[#1e293b] hover:text-white"
    }`;
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0f172a] border-r border-gray-800 h-full shrink-0">
      <div className="p-4 py-6 border-b border-gray-800 flex flex-col items-center justify-center">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.25em] mb-2">Panel de Control</p>
        <img src="/1.png" alt="Sermetavia Logo" className="h-[72px] w-auto object-contain" />
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {/* Navegación Principal */}
        <p className="px-6 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Operaciones</p>
        <ul className="space-y-1 px-3">
          {mainNav.map(item => (
            <li key={item.href}>
              <Link href={item.href} className={linkClass(item.href)}>
                <item.icon size={20} className={pathname === item.href ? "text-[#10b981]" : ""} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Separador */}
        <div className="my-4 mx-6 border-t border-gray-800"></div>

        {/* Navegación del Sistema */}
        <p className="px-6 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Sistema</p>
        <ul className="space-y-1 px-3">
          {systemNav.map(item => (
            <li key={item.href}>
              <Link href={item.href} className={linkClass(item.href)}>
                <item.icon size={20} className={pathname === item.href ? "text-[#10b981]" : ""} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="bg-[#1e293b] rounded p-3 flex flex-col items-center justify-center text-center border border-gray-700">
          <div className="w-2 h-2 rounded-full bg-[#10b981] mb-2 animate-pulse"></div>
          <p className="text-xs text-gray-300">Sistema Activo</p>
          <p className="text-[10px] text-gray-500 mt-1">V 2.0.0</p>
        </div>
      </div>
    </aside>
  );
}
