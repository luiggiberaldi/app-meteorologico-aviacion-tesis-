"use client";

import { useEffect, useState } from "react";
import { Wind, Eye, Gauge, Cloud, Thermometer, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface WeatherData {
  windSpeed: number | null;
  windDirection: number | null;
  visibility: number | null;
  temperature: number | null;
  pressure: number | null;
  cloudCover: number | null;
}

export default function CurrentForecast() {
  const [data, setData] = useState<WeatherData>({
    windSpeed: null,
    windDirection: null,
    visibility: null,
    temperature: null,
    pressure: null,
    cloudCover: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      // Coordendas Maracay aprox: Lat 10.24, Lon -67.59
      // Open-Meteo variables: wind_speed_10m, wind_direction_10m, visibility, temperature_2m, surface_pressure, cloud_cover
      const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=10.24&longitude=-67.59&current=temperature_2m,surface_pressure,cloud_cover,visibility,wind_speed_10m,wind_direction_10m");
      if (!res.ok) throw new Error("Error al consultar API meteorológica");
      
      const json = await res.json();
      const current = json.current;
      
      const newWeather: WeatherData = {
        windSpeed: current.wind_speed_10m,
        windDirection: current.wind_direction_10m,
        visibility: current.visibility ? current.visibility / 1000 : null, // Convertir a km
        temperature: current.temperature_2m,
        pressure: current.surface_pressure,
        cloudCover: current.cloud_cover,
      };

      setData(newWeather);
      setLastUpdated(new Date());

      // Guardado silencioso en Supabase
      // NOTA ACADÉMICA (Seguridad): En producción, las políticas RLS de Supabase 
      // deberían restringir qué dominios pueden hacer este INSERT usando el anon_key,
      // o preferiblemente mover esta lógica a un Backend Seguro (uso de service_role).
      try {
        await supabase.from("weather_logs").insert([{
          location: "BARAGUA",
          wind_speed: newWeather.windSpeed,
          wind_direction: newWeather.windDirection,
          visibility: newWeather.visibility ? newWeather.visibility * 1000 : null, // guardado en metros según SQL opcional, o km
          temperature: newWeather.temperature,
          pressure_qnh: newWeather.pressure,
          cloud_cover: newWeather.cloudCover ? `${newWeather.cloudCover}%` : null
        }]);
      } catch (dbError) {
        console.error("Error guardando histórico en DB", dbError);
      }
      
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    // Actualizar cada 5 minutos
    const interval = setInterval(fetchWeather, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <span className="w-1.5 h-5 bg-[#10b981] rounded mr-2"></span>
          Pronóstico Actual
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
            disabled={loading}
            className="flex items-center space-x-2 text-xs bg-[#1e293b] hover:bg-[#334155] text-white px-3 py-1.5 rounded border border-gray-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Widget 
          title="Viento" 
          icon={Wind} 
          value={data.windSpeed !== null ? `${data.windSpeed} km/h` : "--"} 
          desc={data.windDirection !== null ? `Dir: ${data.windDirection}°` : "Dir: ---°"} 
          loading={loading && !data.windSpeed}
        />
        <Widget 
          title="Visibilidad" 
          icon={Eye} 
          value={data.visibility !== null ? `${data.visibility.toFixed(1)} km` : "--"} 
          desc="VFR" 
          loading={loading && !data.visibility}
        />
        <Widget 
          title="Presión Atm / QNH" 
          icon={Gauge} 
          value={data.pressure !== null ? `${data.pressure} hPa` : "---- hPa"} 
          desc="Superficie" 
          loading={loading && !data.pressure}
        />
        <Widget 
          title="Nubosidad" 
          icon={Cloud} 
          value={data.cloudCover !== null ? `${data.cloudCover}%` : "---"} 
          desc="Cobertura" 
          loading={loading && !data.cloudCover}
        />
        <Widget 
          title="Temperatura" 
          icon={Thermometer} 
          value={data.temperature !== null ? `${data.temperature} °C` : "-- °C"} 
          desc="Actual" 
          loading={loading && !data.temperature}
        />
      </div>
    </section>
  );
}

function Widget({ title, icon: Icon, value, desc, loading }: { title: string, icon: any, value: string, desc: string, loading?: boolean }) {
  return (
    <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700 flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between mb-3 text-gray-400">
        <span className="text-xs font-medium uppercase tracking-wider">{title}</span>
        <Icon size={16} />
      </div>
      <div className="mt-auto">
        {loading ? (
           <div className="h-8 w-20 bg-gray-700 rounded animate-pulse mb-1"></div>
        ) : (
          <span className="block text-2xl font-bold text-white mb-1">{value}</span>
        )}
        <span className="text-[10px] text-gray-500 bg-black/30 px-2 py-1 rounded inline-block">{desc}</span>
      </div>
    </div>
  );
}
