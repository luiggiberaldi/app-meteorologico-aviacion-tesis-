"use client";

import { Newspaper, AlertTriangle, Info, Radio } from "lucide-react";

const noticias = [
  {
    id: 1,
    titulo: "Alerta Meteorológica: Frente Frío en Región Noroccidental",
    fecha: "12 Mar 2026",
    categoria: "Alerta",
    categoriaColor: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: AlertTriangle,
    contenido: "Se pronostica el ingreso de un frente frío desde el Caribe que afectará las operaciones VFR en las bases SVBM y SVMT durante las próximas 48 horas. Se recomienda precaución extrema y monitoreo constante."
  },
  {
    id: 2,
    titulo: "Actualización del Sistema SERMETAVIA V2.0",
    fecha: "12 Mar 2026",
    categoria: "Informativo",
    categoriaColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: Info,
    contenido: "Se ha implementado la nueva arquitectura modular del sistema, incluyendo el módulo de Inteligencia Artificial Predictiva y la reestructuración de navegación por secciones independientes."
  },
  {
    id: 3,
    titulo: "Mantenimiento Programado: Radar Meteorológico Base Baragua",
    fecha: "11 Mar 2026",
    categoria: "Operacional",
    categoriaColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: Radio,
    contenido: "El radar meteorológico de la Base Aérea Logística Baragua entrará en mantenimiento preventivo el día 15 de marzo de 2026. Durante este periodo, los datos de precipitación se obtendrán exclusivamente vía satélite."
  },
  {
    id: 4,
    titulo: "Incorporación de Nuevas Estaciones Meteorológicas",
    fecha: "10 Mar 2026",
    categoria: "Informativo",
    categoriaColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: Info,
    contenido: "Se han integrado al sistema las estaciones meteorológicas de Porlamar (SVPM) y Puerto Ordaz (SVPR), ampliando la cobertura del servicio meteorológico nacional a 12 bases aéreas."
  },
  {
    id: 5,
    titulo: "Boletín Especial: Temporada de Lluvias 2026",
    fecha: "08 Mar 2026",
    categoria: "Alerta",
    categoriaColor: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: AlertTriangle,
    contenido: "El INAMEH ha emitido un boletín especial indicando el inicio temprano de la temporada de lluvias 2026. Se espera un incremento del 15% en precipitaciones respecto al promedio histórico en la región centro-norte del país."
  },
];

export default function NoticiasPage() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-1">NOTICIAS Y BOLETINES</h2>
        <p className="text-gray-400 text-sm">Avisos institucionales, alertas meteorológicas y boletines operacionales del Servicio Meteorológico de la Aviación.</p>
      </div>

      <div className="space-y-4">
        {noticias.map((noticia) => (
          <article key={noticia.id} className="bg-[#1e293b] border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-colors">
            <div className="flex items-start gap-4">
              <div className="bg-[#0f172a] p-3 rounded-lg border border-gray-700 shrink-0">
                <noticia.icon size={22} className="text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${noticia.categoriaColor}`}>
                    {noticia.categoria}
                  </span>
                  <span className="text-[11px] text-gray-500">{noticia.fecha}</span>
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{noticia.titulo}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{noticia.contenido}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
