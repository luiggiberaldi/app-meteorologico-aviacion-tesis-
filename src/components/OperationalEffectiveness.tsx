import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function OperationalEffectiveness() {
  return (
    <section id="efectividad" className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <span className="w-1.5 h-5 bg-[#10b981] rounded mr-2"></span>
          Tablas de Efectividad Operacional
        </h3>
        <span className="text-xs text-gray-400 bg-[#1e293b] px-3 py-1 rounded-full border border-gray-700">
          Estándar OACI/INAC
        </span>
      </div>

      <div className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-[#1e293b] to-[#0f172a] border-b border-gray-700">
          <h4 className="font-semibold text-white">Efectividad por Condición Meteorológica</h4>
          <p className="text-xs text-gray-400 mt-1">Porcentajes de seguridad operacional según estándares internacionales</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0f172a]">
              <tr className="text-xs text-gray-400 uppercase tracking-wider">
                <th className="px-4 py-3 text-left font-medium">Condición Meteorológica</th>
                <th className="px-4 py-3 text-center font-medium">VFR (%)</th>
                <th className="px-4 py-3 text-center font-medium">IFR (%)</th>
                <th className="px-4 py-3 text-left font-medium">Restricción Operacional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <EffectivenessRow 
                condition="Visibilidad > 10 km"
                vfr={100}
                ifr={100}
                restriction="Ninguna"
                status="good"
              />
              <EffectivenessRow 
                condition="Visibilidad 8-10 km"
                vfr={95}
                ifr={100}
                restriction="Precaución VFR"
                status="good"
              />
              <EffectivenessRow 
                condition="Visibilidad 5-8 km"
                vfr={80}
                ifr={100}
                restriction="Precaución"
                status="warning"
              />
              <EffectivenessRow 
                condition="Visibilidad 3-5 km"
                vfr={50}
                ifr={90}
                restriction="Limitada VFR"
                status="warning"
              />
              <EffectivenessRow 
                condition="Visibilidad 1-3 km"
                vfr={0}
                ifr={70}
                restriction="Solo IFR"
                status="danger"
              />
              <EffectivenessRow 
                condition="Visibilidad < 1 km"
                vfr={0}
                ifr={30}
                restriction="Restringido"
                status="danger"
              />
              <EffectivenessRow 
                condition="Techo > 3000 ft"
                vfr={100}
                ifr={100}
                restriction="Ninguna"
                status="good"
              />
              <EffectivenessRow 
                condition="Techo 1000-3000 ft"
                vfr={80}
                ifr={100}
                restriction="Precaución VFR"
                status="warning"
              />
              <EffectivenessRow 
                condition="Techo 500-1000 ft"
                vfr={40}
                ifr={90}
                restriction="Limitada VFR"
                status="warning"
              />
              <EffectivenessRow 
                condition="Techo < 500 ft"
                vfr={0}
                ifr={60}
                restriction="Solo IFR CAT II/III"
                status="danger"
              />
              <EffectivenessRow 
                condition="Viento > 25 KT"
                vfr={60}
                ifr={80}
                restriction="Turbulencia Moderada"
                status="warning"
              />
              <EffectivenessRow 
                condition="Viento > 35 KT"
                vfr={20}
                ifr={40}
                restriction="Alto Riesgo"
                status="danger"
              />
              <EffectivenessRow 
                condition="Tormenta Eléctrica"
                vfr={0}
                ifr={0}
                restriction="Operaciones Prohibidas"
                status="danger"
              />
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-[#0f172a] border-t border-gray-700 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <CheckCircle size={14} className="text-green-500" />
              <span className="text-gray-400">Óptimo</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <AlertTriangle size={14} className="text-yellow-500" />
              <span className="text-gray-400">Precaución</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <XCircle size={14} className="text-red-500" />
              <span className="text-gray-400">Restringido</span>
            </div>
          </div>
          <span className="text-gray-500">Fuente: Estándares OACI Anexo 3</span>
        </div>
      </div>
    </section>
  );
}

function EffectivenessRow({ 
  condition, 
  vfr, 
  ifr, 
  restriction, 
  status 
}: { 
  condition: string; 
  vfr: number; 
  ifr: number; 
  restriction: string;
  status: 'good' | 'warning' | 'danger';
}) {
  const getStatusColor = () => {
    switch(status) {
      case 'good': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'danger': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch(status) {
      case 'good': return <CheckCircle size={16} className="text-green-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'danger': return <XCircle size={16} className="text-red-500" />;
    }
  };

  return (
    <tr className="hover:bg-[#1e293b] transition-colors">
      <td className="px-4 py-3 text-sm text-gray-300">{condition}</td>
      <td className="px-4 py-3 text-center">
        <span className={`text-sm font-semibold ${getStatusColor()}`}>
          {vfr}%
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <span className={`text-sm font-semibold ${getStatusColor()}`}>
          {ifr}%
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-400 flex items-center space-x-2">
        {getStatusIcon()}
        <span>{restriction}</span>
      </td>
    </tr>
  );
}
