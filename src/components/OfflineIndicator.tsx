"use client";

import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Verificar estado inicial asumiendo navigator en entorno cliente
    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);

      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-red-900 border-b border-red-700 text-white px-4 py-2 flex items-center justify-center space-x-2 text-sm z-50">
      <WifiOff size={16} className="text-red-300" />
      <span>
        <strong>Sin conexión a Internet.</strong> Estás viendo datos cacheados localmente. Algunas funciones pueden no estar actualizadas.
      </span>
    </div>
  );
}
