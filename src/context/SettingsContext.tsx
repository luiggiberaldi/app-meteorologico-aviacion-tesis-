"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface AppSettings {
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

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'es',
  timezone: 'America/Caracas',
  defaultBase: '',
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

const STORAGE_KEY = 'aerometrix_settings';

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  saveSettings: () => void;
  resetSettings: () => void;
  hasChanges: boolean;
  saved: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings(prev => ({ ...prev, ...JSON.parse(stored) }));
      }
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  // Apply visual settings to document
  useEffect(() => {
    if (!loaded) return;
    const root = document.documentElement;

    // Font size
    root.classList.remove('text-sm', 'text-base', 'text-lg');
    if (settings.fontSize === 'small') root.classList.add('text-sm');
    else if (settings.fontSize === 'large') root.classList.add('text-lg');
    else root.classList.add('text-base');

    // Compact mode
    if (settings.compactMode) {
      root.setAttribute('data-compact', 'true');
    } else {
      root.removeAttribute('data-compact');
    }

    // Animations
    if (!settings.animationsEnabled) {
      root.setAttribute('data-no-animations', 'true');
    } else {
      root.removeAttribute('data-no-animations');
    }

    // Language
    root.lang = settings.language || 'es';
  }, [settings.fontSize, settings.compactMode, settings.animationsEnabled, loaded]);

  const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
    setSaved(false);
  }, []);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
    setHasChanges(true);
    setSaved(false);
  }, []);

  const saveSettings = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setSaved(true);
      setHasChanges(false);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* ignore */ }
  }, [settings]);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    setHasChanges(true);
    setSaved(false);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, updateSettings, saveSettings, resetSettings, hasChanges, saved }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings debe ser usado dentro de un SettingsProvider');
  }
  return context;
}
