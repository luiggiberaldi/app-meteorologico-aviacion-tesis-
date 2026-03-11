import CurrentForecast from "@/components/CurrentForecast";
import SurveyBaragua from "@/components/SurveyBaragua";
import ReportDashboard from "@/components/ReportDashboard";
import MetarTafGamet from "@/components/MetarTafGamet";
import OperationalAlerts from "@/components/OperationalAlerts";

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Página */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Panel Principal</h2>
        <p className="text-gray-400 text-sm">Diseño de una plataforma de pronóstico meteorológico para el control de las aeronaves por parte de la Base Aérea Logística BARAGUA, Maracay estado Aragua.</p>
      </div>

      {/* Módulo 1: Pronóstico Actual (Conectado a API y DB) */}
      <div id="pronostico" className="scroll-mt-6">
        <CurrentForecast />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
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
        
        {/* Módulo 4: Cuestionario Baragua */}
        <div id="cuestionario" className="lg:col-span-2 scroll-mt-6">
          <SurveyBaragua />
        </div>

        {/* Módulo 5: Reportes y Exportación */}
        <div id="reportes" className="lg:col-span-3 scroll-mt-6">
          <ReportDashboard />
        </div>

      </div>

    </div>
  );
}
