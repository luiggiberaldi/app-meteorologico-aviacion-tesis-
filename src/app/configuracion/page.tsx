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
  Save, RotateCcw, UserCog, AlertCircle, ShieldAlert, BookOpen, FlaskConical, Ban
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSettings, DEFAULT_SETTINGS, type AppSettings } from '@/context/SettingsContext';
import { useTranslation } from '@/i18n';

// ─── Tabs definition (labelKey used for translation lookup) ───
const TAB_DEFS = [
  { id: 'account', labelKey: 'tabAccount' as const, icon: UserCog },
  { id: 'general', labelKey: 'tabGeneral' as const, icon: Settings },
  { id: 'units', labelKey: 'tabUnits' as const, icon: Gauge },
  { id: 'appearance', labelKey: 'tabAppearance' as const, icon: Monitor },
  { id: 'notifications', labelKey: 'tabNotifications' as const, icon: Bell },
  { id: 'data', labelKey: 'tabData' as const, icon: Database },
  { id: 'advanced', labelKey: 'tabAdvanced' as const, icon: Wrench },
  { id: 'about', labelKey: 'tabAbout' as const, icon: Info },
  { id: 'legal', labelKey: 'tabLegal' as const, icon: ShieldAlert },
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
  const [activeTab, setActiveTab] = useState('account');
  const { settings, updateSetting, saveSettings, resetSettings, hasChanges, saved } = useSettings();
  const { user, updateCredentials } = useAuth();
  const { t } = useTranslation('settings');
  // Estado del formulario de cuenta
  const [accUsername, setAccUsername] = useState('');
  const [accPassword, setAccPassword] = useState('');
  const [accDisplayName, setAccDisplayName] = useState('');
  const [accError, setAccError] = useState<string | null>(null);
  const [accSuccess, setAccSuccess] = useState<string | null>(null);

  // Sincronizar campos de cuenta con el usuario actual
  useEffect(() => {
    if (user) {
      setAccUsername(user.username);
      setAccPassword(user.password);
      setAccDisplayName(user.displayName);
    }
  }, [user]);

  // ─── Render de cada tab ───
  const handleSaveAccount = () => {
    setAccError(null);
    setAccSuccess(null);
    if (!accUsername.trim()) { setAccError(t('emptyUserError')); return; }
    if (accPassword.length < 6) { setAccError(t('shortPasswordError')); return; }
    if (!accDisplayName.trim()) { setAccError(t('emptyNameError')); return; }
    const result = updateCredentials(accUsername.trim(), accPassword, accDisplayName.trim());
    if (result.error) { setAccError(result.error); }
    else { setAccSuccess(t('credentialsUpdated')); setTimeout(() => setAccSuccess(null), 4000); }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-1">
            <SectionTitle icon={UserCog} title={t('accessCredentials')} />
            {accError && (
              <div className="flex items-center gap-2 bg-red-900/30 border border-red-500/40 rounded-lg p-3 mb-3">
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <p className="text-sm text-red-300">{accError}</p>
              </div>
            )}
            {accSuccess && (
              <div className="flex items-center gap-2 bg-emerald-900/30 border border-emerald-500/40 rounded-lg p-3 mb-3">
                <Check size={16} className="text-emerald-400 shrink-0" />
                <p className="text-sm text-emerald-300">{accSuccess}</p>
              </div>
            )}
            <div className="py-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">{t('displayName')}</label>
              <input type="text" value={accDisplayName} onChange={e => setAccDisplayName(e.target.value)}
                className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none" />
              <p className="text-[11px] text-gray-500 mt-1">{t('displayNameDesc')}</p>
            </div>
            <Divider />
            <div className="py-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">{t('usernameLabel')}</label>
              <input type="text" value={accUsername} onChange={e => setAccUsername(e.target.value)}
                className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none" />
              <p className="text-[11px] text-gray-500 mt-1">{t('usernameDesc')}</p>
            </div>
            <Divider />
            <div className="py-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">{t('passwordLabel')}</label>
              <input type="password" value={accPassword} onChange={e => setAccPassword(e.target.value)}
                className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none" />
              <p className="text-[11px] text-gray-500 mt-1">{t('passwordDesc')}</p>
            </div>
            <div className="pt-4">
              <button onClick={handleSaveAccount}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg transition-colors text-sm font-medium shadow-lg shadow-emerald-900/30">
                <Save size={16} /> {t('saveAccountChanges')}
              </button>
            </div>
          </div>
        );

      case 'general':
        return (
          <div className="space-y-1">
            <SectionTitle icon={Globe} title={t('sectionRegional')} />
            <SelectField
              value={settings.language} onChange={v => updateSetting('language', v)}
              label={t('language')} description={t('languageDesc')}
              options={[
                { value: 'es', label: 'Español' },
                { value: 'en', label: 'English' },
                { value: 'pt', label: 'Português' },
              ]}
            />
            <Divider />
            <SelectField
              value={settings.timezone} onChange={v => updateSetting('timezone', v)}
              label={t('timezone')} description={t('timezoneDesc')}
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
              label={t('dateFormat')}
              options={[
                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' },
              ]}
            />

            <div className="mt-6" />
            <SectionTitle icon={MapPin} title={t('sectionDefaultBase')} />
            <SelectField
              value={settings.defaultBase} onChange={v => updateSetting('defaultBase', v)}
              label={t('defaultBase')} description={t('defaultBaseDesc')}
              options={[
                { value: '', label: t('nationalAllBases') },
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
            <SectionTitle icon={RefreshCw} title={t('sectionDataUpdate')} />
            <SelectField
              value={String(settings.autoRefreshInterval)}
              onChange={v => updateSetting('autoRefreshInterval', Number(v))}
              label={t('refreshInterval')} description={t('refreshIntervalDesc')}
              options={[
                { value: '60', label: t('every1min') },
                { value: '120', label: t('every2min') },
                { value: '300', label: t('every5min') },
                { value: '600', label: t('every10min') },
                { value: '900', label: t('every15min') },
                { value: '1800', label: t('every30min') },
              ]}
            />
          </div>
        );

      case 'units':
        return (
          <div className="space-y-1">
            <SectionTitle icon={Thermometer} title={t('sectionMeteoUnits')} />
            <SelectField
              value={settings.tempUnit} onChange={v => updateSetting('tempUnit', v as any)}
              label={t('temperature')}
              options={[
                { value: 'C', label: '°C (Celsius)' },
                { value: 'F', label: '°F (Fahrenheit)' },
              ]}
            />
            <Divider />
            <SelectField
              value={settings.windUnit} onChange={v => updateSetting('windUnit', v as any)}
              label={t('windSpeed')}
              options={[
                { value: 'KT', label: 'Nudos (KT)' },
                { value: 'KMH', label: 'km/h' },
                { value: 'MS', label: 'm/s' },
              ]}
            />
            <Divider />
            <SelectField
              value={settings.visibilityUnit} onChange={v => updateSetting('visibilityUnit', v as any)}
              label={t('visibility')}
              options={[
                { value: 'KM', label: 'Kilómetros (km)' },
                { value: 'SM', label: 'Millas Estatutarias (SM)' },
                { value: 'M', label: 'Metros (m)' },
              ]}
            />
            <Divider />
            <SelectField
              value={settings.pressureUnit} onChange={v => updateSetting('pressureUnit', v as any)}
              label={t('pressure')}
              options={[
                { value: 'HPA', label: 'Hectopascales (hPa)' },
                { value: 'INHG', label: 'Pulgadas Hg (inHg)' },
                { value: 'MB', label: 'Milibares (mb)' },
              ]}
            />

            <div className="mt-6" />
            <SectionTitle icon={Plane} title={t('sectionAviationUnits')} />
            <SelectField
              value={settings.altitudeUnit} onChange={v => updateSetting('altitudeUnit', v as any)}
              label={t('altitude')}
              options={[
                { value: 'FT', label: 'Pies (ft)' },
                { value: 'M', label: 'Metros (m)' },
              ]}
            />
            <Divider />
            <SelectField
              value={settings.fuelUnit} onChange={v => updateSetting('fuelUnit', v as any)}
              label={t('fuel')}
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
            <SectionTitle icon={Sun} title={t('sectionTheme')} />
            <SelectField
              value={settings.theme} onChange={v => updateSetting('theme', v as any)}
              label={t('interfaceTheme')} description={t('interfaceThemeDesc')}
              options={[
                { value: 'dark', label: `🌙 ${t('darkMode')}` },
                { value: 'light', label: `☀️ ${t('lightMode')}` },
                { value: 'auto', label: `🔄 ${t('autoMode')}` },
              ]}
            />

            <div className="mt-6" />
            <SectionTitle icon={Monitor} title={t('sectionInterface')} />
            <SelectField
              value={settings.fontSize} onChange={v => updateSetting('fontSize', v as any)}
              label={t('fontSize')} description={t('fontSizeDesc')}
              options={[
                { value: 'small', label: t('fontSmall') },
                { value: 'medium', label: t('fontNormal') },
                { value: 'large', label: t('fontLarge') },
              ]}
            />
            <Divider />
            <Toggle
              value={settings.animationsEnabled}
              onChange={v => updateSetting('animationsEnabled', v)}
              label={t('animations')}
              description={t('animationsDesc')}
            />
            <Divider />
            <Toggle
              value={settings.compactMode}
              onChange={v => updateSetting('compactMode', v)}
              label={t('compactMode')}
              description={t('compactModeDesc')}
            />
            <Divider />
            <Toggle
              value={settings.sidebarCollapsed}
              onChange={v => updateSetting('sidebarCollapsed', v)}
              label={t('collapsedSidebar')}
              description={t('collapsedSidebarDesc')}
            />
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-1">
            <SectionTitle icon={Bell} title={t('sectionGeneralNotifs')} />
            <Toggle
              value={settings.notificationsEnabled}
              onChange={v => updateSetting('notificationsEnabled', v)}
              label={t('systemNotifications')}
              description={t('systemNotificationsDesc')}
            />
            <Divider />
            <Toggle
              value={settings.soundEnabled}
              onChange={v => updateSetting('soundEnabled', v)}
              label={t('alertSound')}
              description={t('alertSoundDesc')}
            />

            <div className="mt-6" />
            <SectionTitle icon={Radio} title={t('sectionAlertTypes')} />
            <Toggle
              value={settings.weatherAlerts}
              onChange={v => updateSetting('weatherAlerts', v)}
              label={t('weatherAlerts')}
              description={t('weatherAlertsDesc')}
            />
            <Divider />
            <Toggle
              value={settings.maintenanceAlerts}
              onChange={v => updateSetting('maintenanceAlerts', v)}
              label={t('maintenanceAlerts')}
              description={t('maintenanceAlertsDesc')}
            />
            <Divider />
            <Toggle
              value={settings.operationalAlerts}
              onChange={v => updateSetting('operationalAlerts', v)}
              label={t('operationalAlerts')}
              description={t('operationalAlertsDesc')}
            />

            <div className="mt-6" />
            <SectionTitle icon={Gauge} title={t('sectionAlertThresholds')} />
            <NumberField
              value={settings.alertThresholdWind}
              onChange={v => updateSetting('alertThresholdWind', v)}
              label={t('windThreshold')} description={t('windThresholdDesc')}
              min={10} max={80} suffix="KT"
            />
            <Divider />
            <NumberField
              value={settings.alertThresholdVisibility}
              onChange={v => updateSetting('alertThresholdVisibility', v)}
              label={t('visibilityThreshold')} description={t('visibilityThresholdDesc')}
              min={500} max={10000} suffix="m"
            />
          </div>
        );

      case 'data':
        return (
          <div className="space-y-1">
            <SectionTitle icon={HardDrive} title={t('sectionLocalStorage')} />
            <NumberField
              value={settings.dataRetentionDays}
              onChange={v => updateSetting('dataRetentionDays', v)}
              label={t('dataRetention')} description={t('dataRetentionDesc')}
              min={7} max={365} suffix={t('days')}
            />
            <Divider />
            <Toggle
              value={settings.cacheEnabled}
              onChange={v => updateSetting('cacheEnabled', v)}
              label={t('dataCache')}
              description={t('dataCacheDesc')}
            />

            <div className="mt-6" />
            <SectionTitle icon={Download} title={t('sectionBackups')} />
            <Toggle
              value={settings.autoBackup}
              onChange={v => updateSetting('autoBackup', v)}
              label={t('autoBackup')}
              description={t('autoBackupDesc')}
            />
            <Divider />
            <SelectField
              value={settings.backupFrequency}
              onChange={v => updateSetting('backupFrequency', v as any)}
              label={t('backupFrequency')} description={t('backupFrequencyDesc')}
              options={[
                { value: 'daily', label: t('daily') },
                { value: 'weekly', label: t('weekly') },
                { value: 'monthly', label: t('monthly') },
              ]}
            />

            <div className="mt-6" />
            <SectionTitle icon={Trash2} title={t('sectionDataActions')} />
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
                <Download size={16} /> {t('exportConfig')}
              </button>
              <label className="flex items-center gap-2 bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-700/50 px-4 py-2 rounded-lg transition-colors text-sm cursor-pointer">
                <Upload size={16} /> {t('importConfig')}
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
                          updateSetting('language', imported.language ?? DEFAULT_SETTINGS.language);
                          // Apply all imported settings
                          Object.keys(imported).forEach(key => {
                            if (key in DEFAULT_SETTINGS) {
                              updateSetting(key as keyof AppSettings, imported[key]);
                            }
                          });
                        } catch { /* ignore */ }
                      };
                      reader.readAsText(file);
                    }
                  }}
                />
              </label>
              <button
                onClick={() => {
                  if (confirm(t('clearDataConfirm'))) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="flex items-center gap-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 border border-red-700/50 px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <Trash2 size={16} /> {t('clearLocalData')}
              </button>
            </div>
          </div>
        );

      case 'advanced':
        return (
          <div className="space-y-1">
            <SectionTitle icon={Zap} title={t('sectionPerformance')} />
            <NumberField
              value={settings.apiTimeout}
              onChange={v => updateSetting('apiTimeout', v)}
              label={t('apiTimeout')} description={t('apiTimeoutDesc')}
              min={5} max={60} suffix={t('seconds')}
            />
            <Divider />
            <NumberField
              value={settings.maxRetries}
              onChange={v => updateSetting('maxRetries', v)}
              label={t('maxRetries')} description={t('maxRetriesDesc')}
              min={0} max={10}
            />

            <div className="mt-6" />
            <SectionTitle icon={Shield} title={t('sectionConnectivity')} />
            <Toggle
              value={settings.offlineMode}
              onChange={v => updateSetting('offlineMode', v)}
              label={t('offlineMode')}
              description={t('offlineModeDesc')}
            />
            <Divider />
            <Toggle
              value={settings.telemetryEnabled}
              onChange={v => updateSetting('telemetryEnabled', v)}
              label={t('telemetry')}
              description={t('telemetryDesc')}
            />

            <div className="mt-6" />
            <SectionTitle icon={Wrench} title={t('sectionDevelopment')} />
            <Toggle
              value={settings.debugMode}
              onChange={v => updateSetting('debugMode', v)}
              label={t('debugMode')}
              description={t('debugModeDesc')}
            />

            <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
              <p className="text-xs text-yellow-300 font-bold mb-1">⚠️ {t('dangerZone')}</p>
              <p className="text-xs text-yellow-200/70 mb-3">{t('dangerZoneDesc')}</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    if (confirm(t('factoryResetConfirm'))) {
                      resetSettings();
                    }
                  }}
                  className="flex items-center gap-2 bg-red-900/40 hover:bg-red-800/50 text-red-300 border border-red-600/50 px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  <RotateCcw size={16} /> {t('factoryReset')}
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
              <p className="text-gray-400 text-sm mt-1">{t('aboutService')}</p>
              <div className="inline-block mt-3 bg-emerald-900/30 border border-emerald-600/40 rounded-full px-4 py-1">
                <span className="text-emerald-300 text-sm font-mono">v2.0.0</span>
              </div>
            </div>

            <div className="bg-[#0f172a] rounded-xl border border-gray-700 divide-y divide-gray-800">
              {[
                [t('aboutPlatform'), 'Next.js 15 + React 19'],
                [t('aboutDatabase'), 'Supabase (PostgreSQL)'],
                [t('aboutWeatherAPI'), 'Open-Meteo (Libre)'],
                [t('aboutCartography'), 'Leaflet + OpenStreetMap'],
                [t('aboutCharts'), 'Recharts 2.x'],
                [t('aboutPWA'), 'Service Worker + Manifest'],
                [t('aboutDeployment'), 'Cloudflare Workers'],
              ].map(([key, val]) => (
                <div key={key} className="flex justify-between items-center px-4 py-3">
                  <span className="text-sm text-gray-400">{key}</span>
                  <span className="text-sm text-white font-medium">{val}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#0f172a] rounded-xl border border-gray-700 p-4">
              <h4 className="text-sm font-bold text-white mb-3">{t('devTeam')}</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-900/50 border border-emerald-600/40 flex items-center justify-center text-emerald-300 text-xs font-bold">LB</div>
                  <div>
                    <p className="text-sm text-white">{t('thesisProject')}</p>
                    <p className="text-xs text-gray-500">{t('militaryAviation')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0f172a] rounded-xl border border-gray-700 p-4">
              <h4 className="text-sm font-bold text-white mb-3">{t('licenseTitle')}</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                {t('licenseText')}
              </p>
              <p className="text-xs text-gray-500 mt-3">{t('copyright')}</p>
            </div>
          </div>
        );

      case 'legal':
        return (
          <div className="space-y-6">

            {/* Encabezado */}
            <div className="bg-[#0f172a] border border-gray-600 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <ShieldAlert size={32} className="text-amber-400 shrink-0 mt-1" />
                <div>
                  <h3 className="text-white font-bold text-base uppercase tracking-widest mb-1">
                    Aviso Legal y Condiciones de Uso
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    De conformidad con las disposiciones del <strong className="text-gray-300">Código Civil de Venezuela</strong> (G.O. N° 2.990, 1982), la <strong className="text-gray-300">Ley Especial contra los Delitos Informáticos</strong> (G.O. N° 37.313, 2001) y la <strong className="text-gray-300">Ley de Infogobierno</strong> (G.O. N° 40.274, 2013), el autor establece las siguientes condiciones de uso para esta plataforma.
                  </p>
                </div>
              </div>
            </div>

            {/* Art. 1: Naturaleza del sistema */}
            <div className="bg-[#0f172a] border border-gray-700 rounded-xl p-5 space-y-2">
              <h4 className="text-amber-400 font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                <BookOpen size={15} /> Artículo 1 — Naturaleza y Alcance del Sistema
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                La plataforma SERMETAVIA constituye un <strong>prototipo de software desarrollado con fines académicos</strong>, presentado como Trabajo Especial de Grado. No representa un sistema operacional certificado, ni ha sido sometido a procesos de validación técnica por parte de autoridades aeronáuticas, meteorológicas o militares de la República Bolivariana de Venezuela.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed mt-2">
                El uso de denominaciones institucionales y referencias geográficas tiene carácter <strong>exclusivamente ilustrativo</strong> dentro del contexto académico de la investigación, sin que ello implique afiliación, aprobación ni respaldo de ningún organismo del Estado venezolano.
              </p>
            </div>

            {/* Art. 2: Exención de responsabilidad civil */}
            <div className="bg-[#0f172a] border border-gray-700 rounded-xl p-5 space-y-2">
              <h4 className="text-amber-400 font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                <ShieldAlert size={15} /> Artículo 2 — Exención de Responsabilidad Civil
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Conforme al <strong>artículo 1.185 del Código Civil venezolano</strong> (hecho ilícito) y al principio de responsabilidad subjetiva que rige en el ordenamiento jurídico venezolano, el autor <strong>no incurrirá en responsabilidad civil</strong> por daños o perjuicios de cualquier naturaleza que pudieran derivarse del uso de esta plataforma, toda vez que:
              </p>
              <ul className="text-gray-300 text-sm leading-relaxed space-y-1.5 mt-2 ml-2">
                <li className="flex gap-2"><span className="text-amber-400 shrink-0">i.</span> El sistema es puesto a disposición sin garantía de exactitud, completitud ni idoneidad operacional.</li>
                <li className="flex gap-2"><span className="text-amber-400 shrink-0">ii.</span> El usuario accede voluntariamente y bajo su exclusiva responsabilidad.</li>
                <li className="flex gap-2"><span className="text-amber-400 shrink-0">iii.</span> El presente aviso constituye notificación previa y suficiente de las limitaciones del sistema, eliminando el elemento de culpa del autor conforme al artículo <strong>1.193 CC</strong>.</li>
              </ul>
            </div>

            {/* Art. 3: Limitaciones de los datos */}
            <div className="bg-[#0f172a] border border-gray-700 rounded-xl p-5 space-y-2">
              <h4 className="text-amber-400 font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                <FlaskConical size={15} /> Artículo 3 — Limitaciones de los Datos Presentados
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Los datos, estimaciones e interpretaciones generados por esta plataforma provienen de fuentes de acceso público (Open-Meteo API) y algoritmos de estimación no certificados. En consecuencia:
              </p>
              <ul className="text-gray-300 text-sm leading-relaxed space-y-1.5 mt-2 ml-2">
                <li className="flex gap-2"><span className="text-gray-500 shrink-0">•</span> No sustituyen la información meteorológica oficial emitida por el <strong>INAMEH</strong> ni por servicios aeronáuticos certificados bajo normas OACI.</li>
                <li className="flex gap-2"><span className="text-gray-500 shrink-0">•</span> Los dictámenes del módulo de Inteligencia Artificial son generados por modelos de lenguaje (LLM) y carecen de validez técnica, científica u operacional.</li>
                <li className="flex gap-2"><span className="text-gray-500 shrink-0">•</span> No deben emplearse como fundamento para ninguna decisión que comprometa la seguridad de personas, aeronaves o instalaciones.</li>
              </ul>
            </div>

            {/* Art. 4: Propiedad intelectual */}
            <div className="bg-[#0f172a] border border-gray-700 rounded-xl p-5 space-y-2">
              <h4 className="text-amber-400 font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                <Shield size={15} /> Artículo 4 — Propiedad Intelectual
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                El código fuente, diseño, arquitectura y documentación de esta plataforma son obra intelectual original del autor, protegida por la <strong>Ley sobre el Derecho de Autor de Venezuela</strong> (G.O. N° 4.638 Extraordinario, 1993). Queda prohibida su reproducción total o parcial, modificación, distribución o uso comercial sin autorización expresa y escrita del titular.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed mt-2">
                El acceso a esta plataforma no confiere al usuario ningún derecho de propiedad intelectual sobre sus contenidos o componentes.
              </p>
            </div>

            {/* Art. 5: Aceptación */}
            <div className="bg-amber-950/30 border border-amber-700/40 rounded-xl p-4">
              <p className="text-amber-200/80 text-xs leading-relaxed">
                <strong className="text-amber-300">Aceptación de condiciones:</strong> El acceso y uso de esta plataforma implica la aceptación plena, expresa e incondicional de todas las condiciones establecidas en el presente aviso legal. Quien no esté de acuerdo con estas condiciones deberá abstenerse de usar el sistema.
              </p>
              <p className="text-gray-600 text-[10px] mt-3 pt-2 border-t border-amber-900/40">
                Versión 1.0 · República Bolivariana de Venezuela · © 2026 Luigi Beraldi — Todos los derechos reservados.
              </p>
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
        <h2 className="text-2xl font-bold tracking-tight text-white mb-1">{t('pageTitle')}</h2>
        <p className="text-gray-400 text-sm">{t('pageDescription')}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar de tabs */}
        <div className="lg:w-56 shrink-0">
          <nav className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden">
            {TAB_DEFS.map(tab => (
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
                {t(tab.labelKey)}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido del tab */}
        <div className="flex-1 min-w-0">
          <div className="bg-[#1e293b] rounded-xl border border-gray-700 p-6">
            {renderContent()}
          </div>

          {/* Botones de acción (excepto en 'about' y 'account') */}
          {activeTab !== 'about' && activeTab !== 'account' && (
            <div className="mt-4 flex items-center justify-between bg-[#1e293b] rounded-xl border border-gray-700 px-6 py-4">
              <div className="flex items-center gap-2">
                {saved && (
                  <span className="flex items-center gap-1 text-emerald-400 text-sm animate-pulse">
                    <Check size={16} /> {t('settingsSaved')}
                  </span>
                )}
                {hasChanges && !saved && (
                  <span className="text-yellow-400 text-sm">● {t('unsavedChanges')}</span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={resetSettings}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  <RotateCcw size={16} /> {t('restore')}
                </button>
                <button
                  onClick={saveSettings}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg transition-colors text-sm font-medium shadow-lg shadow-emerald-900/30"
                >
                  <Save size={16} /> {t('save')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
