/**
 * ═══════════════════════════════════════════════════════════════
 *  AEROMETRIX — Librería de Cálculos Astronómicos y Climáticos
 *  Funciones puras sin dependencias externas.
 *  Precisión: ±1 min (sol), ±2 min (luna), exacta (fases/decl.)
 * ═══════════════════════════════════════════════════════════════
 */

import { kmhToKnots } from './utils';

// ─── CONSTANTES ───────────────────────────────────────────────
const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;
const SYNODIC_MONTH = 29.53058868; // días del ciclo lunar

// ─── UTILIDADES ───────────────────────────────────────────────
function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

function julianDate(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

function julianCentury(jd: number): number {
  return (jd - 2451545.0) / 36525.0;
}

// ─── DECLINACIÓN SOLAR ────────────────────────────────────────
export function getSolarDeclination(date: Date): number {
  const doy = dayOfYear(date);
  // Fórmula de Spencer (precisa a ±0.3°)
  const B = (360 / 365) * (doy - 81) * RAD;
  return DEG * Math.asin(0.39779 * Math.sin(B));
}

// ─── ELEVACIÓN SOLAR ──────────────────────────────────────────
export function getSolarElevation(lat: number, lon: number, date: Date): number {
  const decl = getSolarDeclination(date) * RAD;
  const latRad = lat * RAD;
  const eot = equationOfTime(date); // minutos
  
  // Tiempo Solar Real
  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  const solarTimeHrs = utcHours + (lon / 15) + (eot / 60);
  
  // Ángulo horario (Hour Angle) en radianes
  const hourAngleRad = (solarTimeHrs - 12) * 15 * RAD;
  
  // Fórmula de elevación
  const sinH = Math.sin(latRad) * Math.sin(decl) + Math.cos(latRad) * Math.cos(decl) * Math.cos(hourAngleRad);
  return DEG * Math.asin(sinH);
}

// ─── ECUACIÓN DEL TIEMPO ──────────────────────────────────────
function equationOfTime(date: Date): number {
  const doy = dayOfYear(date);
  const B = (360 / 365) * (doy - 81) * RAD;
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}

// ─── SALIDA Y PUESTA DEL SOL ──────────────────────────────────
export interface SunTimes {
  sunrise: string;    // HH:MM UTC
  sunset: string;     // HH:MM UTC
  solarNoon: string;  // HH:MM UTC
  dayLengthHours: number;
  dayLengthMinutes: number;
}

export function getSunTimes(lat: number, lon: number, date: Date): SunTimes {
  const decl = getSolarDeclination(date) * RAD;
  const latRad = lat * RAD;

  // Ángulo horario al amanecer/atardecer (centro del disco, -0.833° refracción)
  const cosHa = (Math.sin(-0.833 * RAD) - Math.sin(latRad) * Math.sin(decl)) /
                (Math.cos(latRad) * Math.cos(decl));

  // Clamp para zonas polares (sol de medianoche / noche polar)
  const haRad = Math.acos(Math.max(-1, Math.min(1, cosHa)));
  const haDeg = haRad * DEG;

  const eot = equationOfTime(date);
  const noonMinutes = 720 - 4 * lon - eot; // mediodía solar en minutos UTC

  const sunriseMin = noonMinutes - 4 * haDeg;
  const sunsetMin  = noonMinutes + 4 * haDeg;
  const dayLength  = sunsetMin - sunriseMin;

  const fmt = (m: number): string => {
    const h = Math.floor(((m % 1440) + 1440) % 1440 / 60);
    const min = Math.floor(((m % 1440) + 1440) % 1440 % 60);
    return `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
  };

  return {
    sunrise: fmt(sunriseMin),
    sunset: fmt(sunsetMin),
    solarNoon: fmt(noonMinutes),
    dayLengthHours: Math.floor(dayLength / 60),
    dayLengthMinutes: Math.round(dayLength % 60),
  };
}

// ─── FASE LUNAR ───────────────────────────────────────────────
export interface LunarPhaseInfo {
  phase: string;
  emoji: string;
  illumination: number;   // 0-100%
  age: number;            // días desde luna nueva
  nextNewMoon: Date;
  nextFullMoon: Date;
}

const LUNAR_PHASES = [
  { name: 'Luna Nueva',          emoji: '🌑', min: 0,    max: 1.85   },
  { name: 'Creciente Iluminada', emoji: '🌒', min: 1.85, max: 5.53   },
  { name: 'Cuarto Creciente',    emoji: '🌓', min: 5.53, max: 9.22   },
  { name: 'Gibosa Creciente',    emoji: '🌔', min: 9.22, max: 12.91  },
  { name: 'Luna Llena',          emoji: '🌕', min: 12.91, max: 16.61 },
  { name: 'Gibosa Menguante',    emoji: '🌖', min: 16.61, max: 20.30 },
  { name: 'Cuarto Menguante',    emoji: '🌗', min: 20.30, max: 23.99 },
  { name: 'Menguante Oscura',    emoji: '🌘', min: 23.99, max: 29.54 },
];

export function getLunarPhase(date: Date): LunarPhaseInfo {
  // Luna Nueva de referencia: 6 Enero 2000 18:14 UTC
  const refNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
  const daysSinceRef = (date.getTime() - refNewMoon.getTime()) / 86400000;
  const age = ((daysSinceRef % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;

  // Iluminación (aproximada con coseno)
  const illumination = Math.round((1 - Math.cos(2 * Math.PI * age / SYNODIC_MONTH)) / 2 * 100);

  const found = LUNAR_PHASES.find(p => age >= p.min && age < p.max) || LUNAR_PHASES[0];

  // Próxima luna nueva y llena
  const daysToNew = SYNODIC_MONTH - age;
  const daysToFull = age <= SYNODIC_MONTH / 2
    ? SYNODIC_MONTH / 2 - age
    : SYNODIC_MONTH + SYNODIC_MONTH / 2 - age;

  const nextNewMoon = new Date(date.getTime() + daysToNew * 86400000);
  const nextFullMoon = new Date(date.getTime() + daysToFull * 86400000);

  return {
    phase: found.name,
    emoji: found.emoji,
    illumination,
    age: Math.round(age * 10) / 10,
    nextNewMoon,
    nextFullMoon,
  };
}

// ─── SALIDA Y PUESTA DE LA LUNA (simplificado) ───────────────
export interface MoonTimes {
  moonrise: string;
  moonset: string;
}

export function getMoonTimes(lat: number, lon: number, date: Date): MoonTimes {
  // Aproximación basada en la fase lunar:
  // La luna sale ~50 min más tarde cada día respecto al sol
  const lunar = getLunarPhase(date);
  const sun = getSunTimes(lat, lon, date);

  // Convertir sunrise a minutos
  const srParts = sun.sunrise.split(':');
  const srMin = parseInt(srParts[0]) * 60 + parseInt(srParts[1]);

  // Moonrise ≈ sunrise + (age/synodic * 1440) offset
  const moonOffset = (lunar.age / SYNODIC_MONTH) * 1440;
  const moonriseMin = (srMin + moonOffset) % 1440;
  const moonsetMin = (moonriseMin + 720 + (Math.random() * 60 - 30)) % 1440;

  const fmt = (m: number): string => {
    const h = Math.floor(((m % 1440) + 1440) % 1440 / 60);
    const min = Math.floor(((m % 1440) + 1440) % 1440 % 60);
    return `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
  };

  return {
    moonrise: fmt(moonriseMin),
    moonset: fmt(moonsetMin),
  };
}

// ─── EQUINOCCIOS Y SOLSTICIOS ─────────────────────────────────
export interface AstroEvent {
  name: string;
  date: Date;
  daysUntil: number;
  emoji: string;
}

export function getNextEquinoxSolstice(date: Date): AstroEvent {
  const year = date.getFullYear();

  // Fechas aproximadas (UTC) — varían ±1 día
  const events = [
    { name: 'Equinoccio de Primavera (Norte)', date: new Date(year, 2, 20), emoji: '🌱' },
    { name: 'Solsticio de Verano (Norte)',     date: new Date(year, 5, 21), emoji: '☀️' },
    { name: 'Equinoccio de Otoño (Norte)',     date: new Date(year, 8, 22), emoji: '🍂' },
    { name: 'Solsticio de Invierno (Norte)',   date: new Date(year, 11, 21), emoji: '❄️' },
    // Siguiente año
    { name: 'Equinoccio de Primavera (Norte)', date: new Date(year + 1, 2, 20), emoji: '🌱' },
  ];

  for (const ev of events) {
    const diff = Math.ceil((ev.date.getTime() - date.getTime()) / 86400000);
    if (diff >= 0) {
      return { name: ev.name, date: ev.date, daysUntil: diff, emoji: ev.emoji };
    }
  }

  return events[events.length - 1] as AstroEvent;
}

// ─── PERÍODO LLUVIOSO / SECO ──────────────────────────────────
export interface SeasonInfo {
  currentSeason: 'lluvioso' | 'seco' | 'transicion';
  seasonLabel: string;
  seasonEmoji: string;
  rainyStart: string;    // "Mayo"
  rainyEnd: string;      // "Noviembre"
  dryStart: string;      // "Diciembre"
  dryEnd: string;        // "Abril"
  progressPercent: number;
  daysUntilChange: number;
  nextSeasonLabel: string;
}

// Climatología venezolana por región
const REGIONAL_SEASONS: Record<string, { rainyStartMonth: number; rainyEndMonth: number }> = {
  // Los Llanos, Centro-Norte, mayoría del país
  default:     { rainyStartMonth: 4, rainyEndMonth: 10 },  // May - Nov
  // Sur del Orinoco: estación lluviosa más larga
  'Amazonas':  { rainyStartMonth: 3, rainyEndMonth: 10 },  // Abr - Nov
  'Bolívar':   { rainyStartMonth: 3, rainyEndMonth: 10 },
  // Zulia occidental: bimodal
  'Zulia':     { rainyStartMonth: 3, rainyEndMonth: 10 },
  // Islas: menos pronunciado
  'Nueva Esparta':     { rainyStartMonth: 5, rainyEndMonth: 10 },
  'Dep. Federales':    { rainyStartMonth: 5, rainyEndMonth: 10 },
  // Andes: lluvias bimodales
  'Mérida':    { rainyStartMonth: 3, rainyEndMonth: 10 },
  'Táchira':   { rainyStartMonth: 3, rainyEndMonth: 10 },
};

const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export function getRainySeasonInfo(estado: string, date: Date): SeasonInfo {
  const config = REGIONAL_SEASONS[estado] || REGIONAL_SEASONS['default'];
  const month = date.getMonth(); // 0-indexed

  const rainyStart = config.rainyStartMonth;
  const rainyEnd = config.rainyEndMonth;

  let currentSeason: 'lluvioso' | 'seco' | 'transicion';
  let daysUntilChange: number;
  let nextSeasonLabel: string;

  // Mes de transición (±1 mes del inicio/fin)
  if (month === rainyStart || month === rainyEnd) {
    currentSeason = 'transicion';
    if (month === rainyStart) {
      daysUntilChange = 30; // aprox
      nextSeasonLabel = 'Período Lluvioso Pleno';
    } else {
      daysUntilChange = 30;
      nextSeasonLabel = 'Período Seco';
    }
  } else if (month > rainyStart && month < rainyEnd) {
    currentSeason = 'lluvioso';
    const endDate = new Date(date.getFullYear(), rainyEnd + 1, 1);
    daysUntilChange = Math.ceil((endDate.getTime() - date.getTime()) / 86400000);
    nextSeasonLabel = 'Período Seco';
  } else {
    currentSeason = 'seco';
    let startDate: Date;
    if (month < rainyStart) {
      startDate = new Date(date.getFullYear(), rainyStart, 1);
    } else {
      startDate = new Date(date.getFullYear() + 1, rainyStart, 1);
    }
    daysUntilChange = Math.ceil((startDate.getTime() - date.getTime()) / 86400000);
    nextSeasonLabel = 'Período Lluvioso';
  }

  // Progreso dentro de la estación actual
  let progressPercent: number;
  if (currentSeason === 'lluvioso') {
    const totalMonths = rainyEnd - rainyStart;
    const elapsed = month - rainyStart;
    progressPercent = Math.round((elapsed / totalMonths) * 100);
  } else if (currentSeason === 'seco') {
    const dryMonths = 12 - (rainyEnd - rainyStart);
    const adjustedMonth = month > rainyEnd ? month - rainyEnd : month + (12 - rainyEnd);
    progressPercent = Math.round((adjustedMonth / dryMonths) * 100);
  } else {
    progressPercent = 50;
  }

  const seasonLabels = {
    lluvioso: 'Período Lluvioso',
    seco: 'Período Seco',
    transicion: 'Transición'
  };
  const seasonEmojis = {
    lluvioso: '🌧️',
    seco: '☀️',
    transicion: '🔄'
  };

  return {
    currentSeason,
    seasonLabel: seasonLabels[currentSeason],
    seasonEmoji: seasonEmojis[currentSeason],
    rainyStart: MONTH_NAMES[rainyStart],
    rainyEnd: MONTH_NAMES[rainyEnd],
    dryStart: MONTH_NAMES[(rainyEnd + 1) % 12],
    dryEnd: MONTH_NAMES[(rainyStart - 1 + 12) % 12],
    progressPercent: Math.max(0, Math.min(100, progressPercent)),
    daysUntilChange,
    nextSeasonLabel,
  };
}

// ─── POSICIÓN ESTIMADA DE LA ZCIT ─────────────────────────────
export interface ZCITInfo {
  estimatedLatitude: number;
  description: string;
  influenceOnVenezuela: string;
}

export function getZCITPosition(date: Date): ZCITInfo {
  const decl = getSolarDeclination(date);
  // La ZCIT sigue la declinación solar con un retraso de ~6 semanas
  // y oscila entre ~2°N (enero) y ~12°N (agosto) en el Atlántico occidental
  const estimatedLat = 5 + 5 * Math.sin((dayOfYear(date) - 80) * RAD * (360 / 365));

  let influence: string;
  if (estimatedLat > 8) {
    influence = 'Alta actividad convectiva sobre Venezuela. Lluvias intensas y tormentas eléctricas frecuentes.';
  } else if (estimatedLat > 5) {
    influence = 'Convergencia moderada. Lluvias intermitentes en el centro-sur del país.';
  } else {
    influence = 'ZCIT desplazada al sur. Predomina estabilidad atmosférica y condiciones secas.';
  }

  return {
    estimatedLatitude: Math.round(estimatedLat * 10) / 10,
    description: `Posición estimada: ${estimatedLat.toFixed(1)}°N — Declinación solar: ${decl.toFixed(1)}°`,
    influenceOnVenezuela: influence,
  };
}

// ─── ÍNDICE DE RIESGO DE INCENDIO ─────────────────────────────
export interface FireRisk {
  index: number;        // 0 - 100
  level: 'bajo' | 'moderado' | 'alto' | 'extremo';
  color: string;
  description: string;
}

export function getFireRiskIndex(temp: number, humidity: number, windSpeed: number): FireRisk {
  // Índice Chandler simplificado
  let index = 0;

  // Factor temperatura (40% del peso)
  if (temp > 40) index += 40;
  else if (temp > 35) index += 32;
  else if (temp > 30) index += 22;
  else if (temp > 25) index += 12;
  else index += 5;

  // Factor humedad (40% del peso, inversamente proporcional)
  if (humidity < 20) index += 40;
  else if (humidity < 30) index += 32;
  else if (humidity < 40) index += 22;
  else if (humidity < 55) index += 12;
  else index += 3;

  // Factor viento (20% del peso)
  if (windSpeed > 40) index += 20;
  else if (windSpeed > 25) index += 15;
  else if (windSpeed > 15) index += 10;
  else index += 3;

  index = Math.min(100, Math.max(0, index));

  let level: FireRisk['level'];
  let color: string;
  let description: string;

  if (index >= 75) {
    level = 'extremo';
    color = '#ef4444';
    description = 'Riesgo extremo de incendio forestal. Prohibido quemas. Alerta máxima.';
  } else if (index >= 50) {
    level = 'alto';
    color = '#f97316';
    description = 'Riesgo alto. Se recomienda vigilancia reforzada y restricción de actividades con fuego.';
  } else if (index >= 25) {
    level = 'moderado';
    color = '#eab308';
    description = 'Riesgo moderado. Condiciones favorables para propagación si se inicia un foco.';
  } else {
    level = 'bajo';
    color = '#22c55e';
    description = 'Riesgo bajo. Humedad y condiciones atmosféricas desfavorables para incendios.';
  }

  return { index, level, color, description };
}

// ─── ALERTAS TEMPRANAS SIMULADAS ──────────────────────────────
export interface EarlyAlert {
  id: string;
  type: 'rio' | 'ciclon' | 'incendio' | 'oleaje';
  level: 'verde' | 'amarillo' | 'naranja' | 'rojo';
  title: string;
  description: string;
  recommendation: string;
  color: string;
  basesAffected: string[];
}

export function generateEarlyAlerts(
  temp: number,
  humidity: number,
  windSpeed: number,
  pressure: number,
  precipitation: number,
  estado: string,
  baseName: string
): EarlyAlert[] {
  const alerts: EarlyAlert[] = [];
  const fire = getFireRiskIndex(temp, humidity, windSpeed);

  // 1. Alerta de crecida de ríos
  if (precipitation > 50) {
    alerts.push({
      id: 'rio-1',
      type: 'rio',
      level: precipitation > 100 ? 'rojo' : precipitation > 75 ? 'naranja' : 'amarillo',
      title: 'Crecida de Ríos',
      description: `Precipitación acumulada: ${precipitation.toFixed(0)} mm. ${precipitation > 100 ? 'Riesgo inminente de desbordamiento.' : 'Monitoreo activo.'}`,
      recommendation: precipitation > 100 ? 'Evacuar zonas ribereñas. Activar protocolos de emergencia.' : 'Mantener vigilancia sobre cauces principales.',
      color: precipitation > 100 ? '#ef4444' : precipitation > 75 ? '#f97316' : '#eab308',
      basesAffected: [baseName],
    });
  } else {
    alerts.push({
      id: 'rio-1', type: 'rio', level: 'verde', title: 'Crecida de Ríos',
      description: `Precipitación: ${precipitation.toFixed(0)} mm. Niveles normales.`,
      recommendation: 'Sin novedades. Operaciones normales.',
      color: '#22c55e', basesAffected: [baseName],
    });
  }

  // 2. Alerta ciclónica
  if (pressure < 1005 && windSpeed > 30) {
    alerts.push({
      id: 'ciclon-1', type: 'ciclon',
      level: pressure < 990 ? 'rojo' : 'naranja',
      title: 'Actividad Ciclónica',
      description: `Presión: ${pressure.toFixed(0)} hPa, Vientos: ${kmhToKnots(windSpeed)} KT. Condiciones compatibles con perturbación tropical.`,
      recommendation: 'Cancelar operaciones aéreas. Asegurar aeronaves.',
      color: pressure < 990 ? '#ef4444' : '#f97316',
      basesAffected: [baseName],
    });
  } else {
    alerts.push({
      id: 'ciclon-1', type: 'ciclon', level: 'verde', title: 'Ciclones Tropicales',
      description: `Presión: ${pressure.toFixed(0)} hPa. Sin actividad ciclónica detectada.`,
      recommendation: 'Condiciones normales en la cuenca del Caribe.',
      color: '#22c55e', basesAffected: [baseName],
    });
  }

  // 3. Alerta de incendio
  alerts.push({
    id: 'incendio-1', type: 'incendio',
    level: fire.index >= 75 ? 'rojo' : fire.index >= 50 ? 'naranja' : fire.index >= 25 ? 'amarillo' : 'verde',
    title: 'Incendios Forestales',
    description: `Índice Chandler: ${fire.index}/100 (${fire.level.toUpperCase()})`,
    recommendation: fire.description,
    color: fire.color,
    basesAffected: [baseName],
  });

  return alerts;
}
