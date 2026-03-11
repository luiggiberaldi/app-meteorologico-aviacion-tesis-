"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

const QUESTIONS = [
  { id: "q1_forecast_current", text: "¿El servicio de pronóstico actual le permite obtener la información meteorológica de forma rápida?" },
  { id: "q2_records_kept", text: "¿Considera que los registros meteorológicos se gestionan de manera organizada y accesible?" },
  { id: "q3_operations_control", text: "¿La información meteorológica disponible es suficiente para apoyar el control de las aeronaves?" },
  { id: "q4_effectiveness", text: "¿La ausencia de una plataforma automatizada afecta la eficiencia en la toma de decisiones?" },
  { id: "q5_design_steps", text: "¿Sería útil contar con una plataforma que integre datos en tiempo real e históricos para las operaciones?" },
  { id: "q6_techniques", text: "¿Considera necesario modernizar las herramientas tecnológicas del servicio meteorológico en Baragua?" },
  { id: "q7_results_impact", text: "¿Apoyaría la implementación de este tipo de plataforma como solución permanente en la base?" },
];

export default function SurveyBaragua() {
  const [respondentCode, setRespondentCode] = useState("");
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({
    q1_forecast_current: null,
    q2_records_kept: null,
    q3_operations_control: null,
    q4_effectiveness: null,
    q5_design_steps: null,
    q6_techniques: null,
    q7_results_impact: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRadioChange = (questionId: string, value: boolean) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validar código de empleado
    if (!respondentCode.trim()) {
      setError("Por favor, ingrese un código de encuestado identificador.");
      return;
    }

    // Validar preguntas incompletas
    const missingAnswers = QUESTIONS.some(q => answers[q.id] === null);
    if (missingAnswers) {
      setError("Por favor, responda todas las preguntas (Sí/No) antes de enviar.");
      return;
    }

    setLoading(true);

    try {
      // NOTA ACADÉMICA (Seguridad): La tabla `survey_responses` en producción 
      // debería tener RLS activado permitiendo *sólo INSERTS* con anon_key, 
      // mientras se reserva el permiso de lectura (SELECT) únicamente 
      // para usuarios administradores autenticados.
      const { error: dbError } = await supabase
        .from("survey_responses")
        .insert([{
          respondent_code: respondentCode,
          q1_forecast_current: answers.q1_forecast_current,
          q2_records_kept: answers.q2_records_kept,
          q3_operations_control: answers.q3_operations_control,
          q4_effectiveness: answers.q4_effectiveness,
          q5_design_steps: answers.q5_design_steps,
          q6_techniques: answers.q6_techniques,
          q7_results_impact: answers.q7_results_impact,
        }]);

      if (dbError) throw dbError;

      setSuccess(true);
      // Limpiar formulario tras el éxito
      setRespondentCode("");
      setAnswers({
        q1_forecast_current: null,
        q2_records_kept: null,
        q3_operations_control: null,
        q4_effectiveness: null,
        q5_design_steps: null,
        q6_techniques: null,
        q7_results_impact: null,
      });

    } catch (err: any) {
      setError(err.message || "Ocurrió un error al registrar las respuestas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#1e293b] rounded-xl border border-gray-700 p-5 flex flex-col">
      <div className="mb-4 border-b border-gray-700 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-y-2">
        <h3 className="text-md font-semibold text-white">Cuestionario Baragua</h3>
        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700 w-max">Instrumento de Recolección</span>
      </div>
      <p className="text-xs text-gray-400 italic mb-5 leading-relaxed">
        Instrumento de recolección de datos | 7 ítems | Escala dicotómica (Sí/No) | Población: Personal de Meteorología SERMETAVIA - Baragua
      </p>

      {success ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-10">
          <CheckCircle className="w-12 h-12 text-[#10b981]" />
          <p className="text-white font-medium text-lg">¡Respuestas registradas correctamente!</p>
          <button 
            onClick={() => setSuccess(false)}
            className="mt-4 text-sm text-[#10b981] hover:text-[#34d399] transition-colors"
          >
            Realizar otra encuesta
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          
          {/* Código del Encuestado */}
          <div className="space-y-1">
            <label htmlFor="respondent_code" className="block text-sm font-medium text-gray-300">
              Código de Identificación (Encuestado) <span className="text-red-400">*</span>
            </label>
            <input 
              type="text" 
              id="respondent_code"
              placeholder="Ej.: OF-01, TEC-03"
              value={respondentCode}
              onChange={(e) => setRespondentCode(e.target.value)}
              className="w-full sm:max-w-xs bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#10b981]"
            />
          </div>

          {/* Lista de Preguntas */}
          <div className="space-y-5 rounded-md bg-black/20 p-4 border border-gray-800">
            {QUESTIONS.map((q, index) => (
              <div key={q.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-gray-800/50 last:border-0 last:pb-0">
                <p className="text-sm text-gray-200 md:w-3/4">
                  <span className="font-bold text-gray-400 mr-2">Q{index + 1}.</span>
                  {q.text}
                </p>
                
                <div className="flex space-x-4 shrink-0">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input 
                        type="radio" 
                        name={q.id} 
                        checked={answers[q.id] === true}
                        onChange={() => handleRadioChange(q.id, true)}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 rounded-full border border-gray-500 bg-gray-800 peer-checked:border-[#10b981] peer-checked:bg-[#10b981] transition-all flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Sí</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input 
                        type="radio" 
                        name={q.id}
                        checked={answers[q.id] === false}
                        onChange={() => handleRadioChange(q.id, false)}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 rounded-full border border-gray-500 bg-gray-800 peer-checked:border-red-500 peer-checked:bg-red-500 transition-all flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">No</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* Errores */}
          {error && (
            <div className="bg-red-900/40 border border-red-500/50 p-3 rounded-md flex items-start space-x-2">
              <AlertCircle className="text-red-400 w-5 h-5 shrink-0" />
              <p className="text-sm text-red-200 mt-0.5">{error}</p>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 bg-[#10b981] hover:bg-[#059669] text-white font-medium py-2 px-6 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#10b981] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Enviar Respuestas</span>
                </>
              )}
            </button>
          </div>
          
        </form>
      )}
    </section>
  );
}
