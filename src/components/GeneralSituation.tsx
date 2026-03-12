"use client";

import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle2, AlertTriangle, Eye, Cloud } from 'lucide-react';
import { useBaseContext } from '@/context/BaseContext';

interface WeatherData {
  windSpeed: number | null;
  visibility: number | null;
  temperature: number | null;
  cloudCover: number | null;
}

interface GeneralSituationProps {
  weatherData: WeatherData;
}

export default function GeneralSituation({ weatherData }: GeneralSituationProps) {
  const { selectedBase } = useBaseContext();

  // Manejo seguro de nulos
  const visibilityKm = (weatherData.visibility ?? 10000) / 1000;
  const windSpeedKmph = weatherData.windSpeed ?? 0;
  const cloudCoverPct = weatherData.cloudCover ?? 0;

  // Calcular estado general basado en datos
  const getOverallStatus = () => {
    if (visibilityKm > 8 && windSpeedKmph < 20 && cloudCoverPct < 50) {
      return { status: 'ÓPTIMO', color: 'green', icon: CheckCircle2, trend: 'stable' };
    } else if (visibilityKm > 5 && windSpeedKmph < 30) {
      return { status: 'ACEPTABLE', color: 'yellow', icon: AlertCircle, trend: 'stable' };
    } else {
      return { status: 'PRECAUCIÓN', color: 'red', icon: AlertTriangle, trend: 'deteriorating' };
    }
  };

  const situation = getOverallStatus();
  const StatusIcon = situation.icon;

  const getTrendIcon = () => {
    switch(situation.trend) {
      case 'improving': return <TrendingUp className="text-green-500" size={20} />;
      case 'deteriorating': return <TrendingDown className="text-red-500" size={20} />;
      default: return <Minus className="text-gray-400" size={20} />;
    }
  };

  const getBorderColorClass = () => {
    switch(situation.color) {
      case 'green': return 'border-green-500/30';
      case 'yellow': return 'border-yellow-500/30';
      case 'red': return 'border-red-500/30';
      default: return 'border-gray-500/30';
    }
  };

  const getBgColorClass = () => {
    switch(situation.color) {
      case 'green': return 'bg-green-500/10';
      case 'yellow': return 'bg-yellow-500/10';
      case 'red': return 'bg-red-500/10';
      default: return 'bg-gray-500/10';
    }
  };
  
  const getIconColorClass = () => {
    switch(situation.color) {
      case 'green': return 'text-green-500';
      case 'yellow': return 'text-yellow-500';
      case 'red': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBgColor = () => {
    switch(situation.color) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <section className="mb-8">
      <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl border-2 border-gray-700 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${getBgColorClass()} border ${getBorderColorClass()}`}>
              <StatusIcon className={getIconColorClass()} size={28} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white uppercase">SITUACIÓN GENERAL - {selectedBase ? selectedBase.nombre : 'NACIONAL'}</h2>
              <p className="text-sm text-gray-400 mt-1">Análisis meteorológico en tiempo real</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-500">Tendencia:</span>
            {getTrendIcon()}
          </div>
        </div>

        {/* Estado Actual format for national overview (simplified based on latest local data) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className={`p-4 rounded-lg bg-[#0f172a] border border-gray-800`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400 uppercase tracking-wide">Estado Operacional Base</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBgColor()} text-white`}>
                {situation.status}
              </span>
            </div>
            <div className="space-y-3 mt-2">
              <StatusItem 
                icon={<Eye size={16} />}
                label="Visibilidad" 
                value={weatherData.visibility !== null ? `${visibilityKm.toFixed(1)} km` : '---'} 
                status={visibilityKm > 8 ? 'good' : visibilityKm > 5 ? 'warning' : 'danger'} 
              />
              <StatusItem 
                icon={<Cloud size={16} />}
                label="Techo Estimado" 
                value={cloudCoverPct < 50 ? "> 3000 ft" : "< 3000 ft"} 
                status={cloudCoverPct < 50 ? 'good' : 'warning'} 
              />
            </div>
          </div>
          
          <div className={`p-4 rounded-lg bg-[#0f172a] border border-gray-800`}>
             <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400 uppercase tracking-wide">Resumen Clave</span>
             </div>
             <p className="text-sm text-gray-300 leading-relaxed">
               Condiciones meteorológicas actuales evaluadas según estándares INAC/OACI. 
               La operatividad {selectedBase ? 'en la base' : 'global'} se encuentra en estado <strong className={getIconColorClass()}>{situation.status}</strong> para operaciones VFR regulares basadas en la visibilidad y nubosidad predominante.
             </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusItem({ icon, label, value, status }: { icon: React.ReactNode, label: string, value: string, status: 'good' | 'warning' | 'danger' }) {
  const getStatusColor = () => {
    switch(status) {
      case 'good': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'danger': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0">
      <div className="flex items-center space-x-2 text-gray-400">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className={`text-sm font-semibold ${getStatusColor()}`}>{value}</span>
    </div>
  );
}
