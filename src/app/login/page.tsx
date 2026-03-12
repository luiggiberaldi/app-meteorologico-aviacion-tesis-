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
      if (result.error) { setError(result.error); } else { setSuccess('Cuenta creada. Puede iniciar sesión.'); setIsRegister(false); setPassword(''); }
    } else {
      const result = await signIn(email, password);
      if (result.error) { setError(result.error); } else { router.push('/'); }
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', background: '#0f172a', overflow: 'auto' }}>

      {/* ─── DESKTOP: 2 columnas ─── */}
      <div className="hidden lg:flex" style={{ flex: 1, minHeight: '100vh' }}>

        {/* IZQUIERDA */}
        <div style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Fondos */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(16,185,129,0.08) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 80%, rgba(59,130,246,0.05) 0%, transparent 60%)' }} />

          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '3rem', maxWidth: '480px' }}>
            <img src="/1.png" alt="SERMETAVIA" style={{ height: '120px', width: 'auto', objectFit: 'contain', margin: '0 auto 1.5rem' }} />
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '0.75rem' }}>
              Sistema Meteorológico<br/>
              <span style={{ color: '#34d399' }}>Aviación Militar Bolivariana</span>
            </h1>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', maxWidth: '380px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
              Vigilancia meteorológica operacional para las bases aéreas de la Fuerza Armada Nacional Bolivariana.
            </p>

            {/* Features */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
              {[
                { Icon: Cloud, color: '#34d399', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', title: 'Pronóstico en Vivo', desc: 'Open-Meteo cada 5 min' },
                { Icon: Plane, color: '#60a5fa', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)', title: 'Planificación', desc: 'ETE, combustible, rutas' },
                { Icon: Satellite, color: '#a78bfa', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)', title: 'GOES-16', desc: 'Imágenes cada 10 min' },
                { Icon: Radio, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)', title: 'Red Nacional', desc: '7 bases aéreas 24/7' },
              ].map(f => (
                <div key={f.title} style={{ background: f.bg, border: `1px solid ${f.border}`, borderRadius: '12px', padding: '14px 16px', textAlign: 'left' }}>
                  <f.Icon size={20} style={{ color: f.color, marginBottom: '6px' }} />
                  <p style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 600 }}>{f.title}</p>
                  <p style={{ color: '#6b7280', fontSize: '0.625rem', marginTop: '2px' }}>{f.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#6b7280', fontSize: '0.6875rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
                Sistema Operativo
              </span>
              <span>•</span>
              <span style={{ fontFamily: 'monospace', color: 'rgba(251,191,36,0.6)' }}>{clock}</span>
              <span>•</span>
              <span>v2.0.0</span>
            </div>
          </div>
        </div>

        {/* Separador vertical */}
        <div style={{ width: '1px', background: 'linear-gradient(to bottom, transparent 10%, #374151 50%, transparent 90%)' }} />

        {/* DERECHA */}
        <div style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <img src="/2.png" alt="SERMETAVIA" style={{ height: '56px', width: 'auto', objectFit: 'contain', margin: '0 auto 0.75rem' }} />
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff' }}>Acceso al Sistema</h2>
              <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '4px' }}>Ingrese sus credenciales institucionales</p>
            </div>

            {renderFormCard(isRegister, setIsRegister, error, setError, success, setSuccess, fullName, setFullName, email, setEmail, password, setPassword, showPassword, setShowPassword, loading, handleSubmit)}

            {/* Status */}
            <div style={{ marginTop: '1.25rem', background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(55,65,81,0.4)', borderRadius: '12px', padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <Activity size={16} style={{ color: '#10b981', marginTop: '1px', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 500, color: '#d1d5db' }}>Estado de la plataforma</p>
                  <div style={{ display: 'flex', gap: '14px', marginTop: '6px', fontSize: '0.6875rem', color: '#6b7280' }}>
                    {['API Meteo', 'Base de Datos', 'Auth Service'].map(s => (
                      <span key={s} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />{s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#4b5563', fontSize: '0.6875rem' }}>
                <Shield size={12} />
                <span>Conexión segura · HTTPS/TLS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MOBILE: Layout centrado ─── */}
      <div className="flex lg:hidden" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', minHeight: '100vh' }}>
        <div style={{ width: '100%', maxWidth: '380px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img src="/2.png" alt="SERMETAVIA" style={{ height: '56px', width: 'auto', objectFit: 'contain', margin: '0 auto 0.75rem' }} />
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>SERMETAVIA</h1>
            <p style={{ color: '#9ca3af', fontSize: '0.6875rem', marginTop: '4px' }}>Servicio Meteorológico — Aviación Militar Bolivariana</p>
          </div>

          {renderFormCard(isRegister, setIsRegister, error, setError, success, setSuccess, fullName, setFullName, email, setEmail, password, setPassword, showPassword, setShowPassword, loading, handleSubmit)}

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#4b5563', fontSize: '0.6875rem' }}>
              <Shield size={12} />
              <span>Conexión segura · HTTPS/TLS</span>
            </div>
            <p style={{ fontSize: '0.625rem', color: '#374151', marginTop: '0.5rem' }}>© 2026 SERMETAVIA — Acceso Restringido</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Form Card reutilizable ─── */
function renderFormCard(
  isRegister: boolean, setIsRegister: (v: boolean) => void,
  error: string | null, setError: (v: string | null) => void,
  success: string | null, setSuccess: (v: string | null) => void,
  fullName: string, setFullName: (v: string) => void,
  email: string, setEmail: (v: string) => void,
  password: string, setPassword: (v: string) => void,
  showPassword: boolean, setShowPassword: (v: boolean) => void,
  loading: boolean, handleSubmit: (e: React.FormEvent) => void,
) {
  return (
    <div style={{ background: 'rgba(30,41,59,0.85)', borderRadius: '16px', border: '1px solid rgba(55,65,81,0.7)', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(55,65,81,0.7)' }}>
        {[
          { reg: false, icon: <LogIn size={14} />, label: 'Iniciar Sesión' },
          { reg: true, icon: <UserPlus size={14} />, label: 'Crear Cuenta' },
        ].map(t => (
          <button key={String(t.reg)}
            onClick={() => { setIsRegister(t.reg); setError(null); setSuccess(null); }}
            style={{
              flex: 1, padding: '14px 0', fontSize: '0.8125rem', fontWeight: isRegister === t.reg ? 600 : 400,
              color: isRegister === t.reg ? '#fff' : '#6b7280',
              background: isRegister === t.reg ? 'rgba(15,23,42,0.6)' : 'transparent',
              borderBottom: isRegister === t.reg ? '2px solid #10b981' : '2px solid transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              cursor: 'pointer', border: 'none', transition: 'all 0.15s',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(127,29,29,0.3)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 12px' }}>
              <AlertCircle size={15} style={{ color: '#f87171', flexShrink: 0 }} />
              <p style={{ fontSize: '0.8125rem', color: '#fca5a5' }}>{error}</p>
            </div>
          )}
          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(6,78,59,0.3)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '10px 12px' }}>
              <Check size={15} style={{ color: '#34d399', flexShrink: 0 }} />
              <p style={{ fontSize: '0.8125rem', color: '#6ee7b7' }}>{success}</p>
            </div>
          )}

          {isRegister && (
            <div>
              <label style={{ display: 'block', fontSize: '0.625rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Nombre Completo</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Tte. Juan Pérez" required
                style={{ width: '100%', background: '#0f172a', border: '1px solid #4b5563', borderRadius: '8px', padding: '11px 14px', fontSize: '0.875rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.625rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Correo Electrónico</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="usuario@amb.mil.ve" required
              style={{ width: '100%', background: '#0f172a', border: '1px solid #4b5563', borderRadius: '8px', padding: '11px 14px', fontSize: '0.875rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.625rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #4b5563', borderRadius: '8px', padding: '11px 14px', paddingRight: '44px', fontSize: '0.875rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 0 }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {isRegister && <p style={{ fontSize: '0.625rem', color: '#4b5563', marginTop: '4px' }}>Mínimo 6 caracteres</p>}
          </div>

          <button type="submit" disabled={loading}
            style={{
              width: '100%', background: loading ? '#065f46' : '#059669', color: '#fff', fontWeight: 600,
              padding: '12px', borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.875rem',
              boxShadow: '0 8px 20px rgba(5,150,105,0.25)', transition: 'all 0.15s', marginTop: '4px',
            }}>
            {loading ? (
              <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
            ) : isRegister ? (
              <><UserPlus size={17} /> Crear Cuenta</>
            ) : (
              <><LogIn size={17} /> Ingresar al Sistema</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
