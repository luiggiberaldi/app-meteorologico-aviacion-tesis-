import type es from '../es/sidebar';

const sidebar: Record<keyof typeof es, string> = {
  controlPanel: 'Painel de Controle',
  operations: 'Operações',
  system: 'Sistema',
  commandCenter: 'Centro de Comando',
  weatherAlerts: 'Alertas Meteorológicos',
  specializedSensors: 'Sensores Especializados',
  flightPlanning: 'Planejamento de Voos',
  satelliteImages: 'Imagens de Satélite',
  inamehVideos: 'Dados INAMEH',
  statistics: 'Estatísticas e Operações',
  historicalData: 'Dados Históricos',
  aiPrediction: 'IA Preditiva',
  astronomy: 'Astronomia e Estações',
  earlyWarning: 'Alerta Antecipado',
  maritimeWaves: 'Ondulação Marítima',
  news: 'Notícias',
  userManual: 'Manual do Usuário',
  cyberSecurity: 'Segurança Cibernética',
  users: 'Usuários',
  settings: 'Configurações',
  systemActive: 'Sistema Ativo',
  metNetwork: 'Rede Meteorológica',
} as const;

export default sidebar;
