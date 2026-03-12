"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { LogIn, UserPlus, Eye, EyeOff, Shield, AlertCircle, Check, Cloud, Plane, Radio, Satellite, Activity } from 'lucide-react';

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [clock, setClock] = useState('');

  useEffect(() => {
    const tick = () => setClock(new Date().toISOString().substring(11, 19) + ' UTC');
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (isRegister) {
      if (!fullName.trim()) { setError('Ingrese su nombre completo'); setLoading(false); return; }
      if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); setLoading(false); return; }
      const result = await signUp(email, password, fullName);
      if (result.error) { setError(result.error); }
      else { setSuccess('Cuenta creada exitosamente. Puede iniciar sesión.'); setIsRegister(false); setPassword(''); }
    } else {
      const result = await signIn(email, password);
      if (result.error) { setError(result.error); }
      else { router.push('/'); }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col lg:flex-row">

      {/* ─── Panel Izquierdo: Hero (desktop) ─── */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[50%] relative overflow-hidden flex-col items-center justify-center p-10 xl:p-16">
        {/* Fondo */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-[#0f172a] to-blue-950/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[80px]" />

        <div className="relative z-10 max-w-lg text-center">
          {/* Logo + Título */}
          <img src="/1.png" alt="SERMETAVIA" className="h-28 w-auto object-contain mx-auto mb-6" />
          <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-3">
            Sistema Meteorológico<br/>
            <span className="text-emerald-400">Aviación Militar Bolivariana</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed mb-10">
            Vigilancia meteorológica operacional para las bases aéreas de la Fuerza Armada Nacional Bolivariana.
          </p>

          {/* Features en grilla 2x2 */}
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-10">
            {[
              { icon: Cloud, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', title: 'Pronóstico en Vivo', desc: 'Open-Meteo API cada 5 min' },
              { icon: Plane, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', title: 'Planificación', desc: 'ETE, combustible, Haversine' },
              { icon: Satellite, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', title: 'GOES-16', desc: 'Imágenes cada 10 minutos' },
              { icon: Radio, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', title: 'Red Nacional', desc: '7 bases aéreas 24/7' },
            ].map(f => (
              <div key={f.title} className={`${f.bg} border rounded-xl px-4 py-3 text-left`}>
                <f.icon size={20} className={`${f.color} mb-1.5`} />
                <p className="text-white text-xs font-semibold">{f.title}</p>
                <p className="text-gray-500 text-[10px] mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-center gap-4 text-[11px] text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sistema Operativo
            </span>
            <span>•</span>
            <span className="font-mono text-amber-400/70">{clock}</span>
            <span>•</span>
            <span>v2.0.0</span>
          </div>
        </div>

        {/* Copyright */}
        <p className="absolute bottom-6 text-gray-700 text-[10px]">© 2026 SERMETAVIA · Todos los derechos reservados</p>
      </div>

      {/* ─── Panel Derecho: Formulario ─── */}
      <div className="w-full lg:w-[52%] xl:w-[50%] flex flex-col items-center justify-center p-4 sm:p-8 relative">
        {/* Fondo sutil */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-emerald-500/3 rounded-full blur-[100px]" />
        </div>

        {/* Separador vertical desktop */}
        <div className="hidden lg:block absolute left-0 top-[15%] bottom-[15%] w-px bg-gradient-to-b from-transparent via-gray-700 to-transparent" />

        <div className="relative w-full max-w-[420px]">
          {/* Logo mobile */}
          <div className="text-center mb-8 lg:hidden">
            <img src="/2.png" alt="SERMETAVIA" className="h-16 w-auto mx-auto mb-3 object-contain" />
            <h1 className="text-xl font-bold text-white">SERMETAVIA</h1>
            <p className="text-gray-400 text-xs mt-1">Servicio Meteorológico — Aviación Militar Bolivariana</p>
          </div>

          {/* Header desktop */}
          <div className="hidden lg:flex flex-col items-center mb-6">
            <img src="/2.png" alt="SERMETAVIA" className="h-16 w-auto mb-3 object-contain" />
            <h2 className="text-lg font-bold text-white">Acceso al Sistema</h2>
            <p className="text-gray-500 text-xs mt-1">Ingrese sus credenciales institucionales</p>
          </div>

          {/* Card */}
          <div className="bg-[#1e293b]/80 backdrop-blur-sm rounded-2xl border border-gray-700/80 shadow-2xl shadow-black/40 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-700/80">
              <button
                onClick={() => { setIsRegister(false); setError(null); setSuccess(null); }}
                className={`flex-1 py-3.5 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  !isRegister
                    ? 'text-white bg-[#0f172a]/60 border-b-2 border-emerald-500'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <LogIn size={15} /> Iniciar Sesión
              </button>
              <button
                onClick={() => { setIsRegister(true); setError(null); setSuccess(null); }}
                className={`flex-1 py-3.5 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  isRegister
                    ? 'text-white bg-[#0f172a]/60 border-b-2 border-emerald-500'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <UserPlus size={15} /> Crear Cuenta
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 lg:p-7 space-y-5">
              {error && (
                <div className="flex items-center gap-2 bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                  <AlertCircle size={16} className="text-red-400 shrink-0" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 bg-emerald-900/30 border border-emerald-500/40 rounded-lg p-3">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <p className="text-sm text-emerald-300">{success}</p>
                </div>
              )}

              {isRegister && (
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1.5 block">Nombre Completo</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Tte. Juan Pérez"
                    className="w-full bg-[#0f172a] border border-gray-600 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/40 transition-all" required />
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1.5 block">Correo Electrónico</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="usuario@amb.mil.ve"
                  className="w-full bg-[#0f172a] border border-gray-600 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/40 transition-all" required />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1.5 block">Contraseña</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                    className="w-full bg-[#0f172a] border border-gray-600 rounded-lg px-4 py-3 pr-11 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/40 transition-all" required minLength={6} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {isRegister && <p className="text-[10px] text-gray-600 mt-1.5">Mínimo 6 caracteres</p>}
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 text-sm mt-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isRegister ? (
                  <><UserPlus size={18} /> Crear Cuenta</>
                ) : (
                  <><LogIn size={18} /> Ingresar al Sistema</>
                )}
              </button>
            </form>
          </div>

          {/* Info extra debajo del card */}
          <div className="mt-6 bg-[#1e293b]/40 border border-gray-700/40 rounded-xl p-4 hidden lg:block">
            <div className="flex items-start gap-3">
              <Activity size={18} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-gray-300">Estado de la plataforma</p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> API Meteo</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Base de Datos</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Auth Service</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-5">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-[11px]">
              <Shield size={13} />
              <span>Conexión segura · HTTPS/TLS · Cifrado E2E</span>
            </div>
            <p className="text-[10px] text-gray-700 mt-2 lg:hidden">© 2026 SERMETAVIA — Acceso Restringido</p>
          </div>
        </div>
      </div>
    </div>
  );
}
