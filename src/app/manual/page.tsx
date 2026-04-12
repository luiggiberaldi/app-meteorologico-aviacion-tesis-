"use client";

import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const secciones = [
  {
    titulo: "¿Qué es SERMETAVIA?",
    contenido: "SERMETAVIA (Servicio Meteorológico de la Aviación) es una plataforma PWA de pronóstico meteorológico diseñada para el control y la efectividad de las operaciones aéreas a nivel nacional de la República Bolivariana de Venezuela. Integra datos en tiempo real de múltiples estaciones meteorológicas, análisis predictivo basado en Inteligencia Artificial y herramientas de planificación de vuelos."
  },
  {
    titulo: "Centro de Mando (Dashboard)",
    contenido: "Es la pantalla principal del sistema. Muestra la Situación General del día, el Pronóstico Actual de la base seleccionada, el Mapa Meteorológico Nacional interactivo con datos en vivo de cada estación, y las Alertas Operacionales vigentes. Desde aquí se obtiene una visión global del estado meteorológico del país."
  },
  {
    titulo: "Alertas Meteorológicas",
    contenido: "Módulo de vigilancia de fenómenos adversos que monitorea condiciones peligrosas para la aviación. Presenta indicadores de riesgo para vórtices/ciclones, actividad eléctrica, engelamiento, cizalladura de viento y visibilidad reducida. Cada fenómeno se clasifica en niveles: NORMAL, ADVERTENCIA y PELIGRO, con métricas como ráfagas máximas, índice CAPE e isoterma cero."
  },
  {
    titulo: "Sensores Especializados",
    contenido: "Red de sensores que recopila telemetría agrícola y oceanográfica. Incluye datos de temperatura del suelo, humedad relativa, índice UV, evapotranspiración, velocidad del viento en superficie, presión barométrica y precipitación acumulada. Los datos se presentan en módulos temáticos con indicadores visuales de estado."
  },
  {
    titulo: "Planificación de Vuelos",
    contenido: "Módulo que permite calcular rutas aéreas entre bases. Utiliza la Fórmula de Haversine para calcular distancias exactas en Millas Náuticas (NM), estima el Tiempo en Ruta (ETE) basándose en la velocidad de la aeronave, calcula el consumo de combustible estimado, y analiza las condiciones de viento cruzado (Crosswind) para determinar la seguridad del despegue y aterrizaje."
  },
  {
    titulo: "Imágenes Satelitales",
    contenido: "Módulo de monitoreo satelital en tiempo real integrado con Windy.com. Permite visualizar capas de Radar de Precipitación, Cobertura de Nubes, Temperatura, Vientos y Presión Atmosférica. Los datos se actualizan en tiempo real y se sincronizan con la base aérea seleccionada."
  },
  {
    titulo: "Estadísticas y Operaciones",
    contenido: "Panel que muestra métricas de Efectividad Operacional (porcentaje de misiones completadas vs. canceladas por clima), la Gestión de Operaciones activas, y los reportes meteorológicos estándar METAR, TAF y GAMET de cada estación."
  },
  {
    titulo: "Datos Históricos",
    contenido: "Módulo que permite consultar y comparar datos meteorológicos históricos de las estaciones. Incluye gráficas de tendencias de temperatura, humedad, viento y presión atmosférica a lo largo del tiempo, útil para análisis climatológico y planificación operativa."
  },
  {
    titulo: "IA Predictiva",
    contenido: "Módulo avanzado que utiliza modelos de lenguaje de gran escala (LLM) integrados con datos de sensores meteorológicos. Genera una Matriz de Riesgo Cuantitativa con porcentajes de peligro de Engelamiento, Turbulencia y Pérdida de Visibilidad, acompañada de una recomendación operativa táctica generada por la IA."
  },
  {
    titulo: "Astronomía y Estaciones",
    contenido: "Módulo que proporciona información astronómica relevante para la aviación: horarios de salida y puesta del sol, fases lunares, horas de crepúsculo civil y náutico, y duración del día. Esencial para la planificación de misiones VFR que dependen de las condiciones de luz natural."
  },
  {
    titulo: "Alerta Temprana",
    contenido: "Sistema de detección anticipada de fenómenos meteorológicos adversos. Analiza tendencias de datos en tiempo real para identificar patrones que podrían derivar en condiciones peligrosas, emitiendo alertas preventivas antes de que los fenómenos se materialicen."
  },
  {
    titulo: "Oleaje Marítimo",
    contenido: "Módulo de monitoreo de condiciones marítimas relevante para operaciones costeras y navales. Presenta datos de altura de olas, período de oleaje, dirección del mar de fondo y temperatura del agua superficial en las zonas costeras de Venezuela."
  },
  {
    titulo: "Noticias y Boletines",
    contenido: "Feed en tiempo real de avisos institucionales, alertas meteorológicas y boletines operacionales. Las noticias se clasifican por categoría (Alerta, Informativo, Operacional) y se actualizan automáticamente. Incluye reportes TAF, PIREP, SIGMET y NOTAM relevantes para las operaciones aéreas."
  },
  {
    titulo: "Seguridad Cibernética",
    contenido: "Panel que muestra el estado de todas las políticas de seguridad implementadas en SERMETAVIA. Incluye información sobre cifrado HTTPS/TLS, autenticación, Row Level Security en base de datos, protección de API keys, políticas CORS, auditoría y la infraestructura edge de Cloudflare Workers."
  },
  {
    titulo: "Gestión de Usuarios",
    contenido: "Módulo de administración que permite gestionar los usuarios del sistema. Permite crear, editar y eliminar cuentas de usuario, y asignar roles y permisos de acceso según las necesidades operativas."
  },
  {
    titulo: "Configuración",
    contenido: "Panel completo de personalización del sistema que incluye:\n• Mi Cuenta: Modificar credenciales de acceso y nombre para mostrar.\n• General: Idioma, zona horaria, formato de fecha, base predeterminada e intervalo de refresco.\n• Unidades: Temperatura (°C/°F), viento (KT/km/h/m/s), visibilidad (km/SM/m), presión (hPa/inHg), altitud (ft/m) y combustible (lbs/kg/gal/lt).\n• Apariencia: Tema, tamaño de fuente, animaciones, modo compacto.\n• Notificaciones: Control de alertas meteorológicas, de mantenimiento y operacionales con umbrales configurables.\n• Datos: Retención de datos, respaldos automáticos, exportar/importar configuración.\n• Avanzado: Timeout de API, reintentos, modo offline, modo debug."
  },
  {
    titulo: "Glosario Aeronáutico",
    contenido: "• METAR: Informe meteorológico aeronáutico de rutina (Meteorological Aerodrome Report).\n• TAF: Pronóstico de aeródromo (Terminal Aerodrome Forecast), válido por 24-30 horas.\n• GAMET: Pronóstico de área para vuelos a baja altitud.\n• VFR: Reglas de Vuelo Visual (Visual Flight Rules). Requiere visibilidad mínima de 5km.\n• IFR: Reglas de Vuelo por Instrumentos (Instrument Flight Rules). Se activa cuando las condiciones VFR no se cumplen.\n• QNH: Presión atmosférica ajustada al nivel del mar.\n• NOTAM: Aviso a los aviadores (Notice to Airmen).\n• SIGMET: Información meteorológica significativa para la seguridad de las aeronaves.\n• PIREP: Reporte de Piloto (Pilot Report). Información meteorológica observada por la tripulación en vuelo.\n• ETE: Tiempo Estimado en Ruta (Estimated Time Enroute).\n• NM: Milla Náutica (1.852 km).\n• CAPE: Energía Potencial Convectiva Disponible. Indicador de inestabilidad atmosférica.\n• LLWS: Cizalladura de viento en capas bajas (Low Level Wind Shear).\n• CB: Cumulonimbus. Nube de tormenta con fuerte convección vertical.\n• FOD: Foreign Object Debris. Objetos en la pista que pueden dañar aeronaves.\n• PWA: Progressive Web App. Aplicación web con capacidades offline."
  },
];

