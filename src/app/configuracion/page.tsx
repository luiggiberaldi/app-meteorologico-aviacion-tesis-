"use client";

import React, { useState, useEffect } from 'react';
import {
  Settings, Monitor, Bell, Database, Wrench, Info,
  Sun, Moon, Globe, Clock, MapPin, Thermometer,
  Volume2, VolumeX, Mail, Smartphone,
  HardDrive, Trash2, Download, Upload,
  RefreshCw, Zap, Shield, Server,
  Check, ChevronRight, ToggleLeft, ToggleRight,
  Gauge, Wind, Eye, Plane, Radio,
  Save, RotateCcw
} from 'lucide-react';

// ─── Tipos ───
interface AppSettings {
  // General
  language: string;
  timezone: string;
  defaultBase: string;
  autoRefreshInterval: number;
  dateFormat: string;
  // Unidades
  tempUnit: 'C' | 'F';
  windUnit: 'KT' | 'KMH' | 'MS';
  visibilityUnit: 'KM' | 'SM' | 'M';
  pressureUnit: 'HPA' | 'INHG' | 'MB';
  altitudeUnit: 'FT' | 'M';
  fuelUnit: 'LBS' | 'KG' | 'GAL' | 'LT';
  // Apariencia
  theme: 'dark' | 'light' | 'auto';
  sidebarCollapsed: boolean;
  animationsEnabled: boolean;
  compactMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  // Notificaciones
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  weatherAlerts: boolean;
  maintenanceAlerts: boolean;
  operationalAlerts: boolean;
  alertThresholdWind: number;
  alertThresholdVisibility: number;
  // Datos
  dataRetentionDays: number;
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  cacheEnabled: boolean;
  // Avanzado
  debugMode: boolean;
  apiTimeout: number;
  maxRetries: number;
  offlineMode: boolean;
  telemetryEnabled: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  language: 'es',
  timezone: 'America/Caracas',
  defaultBase: 'SVMI',
  autoRefreshInterval: 300,
  dateFormat: 'DD/MM/YYYY',
  tempUnit: 'C',
  windUnit: 'KT',
  visibilityUnit: 'KM',
  pressureUnit: 'HPA',
  altitudeUnit: 'FT',
  fuelUnit: 'LBS',
  theme: 'dark',
  sidebarCollapsed: false,
  animationsEnabled: true,
  compactMode: false,
  fontSize: 'medium',
  notificationsEnabled: true,
  soundEnabled: true,
  weatherAlerts: true,
  maintenanceAlerts: true,
  operationalAlerts: true,
  alertThresholdWind: 30,
  alertThresholdVisibility: 5000,
  dataRetentionDays: 90,
  autoBackup: true,
  backupFrequency: 'weekly',
  cacheEnabled: true,
  debugMode: false,
  apiTimeout: 10,
  maxRetries: 3,
  offlineMode: true,
  telemetryEnabled: false,
};

// ─── Tabs ───
const TABS = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'units', label: 'Unidades', icon: Gauge },
  { id: 'appearance', label: 'Apariencia', icon: Monitor },
  { id: 'notifications', label: 'Notificaciones', icon: Bell },
  { id: 'data', label: 'Datos y Respaldos', icon: Database },
  { id: 'advanced', label: 'Avanzado', icon: Wrench },
  { id: 'about', label: 'Acerca de', icon: Info },
];

// ─── Componentes auxiliares ───
function Toggle({ value, onChange, label, description }: { value: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1 min-w-0 mr-4">
        <p className="text-sm font-medium text-white">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button onClick={() => onChange(!value)} className="shrink-0">
        {value ? (
          <ToggleRight size={32} className="text-emerald-400" />
        ) : (
          <ToggleLeft size={32} className="text-gray-600" />
        )}
      </button>
    </div>
  );
}

