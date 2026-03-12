"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  { id: 1, codigo: 'SVBS', nombre: 'Base Aérea Logística Baragua', ciudad: 'Maracay', estado: 'Aragua', latitud: 10.2475, longitud: -67.5953, tipo: 'military' },
  { id: 2, codigo: 'SVBL', nombre: 'Base Aérea Libertador', ciudad: 'Palo Negro', estado: 'Aragua', latitud: 10.1833, longitud: -67.5500, tipo: 'military' },
  { id: 3, codigo: 'SVFM', nombre: 'Base Aérea Gral. Francisco de Miranda', ciudad: 'Caracas', estado: 'Miranda', latitud: 10.4833, longitud: -66.8500, tipo: 'military' },
  { id: 4, codigo: 'SVMC', nombre: 'Base Aérea Mayor Gral. Rafael Urdaneta', ciudad: 'Maracaibo', estado: 'Zulia', latitud: 10.5500, longitud: -71.7333, tipo: 'military' },
  { id: 5, codigo: 'SVBC', nombre: 'Base Aérea Mariscal Sucre', ciudad: 'Barcelona', estado: 'Anzoátegui', latitud: 10.1167, longitud: -64.6833, tipo: 'military' }
];

interface BaseContextProps {
  selectedBase: BaseAerea | null; // null significa "Todas las bases"
  setSelectedBase: (base: BaseAerea | null) => void;
  bases: BaseAerea[];
}

const BaseContext = createContext<BaseContextProps | undefined>(undefined);

export function BaseProvider({ children }: { children: ReactNode }) {
  // Inicialmente, seleccionamos "Todas las bases" (null) o la primera base por defecto.
  // Vamos a usar null para la vista general nacional.
  const [selectedBase, setSelectedBase] = useState<BaseAerea | null>(null);

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
