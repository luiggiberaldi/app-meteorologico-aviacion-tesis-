import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import OfflineIndicator from "@/components/OfflineIndicator";
import { BaseProvider } from "@/context/BaseContext";
import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "SERMETAVIA - Red Meteorológica Nacional",
  description: "Plataforma de pronóstico meteorológico para aviación militar",
  manifest: "/manifest.json",
  themeColor: "#10b981",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="flex h-screen overflow-hidden bg-military-bg text-military-text font-sans antialiased">
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
          <div className="flex flex-col flex-1 overflow-hidden">
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

        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.register('/sw.js')
                .then((reg) => console.log('SW registrado'))
                .catch((err) => console.log('SW error:', err));
            }
          `}
        </Script>
      </body>
    </html>
  );
}
