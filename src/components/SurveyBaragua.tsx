"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Send, CheckCircle, AlertCircle, Trash2 } from "lucide-react";

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

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState<1 | 2 | 3 | 4>(1);
  const [resetConfirmText, setResetConfirmText] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const CONFIRM_WORD = "ELIMINAR";

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
      // Verificar si el código ya respondió la encuesta
      const { data: existing } = await supabase
        .from("survey_responses")
        .select("id")
        .eq("respondent_code", respondentCode.trim())
        .maybeSingle();

      if (existing) {
        setError("Este código de encuestado ya registró una respuesta. No se permiten respuestas duplicadas.");
        setLoading(false);
        return;
      }

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

  const handleResetAllResults = async () => {
    if (resetConfirmText !== CONFIRM_WORD) return;
    
    setResetLoading(true);
    try {
      const { error } = await supabase
        .from("survey_responses")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) throw error;

      setShowResetModal(false);
      setResetStep(1);
      setResetConfirmText("");
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
      setError(null);
      setSuccess(false);
      
      // Mostrar paso final de éxito
      setResetStep(4);
    } catch (err: any) {
      setError("Error al reiniciar: " + (err.message || "Error desconocido"));
      setShowResetModal(false);
      setResetStep(1);
    } finally {
      setResetLoading(false);
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
          
          <button
            type="button"
            onClick={() => {
              setResetStep(1);
              setResetConfirmText("");
              setShowResetModal(true);
            }}
            className="w-full mt-4 flex items-center justify-center space-x-2 bg-transparent hover:bg-red-900/20 text-red-600/50 hover:text-red-400 border border-red-900/30 hover:border-red-700/50 py-2 rounded-md transition-colors text-xs"
          >
            <Trash2 size={12} />
            <span>Reiniciar todos los resultados (Admin)</span>
          </button>
          
        </form>
      )}

      {showResetModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-[#1e293b] border border-gray-700/50 rounded-xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Cabecera */}
            <div className={`${resetStep === 4 ? 'bg-emerald-950/40 border-emerald-900/50' : 'bg-red-950/40 border-red-900/50'} px-6 py-4 border-b flex items-center space-x-3`}>
               {resetStep === 4 ? (
                 <CheckCircle className="text-emerald-500 shrink-0" size={24} />
               ) : (
                 <AlertCircle className="text-red-500 shrink-0" size={24} />
               )}
               <h3 className={`${resetStep === 4 ? 'text-emerald-400' : 'text-red-400'} font-bold text-lg`}>
                 {resetStep === 1 ? "Advertencia Crítica" : resetStep === 2 ? "Confirmación Irreversible" : resetStep === 3 ? "Validación Final" : "Operación Exitosa"}
               </h3>
            </div>
            
            {/* Cuerpo */}
            <div className="p-6 space-y-4">
              {resetStep === 1 && (
                <p className="text-gray-300 text-sm leading-relaxed">
                  Esta acción eliminará <strong className="text-red-400 font-bold">PERMANENTEMENTE</strong> todos los resultados de la encuesta en la base de datos.
                  <br/><br/>
                  ¿Está absolutamente seguro de continuar con el borrado?
                </p>
              )}
              {resetStep === 2 && (
                <p className="text-gray-300 text-sm leading-relaxed">
                  Esta operación es <strong className="text-red-400 font-bold">IRREVERSIBLE</strong> y eliminará los datos del análisis KR-20 para todos los usuarios.
                  <br/><br/>
                  ¿Confirma que desea borrar TODOS los datos?
                </p>
              )}
              {resetStep === 3 && (
                <>
                  <p className="text-gray-300 text-sm">
                    Para ejecutar el borrado, escriba la palabra <span className="font-mono font-bold text-red-500 tracking-widest bg-red-950/50 px-2 py-1 rounded inline-block">ELIMINAR</span> en el campo inferior:
                  </p>
                  <input
                    type="text"
                    value={resetConfirmText}
                    onChange={(e) => setResetConfirmText(e.target.value)}
                    placeholder="Escriba ELIMINAR"
                    className="w-full mt-2 bg-gray-900 border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-md p-3 text-sm text-white outline-none font-mono text-center tracking-widest transition-all"
                  />
                </>
              )}
              {resetStep === 4 && (
                <div className="flex flex-col items-center justify-center py-4 text-center space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="p-3 bg-emerald-900/20 rounded-full">
                    <Trash2 className="text-emerald-500" size={32} />
                  </div>
                  <p className="text-gray-300 text-sm">
                    Todos los registros de la encuesta han sido eliminados permanentemente de la base de datos Supabase. <br/><br/>El sistema de KR-20 ha sido reseteado a 0.
                  </p>
                </div>
              )}
            </div>

            {/* Acciones */}
            <div className="bg-black/40 px-6 py-4 border-t border-gray-800 flex space-x-3">
              {resetStep === 4 ? (
                <button
                  type="button"
                  onClick={() => { setShowResetModal(false); setResetStep(1); }}
                  className="w-full py-2.5 rounded-md bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition-colors"
                >
                  Cerrar
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => { setShowResetModal(false); setResetStep(1); setResetConfirmText(""); }}
                    className="flex-1 py-2.5 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white text-sm font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  
                  {resetStep === 1 && (
                    <button
                      type="button"
                      onClick={() => setResetStep(2)}
                      className="flex-1 py-2.5 rounded-md bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-red-900/20"
                    >
                      Sí, continuar
                    </button>
                  )}

                  {resetStep === 2 && (
                    <button
                      type="button"
                      onClick={() => setResetStep(3)}
                      className="flex-1 py-2.5 rounded-md bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-red-900/20"
                    >
                      <Trash2 size={16} />
                      <span>Sí, borrar todo</span>
                    </button>
                  )}

                  {resetStep === 3 && (
                    <button
                      type="button"
                      onClick={handleResetAllResults}
                      disabled={resetConfirmText !== CONFIRM_WORD || resetLoading}
                      className="flex-1 py-2.5 rounded-md bg-red-700 hover:bg-red-500 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg shadow-red-900/20"
                    >
                      {resetLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Aplicando...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 size={16} />
                          <span>Confirmar Borrado</span>
                        </>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