function SelectField({ value, onChange, label, description, options }: {
  value: string; onChange: (v: string) => void; label: string; description?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1 min-w-0 mr-4">
        <p className="text-sm font-medium text-white">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none min-w-[140px]"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function NumberField({ value, onChange, label, description, min, max, suffix }: {
  value: number; onChange: (v: number) => void; label: string; description?: string;
  min: number; max: number; suffix?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1 min-w-0 mr-4">
        <p className="text-sm font-medium text-white">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          min={min}
          max={max}
          className="bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none w-20 text-center"
        />
        {suffix && <span className="text-xs text-gray-500">{suffix}</span>}
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-700">
      <Icon size={18} className="text-emerald-400" />
      <h3 className="text-md font-bold text-white">{title}</h3>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-gray-800 my-1" />;
}

// ─── Componente Principal ───
export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Cargar config de localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sermetavia_settings');
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      }
    } catch { /* ignore */ }
  }, []);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
    setSaved(false);
  };

  const handleSave = () => {
    try {
      localStorage.setItem('sermetavia_settings', JSON.stringify(settings));
      setSaved(true);
      setHasChanges(false);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* ignore */ }
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setHasChanges(true);
    setSaved(false);
  };

  // ─── Render de cada tab ───
  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-1">
            <SectionTitle icon={Globe} title="Regional" />
            <SelectField
              value={settings.language} onChange={v => updateSetting('language', v)}
              label="Idioma" description="Idioma de la interfaz del sistema"
              options={[
                { value: 'es', label: 'Español' },
                { value: 'en', label: 'English' },
                { value: 'pt', label: 'Português' },
              ]}
            />
            <Divider />
            <SelectField
              value={settings.timezone} onChange={v => updateSetting('timezone', v)}
              label="Zona Horaria" description="Hora local del sistema"
              options={[
                { value: 'America/Caracas', label: 'UTC-4 (Venezuela)' },
                { value: 'America/Bogota', label: 'UTC-5 (Colombia)' },
                { value: 'America/New_York', label: 'UTC-5 (EST)' },
                { value: 'UTC', label: 'UTC (Zulu)' },
              ]}
            />
            <Divider />
            <SelectField
              value={settings.dateFormat} onChange={v => updateSetting('dateFormat', v)}
              label="Formato de Fecha"
              options={[
                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' },
              ]}
            />

            <div className="mt-6" />
            <SectionTitle icon={MapPin} title="Base Predeterminada" />
            <SelectField
              value={settings.defaultBase} onChange={v => updateSetting('defaultBase', v)}
              label="Base Inicial" description="Base que se carga al abrir la aplicación"
              options={[
                { value: 'SVMI', label: 'SVMI - Maiquetía' },
                { value: 'SVBS', label: 'SVBS - Baraguá' },
                { value: 'SVBM', label: 'SVBM - Barquisimeto' },
                { value: 'SVFM', label: 'SVFM - Gral. F. de Miranda' },
                { value: 'SVBL', label: 'SVBL - El Libertador' },
                { value: 'SVMG', label: 'SVMG - Mariscal Sucre' },
                { value: 'SVCS', label: 'SVCS - Sto. Domingo' },
              ]}
            />

            <div className="mt-6" />
            <SectionTitle icon={RefreshCw} title="Actualización de Datos" />
            <SelectField
              value={String(settings.autoRefreshInterval)}
              onChange={v => updateSetting('autoRefreshInterval', Number(v))}
              label="Intervalo de Refresco" description="Frecuencia de actualización automática de datos meteorológicos"
              options={[
                { value: '60', label: 'Cada 1 minuto' },
                { value: '120', label: 'Cada 2 minutos' },
                { value: '300', label: 'Cada 5 minutos' },
                { value: '600', label: 'Cada 10 minutos' },
                { value: '900', label: 'Cada 15 minutos' },
                { value: '1800', label: 'Cada 30 minutos' },
              ]}
            />
          </div>
        );

      case 'units':
        return (
          <div className="space-y-1">
            <SectionTitle icon={Thermometer} title="Unidades Meteorológicas" />
            <SelectField
              value={settings.tempUnit} onChange={v => updateSetting('tempUnit', v as any)}
              label="Temperatura"
              options={[
                { value: 'C', label: '°C (Celsius)' },
                { value: 'F', label: '°F (Fahrenheit)' },
              ]}
            />
            <Divider />
            <SelectField
              value={settings.windUnit} onChange={v => updateSetting('windUnit', v as any)}
              label="Velocidad del Viento"
              options={[
                { value: 'KT', label: 'Nudos (KT)' },
                { value: 'KMH', label: 'km/h' },
                { value: 'MS', label: 'm/s' },
              ]}
            />
            <Divider />
            <SelectField
              value={settings.visibilityUnit} onChange={v => updateSetting('visibilityUnit', v as any)}
              label="Visibilidad"
              options={[
                { value: 'KM', label: 'Kilómetros (km)' },
                { value: 'SM', label: 'Millas Estatutarias (SM)' },
                { value: 'M', label: 'Metros (m)' },
              ]}
            />
            <Divider />
            <SelectField
              value={settings.pressureUnit} onChange={v => updateSetting('pressureUnit', v as any)}
              label="Presión Atmosférica"
              options={[
                { value: 'HPA', label: 'Hectopascales (hPa)' },
                { value: 'INHG', label: 'Pulgadas Hg (inHg)' },
                { value: 'MB', label: 'Milibares (mb)' },
              ]}
            />

            <div className="mt-6" />
            <SectionTitle icon={Plane} title="Unidades de Aviación" />
            <SelectField
              value={settings.altitudeUnit} onChange={v => updateSetting('altitudeUnit', v as any)}
              label="Altitud"
              options={[
                { value: 'FT', label: 'Pies (ft)' },
                { value: 'M', label: 'Metros (m)' },
              ]}
            />
            <Divider />
            <SelectField
              value={settings.fuelUnit} onChange={v => updateSetting('fuelUnit', v as any)}
              label="Combustible"
              options={[
                { value: 'LBS', label: 'Libras (lbs)' },
                { value: 'KG', label: 'Kilogramos (kg)' },
                { value: 'GAL', label: 'Galones (gal)' },
                { value: 'LT', label: 'Litros (lt)' },
              ]}
            />
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-1">
            <SectionTitle icon={Sun} title="Tema" />
            <SelectField
              value={settings.theme} onChange={v => updateSetting('theme', v as any)}
              label="Tema de la Interfaz" description="Apariencia visual del sistema"
              options={[
                { value: 'dark', label: '🌙 Modo Oscuro' },
                { value: 'light', label: '☀️ Modo Claro' },
                { value: 'auto', label: '🔄 Automático (SO)' },
              ]}
            />

            <div className="mt-6" />
            <SectionTitle icon={Monitor} title="Interfaz" />
            <SelectField
              value={settings.fontSize} onChange={v => updateSetting('fontSize', v as any)}
              label="Tamaño de Fuente" description="Tamaño del texto en toda la aplicación"
              options={[
                { value: 'small', label: 'Pequeño' },
                { value: 'medium', label: 'Normal' },
                { value: 'large', label: 'Grande' },
              ]}
            />
            <Divider />
            <Toggle
              value={settings.animationsEnabled}
              onChange={v => updateSetting('animationsEnabled', v)}
              label="Animaciones"
              description="Transiciones y efectos animados en la interfaz"
            />
            <Divider />
            <Toggle
              value={settings.compactMode}
              onChange={v => updateSetting('compactMode', v)}
              label="Modo Compacto"
              description="Reduce el espaciado para mostrar más información en pantalla"
            />
            <Divider />
            <Toggle
              value={settings.sidebarCollapsed}
              onChange={v => updateSetting('sidebarCollapsed', v)}
              label="Barra Lateral Colapsada"
              description="Inicia la barra lateral en modo minimizado"
            />
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-1">
            <SectionTitle icon={Bell} title="Notificaciones Generales" />
            <Toggle
              value={settings.notificationsEnabled}
              onChange={v => updateSetting('notificationsEnabled', v)}
              label="Notificaciones del Sistema"
              description="Recibir alertas y avisos del sistema en tiempo real"
            />
            <Divider />
            <Toggle
              value={settings.soundEnabled}
              onChange={v => updateSetting('soundEnabled', v)}
              label="Sonido de Alertas"
              description="Reproducir sonido al recibir alertas críticas"
            />

            <div className="mt-6" />
            <SectionTitle icon={Radio} title="Tipos de Alerta" />
            <Toggle
              value={settings.weatherAlerts}
              onChange={v => updateSetting('weatherAlerts', v)}
              label="Alertas Meteorológicas"
              description="Notificar condiciones climáticas adversas (tormenta, vientos fuertes, baja visibilidad)"
            />
            <Divider />
            <Toggle
              value={settings.maintenanceAlerts}
              onChange={v => updateSetting('maintenanceAlerts', v)}
              label="Alertas de Mantenimiento"
              description="Notificar cuando una aeronave tenga mantenimiento programado próximo"
            />
            <Divider />
            <Toggle
              value={settings.operationalAlerts}
              onChange={v => updateSetting('operationalAlerts', v)}
              label="Alertas Operacionales"
              description="Notificar cambios de estado en las operaciones de vuelo"
            />

            <div className="mt-6" />
            <SectionTitle icon={Gauge} title="Umbrales de Alerta" />
            <NumberField
              value={settings.alertThresholdWind}
              onChange={v => updateSetting('alertThresholdWind', v)}
              label="Umbral de Viento" description="Velocidad de viento (KT) para generar alerta"
              min={10} max={80} suffix="KT"
            />
            <Divider />
            <NumberField
              value={settings.alertThresholdVisibility}
              onChange={v => updateSetting('alertThresholdVisibility', v)}
              label="Umbral de Visibilidad" description="Visibilidad mínima (metros) para generar alerta"
              min={500} max={10000} suffix="m"
            />
          </div>
        );

      case 'data':
        return (
          <div className="space-y-1">
            <SectionTitle icon={HardDrive} title="Almacenamiento Local" />
            <NumberField
              value={settings.dataRetentionDays}
              onChange={v => updateSetting('dataRetentionDays', v)}
              label="Retención de Datos" description="Días que se conservan los registros meteorológicos en caché local"
              min={7} max={365} suffix="días"
            />
            <Divider />
            <Toggle
              value={settings.cacheEnabled}
              onChange={v => updateSetting('cacheEnabled', v)}
              label="Caché de Datos"
              description="Almacenar datos consultados recientemente para acceso rápido"
            />

            <div className="mt-6" />
            <SectionTitle icon={Download} title="Respaldos" />
            <Toggle
              value={settings.autoBackup}
              onChange={v => updateSetting('autoBackup', v)}
              label="Respaldo Automático"
              description="Generar respaldos periódicos de la configuración y datos locales"
            />
            <Divider />
            <SelectField
              value={settings.backupFrequency}
              onChange={v => updateSetting('backupFrequency', v as any)}
              label="Frecuencia de Respaldo" description="Intervalo entre respaldos automáticos"
              options={[
                { value: 'daily', label: 'Diario' },
                { value: 'weekly', label: 'Semanal' },
                { value: 'monthly', label: 'Mensual' },
              ]}
            />

            <div className="mt-6" />
            <SectionTitle icon={Trash2} title="Acciones de Datos" />
            <div className="flex flex-wrap gap-3 py-3">
              <button
                onClick={() => {
                  const data = JSON.stringify(settings, null, 2);
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `sermetavia-config-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 border border-blue-700/50 px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <Download size={16} /> Exportar Configuración
              </button>
              <label className="flex items-center gap-2 bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-700/50 px-4 py-2 rounded-lg transition-colors text-sm cursor-pointer">
                <Upload size={16} /> Importar Configuración
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => {
                        try {
                          const imported = JSON.parse(ev.target?.result as string);
                          setSettings({ ...DEFAULT_SETTINGS, ...imported });
                          setHasChanges(true);
                        } catch { /* ignore */ }
                      };
                      reader.readAsText(file);
                    }
                  }}
                />
              </label>
              <button
                onClick={() => {
                  if (confirm('¿Está seguro de que desea limpiar todos los datos almacenados localmente? Esta acción no se puede deshacer.')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="flex items-center gap-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 border border-red-700/50 px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <Trash2 size={16} /> Limpiar Datos Locales
              </button>
            </div>
          </div>
        );

      case 'advanced':
        return (
          <div className="space-y-1">
            <SectionTitle icon={Zap} title="Rendimiento" />
            <NumberField
              value={settings.apiTimeout}
              onChange={v => updateSetting('apiTimeout', v)}
              label="Timeout de API" description="Tiempo máximo de espera para solicitudes de red"
              min={5} max={60} suffix="seg"
            />
            <Divider />
            <NumberField
              value={settings.maxRetries}
              onChange={v => updateSetting('maxRetries', v)}
              label="Reintentos Máximos" description="Número de reintentos antes de reportar error de conexión"
              min={0} max={10}
            />

            <div className="mt-6" />
            <SectionTitle icon={Shield} title="Conectividad" />
            <Toggle
              value={settings.offlineMode}
              onChange={v => updateSetting('offlineMode', v)}
              label="Modo Offline (PWA)"
              description="Habilitar caché del Service Worker para funcionamiento sin conexión a Internet"
            />
            <Divider />
            <Toggle
              value={settings.telemetryEnabled}
              onChange={v => updateSetting('telemetryEnabled', v)}
              label="Telemetría de Uso"
              description="Enviar datos anónimos de uso al equipo de desarrollo para mejorar la plataforma"
            />

            <div className="mt-6" />
            <SectionTitle icon={Wrench} title="Desarrollo" />
            <Toggle
              value={settings.debugMode}
              onChange={v => updateSetting('debugMode', v)}
              label="Modo Debug"
              description="Activa logs avanzados en la consola del navegador y muestra IDs técnicos"
            />

            <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
              <p className="text-xs text-yellow-300 font-bold mb-1">⚠️ Zona de Peligro</p>
              <p className="text-xs text-yellow-200/70 mb-3">Estas acciones afectan la operación del sistema. Usar con precaución.</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    if (confirm('¿Restaurar TODA la configuración a valores de fábrica?')) {
                      handleReset();
                    }
                  }}
                  className="flex items-center gap-2 bg-red-900/40 hover:bg-red-800/50 text-red-300 border border-red-600/50 px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  <RotateCcw size={16} /> Restaurar Valores de Fábrica
                </button>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <div className="text-center py-6">
              <img src="/2.png" alt="SERMETAVIA" className="h-24 w-auto mx-auto mb-4 object-contain" />
              <h2 className="text-2xl font-bold text-white">SERMETAVIA</h2>
              <p className="text-gray-400 text-sm mt-1">Servicio Meteorológico de la Aviación Militar Bolivariana</p>
              <div className="inline-block mt-3 bg-emerald-900/30 border border-emerald-600/40 rounded-full px-4 py-1">
                <span className="text-emerald-300 text-sm font-mono">v2.0.0</span>
              </div>
            </div>

            <div className="bg-[#0f172a] rounded-xl border border-gray-700 divide-y divide-gray-800">
              {[
                ['Plataforma', 'Next.js 15 + React 19'],
                ['Base de Datos', 'Supabase (PostgreSQL)'],
                ['API Meteorológica', 'Open-Meteo (Libre)'],
                ['Cartografía', 'Leaflet + OpenStreetMap'],
                ['Gráficas', 'Recharts 2.x'],
                ['PWA', 'Service Worker + Manifest'],
                ['Despliegue', 'Vercel Edge Network'],
              ].map(([key, val]) => (
                <div key={key} className="flex justify-between items-center px-4 py-3">
                  <span className="text-sm text-gray-400">{key}</span>
                  <span className="text-sm text-white font-medium">{val}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#0f172a] rounded-xl border border-gray-700 p-4">
              <h4 className="text-sm font-bold text-white mb-3">Equipo de Desarrollo</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-900/50 border border-emerald-600/40 flex items-center justify-center text-emerald-300 text-xs font-bold">LB</div>
                  <div>
                    <p className="text-sm text-white">Proyecto de Tesis</p>
                    <p className="text-xs text-gray-500">Aviación Militar Bolivariana</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0f172a] rounded-xl border border-gray-700 p-4">
              <h4 className="text-sm font-bold text-white mb-3">Licencia y Uso</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Este software es propiedad del Servicio Meteorológico de la Aviación Militar Bolivariana (SERMETAVIA).
                Su uso está exclusivamente autorizado para fines institucionales y académicos.
                Queda estrictamente prohibida su distribución, copia o modificación sin autorización expresa.
              </p>
              <p className="text-xs text-gray-500 mt-3">© 2026 SERMETAVIA — Todos los derechos reservados.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-1">CONFIGURACIÓN</h2>
        <p className="text-gray-400 text-sm">Personaliza el comportamiento, aspecto y preferencias del sistema SERMETAVIA.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar de tabs */}
        <div className="lg:w-56 shrink-0">
          <nav className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-l-4 ${
                  activeTab === tab.id
                    ? 'bg-[#0f172a] text-white border-emerald-500 font-semibold'
                    : 'text-gray-400 hover:bg-[#0f172a]/50 hover:text-white border-transparent'
                }`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? 'text-emerald-400' : ''} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido del tab */}
        <div className="flex-1 min-w-0">
          <div className="bg-[#1e293b] rounded-xl border border-gray-700 p-6">
            {renderContent()}
          </div>

          {/* Botones de acción (excepto en 'about') */}
          {activeTab !== 'about' && (
            <div className="mt-4 flex items-center justify-between bg-[#1e293b] rounded-xl border border-gray-700 px-6 py-4">
              <div className="flex items-center gap-2">
                {saved && (
                  <span className="flex items-center gap-1 text-emerald-400 text-sm animate-pulse">
                    <Check size={16} /> Configuración guardada
                  </span>
                )}
                {hasChanges && !saved && (
                  <span className="text-yellow-400 text-sm">● Cambios sin guardar</span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  <RotateCcw size={16} /> Restaurar
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg transition-colors text-sm font-medium shadow-lg shadow-emerald-900/30"
                >
                  <Save size={16} /> Guardar Cambios
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
