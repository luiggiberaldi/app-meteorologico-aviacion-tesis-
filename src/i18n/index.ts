import { useCallback } from 'react';
import { useSettings } from '@/context/SettingsContext';

// Import all locale files
import esSidebar from './locales/es/sidebar';
import enSidebar from './locales/en/sidebar';
import ptSidebar from './locales/pt/sidebar';

import esTopbar from './locales/es/topbar';
import enTopbar from './locales/en/topbar';
import ptTopbar from './locales/pt/topbar';

import esLogin from './locales/es/login';
import enLogin from './locales/en/login';
import ptLogin from './locales/pt/login';

import esSettings from './locales/es/settings';
import enSettings from './locales/en/settings';
import ptSettings from './locales/pt/settings';

export type Language = 'es' | 'en' | 'pt';

const dictionaries = {
  es: { sidebar: esSidebar, topbar: esTopbar, login: esLogin, settings: esSettings },
  en: { sidebar: enSidebar, topbar: enTopbar, login: enLogin, settings: enSettings },
  pt: { sidebar: ptSidebar, topbar: ptTopbar, login: ptLogin, settings: ptSettings },
} as const;

export type Namespace = keyof (typeof dictionaries)['es'];

export function useTranslation<N extends Namespace>(namespace: N) {
  const { settings } = useSettings();
  const lang = (settings.language as Language) || 'es';

  type Keys = keyof (typeof dictionaries)['es'][N];

  const t = useCallback(
    (key: Keys): string => {
      const dict = dictionaries[lang]?.[namespace];
      const value = dict?.[key as keyof typeof dict];
      if (value) return value as string;
      // Fallback to Spanish
      const fallback = dictionaries.es[namespace];
      return (fallback[key as keyof typeof fallback] as string) ?? String(key);
    },
    [lang, namespace]
  );

  return { t, language: lang };
}
