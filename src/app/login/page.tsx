"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { LogIn, UserPlus, Eye, EyeOff, Shield, AlertCircle, Check, Cloud, Plane, Radio, Satellite } from 'lucide-react';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (isRegister) {
      if (!fullName.trim()) {
        setError('Ingrese su nombre completo');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        setLoading(false);
        return;
      }
      const result = await signUp(email, password, fullName);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Cuenta creada exitosamente. Puede iniciar sesión.');
        setIsRegister(false);
        setPassword('');
      }
    } else {
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        router.push('/');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex">
      {/* ─── Panel Izquierdo: Hero / Info (solo desktop) ─── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden flex-col justify-between p-12">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-[#0f172a] to-blue-900/20" />
        <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-blue-500/8 rounded-full blur-[80px]" />
        
        {/* Contenido */}
        <div className="relative z-10">
          <img src="/1.png" alt="SERMETAVIA" className="h-24 w-auto object-contain mb-8" />
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
            Sistema Meteorológico<br />
            <span className="text-emerald-400">Aviación Militar</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md leading-relaxed">
            Plataforma integral de vigilancia meteorológica para la Aviación Militar Bolivariana de Venezuela.
          </p>
        </div>

        {/* Features grid */}
        <div className="relative z-10 grid grid-cols-2 gap-4 max-w-lg">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <Cloud size={24} className="text-emerald-400 mb-2" />
            <p className="text-white text-sm font-medium">Pronóstico en Vivo</p>
            <p className="text-gray-500 text-xs mt-1">Datos meteorológicos actualizados cada 5 minutos</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <Plane size={24} className="text-blue-400 mb-2" />
            <p className="text-white text-sm font-medium">Planificación</p>
            <p className="text-gray-500 text-xs mt-1">Cálculo de rutas, ETE y combustible</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <Satellite size={24} className="text-purple-400 mb-2" />
            <p className="text-white text-sm font-medium">Imágenes Satelitales</p>
            <p className="text-gray-500 text-xs mt-1">Cobertura GOES-16 en tiempo real</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <Radio size={24} className="text-amber-400 mb-2" />
            <p className="text-white text-sm font-medium">Red Nacional</p>
            <p className="text-gray-500 text-xs mt-1">7 bases aéreas monitoreadas 24/7</p>
          </div>
        </div>

        {/* Bottom text */}
        <div className="relative z-10">
          <p className="text-gray-600 text-xs">© 2026 SERMETAVIA · Todos los derechos reservados</p>
        </div>
      </div>

      {/* ─── Panel Derecho: Formulario ─── */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-4 sm:p-8">
        {/* Fondo sutil mobile */}
        <div className="absolute inset-0 lg:hidden overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          {/* Logo mobile */}
          <div className="text-center mb-8 lg:hidden">
            <img src="/2.png" alt="SERMETAVIA" className="h-16 w-auto mx-auto mb-3 object-contain" />
            <h1 className="text-xl font-bold text-white">SERMETAVIA</h1>
            <p className="text-gray-400 text-xs mt-1">Servicio Meteorológico — Aviación Militar Bolivariana</p>
          </div>

          {/* Logo desktop (más sutil, solo el escudo) */}
          <div className="hidden lg:block text-center mb-6">
            <img src="/2.png" alt="SERMETAVIA" className="h-14 w-auto mx-auto mb-3 object-contain" />
            <p className="text-gray-400 text-sm">Acceso al Panel de Control</p>
          </div>

          {/* Card del formulario */}
          <div className="bg-[#1e293b] rounded-2xl border border-gray-700 shadow-2xl shadow-black/30 overflow-hidden">
            {/* Header tabs */}
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => { setIsRegister(false); setError(null); setSuccess(null); }}
                className={`flex-1 py-3.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  !isRegister
                    ? 'text-white bg-[#0f172a] border-b-2 border-emerald-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <LogIn size={16} /> Iniciar Sesión
              </button>
              <button
                onClick={() => { setIsRegister(true); setError(null); setSuccess(null); }}
                className={`flex-1 py-3.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  isRegister
                    ? 'text-white bg-[#0f172a] border-b-2 border-emerald-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <UserPlus size={16} /> Crear Cuenta
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Mensajes */}
              {error && (
                <div className="flex items-center gap-2 bg-red-900/30 border border-red-500/40 rounded-lg p-3 animate-in fade-in duration-200">
                  <AlertCircle size={16} className="text-red-400 shrink-0" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 bg-emerald-900/30 border border-emerald-500/40 rounded-lg p-3 animate-in fade-in duration-200">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <p className="text-sm text-emerald-300">{success}</p>
                </div>
              )}

              {/* Nombre completo (solo registro) */}
              {isRegister && (
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Tte. Juan Pérez"
                    className="w-full bg-[#0f172a] border border-gray-600 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="usuario@amb.mil.ve"
                  className="w-full bg-[#0f172a] border border-gray-600 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#0f172a] border border-gray-600 rounded-lg px-4 py-3 pr-11 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {isRegister && (
                  <p className="text-[11px] text-gray-500 mt-1.5">Mínimo 6 caracteres</p>
                )}
              </div>

              {/* Botón submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 text-sm"
              >
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

          {/* Footer */}
          <div className="text-center mt-6">
            <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
              <Shield size={14} />
              <span>Conexión segura · HTTPS/TLS · Cifrado E2E</span>
            </div>
            <p className="text-[10px] text-gray-600 mt-2 lg:hidden">© 2026 SERMETAVIA — Acceso Restringido</p>
          </div>
        </div>
      </div>
    </div>
  );
}
