import type es from '../es/sidebar';

const sidebar: Record<keyof typeof es, string> = {
  controlPanel: 'Control Panel',
  operations: 'Operations',
  system: 'System',
  commandCenter: 'Command Center',
  weatherAlerts: 'Weather Alerts',
  specializedSensors: 'Specialized Sensors',
  flightPlanning: 'Flight Planning',
  satelliteImages: 'Satellite Images',
  statistics: 'Statistics & Operations',
  historicalData: 'Historical Data',
  aiPrediction: 'AI Prediction',
  astronomy: 'Astronomy & Stations',
  earlyWarning: 'Early Warning',
  maritimeWaves: 'Maritime Swell',
  news: 'News',
  userManual: 'User Manual',
  cyberSecurity: 'Cybersecurity',
  users: 'Users',
  settings: 'Settings',
  systemActive: 'System Active',
  metNetwork: 'Meteorological Network',
} as const;

export default sidebar;
