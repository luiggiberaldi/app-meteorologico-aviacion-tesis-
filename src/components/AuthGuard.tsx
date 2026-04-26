"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

function isLoginPage(path: string | null): boolean {
  const normalized = path?.replace(/\/+$/, '') || '';
  return normalized === '/login';
}

function MilitaryLoader({ text }: { text: string }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0f172a] z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="custom-loader" />
        <p className="text-gray-400 text-sm">{text}</p>
      </div>
      <style jsx>{`
        .custom-loader {
          width: 70px;
          height: 70px;
          background: #4b5e40;
          border-radius: 50px;
          -webkit-mask: radial-gradient(circle 31px at 50% calc(100% + 13px),#000 95%,#0000) top 4px left 50%,
            radial-gradient(circle 31px,#000 95%,#0000) center,
            radial-gradient(circle 31px at 50% -13px,#000 95%,#0000) bottom 4px left 50%,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          -webkit-mask-repeat: no-repeat;
          animation: cu10 1.5s infinite;
        }
        @keyframes cu10 {
          0%      { -webkit-mask-size: 0 18px, 0 18px, 0 18px, auto }
          16.67%  { -webkit-mask-size: 100% 18px, 0 18px, 0 18px, auto }
          33.33%  { -webkit-mask-size: 100% 18px, 100% 18px, 0 18px, auto }
          50%     { -webkit-mask-size: 100% 18px, 100% 18px, 100% 18px, auto }
          66.67%  { -webkit-mask-size: 0 18px, 100% 18px, 100% 18px, auto }
          83.33%  { -webkit-mask-size: 0 18px, 0 18px, 100% 18px, auto }
          100%    { -webkit-mask-size: 0 18px, 0 18px, 0 18px, auto }
        }
      `}</style>
    </div>
  );
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
    return <MilitaryLoader text="Verificando sesión..." />;
  }

  // Si no hay usuario, mostrar spinner mientras redirige
  if (!user) {
    return <MilitaryLoader text="Redirigiendo al inicio de sesión..." />;
  }

  return <>{children}</>;
}
