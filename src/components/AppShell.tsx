"use client";

import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import OfflineIndicator from './OfflineIndicator';
import AuthGuard from './AuthGuard';
import { BaseProvider } from '@/context/BaseContext';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const isLoginPage = pathname === '/login';

  // En la página de login, renderizar solo el children sin shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Para cualquier otra ruta, mostrar con AuthGuard + Sidebar + Topbar
  return (
    <AuthGuard>
      {/* Banner de Conexión Offline */}
      <div className="absolute top-0 left-0 w-full z-[100] print-hidden">
        <OfflineIndicator />
      </div>

      {/* Sidebar */}
      <div className="print-hidden h-full pt-0">
        <Sidebar />
      </div>

      {/* Contenido Principal */}
      <BaseProvider>
        <div className="flex flex-col flex-1 overflow-hidden print:overflow-visible">
          {/* Topbar */}
          <div className="print-hidden">
            <Topbar />
          </div>

          {/* Área Escroleable */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 print:overflow-visible print:p-0">
            <div className="mx-auto max-w-7xl print:max-w-none print:w-full">
              {children}
            </div>
          </main>
        </div>
      </BaseProvider>
    </AuthGuard>
  );
}
