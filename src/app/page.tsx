import CurrentForecast from "@/components/CurrentForecast";
import VenezuelaWeatherMap from "@/components/VenezuelaWeatherMap";
import OperationalEffectiveness from "@/components/OperationalEffectiveness";
import ReportDashboard from "@/components/ReportDashboard";
import MetarTafGamet from "@/components/MetarTafGamet";
import OperationalAlerts from "@/components/OperationalAlerts";
import GeneralSituation from "@/components/GeneralSituation";
import CompareBases from "@/components/CompareBases";

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Página */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-1">SITUACIÓN GENERAL</h2>
        <p className="text-gray-400 text-sm">Plataforma de pronóstico meteorológico para el control y efectividad de las aeronaves a nivel nacional de la República Bolivariana de Venezuela.</p>
      </div>

      {/* Módulo General Situation */}
      <div id="general" className="scroll-mt-6">
        <GeneralSituation weatherData={{ windSpeed: 25, visibility: 6000, temperature: 28, cloudCover: 40 }} />
      </div>

      {/* Módulo 1: Pronóstico Actual (Conectado a API y DB) */}
      <div id="pronostico" className="scroll-mt-6">
        <CurrentForecast />
      </div>

      {/* Mapa Meteorológico Nacional */}
      <div id="mapa" className="scroll-mt-6">
        <VenezuelaWeatherMap />
      </div>

      {/* Vista Comparativa Nacional */}
      <div id="comparativa" className="scroll-mt-6">
        <CompareBases />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Módulo 2: METAR / TAF / GAMET */}
        <div id="metar" className="scroll-mt-6">
          <MetarTafGamet />
        </div>

        {/* Módulo 3: Alertas Operacionales */}
        <div id="alertas" className="scroll-mt-6">
          <OperationalAlerts />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Módulo 4: Efectividad Operacional (Nacional) */}
        <div id="efectividad" className="lg:col-span-2 scroll-mt-6">
          <OperationalEffectiveness />
        </div>

        {/* Módulo 5: Reportes y Exportación */}
        <div id="reportes" className="lg:col-span-3 scroll-mt-6">
          <ReportDashboard />
        </div>

      </div>

    </div>
  );
}
