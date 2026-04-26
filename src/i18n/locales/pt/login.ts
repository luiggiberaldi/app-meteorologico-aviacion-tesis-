import type es from '../es/login';

const login: Record<keyof typeof es, string> = {
  systemTitle: 'Sistema Meteorologico',
  systemSubtitle: 'Aviacao Militar Bolivariana',
  systemDescription: 'Vigilancia meteorologica operacional para as bases aereas da Forca Armada Nacional Bolivariana.',
  liveForecast: 'Previsao ao Vivo',
  liveForecastDesc: 'Open-Meteo a cada 5 min',
  planning: 'Planejamento',
  planningDesc: 'ETE, combustivel, rotas',
  goes16: 'GOES-16',
  goes16Desc: 'Imagens a cada 10 min',
  nationalNetwork: 'Rede Nacional',
  nationalNetworkDesc: '7 bases aereas 24/7',
  systemOperational: 'Sistema Operacional',
  accessSystem: 'Acesso ao Sistema',
  enterCredentials: 'Insira suas credenciais institucionais',
  signIn: 'Entrar',
  username: 'Usuario',
  password: 'Senha',
  usernamePlaceholder: 'Insira seu usuario',
  loginButton: 'Acessar o Sistema',
  platformStatus: 'Status da plataforma',
  apiMeteo: 'API Meteo',
  database: 'Banco de Dados',
  auth: 'Auth',
  secureConnection: 'Conexao segura · HTTPS/TLS',
  mobileSubtitle: 'Servico Meteorologico — Aviacao Militar Bolivariana',
  copyright: '© 2026 AEROMETRIX — Acesso Restrito',
} as const;

export default login;
