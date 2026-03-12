import React from 'react';

interface WindBarbProps {
  speed: number; // en nudos
  direction: number; // en grados (0-360)
  size?: number;
}

const WindBarb: React.FC<WindBarbProps> = ({ speed, direction, size = 40 }) => {
  const pennants = Math.floor(speed / 50);
  
  // Si hay banderines, ajustar plumas
  const adjustedSpeed = speed - (pennants * 50);
  const adjustedFullBarbs = Math.floor(adjustedSpeed / 10);
  const adjustedHalfBarbs = (adjustedSpeed % 10) >= 5 ? 1 : 0;
  
  if (speed < 3) {
    // Viento en calma - círculo
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" className="overflow-visible">
        <circle cx={20} cy={20} r={8} fill="none" stroke="#222" strokeWidth="2.5" />
        <circle cx={20} cy={20} r={2} fill="#222" />
      </svg>
    );
  }
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 40 40"
      className="overflow-visible"
      style={{ transform: `rotate(${direction}deg)`, transformOrigin: 'center' }}
    >
      {/* Eje principal */}
      <line x1={20} y1={5} x2={20} y2={20} stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Banderines (50 kt cada uno) */}
      {Array.from({ length: pennants }).map((_, i) => (
        <polygon
          key={`pennant-${i}`}
          points={`20,${5 + i*6} 32,${8 + i*6} 20,${11 + i*6}`}
          fill="#222"
        />
      ))}
      
      {/* Plumas completas (10 kt cada una) */}
      {Array.from({ length: adjustedFullBarbs }).map((_, i) => (
        <line
          key={`full-${i}`}
          x1={20}
          y1={5 + pennants * 6 + i * 4 + (pennants > 0 ? 2 : 0)}
          x2={32}
          y2={2 + pennants * 6 + i * 4 + (pennants > 0 ? 2 : 0)}
          stroke="#222"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
      
      {/* Media pluma (5 kt) */}
      {adjustedHalfBarbs > 0 && (
        <line
          x1={20}
          y1={5 + pennants * 6 + adjustedFullBarbs * 4 + (pennants > 0 ? 2 : 0)}
          x2={26}
          y2={3.5 + pennants * 6 + adjustedFullBarbs * 4 + (pennants > 0 ? 2 : 0)}
          stroke="#222"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
      
      {/* Punto central de la estación */}
      <circle cx={20} cy={20} r={3} fill="#ef4444" />
    </svg>
  );
};

export default WindBarb;
