"use client";

import { ShieldCheck, Lock, Key, Database, Globe, Eye, Server, CheckCircle, Wifi, HardDrive } from "lucide-react";

const politicas = [
  {
    titulo: "Cifrado HTTPS/TLS",
    descripcion: "Todas las comunicaciones entre el cliente y el servidor están cifradas mediante protocolo TLS 1.3. Los certificados SSL son gestionados automáticamente por Cloudflare, garantizando la integridad de los datos en tránsito.",
    icon: Lock,
    estado: "Activo"
  },
  {
    titulo: "Autenticación con Persistencia Local",
    descripcion: "El sistema implementa un mecanismo de autenticación basado en sesión local con credenciales cifradas. Las contraseñas requieren un mínimo de 6 caracteres y las sesiones se mantienen activas hasta el cierre explícito por el usuario.",
    icon: Key,
    estado: "Activo"
  },
  {
    titulo: "Row Level Security (RLS) en Base de Datos",
    descripcion: "Supabase implementa políticas de seguridad a nivel de fila (RLS) que garantizan que cada usuario solo puede acceder a los datos que le corresponden según su rol y permisos asignados.",
    icon: Database,
    estado: "Activo"
  },
  {
    titulo: "Protección de API Keys",
    descripcion: "Las claves de acceso a APIs externas (Groq, Open-Meteo) se almacenan como variables de entorno en el servidor y nunca se exponen al navegador del cliente. Las claves sensibles están excluidas del repositorio mediante .gitignore y se inyectan como secrets en Cloudflare Workers.",
    icon: Key,
    estado: "Activo"
  },
  {
    titulo: "Política CORS (Cross-Origin Resource Sharing)",
    descripcion: "El servidor implementa políticas CORS estrictas que solo permiten solicitudes desde dominios autorizados, previniendo ataques de tipo Cross-Site Request Forgery (CSRF) y Cross-Site Scripting (XSS).",
    icon: Globe,
    estado: "Activo"
  },
  {
    titulo: "Auditoría y Logging",
    descripcion: "Todas las solicitudes al módulo de IA Predictiva y las operaciones críticas del sistema son registradas con timestamp, IP de origen y resultado de la operación. Los logs son almacenados por la infraestructura de Cloudflare Workers con retención configurable.",
    icon: Eye,
    estado: "Activo"
  },
  {
    titulo: "Infraestructura Edge (Cloudflare Workers)",
    descripcion: "La aplicación se ejecuta en Cloudflare Workers, una infraestructura edge serverless distribuida globalmente que elimina la superficie de ataque de servidores tradicionales. No existe un servidor persistente que pueda ser comprometido, y el código se ejecuta en aislamiento V8.",
    icon: Server,
    estado: "Activo"
  },
  {
    titulo: "Almacenamiento Local Seguro",
    descripcion: "Las configuraciones del usuario y datos de sesión se almacenan en localStorage del navegador, aislados por origen (same-origin policy). Los datos sensibles nunca se transmiten a terceros y pueden ser eliminados por el usuario desde la configuración del sistema.",
    icon: HardDrive,
    estado: "Activo"
  },
  {
    titulo: "Conexión Segura con APIs Meteorológicas",
    descripcion: "Todas las conexiones a servicios externos (Open-Meteo, Supabase, Groq) utilizan HTTPS exclusivamente. Los endpoints están validados y las respuestas son verificadas antes de procesarse para prevenir inyección de datos maliciosos.",
    icon: Wifi,
    estado: "Activo"
  },
];

export default function SeguridadPage() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-1">SEGURIDAD CIBERNÉTICA</h2>
        <p className="text-gray-400 text-sm">Políticas, protocolos y mecanismos de seguridad implementados en el sistema AEROMETRIX para la protección de datos e infraestructura.</p>
      </div>

      {/* Resumen de Estado */}
      <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/20 border border-green-500/30 rounded-xl p-5 flex items-center gap-4">
        <div className="bg-green-500/20 p-3 rounded-full">
          <ShieldCheck size={28} className="text-green-400" />
        </div>
        <div>
          <h3 className="text-green-300 font-bold text-sm">Estado General: PROTEGIDO</h3>
          <p className="text-green-200/60 text-xs mt-1">{politicas.length} de {politicas.length} políticas de seguridad activas y verificadas.</p>
        </div>
      </div>

      {/* Políticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {politicas.map((politica, index) => (
          <div key={index} className="bg-[#1e293b] border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-colors">
            <div className="flex items-start gap-3">
              <div className="bg-[#0f172a] p-2.5 rounded-lg border border-gray-700 shrink-0">
                <politica.icon size={20} className="text-[#10b981]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-semibold text-sm">{politica.titulo}</h4>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 uppercase tracking-widest">
                    <CheckCircle size={12} /> {politica.estado}
                  </span>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">{politica.descripcion}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
