import { AuthProvider } from "@/context/AuthContext";
import { SettingsProvider } from "@/context/SettingsContext";
import AppShell from "@/components/AppShell";
import LegalModal from "@/components/LegalModal";
import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "AEROMETRIX - Red Meteorológica Nacional",
  description: "Plataforma de pronóstico meteorológico para aviación militar",
  manifest: "/manifest.json",
};

export const viewport = {
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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="flex h-screen overflow-hidden print:h-auto print:overflow-visible bg-military-bg text-military-text font-sans antialiased">
        <LegalModal />
        <AuthProvider>
          <SettingsProvider>
            <AppShell>
              {children}
            </AppShell>
          </SettingsProvider>
        </AuthProvider>

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
