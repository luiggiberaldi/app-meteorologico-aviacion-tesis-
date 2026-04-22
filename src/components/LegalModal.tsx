'use client';

import { useState, useRef, useEffect } from 'react';
import { ShieldAlert, BookOpen, FlaskConical, Shield, CheckCircle, Loader2, Mail } from 'lucide-react';

const ACCEPTED_KEY = 'sermetavia_terms_accepted_v1';

export default function LegalModal() {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const accepted = localStorage.getItem(ACCEPTED_KEY);
    if (!accepted) setVisible(true);
  }, []);

  const handleScroll = () => {
    const el = contentRef.current;
    if (!el) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;
    if (atBottom) setScrolled(true);
  };

  const handleAccept = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/accept-terms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAgent: navigator.userAgent }),
      });
      if (!res.ok) throw new Error('Error al registrar.');
      localStorage.setItem(ACCEPTED_KEY, new Date().toISOString());
      setDone(true);
      setTimeout(() => setVisible(false), 3500);
    } catch {
      setError('Ocurrió un error al registrar la aceptación. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-gray-600 rounded-2xl w-full max-w-2xl flex flex-col max-h-[92vh] shadow-2xl">

        {/* Header fijo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700 shrink-0">
          <ShieldAlert size={26} className="text-amber-400 shrink-0" />
          <div>
            <h2 className="text-white font-bold text-base uppercase tracking-widest">Aviso Legal y Condiciones de Uso</h2>
            <p className="text-gray-400 text-xs mt-0.5">Debes leer y aceptar antes de continuar</p>
          </div>
        </div>

        {/* Contenido con scroll */}
        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="overflow-y-auto flex-1 px-6 py-5 space-y-5 scroll-smooth"
        >
          {/* Intro */}
          <p className="text-gray-300 text-sm leading-relaxed">
            De conformidad con la <strong className="text-white">Ley de Mensajes de Datos y Firmas Electrónicas</strong> (G.O. N° 37.148, 2001),
            el <strong className="text-white">Código Civil de Venezuela</strong> y la <strong className="text-white">Ley sobre el Derecho de Autor</strong> (G.O. N° 4.638 Ext., 1993),
            se establecen las siguientes condiciones de uso para la plataforma SERMETAVIA.
          </p>

          {/* Art. 1 */}
          <div className="bg-[#1e293b] rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen size={15} className="text-amber-400" />
              <h4 className="text-amber-400 font-bold text-xs uppercase tracking-widest">Artículo 1 — Naturaleza y Alcance</h4>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              La plataforma SERMETAVIA es un <strong>prototipo de software de carácter académico</strong>, desarrollado como Trabajo Especial de Grado.
              No representa un sistema operacional certificado ni ha sido validado por autoridades aeronáuticas, meteorológicas o militares de la
              República Bolivariana de Venezuela. Las denominaciones institucionales y referencias geográficas tienen carácter
              <strong> exclusivamente ilustrativo</strong> dentro del contexto académico, sin implicar afiliación ni respaldo de ningún organismo del Estado.
            </p>
          </div>

          {/* Art. 2 */}
          <div className="bg-[#1e293b] rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldAlert size={15} className="text-amber-400" />
              <h4 className="text-amber-400 font-bold text-xs uppercase tracking-widest">Artículo 2 — Exención de Responsabilidad Civil</h4>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Conforme a los <strong>artículos 1.185 y 1.193 del Código Civil venezolano</strong>, el autor no incurrirá en responsabilidad civil por
              daños o perjuicios de cualquier naturaleza derivados del uso de esta plataforma, toda vez que: (i) el sistema se pone a disposición
              sin garantía de exactitud ni idoneidad operacional; (ii) el usuario accede voluntariamente y bajo su exclusiva responsabilidad;
              (iii) el presente aviso constituye notificación previa y suficiente de las limitaciones del sistema.
            </p>
          </div>

          {/* Art. 3 */}
          <div className="bg-[#1e293b] rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <FlaskConical size={15} className="text-amber-400" />
              <h4 className="text-amber-400 font-bold text-xs uppercase tracking-widest">Artículo 3 — Limitaciones de los Datos</h4>
            </div>
            <ul className="text-gray-300 text-sm leading-relaxed space-y-1.5">
              <li className="flex gap-2"><span className="text-gray-500 shrink-0">•</span>Los datos provienen de fuentes de acceso público (Open-Meteo API) y no sustituyen la información oficial del <strong>INAMEH</strong> ni servicios aeronáuticos certificados bajo normas OACI.</li>
              <li className="flex gap-2"><span className="text-gray-500 shrink-0">•</span>Los dictámenes del módulo de Inteligencia Artificial son generados por modelos de lenguaje (LLM) y carecen de validez técnica, científica u operacional.</li>
              <li className="flex gap-2"><span className="text-gray-500 shrink-0">•</span>No deben emplearse como fundamento para ninguna decisión que comprometa la seguridad de personas, aeronaves o instalaciones.</li>
            </ul>
          </div>

          {/* Art. 4 */}
          <div className="bg-[#1e293b] rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Shield size={15} className="text-amber-400" />
              <h4 className="text-amber-400 font-bold text-xs uppercase tracking-widest">Artículo 4 — Propiedad Intelectual</h4>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              El código fuente, diseño y documentación de esta plataforma son obra intelectual original del desarrollador, protegida por la
              <strong> Ley sobre el Derecho de Autor de Venezuela</strong> (G.O. N° 4.638 Extraordinario, 1993). Queda prohibida su reproducción,
              modificación, distribución o uso comercial sin autorización escrita del titular. El acceso no confiere al usuario ningún derecho
              de propiedad intelectual sobre sus componentes.
            </p>
          </div>

          {/* Indicador de scroll */}
          {!scrolled && (
            <div className="flex items-center justify-center gap-2 py-3 text-gray-500 text-xs animate-pulse">
              <span>↓ Desplázate hasta el final para continuar</span>
            </div>
          )}

          {/* Aviso de envío automático */}
          {scrolled && !done && (
            <div className="bg-amber-950/30 border border-amber-700/40 rounded-xl p-4 flex items-start gap-3">
              <Mail size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <p className="text-amber-200/80 text-xs leading-relaxed">
                Al aceptar, se generará un registro electrónico con fecha, hora y dirección IP, y se enviará automáticamente una copia del documento a tu correo como comprobante de aceptación.
              </p>
            </div>
          )}

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <div className="pb-2" />
        </div>

        {/* Footer fijo */}
        <div className="px-6 py-4 border-t border-gray-700 shrink-0">
          {done ? (
            <div className="flex flex-col items-center justify-center gap-2 py-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle size={20} />
                <span>Aceptación registrada exitosamente</span>
              </div>
              <p className="text-gray-400 text-xs flex items-center gap-1.5">
                <Mail size={12} />
                Se ha enviado una copia del documento a tu correo electrónico.
              </p>
            </div>
          ) : (
            <button
              onClick={handleAccept}
              disabled={!scrolled || loading}
              className="w-full py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all duration-200
                disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed
                enabled:bg-amber-500 enabled:hover:bg-amber-400 enabled:text-black enabled:cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Registrando y enviando correo...</>
              ) : (
                'He leído y acepto los términos legales'
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
