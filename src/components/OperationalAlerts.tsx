"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AlertTriangle, CheckCircle, ShieldAlert, Flag } from "lucide-react";

interface AlertState {
  level: "GREEN" | "YELLOW" | "RED" | "UNKNOWN";
  message: string;
  triggerValues: string;
}

export default function OperationalAlerts() {
  const [alert, setAlert] = useState<AlertState>({ level: "UNKNOWN", message: "Calculando estado...", triggerValues: "" });
  const [loading, setLoading] = useState(true);

  const checkAlertStatus = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("weather_logs")
        .select("visibility, wind_speed")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error || !data || data.length === 0) {
        setAlert({ level: "UNKNOWN", message: "Esperando lecturas meteorológicas para generar alertas.", triggerValues: "" });
        return;
      }

      // visibilidad (m), viento (asumido número directo ej: km/h o KT dependiendo de la API y peticion, procesamos por número)
      const vis = data[0].visibility !== null ? Number(data[0].visibility) : 9999;
      const wind = data[0].wind_speed !== null ? Number(data[0].wind_speed) : 0;

      let level: AlertState["level"] = "GREEN";
      let message = "Condiciones Óptimas para Operaciones VFR";
      let triggerValues = `Visibilidad: ${(vis / 1000).toFixed(1)} km | Viento: ${wind} km/h`;

      if (vis < 1500 || wind > 30) {
        level = "RED";
        message = "ALERTA ROJO: Operaciones Suspendidas o con restricciones extremas";
        const triggers = [];
        if (vis < 1500) triggers.push(`Visibilidad Crítica (${(vis/1000).toFixed(1)} km)`);
        if (wind > 30) triggers.push(`Vientos Fuertes (${wind} km/h)`);
        triggerValues = `Alerta disparada por: ${triggers.join(" y ")}`;
        
      } else if ((vis >= 1500 && vis <= 5000) || (wind >= 20 && wind <= 30)) {
        level = "YELLOW";
        message = "ALERTA AMARILLA: Precaución Operacional, condiciones marginales";
        const triggers = [];
        if (vis >= 1500 && vis <= 5000) triggers.push(`Visibilidad Reducida (${(vis/1000).toFixed(1)} km)`);
        if (wind >= 20 && wind <= 30) triggers.push(`Vientos Moderados (${wind} km/h)`);
        triggerValues = `Alerta disparada por: ${triggers.join(" y ")}`;

      } else if (vis > 5000 && wind < 20) {
        level = "GREEN";
        message = "Condiciones Óptimas para Operaciones VFR";
        triggerValues = `Visibilidad: ${(vis / 1000).toFixed(1)} km | Viento: ${wind} km/h`;
      }

      setAlert({ level, message, triggerValues: triggerValues.trim() });
    } catch (err) {
      setAlert({ level: "UNKNOWN", message: "Error al evaluar alertas.", triggerValues: "" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAlertStatus();
    // Actualizar cada 5 minutos igual que CurrentForecast
    const interval = setInterval(checkAlertStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const config = {
    GREEN: { 
      icon: CheckCircle, 
      bg: "bg-green-900/20", 
      border: "border-green-500/50", 
      text: "text-green-400", 
      label: "ESTADO VERDE" 
    },
    YELLOW: { 
      icon: AlertTriangle, 
      bg: "bg-yellow-900/20", 
      border: "border-yellow-500/50", 
      text: "text-yellow-400", 
      label: "ESTADO AMARILLO" 
    },
    RED: { 
      icon: ShieldAlert, 
      bg: "bg-red-900/30", 
      border: "border-red-500", 
      text: "text-red-400", 
      label: "ESTADO ROJO" 
    },
    UNKNOWN: { 
      icon: Flag, 
      bg: "bg-gray-800/50", 
      border: "border-gray-600", 
      text: "text-gray-400", 
      label: "ESTADO DESCONOCIDO" 
    },
  };

  const currentConfig = config[alert.level];
  const Icon = currentConfig.icon;

  return (
    <section className="bg-[#1e293b] rounded-xl border border-gray-700 p-5 flex flex-col h-full">
      <div className="mb-4 border-b border-gray-700 pb-2 flex items-center justify-between">
        <h3 className="text-md font-semibold text-white flex items-center">
          <AlertTriangle size={18} className="mr-2 text-[#f59e0b]" />
          Alertas Operacionales
        </h3>
        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700">Automático</span>
      </div>

      <div className="flex-1 flex flex-col justify-center animate-in fade-in duration-500">
        
        {loading ? (
           <div className="flex justify-center py-6">
              <div className="w-8 h-8 border-4 border-[#f59e0b]/30 border-t-[#f59e0b] rounded-full animate-spin"></div>
           </div>
        ) : (
          <div className={`p-6 rounded-xl border ${currentConfig.border} ${currentConfig.bg} flex flex-col items-center text-center space-y-4 transition-colors duration-500`}>
            
            <div className={`p-4 rounded-full bg-black/40 ${currentConfig.text}`}>
              <Icon size={48} />
            </div>

            <div>
              <h4 className={`text-xl font-bold tracking-widest uppercase ${currentConfig.text}`}>
                {currentConfig.label}
              </h4>
              <p className="text-gray-200 font-medium mt-2">{alert.message}</p>
            </div>

            {alert.level !== "UNKNOWN" && (
              <div className="mt-4 bg-black/30 w-full rounded py-2 px-4 shadow-inner">
                <p className="text-xs text-gray-400 font-mono">{alert.triggerValues}</p>
              </div>
            )}
            
          </div>
        )}

      </div>
    </section>
  );
}
