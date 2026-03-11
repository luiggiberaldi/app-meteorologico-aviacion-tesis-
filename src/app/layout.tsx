import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import "./globals.css";

export const metadata = {
  title: "SERMETAVIA - Base Aérea Logística Baragua",
  description: "Plataforma de pronóstico meteorológico para el control de aeronaves",
  manifest: "/manifest.json",
  themeColor: "#1e293b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark scroll-smooth">
      <body className="flex h-screen overflow-hidden bg-military-bg text-military-text font-sans antialiased">
        {/* Sidebar */}
        <div className="print-hidden h-full">
          <Sidebar />
        </div>

        {/* Contenido Principal */}
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
      </body>
    </html>
  );
}