export default function ManualPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-1">MANUAL DE USUARIO</h2>
        <p className="text-gray-400 text-sm">Guía completa del sistema SERMETAVIA. Consulte cada sección para entender las funcionalidades disponibles y el glosario aeronáutico.</p>
      </div>

      <div className="bg-[#1e293b] border border-gray-700 rounded-xl p-4 flex items-center gap-3">
        <BookOpen size={18} className="text-emerald-400 shrink-0" />
        <p className="text-xs text-gray-300"><span className="font-bold text-white">{secciones.length} secciones</span> — Seleccione cualquier sección para expandir su contenido.</p>
      </div>

      <div className="space-y-3">
        {secciones.map((seccion, index) => (
          <div key={index} className="bg-[#1e293b] border border-gray-700 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-4 hover:bg-[#263548] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-gray-500 font-mono w-6 text-right shrink-0">{String(index + 1).padStart(2, '0')}</span>
                <BookOpen size={18} className="text-[#10b981] shrink-0" />
                <span className="text-white font-semibold text-sm text-left">{seccion.titulo}</span>
              </div>
              {openIndex === index ? (
                <ChevronUp size={18} className="text-gray-400 shrink-0" />
              ) : (
                <ChevronDown size={18} className="text-gray-400 shrink-0" />
              )}
            </button>

            {openIndex === index && (
              <div className="px-4 pb-4 border-t border-gray-700/50">
                <p className="text-gray-300 text-xs leading-relaxed mt-3 whitespace-pre-line">{seccion.contenido}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
