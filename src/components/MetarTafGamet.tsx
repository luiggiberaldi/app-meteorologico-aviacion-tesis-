"use client";

import { useState } from "react";
import { CloudSun, Search, Info } from "lucide-react";

interface ParsedData {
  tipo: string;
  viento: string;
  visibilidad: string;
  nubosidad: string;
  temperatura: string;
  presion: string;
  resumen: string;
}

export default function MetarTafGamet() {
  const [metar, setMetar] = useState("");
  const [taf, setTaf] = useState("");
  const [parsed, setParsed] = useState<ParsedData | null>(null);

  const parseCode = (code: string, type: "METAR" | "TAF") => {
    if (!code.trim()) return;

    const windMatch = code.match(/(\d{3}|VRB)(\d{2,3})(?:G(\d{2,3}))?(KT|KMH|MPS)/);
    const visMatch = code.match(/\s(\d{4})\s/);
    const cloudMatch = code.match(/(FEW|SCT|BKN|OVC|VV)(\d{3})/g);
    const tempMatch = code.match(/\s(M?\d{2})\/(M?\d{2})\s/);
    const presMatch = code.match(/\s(Q|A)(\d{4})\s?/);

    let viento = "No reportado";
    if (windMatch) {
      viento = `Dirección ${windMatch[1]}°, Velocidad ${windMatch[2]} ${windMatch[4]}`;
      if (windMatch[3]) viento += ` (Ráfagas de ${windMatch[3]})`;
    }

    let visibilidad = "No reportada";
    if (visMatch) {
      if (visMatch[1] === "9999") visibilidad = "Más de 10 km (Vuelo Visual)";
      else visibilidad = `${parseInt(visMatch[1], 10)} metros`;
    }

    let nubosidad = "Despejado / No reportada";
    if (cloudMatch && cloudMatch.length > 0) {
      nubosidad = cloudMatch.map(c => {
        const type = c.substring(0, 3);
        const height = parseInt(c.substring(3), 10) * 100;
        const types: Record<string, string> = { FEW: "Escasas", SCT: "Dispersas", BKN: "Nublado", OVC: "Cubierto", VV: "Visib. Vertical" };
        return `${types[type] || type} a ${height} ft`;
      }).join(", ");
    } else if (code.includes("CAVOK")) {
      nubosidad = "CAVOK (Cielo y visibilidad OK)";
      visibilidad = "Más de 10 km (CAVOK)";
    }

    let temperatura = "No reportada";
    if (tempMatch) {
        const t = tempMatch[1].startsWith('M') ? `-${tempMatch[1].substring(1)}` : tempMatch[1];
        const td = tempMatch[2].startsWith('M') ? `-${tempMatch[2].substring(1)}` : tempMatch[2];
        temperatura = `${t}°C (Punto de Rocío: ${td}°C)`;
    }

    let presion = "No reportada";
    if (presMatch) {
      presion = presMatch[1] === "Q" ? `${presMatch[2]} hPa` : `${(parseInt(presMatch[2])/100).toFixed(2)} inHg`;
    }

    setParsed({
      tipo: type,
      viento,
      visibilidad,
      nubosidad,
      temperatura,
      presion,
      resumen: `Reporte ${type} procesado. Las condiciones generales indican viento de ${viento}, con visibilidad de ${visibilidad}.`
    });
  };

  return (
    <section className="bg-[#1e293b] rounded-xl border border-gray-700 p-5 flex flex-col h-full">
      <div className="mb-4 border-b border-gray-700 pb-2 flex items-center justify-between">
        <h3 className="text-md font-semibold text-white flex items-center">
          <CloudSun size={18} className="mr-2 text-[#10b981]" />
          METAR / TAF / GAMET
        </h3>
        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700">Traductor</span>
      </div>

      <div className="flex-1 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400">Código METAR</label>
            <textarea 
              value={metar}
              onChange={(e) => setMetar(e.target.value)}
              placeholder="Pegue el código METAR aquí..."
              className="w-full min-h-[96px] bg-gray-900 border border-gray-700 rounded-md p-3 text-sm text-gray-200 focus:outline-none focus:border-[#10b981] font-mono resize-none transition-colors"
            />
            <button 
              onClick={() => parseCode(metar, "METAR")}
              className="w-full flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-md transition-colors text-sm border border-gray-600"
            >
              <Search size={14} />
              <span>Traducir METAR</span>
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400">Código TAF</label>
            <textarea 
              value={taf}
              onChange={(e) => setTaf(e.target.value)}
              placeholder="Pegue el código TAF aquí..."
              className="w-full min-h-[96px] bg-gray-900 border border-gray-700 rounded-md p-3 text-sm text-gray-200 focus:outline-none focus:border-[#10b981] font-mono resize-none transition-colors"
            />
            <button 
              onClick={() => parseCode(taf, "TAF")}
              className="w-full flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-md transition-colors text-sm border border-gray-600"
            >
              <Search size={14} />
              <span>Traducir TAF</span>
            </button>
          </div>
        </div>

        {/* Zona de Resumen */}
        {parsed && (
          <div className="mt-4 bg-gray-900/50 rounded-lg border border-gray-700 p-4 animate-in fade-in duration-300">
            <h4 className="text-[#10b981] font-semibold text-sm mb-3 border-b border-gray-700 pb-2">
              Traducción {parsed.tipo}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-sm mb-4">
              <div>
                <span className="block text-gray-500 text-xs">Viento</span>
                <span className="text-gray-200">{parsed.viento}</span>
              </div>
              <div>
                <span className="block text-gray-500 text-xs">Visibilidad</span>
                <span className="text-gray-200">{parsed.visibilidad}</span>
              </div>
              <div>
                <span className="block text-gray-500 text-xs">Temperatura / Rocío</span>
                <span className="text-gray-200">{parsed.temperatura}</span>
              </div>
              <div>
                <span className="block text-gray-500 text-xs">Presión (QNH)</span>
                <span className="text-gray-200">{parsed.presion}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="block text-gray-500 text-xs">Nubosidad</span>
                <span className="text-gray-200">{parsed.nubosidad}</span>
              </div>
            </div>
            
            <div className="bg-[#1e293b] p-3 rounded flex items-start space-x-3 border border-gray-800">
               <Info className="text-blue-400 shrink-0 w-5 h-5 mt-0.5" />
               <p className="text-gray-300 text-sm italic">"{parsed.resumen}"</p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
