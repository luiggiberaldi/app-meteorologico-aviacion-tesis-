"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AlertCircle, BarChart3 } from "lucide-react";

interface SurveyStats {
  question: string;
  yesCount: number;
  noCount: number;
  total: number;
}

const QUESTIONS_MAP: Record<string, string> = {
  q1_forecast_current: "¿Información meteorológica rápida?",
  q2_records_kept: "¿Registros organizados y accesibles?",
  q3_operations_control: "¿Información suficiente para control?",
  q4_effectiveness: "¿Falta de plataforma afecta eficiencia?",
  q5_design_steps: "¿Útil integrar datos en t. real e históricos?",
  q6_techniques: "¿Necesario modernizar herramientas?",
  q7_results_impact: "¿Apoyaría esta plataforma permanente?",
};

export default function SurveyResults() {
  const [stats, setStats] = useState<SurveyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kr20, setKr20] = useState<number | null>(null);

  const fetchSurveyResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: dbError } = await supabase
        .from("survey_responses")
        .select("*");

      if (dbError) throw dbError;

      // Calcular totales
      const calculatedStats: SurveyStats[] = Object.keys(QUESTIONS_MAP).map((key) => {
        const yesCount = data.filter((row) => row[key] === true).length;
        const noCount = data.filter((row) => row[key] === false).length;
        return {
          question: QUESTIONS_MAP[key],
          yesCount,
          noCount,
          total: yesCount + noCount,
        };
      });

      // Calcular KR-20
      const nItems = 7;
      const nResponses = data.length;
      let calculatedKr20 = null;
      
      if (nResponses > 1) {
        let sumPq = 0;
        Object.keys(QUESTIONS_MAP).forEach((key) => {
          const p = data.filter((row) => row[key] === true).length / nResponses;
          const q = 1 - p;
          sumPq += p * q;
        });

        const totalScores = data.map(row => {
          let score = 0;
          Object.keys(QUESTIONS_MAP).forEach(key => {
            if (row[key] === true) score++;
          });
          return score;
        });

        const meanTotalScore = totalScores.reduce((a, b) => a + b, 0) / nResponses;
        const varianceTotal = totalScores.reduce((a, b) => a + Math.pow(b - meanTotalScore, 2), 0) / nResponses;

        if (varianceTotal > 0) {
          calculatedKr20 = (nItems / (nItems - 1)) * (1 - (sumPq / varianceTotal));
        }
      }

      setKr20(calculatedKr20);
      setStats(calculatedStats);
    } catch (err: any) {
      setError(err.message || "Error al cargar resultados de encuesta");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveyResults();
  }, []);

  return (
    <div className="bg-[#1e293b] rounded-xl border border-gray-700 p-5 print:bg-white print:border-gray-300 print:shadow-none print:text-black flex flex-col h-full">
      <div className="mb-4 border-b border-gray-700 print:border-gray-300 pb-3 flex items-center">
        <BarChart3 size={18} className="mr-2 text-[#f59e0b] print:text-gray-800" />
        <h3 className="text-md font-semibold text-white print:text-black">Resultados de Encuesta</h3>
      </div>

      {loading ? (
        <div className="flex-1 flex justify-center items-center flex-col space-y-3 py-6">
           <div className="w-8 h-8 border-4 border-[#f59e0b]/30 border-t-[#f59e0b] rounded-full animate-spin"></div>
        </div>
      ) : error ? (
         <div className="bg-red-900/40 border border-red-500/50 p-4 rounded-md flex items-start space-x-3 mb-4">
          <AlertCircle className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm text-red-200">{error}</p>
        </div>
      ) : stats.length === 0 || stats[0].total === 0 ? (
        <p className="text-center text-sm text-gray-500 py-6 m-auto">Aún no hay respuestas registradas.</p>
      ) : (
        <div className="space-y-4 flex-1">
          {stats.map((stat, idx) => {
            const yesPercent = stat.total > 0 ? Math.round((stat.yesCount / stat.total) * 100) : 0;
            const noPercent = stat.total > 0 ? 100 - yesPercent : 0;

            return (
              <div key={idx} className="space-y-1.5 break-inside-avoid">
                <div className="flex justify-between text-xs text-gray-300 print:text-gray-800">
                  <span className="font-medium line-clamp-1 pr-2" title={stat.question}>
                    Q{idx + 1}. {stat.question}
                  </span>
                  <span className="shrink-0 text-gray-500 font-mono">Tot: {stat.total}</span>
                </div>
                
                {/* Barra de progreso visual Sí/No */}
                <div className="h-4 w-full bg-red-500 print:bg-gray-300 rounded overflow-hidden flex text-[10px] font-bold text-white relative">
                  {stat.yesCount > 0 && (
                    <div 
                      className="h-full bg-[#10b981] print:bg-gray-800 flex items-center justify-center transition-all duration-500 overflow-hidden px-1"
                      style={{ width: `${yesPercent}%` }}
                    >
                      {yesPercent > 10 ? `SÍ ${yesPercent}%` : ''}
                    </div>
                  )}
                  {stat.noCount > 0 && (
                    <div 
                      className="h-full flex items-center justify-center transition-all duration-500 overflow-hidden px-1"
                      style={{ width: `${noPercent}%` }}
                    >
                      {noPercent > 10 ? `NO ${noPercent}%` : ''}
                    </div>
                  )}
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 print:text-gray-600 mt-1">
                  <span>Votos Sí: {stat.yesCount}</span>
                  <span>Votos No: {stat.noCount}</span>
                </div>
              </div>
            );
          })}
          
          {/* Confiabilidad KR-20 */}
          {kr20 !== null && (
            <div className="mt-8 pt-4 border-t border-gray-700 print:border-gray-300">
              <h4 className="text-sm font-semibold text-gray-300 print:text-gray-800 mb-2">Confiabilidad del Instrumento (KR-20)</h4>
              <div className="bg-black/30 print:bg-gray-100 p-3 rounded-md border border-gray-800 print:border-gray-300 flex items-center justify-between">
                <div>
                  <span className="block text-2xl font-bold text-[#f59e0b] print:text-gray-900">{kr20.toFixed(2)}</span>
                  <span className="text-xs text-gray-400 print:text-gray-600 font-medium">
                    {kr20 >= 0.70 ? "✅ Instrumento Confiable" : "⚠️ Revisar Instrumento"}
                  </span>
                </div>
                <div className="text-xs text-right text-gray-500 print:text-gray-500 w-32 hidden sm:block">
                  <p>Métrica de consistencia interna para dicotómicas.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
