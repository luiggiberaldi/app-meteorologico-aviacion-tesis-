"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, ShieldAlert, Flag, CloudLightning, Wind } from "lucide-react";
import { useBaseContext } from "@/context/BaseContext";
import HelpTooltip from "@/components/HelpTooltip";
import { kmhToKnots, degreesToCardinal } from "@/lib/utils";

interface AlertState {
  level: "GREEN" | "YELLOW" | "RED" | "CRITICAL" | "UNKNOWN";
  title: string;
  message: string;
  recommendation: React.ReactNode;
  triggerValues: string;
}

export default function OperationalAlerts() {
  const { selectedBase } = useBaseContext();
  const [alert, setAlert] = useState<AlertState>({ level: "UNKNOWN", title: "Calculando...", message: "Obteniendo datos", recommendation: "", triggerValues: "" });
  const [loading, setLoading] = useState(true);

  const evaluateAlerts = async () => {
    try {
      setLoading(true);
      const lat = selectedBase ? selectedBase.latitud : 10.2475;
      const lon = selectedBase ? selectedBase.longitud : -67.5953;

      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_speed_10m,visibility,cloud_cover,weather_code`);
      if (!res.ok) throw new Error("Error fetching weather");
      
      const { current } = await res.json();
      
      // Values
      const visKm = current.visibility !== null ? current.visibility / 1000 : 10;
      const windKmph = current.wind_speed_10m !== null ? current.wind_speed_10m : 0;
      const windKt = kmhToKnots(windKmph); // Convertir km/h a Nudos (KT) usando la utilidad
      const clouds = current.cloud_cover !== null ? current.cloud_cover : 0;
      const weatherCode = current.weather_code !== null ? current.weather_code : 0;

      // Rules based on User Request
      // 1. Tormentas eléctricas (código WMO 95, 96, 99) o Viento cruzado altísimo (>35KT)
      if ([95, 96, 99].includes(weatherCode)) {
        setAlert({
          level: "CRITICAL",
          title: "ALERTA CRÍTICA",
          message: "Tormentas Eléctricas en Desarrollo",
          recommendation: "Suspender toda operación aérea y de rampa inmediatamente.",
          triggerValues: `Código WMO: ${weatherCode} | Visibilidad: ${visKm.toFixed(1)} km`
        });
        return;
      }

      // 2. Visibilidad < 5km (Aprox 2.7 NM) -> Solo IFR
      // 3. Viento cruzado > 25 KT -> Recomendar pista alternativa
      // 4. Techos bajos (Nubes > 80% suele implicar < 500ft en condiciones malas)

      let triggers = [];
      let recs = [];
      let isRed = false;
      let isYellow = false;

      if (visKm < 5) {
        isRed = true;
        triggers.push(`Visibilidad ${visKm.toFixed(1)} km (< 5km)`);
        recs.push(
          <span key="ifr-rec">
            Solo operaciones <HelpTooltip term="IFR" definition="Instrument Flight Rules: Reglas de Vuelo por Instrumentos." />
          </span>
        );
      }
      
      if (windKt > 25) {
        isRed = true;
        triggers.push(`Viento ${Math.round(windKt)} KT (> 25 KT)`);
        recs.push("Recomendar pista alternativa por límite de viento cruzado");
      }

      if (clouds > 80 && visKm < 8) {
        isYellow = true;
        triggers.push(`Techos bajos probables (Nubosidad ${clouds}%)`);
        recs.push("Extremar precaución por aproximaciones frustradas");
      }

      if (isRed) {
         setAlert({
           level: "RED",
           title: "RESTRICCIÓN OPERACIONAL",
           message: "Condiciones meteorológicas impiden vuelo visual (VFR)",
           recommendation: recs.map((r, i) => <span key={i}>{r}{i < recs.length - 1 ? ". " : ""}</span>),
           triggerValues: triggers.join(" | ")
         });
      } else if (isYellow) {
         setAlert({
           level: "YELLOW",
           title: "PRECAUCIÓN",
           message: "Operaciones marginales",
           recommendation: recs.length > 0 ? recs.map((r, i) => <span key={i}>{r}{i < recs.length - 1 ? ". " : ""}</span>) : "Mantener monitoreo continuo por degradación",
           triggerValues: triggers.length > 0 ? triggers.join(" | ") : `Visibilidad: ${visKm.toFixed(1)} km | Nubes: ${clouds}%`
         });
      } else {
         setAlert({
           level: "GREEN",
           title: "ESTADO ÓPTIMO",
           message: "Condiciones favorables para vuelos VFR e IFR",
           recommendation: "Operaciones normales según itinerario",
           triggerValues: `Vis: ${visKm.toFixed(1)} km | Viento: ${Math.round(windKt)} KT | Nubes: ${clouds}%`
         });
      }

    } catch (err) {
      setAlert({ level: "UNKNOWN", title: "Error", message: "Sin datos", recommendation: "", triggerValues: "" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    evaluateAlerts();
    const interval = setInterval(evaluateAlerts, 2 * 60 * 1000); // 2 minutos
    return () => clearInterval(interval);
  }, [selectedBase]);

  const config = {
    GREEN: { icon: CheckCircle, bg: "bg-green-900/20", border: "border-green-500/50", text: "text-green-400" },
    YELLOW: { icon: AlertTriangle, bg: "bg-yellow-900/20", border: "border-yellow-500/50", text: "text-yellow-400" },
    RED: { icon: ShieldAlert, bg: "bg-red-900/30", border: "border-red-500", text: "text-red-400" },
    CRITICAL: { icon: CloudLightning, bg: "bg-purple-900/40", border: "border-purple-500", text: "text-purple-400" },
    UNKNOWN: { icon: Flag, bg: "bg-gray-800/50", border: "border-gray-600", text: "text-gray-400" },
  };

  const currentConfig = config[alert.level];
  const Icon = currentConfig?.icon || Flag;

  return (
    <section className="bg-[#1e293b] rounded-xl border border-gray-700 p-5 flex flex-col h-full shadow-lg relative overflow-hidden">
      {/* Background Pulse Effect for RED/CRITICAL */}
      {(alert.level === "RED" || alert.level === "CRITICAL") && (
         <div className="absolute inset-0 bg-red-500/5 animate-pulse rounded-xl pointer-events-none"></div>
      )}

      <div className="mb-4 border-b border-gray-700 pb-2 flex items-center justify-between z-10">
        <h3 className="text-md font-semibold text-white flex items-center">
          <AlertTriangle size={18} className="mr-2 text-[#f59e0b]" />
          Alertas Operacionales {selectedBase ? `- ${selectedBase.nombre}` : ''}
        </h3>
        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700">Automático</span>
      </div>

      <div className="flex-1 flex flex-col justify-center animate-in fade-in duration-500 z-10">
        {loading ? (
           <div className="flex justify-center py-6">
              <div className="w-8 h-8 border-4 border-[#f59e0b]/30 border-t-[#f59e0b] rounded-full animate-spin"></div>
           </div>
        ) : (
          <div className={`p-5 rounded-xl border ${currentConfig.border} ${currentConfig.bg} flex flex-col items-center text-center space-y-3 transition-colors duration-500`}>
            
            <div className={`p-3 rounded-full bg-black/40 ${currentConfig.text}`}>
              <Icon size={40} />
            </div>

            <div>
              <h4 className={`text-lg font-bold tracking-widest uppercase ${currentConfig.text}`}>
                {alert.title}
              </h4>
              <p className="text-gray-200 text-sm mt-1">{alert.message}</p>
            </div>

            {alert.level !== "UNKNOWN" && alert.level !== "GREEN" && (
              <div className="mt-2 bg-black/40 w-full rounded border border-gray-700/50 p-3">
                <p className="text-xs font-bold text-gray-300 uppercase mb-1 flex items-center justify-center gap-1">
                  Recomendación <Wind size={12} />
                </p>
                <p className="text-sm font-medium text-white">{alert.recommendation}</p>
              </div>
            )}

            {alert.level !== "UNKNOWN" && (
              <div className="mt-2 bg-black/20 w-full rounded py-1.5 px-3">
                <p className="text-[11px] text-gray-400 font-mono">{alert.triggerValues}</p>
              </div>
            )}
            
          </div>
        )}
      </div>
    </section>
  );
}
