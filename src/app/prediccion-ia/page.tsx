"use client";

import AIPredictionModule from "@/components/AIPredictionPlaceholder";

export default function PrediccionIAPage() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-1">INTELIGENCIA ARTIFICIAL PREDICTIVA</h2>
        <p className="text-gray-400 text-sm">Motor de inferencia basado en modelos de lenguaje (LLM) que procesa datos de sensores meteorológicos y genera matrices de riesgo cuantitativas en tiempo real.</p>
      </div>

      <AIPredictionModule />
    </div>
  );
}
