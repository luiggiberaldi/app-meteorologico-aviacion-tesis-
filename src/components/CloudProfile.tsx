"use client";

import { useEffect, useState, useCallback } from "react";
import { Cloud, CloudRain, CloudLightning, CloudFog, CloudDrizzle, Info } from "lucide-react";
import { useBaseContext } from "@/context/BaseContext";

interface CloudData {
  low: number;
  mid: number;
  high: number;
  precip: number;
}

export default function CloudProfile() {
  const { selectedBase } = useBaseContext();
  const [data, setData] = useState<CloudData>({ low: 0, mid: 0, high: 0, precip: 0 });
  const [loading, setLoading] = useState(true);

  const fetchCloudData = useCallback(async () => {
    setLoading(true);
    try {
      const lat = selectedBase ? selectedBase.latitud : 10.2475;
      const lon = selectedBase ? selectedBase.longitud : -67.5953;

      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=cloud_cover_low,cloud_cover_mid,cloud_cover_high,precipitation`);
      if (!res.ok) throw new Error("Error fetching cloud data");
      
      const json = await res.json();
      const current = json.current;
      
      setData({
        low: current.cloud_cover_low || 0,
        mid: current.cloud_cover_mid || 0,
        high: current.cloud_cover_high || 0,
        precip: current.precipitation || 0,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedBase]);

  useEffect(() => {
    fetchCloudData();
    const interval = setInterval(fetchCloudData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchCloudData]);

  // Lógica de clasificación de nubes ("IA" heurística)
  const determineDominantCloud = () => {
    const { low, mid, high, precip } = data;
    const total = low + mid + high;
    
    if (total < 10 && precip === 0) return { type: "Despejado (Clear)", icon: Cloud, text: "Cielo despejado sin nubes significativas.", isIFR: false, color: "text-blue-400" };
    
    if (precip > 5 && low > 50) return { type: "Cumulonimbus (Cb)", icon: CloudLightning, text: "Nubes de tormenta con fuerte convección vertical.", isIFR: true, color: "text-red-400" };
    if (precip > 0.5 && low > 60) return { type: "Nimbostratus (Ns)", icon: CloudRain, text: "Capa nubosa gris oscura y continua que produce precipitación moderada.", isIFR: true, color: "text-blue-300" };
    
    // Low clouds mostly
    if (low >= mid && low >= high) {
      if (low > 80) return { type: "Stratus (St)", icon: CloudFog, text: "Capa de nubes bajas y uniformes que puede cubrir todo el cielo.", isIFR: true, color: "text-gray-300" };
      if (low > 40) return { type: "Stratocumulus (Sc)", icon: Cloud, text: "Nubes bajas amorfas organizadas en parches extensos o rodillos.", isIFR: false, color: "text-gray-400" };
      return { type: "Cumulus (Cu)", icon: Cloud, text: "Nubes blancas despegadas de contornos bien definidos.", isIFR: false, color: "text-white" };
    }
    
    // Mid clouds mostly
    if (mid >= low && mid >= high) {
      if (mid > 70) return { type: "Altostratus (As)", icon: Cloud, text: "Manto nuboso intermedio estriado o fibroso, cubriendo total o parcialmente el cielo.", isIFR: false, color: "text-gray-300" };
      return { type: "Altocumulus (Ac)", icon: Cloud, text: "Bancos o capas de nubes blancas o grises a nivel medio.", isIFR: false, color: "text-gray-200" };
    }
    
    // High clouds mostly
    if (high > 70 && high > low + mid) return { type: "Cirrostratus (Cs)", icon: Cloud, text: "Veo blanquecino y transparente de nubes altas.", isIFR: false, color: "text-cyan-200" };
    if (high > 40) return { type: "Cirrocumulus (Cc)", icon: Cloud, text: "Nubes altas en banco, sábana fina o capa sin sombras.", isIFR: false, color: "text-cyan-100" };
    return { type: "Cirrus (Ci)", icon: Cloud, text: "Nubes altas, delicadas, en forma de trazos blancos sueltos.", isIFR: false, color: "text-cyan-300" };
  };

  const currentCloud = determineDominantCloud();
  const DominantIcon = currentCloud.icon;

  return (
    <section>
      <div className="flex items-center mb-4 gap-2">
        <span className="w-1.5 h-5 bg-blue-500 rounded mr-2"></span>
        <h3 className="text-lg font-semibold text-white">Perfil y Clasificación de Nubosidad</h3>
      </div>

      <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700/50 flex flex-col md:flex-row gap-6 relative overflow-hidden">
        {/* Fondo sutil (grid de fondo) */}
        <div className="absolute inset-0 bg-[url('/bg-grid.png')] opacity-5 pointer-events-none"></div>

        {/* 1. Indicador / Resultado */}
        <div className="w-full md:w-1/3 flex flex-col justify-center space-y-4 relative z-10 border-r border-gray-700/50 pr-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl bg-[#0f172a] shadow-inner ${loading ? 'animate-pulse' : ''}`}>
               {loading ? <Cloud className="text-gray-600" size={32} /> : <DominantIcon className={currentCloud.color} size={32} />}
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Tipo Dominante</p>
              <h4 className="text-xl font-bold text-white mt-1">
                {loading ? "..." : currentCloud.type}
              </h4>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            {loading ? "Calculando perfil de nubosidad según estrato altitudinal..." : currentCloud.text}
          </p>

          {!loading && currentCloud.isIFR && (
            <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-3 rounded-lg flex items-start gap-2 mt-4 animate-in fade-in">
              <Info size={16} className="shrink-0 mt-0.5" />
              <p className="text-xs font-semibold leading-relaxed">Las nubes bajas presentes generan un "Cielorraso" (Ceiling) que restringe VFR. Vuelo por instrumentos exigido y extrema precaución cerca al terreno.</p>
            </div>
          )}
          {!loading && !currentCloud.isIFR && data.low + data.mid >= 50 && (
             <div className="bg-sky-900/20 border border-sky-500/30 text-sky-400 p-3 rounded-lg flex items-start gap-2 mt-4 animate-in fade-in">
                <Info size={16} className="shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed">Cobertura nubosa amplia por encima de los 3,000 ft mínimos requeridos VFR en aeropuerto. Altitud de planeo visual aceptable.</p>
              </div>
          )}
        </div>

        {/* 2. Visualizador Tridimensional */}
        <div className="flex-1 min-h-[220px] relative z-10 rounded-xl bg-gradient-to-b from-[#0b1325] via-[#101b34] to-[#1e2d4d] border border-blue-900/30 p-4">
          
          {/* Capa Alta */}
          <div className="absolute top-4 left-4 right-4 h-[60px] border-b border-white/5 flex items-center justify-between px-2">
             <div className="opacity-80 flex flex-col items-start pr-4 border-r border-white/10 h-full justify-center w-36">
                <span className="text-[10px] text-cyan-200 uppercase font-mono tracking-wider">Alta (&gt;7 km)</span>
                <span className="text-xl font-bold font-mono text-cyan-100">{loading ? '-' : data.high}%</span>
             </div>
             {/* Nubes altas */}
             <div className="flex-1 flex justify-around pl-4">
               {data.high > 20 && <Cloud className="text-cyan-200/40" size={32} strokeWidth={1} />}
               {data.high > 50 && <Cloud className="text-cyan-200/50" size={40} strokeWidth={1} />}
               {data.high > 80 && <Cloud className="text-cyan-200/60" size={36} strokeWidth={1} />}
             </div>
          </div>

          {/* Capa Media */}
          <div className="absolute top-[80px] left-4 right-4 h-[60px] border-b border-white/5 flex items-center justify-between px-2">
             <div className="opacity-80 flex flex-col items-start pr-4 border-r border-white/10 h-full justify-center w-36">
                <span className="text-[10px] text-gray-300 uppercase font-mono tracking-wider">Media (2-7 km)</span>
                <span className="text-xl font-bold font-mono text-white">{loading ? '-' : data.mid}%</span>
             </div>
             {/* Nubes medias */}
             <div className="flex-1 flex justify-around pl-4">
               {data.mid > 20 && <Cloud className="text-gray-300/40" size={40} strokeWidth={1.5} />}
               {data.mid > 50 && <Cloud className="text-gray-300/60" size={48} strokeWidth={1.5} />}
               {data.mid > 80 && <Cloud className="text-gray-300/80" size={52} strokeWidth={1.5} />}
             </div>
          </div>

          {/* Capa Baja */}
          <div className="absolute top-[150px] left-4 right-4 h-[60px] flex items-center justify-between px-2">
             <div className="opacity-80 flex flex-col items-start pr-4 border-r border-white/10 h-full justify-center w-36">
                <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">Baja (0-2 km)</span>
                <span className="text-xl font-bold font-mono text-gray-200">{loading ? '-' : data.low}%</span>
             </div>
             {/* Nubes bajas y lluvia */}
             <div className="flex-1 flex justify-around pl-4 relative">
               {data.low > 20 && data.precip === 0 && <Cloud className="text-gray-400/50 drop-shadow-md" size={52} strokeWidth={2} />}
               {data.low > 60 && data.precip === 0 && <Cloud className="text-gray-400/80 drop-shadow-md" size={60} strokeWidth={2} />}
               
               {data.low > 20 && data.precip > 0 && data.precip <= 5 && <CloudDrizzle className="text-blue-300/80 drop-shadow-lg" size={52} strokeWidth={1.5} />}
               {data.low > 40 && data.precip > 5 && <CloudLightning className="text-red-300/80 drop-shadow-xl" size={60} strokeWidth={2} />}
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
