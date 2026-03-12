"use client";

import { useState } from 'react';
import { ArrowLeft, Radar, CloudRain, Wind, Thermometer, Gauge } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const RadarPrecipitacion = dynamic(() => import('@/components/mapas/RadarPrecipitacion'), { 
  ssr: false, 
  loading: () => <div className="h-[600px] w-full flex items-center justify-center bg-[#252d3d] rounded-lg animate-pulse"><p className="text-gray-400">Cargando radar satelital...</p></div> 
});

const NubesTemperatura = dynamic(() => import('@/components/mapas/NubesTemperatura'), { 
  ssr: false, 
  loading: () => <div className="h-[600px] w-full flex items-center justify-center bg-[#252d3d] rounded-lg animate-pulse"><p className="text-gray-400">Cargando capas de nubosidad...</p></div> 
});

const Vientos = dynamic(() => import('@/components/mapas/Vientos'), { 
  ssr: false, 
  loading: () => <div className="h-[600px] w-full flex items-center justify-center bg-[#252d3d] rounded-lg animate-pulse"><p className="text-gray-400">Cargando corrientes de viento...</p></div> 
});

const PresionFrentes = dynamic(() => import('@/components/mapas/PresionFrentes'), { 
  ssr: false, 
  loading: () => <div className="h-[600px] w-full flex items-center justify-center bg-[#252d3d] rounded-lg animate-pulse"><p className="text-gray-400">Cargando isobaras climáticas...</p></div> 
});

type TabType = 'radar' | 'nubes' | 'vientos' | 'presion';

export default function ImagenesSatelitalesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('radar');

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link href="/" className="p-2 bg-[#252d3d] hover:bg-[#364156] border border-[#364156] rounded-lg text-gray-300 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Radar className="mr-3 text-[#00d4aa]" size={28} />
            Imágenes Satelitales y Radar
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#1a1f2e] border-b border-[#364156] flex overflow-x-auto hide-scrollbar">
        <button 
          onClick={() => setActiveTab('radar')}
          className={`px-5 py-3.5 font-medium text-sm flex items-center whitespace-nowrap border-b-2 transition-colors ${activeTab === 'radar' ? 'border-[#00d4aa] text-[#00d4aa] bg-[#252d3d]/50' : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#252d3d]/30'}`}
        >
          <CloudRain size={18} className="mr-2" />
          Radar de Precipitación
        </button>
        <button 
          onClick={() => setActiveTab('nubes')}
          className={`px-5 py-3.5 font-medium text-sm flex items-center whitespace-nowrap border-b-2 transition-colors ${activeTab === 'nubes' ? 'border-[#00d4aa] text-[#00d4aa] bg-[#252d3d]/50' : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#252d3d]/30'}`}
        >
          <Thermometer size={18} className="mr-2" />
          Nubes y Temperatura
        </button>
        <button 
          onClick={() => setActiveTab('vientos')}
          className={`px-5 py-3.5 font-medium text-sm flex items-center whitespace-nowrap border-b-2 transition-colors ${activeTab === 'vientos' ? 'border-[#00d4aa] text-[#00d4aa] bg-[#252d3d]/50' : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#252d3d]/30'}`}
        >
          <Wind size={18} className="mr-2" />
          Vientos de Superficie
        </button>
        <button 
          onClick={() => setActiveTab('presion')}
          className={`px-5 py-3.5 font-medium text-sm flex items-center whitespace-nowrap border-b-2 transition-colors ${activeTab === 'presion' ? 'border-[#00d4aa] text-[#00d4aa] bg-[#252d3d]/50' : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#252d3d]/30'}`}
        >
          <Gauge size={18} className="mr-2" />
          Presión y Frentes
        </button>
      </div>

      {/* Contenido interactivo */}
      <div className="w-full h-full min-h-[600px] rounded-lg shadow-xl border border-[#364156] bg-[#252d3d] overflow-hidden">
        {activeTab === 'radar' && <RadarPrecipitacion />}
        {activeTab === 'nubes' && <NubesTemperatura />}
        {activeTab === 'vientos' && <Vientos />}
        {activeTab === 'presion' && <PresionFrentes />}
      </div>
    </div>
  );
}
