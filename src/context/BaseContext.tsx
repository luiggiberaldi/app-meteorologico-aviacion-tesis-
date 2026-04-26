"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos base
export interface BaseAerea {
  id: number;
  codigo: string;
  nombre: string;
  ciudad: string;
  estado: string;
  latitud: number;
  longitud: number;
  tipo: 'military' | 'civil';
}

export const basesAereasDisponibles: BaseAerea[] = [
  // BASES MILITARES
  { id: 1, codigo: 'SVBS', nombre: 'Base Aérea Logística Baragua', ciudad: 'Maracay', estado: 'Aragua', latitud: 10.2475, longitud: -67.5953, tipo: 'military' },
  { id: 2, codigo: 'SVBL', nombre: 'Base Aérea Libertador', ciudad: 'Palo Negro', estado: 'Aragua', latitud: 10.1833, longitud: -67.5500, tipo: 'military' },
  { id: 3, codigo: 'SVFM', nombre: 'Base Aérea Gral. Francisco de Miranda', ciudad: 'Caracas', estado: 'Miranda', latitud: 10.4833, longitud: -66.8500, tipo: 'military' },
  { id: 4, codigo: 'SVMC', nombre: 'Base Aérea Mayor Gral. Rafael Urdaneta', ciudad: 'Maracaibo', estado: 'Zulia', latitud: 10.5500, longitud: -71.7333, tipo: 'military' },
  { id: 5, codigo: 'SVBC', nombre: 'Base Aérea Mariscal Sucre', ciudad: 'Barcelona', estado: 'Anzoátegui', latitud: 10.1167, longitud: -64.6833, tipo: 'military' },
  // AEROPUERTOS CIVILES
  { id: 6, codigo: 'SVMI', nombre: 'Aeropuerto Intl. Simón Bolívar', ciudad: 'Maiquetía', estado: 'La Guaira', latitud: 10.6031, longitud: -66.9904, tipo: 'civil' },
  { id: 7, codigo: 'SVVA', nombre: 'Aeropuerto Intl. Arturo Michelena', ciudad: 'Valencia', estado: 'Carabobo', latitud: 10.1500, longitud: -67.9283, tipo: 'civil' },
  { id: 8, codigo: 'SVMR', nombre: 'Aeropuerto Intl. La Chinita', ciudad: 'Maracaibo', estado: 'Zulia', latitud: 10.5561, longitud: -71.7280, tipo: 'civil' },
  { id: 9, codigo: 'SVBM', nombre: 'Aeropuerto Intl. Gral. José A. Anzoátegui', ciudad: 'Barcelona', estado: 'Anzoátegui', latitud: 10.1130, longitud: -64.6852, tipo: 'civil' },
  { id: 10, codigo: 'SVMG', nombre: 'Aeropuerto Intl. Santiago Mariño', ciudad: 'Porlamar', estado: 'Nueva Esparta', latitud: 10.9130, longitud: -63.9669, tipo: 'civil' },
  { id: 11, codigo: 'SVBR', nombre: 'Aeropuerto Intl. Jacinto Lara', ciudad: 'Barquisimeto', estado: 'Lara', latitud: 9.0435, longitud: -69.3586, tipo: 'civil' },
  { id: 12, codigo: 'SVPR', nombre: 'Aeropuerto Intl. Manuel Carlos Piar', ciudad: 'Ciudad Guayana', estado: 'Bolívar', latitud: 8.2882, longitud: -62.7705, tipo: 'civil' },
  { id: 13, codigo: 'SVSO', nombre: 'Aeropuerto Intl. Mayor Buenaventura Vivas', ciudad: 'Santo Domingo', estado: 'Táchira', latitud: 7.5658, longitud: -72.0353, tipo: 'civil' },
  { id: 14, codigo: 'SVVG', nombre: 'Aeropuerto Intl. Juan Pablo Pérez Alfonzo', ciudad: 'El Vigía', estado: 'Mérida', latitud: 8.6256, longitud: -71.6775, tipo: 'civil' },
  { id: 15, codigo: 'SVCU', nombre: 'Aeropuerto Intl. Antonio José de Sucre', ciudad: 'Cumaná', estado: 'Sucre', latitud: 10.4503, longitud: -64.1308, tipo: 'civil' },
  { id: 16, codigo: 'SVLR', nombre: 'Aeropuerto Nacional Los Roques', ciudad: 'Los Roques', estado: 'Dep. Federales', latitud: 11.9472, longitud: -66.6738, tipo: 'civil' },
  { id: 17, codigo: 'SVPA', nombre: 'Aeropuerto Nacional Cacique Aramare', ciudad: 'Puerto Ayacucho', estado: 'Amazonas', latitud: 5.6033, longitud: -67.5938, tipo: 'civil' },
  { id: 18, codigo: 'SVSR', nombre: 'Aeropuerto Nacional Las Flecheras', ciudad: 'San Fernando de Apure', estado: 'Apure', latitud: 7.8504, longitud: -67.4566, tipo: 'civil' },
  { id: 19, codigo: 'SVJC', nombre: 'Aeropuerto Intl. Josefa Camejo', ciudad: 'Las Piedras', estado: 'Falcón', latitud: 11.7766, longitud: -70.1506, tipo: 'civil' },
  { id: 20, codigo: 'SVSA', nombre: 'Aeropuerto Nac. San Antonio del Táchira', ciudad: 'San Antonio', estado: 'Táchira', latitud: 7.8306, longitud: -72.4363, tipo: 'civil' },
];

interface BaseContextProps {
  selectedBase: BaseAerea | null; // null significa "Todas las bases"
  setSelectedBase: (base: BaseAerea | null) => void;
  bases: BaseAerea[];
}

const BaseContext = createContext<BaseContextProps | undefined>(undefined);

export function BaseProvider({ children }: { children: ReactNode }) {
  const [selectedBase, setSelectedBase] = useState<BaseAerea | null>(null);

  // Cargar base predeterminada desde configuración
  useEffect(() => {
    try {
      const stored = localStorage.getItem('aerometrix_settings');
      if (stored) {
        const settings = JSON.parse(stored);
        if (settings.defaultBase) {
          const found = basesAereasDisponibles.find(b => b.codigo === settings.defaultBase);
          if (found) setSelectedBase(found);
        }
      }
    } catch { /* ignore */ }
  }, []);

  return (
    <BaseContext.Provider value={{ selectedBase, setSelectedBase, bases: basesAereasDisponibles }}>
      {children}
    </BaseContext.Provider>
  );
}

export function useBaseContext() {
  const context = useContext(BaseContext);
  if (context === undefined) {
    throw new Error('useBaseContext debe ser usado dentro de un BaseProvider');
  }
  return context;
}
