"use client";

import { useEffect, useState, useCallback } from "react";
import { Wind, Eye, Gauge, Cloud, Thermometer, RefreshCw, Droplets, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import WindBarb from "./WindBarb";
import { useBaseContext } from "@/context/BaseContext";
import { kmhToKnots, degreesToCardinal } from "@/lib/utils";

interface WeatherData {
  windSpeed: number | null;
  windDirection: number | null;
  visibility: number | null;
  temperature: number | null;
  pressure: number | null;
  cloudCover: number | null;
  humidity: number | null;
}

export default function CurrentForecast() {
  const { selectedBase } = useBaseContext();
  const [data, setData] = useState<WeatherData>({
    windSpeed: null,
    windDirection: null,
    visibility: null,
    temperature: null,
    pressure: null,
    cloudCover: null,
    humidity: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Auto-refresh: 5 min -> 300 segundos
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Cooldown timer de 30 segundos manual
      setCooldown(30);

      const lat = selectedBase ? selectedBase.latitud : 10.2475; // Por defecto Baragua
      const lon = selectedBase ? selectedBase.longitud : -67.5953;

      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,surface_pressure,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,relative_humidity_2m`);
      if (!res.ok) throw new Error("Error al consultar API meteorológica");
      
      const json = await res.json();
      const current = json.current;
      
      const newWeather: WeatherData = {
        windSpeed: current.wind_speed_10m,
        windDirection: current.wind_direction_10m,
        visibility: current.visibility ? current.visibility : null, // Guardar en metros
        temperature: current.temperature_2m,
        pressure: current.surface_pressure,
        cloudCover: current.cloud_cover,
        humidity: current.relative_humidity_2m,
      };

      setData(newWeather);
      setLastUpdated(new Date());

      // Validación contra último registro
      try {
        const { data: dbData } = await supabase
          .from("weather_logs")
          .select("wind_speed, temperature, pressure_qnh, humidity")
          .order("created_at", { ascending: false })
          .limit(1);

        let isDuplicate = false;
        if (dbData && dbData.length > 0) {
          const last = dbData[0];
          isDuplicate = 
            Number(last.wind_speed) === newWeather.windSpeed &&
            Number(last.temperature) === newWeather.temperature &&
            Number(last.pressure_qnh) === newWeather.pressure &&
            Number(last.humidity) === newWeather.humidity;
        }

        if (!isDuplicate) {
          await supabase.from("weather_logs").insert([{
            location: selectedBase ? selectedBase.codigo : "NACIONAL",
            wind_speed: newWeather.windSpeed,
            wind_direction: newWeather.windDirection,
            visibility: newWeather.visibility, // Ya está en metros consistentemente
            temperature: newWeather.temperature,
            pressure_qnh: newWeather.pressure,
            cloud_cover: newWeather.cloudCover ? `${newWeather.cloudCover}%` : null,
            humidity: newWeather.humidity
          }]);
        }
      } catch (dbError) {
        console.error("Error validando/guardando histórico en DB", dbError);
      }
      
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [selectedBase]);

  useEffect(() => {
    fetchWeather();
    // Auto actualizar cada 5 minutos
    const interval = setInterval(fetchWeather, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <span className="w-1.5 h-5 bg-[#10b981] rounded mr-2"></span>
          Pronóstico Actual {selectedBase ? `- ${selectedBase.nombre}` : '- Nacional'}
        </h3>
        
        <div className="flex items-center space-x-3">
          {error && <span className="text-xs text-red-400">{error}</span>}
          {lastUpdated && !error && (
            <span className="text-xs text-gray-400">
              Actualizado: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button 
            onClick={fetchWeather} 
            disabled={loading || cooldown > 0}
            className="flex items-center space-x-2 text-xs bg-[#1e293b] hover:bg-[#334155] text-white px-3 py-1.5 rounded border border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-32 justify-center"
          >
            {loading ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : cooldown > 0 ? (
              <span>Espera {cooldown}s</span>
            ) : (
              <>
                <RefreshCw size={14} />
                <span>Actualizar</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* WIDGET VIENTO REESTRUCTURADO */}
        <div 
          className="bg-[#1e293b] p-4 rounded-xl border border-gray-700 flex flex-col relative overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
          onClick={() => setExpanded("Viento")}
        >
          <div className="flex items-center justify-between mb-3 text-gray-400">
            <span className="text-xs font-medium uppercase tracking-wider">Viento</span>
            <Wind size={16} />
          </div>
          <div className="mt-auto flex justify-between items-end">
            <div>
              {loading && !data.windSpeed ? (
                <div className="h-8 w-20 bg-gray-700 rounded animate-pulse mb-1"></div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-bold text-2xl">{data.windDirection ?? "---"}°</span>
                    <span className="text-white font-semibold text-lg">{degreesToCardinal(data.windDirection)}</span>
                    {data.windDirection !== null && (
                      <span className="text-cyan-400 text-xl" style={{ transform: `rotate(${data.windDirection}deg)`, display: 'inline-block' }}>↑</span>
                    )}
                  </div>
                  <span className="block text-3xl font-bold text-white mb-1">
                    {data.windSpeed !== null ? kmhToKnots(data.windSpeed) : "--"} <span className="text-sm text-gray-400 font-normal">KT</span>
                  </span>
                </>
              )}
            </div>
            {data.windSpeed !== null && data.windDirection !== null && (
              <div className="ml-2 bg-gray-200 rounded-full p-1 self-end shadow-inner shrink-0">
                <WindBarb speed={kmhToKnots(data.windSpeed)} direction={data.windDirection} size={30} />
              </div>
            )}
          </div>
        </div>

        <Widget 
          title="Visibilidad" 
          icon={Eye} 
          value={data.visibility !== null ? `${(data.visibility / 1000).toFixed(1)} km` : "--"} 
          desc="VFR" 
          loading={loading && !data.visibility}
          onClick={() => setExpanded("Visibilidad")}
        />
        <Widget 
          title="Presión Atm / QNH" 
          icon={Gauge} 
          value={data.pressure !== null ? `${data.pressure} hPa` : "---- hPa"} 
          desc="Superficie" 
          loading={loading && !data.pressure}
          onClick={() => setExpanded("Presión Atm / QNH")}
        />
        <Widget 
          title="Nubosidad" 
          icon={Cloud} 
          value={data.cloudCover !== null ? `${data.cloudCover}%` : "---"} 
          desc="Cobertura" 
          loading={loading && !data.cloudCover}
          onClick={() => setExpanded("Nubosidad")}
        />
        <Widget 
          title="Temperatura" 
          icon={Thermometer} 
          value={data.temperature !== null ? `${data.temperature} °C` : "-- °C"} 
          desc="Actual" 
          loading={loading && !data.temperature}
          onClick={() => setExpanded("Temperatura")}
        />
        <Widget 
          title="Humedad" 
          icon={Droplets} 
          value={data.humidity !== null ? `${data.humidity}%` : "--%"} 
          desc="Relativa" 
          loading={loading && !data.humidity}
          onClick={() => setExpanded("Humedad")}
        />
      </div>

      {/* MODAL AMPLIADO */}
      {expanded && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setExpanded(null)}
        >
          <div 
            className="w-[90vw] max-w-md rounded-2xl bg-slate-900 p-6 relative overflow-y-auto max-h-[80vh] shadow-xl border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setExpanded(null)}
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider border-b border-gray-700 pb-2">{expanded}</h3>
            
            <div className="space-y-4 text-gray-300">
              {expanded === "Viento" && (
                <>
                  <p className="flex justify-between items-center"><strong className="text-gray-400">Velocidad:</strong> <span className="text-white text-lg font-mono">{data.windSpeed !== null ? kmhToKnots(data.windSpeed) : '--'} KT</span></p>
                  <p className="flex justify-between items-center"><strong className="text-gray-400">Dirección:</strong> <span className="text-white text-lg font-mono">{data.windDirection ?? '---'}° ({degreesToCardinal(data.windDirection)})</span></p>
                  <p className="flex justify-between items-center"><strong className="text-gray-400">Velocidad (km/h):</strong> <span className="text-white font-mono">{data.windSpeed ?? '--'} km/h</span></p>
                  <div className="mt-4 p-4 bg-black/30 rounded-lg text-sm text-gray-400">
                    <p>El viento en superficie se reporta en Nudos (KT) para aviación. 1 KT equivale aproximadamente a 1.85 km/h.</p>
                  </div>
                </>
              )}
              {expanded === "Visibilidad" && (
                <>
                  <p className="flex justify-between items-center"><strong className="text-gray-400">Visibilidad:</strong> <span className="text-white text-lg font-mono">{data.visibility !== null ? (data.visibility / 1000).toFixed(1) : '--'} km</span></p>
                  <p className="flex justify-between items-center"><strong className="text-gray-400">Estado VFR:</strong> <span className="text-green-400 font-bold uppercase">{data.visibility && data.visibility >= 5000 ? 'Óptimo' : 'Marginal/IFR'}</span></p>
                  <div className="mt-4 p-4 bg-black/30 rounded-lg text-sm text-gray-400">
                    <p>La visibilidad horizontal es crucial para operaciones VFR. Una visibilidad &lt; 5km requiere reglas de vuelo por instrumentos (IFR).</p>
                  </div>
                </>
              )}
              {expanded === "Presión Atm / QNH" && (
                <>
                  <p className="flex justify-between items-center"><strong className="text-gray-400">HectoPascales (hPa):</strong> <span className="text-white text-lg font-mono">{data.pressure ?? '--'} hPa</span></p>
                  <p className="flex justify-between items-center"><strong className="text-gray-400">Pulgadas Hg (inHg):</strong> <span className="text-white text-lg font-mono">{data.pressure ? (data.pressure * 0.02953).toFixed(2) : '--'} inHg</span></p>
                  <div className="mt-4 p-4 bg-black/30 rounded-lg text-sm text-gray-400">
                    <p>El QNH es un reglaje altimétrico que indica la elevación del campo al estar en tierra. 1013.25 es el estándar.</p>
                  </div>
                </>
              )}
              {expanded === "Nubosidad" && (
                <>
                  <p className="flex justify-between items-center"><strong className="text-gray-400">Cobertura:</strong> <span className="text-white text-lg font-mono">{data.cloudCover ?? '--'}%</span></p>
                  <p className="flex justify-between items-center"><strong className="text-gray-400">Categoría (OACI):</strong> <span className="text-white font-mono uppercase">
                    {data.cloudCover !== null ? (data.cloudCover <= 25 ? 'FEW (Escasas)' : data.cloudCover <= 50 ? 'SCT (Dispersas)' : data.cloudCover <= 87 ? 'BKN (Fragmentadas)' : 'OVC (Cubierto)') : '--'}
                  </span></p>
                  <div className="mt-4 p-4 bg-black/30 rounded-lg text-sm text-gray-400">
                    <p>Porcentajes mayores al 50% (BKN u OVC) constituyen un "techo" de nubes que puede restringir vuelo VFR dependiendo de la altitud.</p>
                  </div>
                </>
              )}
              {expanded === "Temperatura" && (
                <>
                  <p className="flex justify-between items-center"><strong className="text-gray-400">Celsius:</strong> <span className="text-white text-lg font-mono">{data.temperature ?? '--'} °C</span></p>
                  <p className="flex justify-between items-center"><strong className="text-gray-400">Fahrenheit:</strong> <span className="text-white font-mono">{data.temperature !== null ? ((data.temperature * 9/5) + 32).toFixed(1) : '--'} °F</span></p>
                  <div className="mt-4 p-4 bg-black/30 rounded-lg text-sm text-gray-400">
                    <p>Afecta el performance de la aeronave (Densidad Altitudinal). Temperaturas más altas requieren más pista para despegar.</p>
                  </div>
                </>
              )}
              {expanded === "Humedad" && (
                <>
                  <p className="flex justify-between items-center"><strong className="text-gray-400">Relativa:</strong> <span className="text-white text-lg font-mono">{data.humidity ?? '--'}%</span></p>
                  <div className="mt-4 p-4 bg-black/30 rounded-lg text-sm text-gray-400">
                    <p>Alta humedad junto a bajas temperaturas favorece la formación de niebla y reduce significativamente la visibilidad. En temperaturas cálidas altera levemente el performance.</p>
                  </div>
                </>
              )}
            </div>
            
            <button 
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              onClick={() => setExpanded(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function Widget({ title, icon: Icon, value, desc, loading, children, onClick }: { title: string, icon: any, value: string, desc: string, loading?: boolean, children?: React.ReactNode, onClick?: () => void }) {
  return (
    <div onClick={onClick} className="bg-[#1e293b] p-4 rounded-xl border border-gray-700 flex flex-col relative overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
      <div className="flex items-center justify-between mb-3 text-gray-400">
        <span className="text-xs font-medium uppercase tracking-wider">{title}</span>
        <Icon size={16} />
      </div>
      <div className="mt-auto flex justify-between items-end">
        <div>
          {loading ? (
             <div className="h-8 w-20 bg-gray-700 rounded animate-pulse mb-1"></div>
          ) : (
            <span className="block text-2xl font-bold text-white mb-1">{value}</span>
          )}
          <span className="text-[10px] text-gray-500 bg-black/30 px-2 py-1 rounded inline-block">{desc}</span>
        </div>
        {children}
      </div>
    </div>
  );
}
