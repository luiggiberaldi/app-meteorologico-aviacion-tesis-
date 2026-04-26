"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

function isLoginPage(path: string | null): boolean {
  const normalized = path?.replace(/\/+$/, '') || '';
  return normalized === '/login';
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && !isLoginPage(pathname)) {
      router.push('/login');
      // Fallback: si router.push no navega en 2s, forzar con window.location
      const timeout = setTimeout(() => {
        window.location.href = '/login/';
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [user, loading, router, pathname]);

  // En la página de login, siempre renderizar
  if (isLoginPage(pathname)) {
    return <>{children}</>;
  }

  // Mientras carga, spinner
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0f172a] z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, mostrar spinner mientras redirige
  if (!user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0f172a] z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Redirigiendo al inicio de sesión...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
