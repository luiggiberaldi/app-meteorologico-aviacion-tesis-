import type es from '../es/login';

const login: Record<keyof typeof es, string> = {
  systemTitle: 'Meteorological System',
  systemSubtitle: 'Bolivarian Military Aviation',
  systemDescription: 'Operational weather surveillance for the air bases of the Bolivarian National Armed Forces.',
  liveForecast: 'Live Forecast',
  liveForecastDesc: 'Open-Meteo every 5 min',
  planning: 'Planning',
  planningDesc: 'ETE, fuel, routes',
  goes16: 'GOES-16',
  goes16Desc: 'Imagery every 10 min',
  nationalNetwork: 'National Network',
  nationalNetworkDesc: '7 air bases 24/7',
  systemOperational: 'System Operational',
  accessSystem: 'System Access',
  enterCredentials: 'Enter your institutional credentials',
  signIn: 'Sign In',
  username: 'Username',
  password: 'Password',
  usernamePlaceholder: 'Enter your username',
  loginButton: 'Access System',
  platformStatus: 'Platform status',
  apiMeteo: 'Meteo API',
  database: 'Database',
  auth: 'Auth',
  secureConnection: 'Secure connection · HTTPS/TLS',
  mobileSubtitle: 'Meteorological Service — Bolivarian Military Aviation',
  copyright: '© 2026 AEROMETRIX — Restricted Access',
} as const;

export default login;
