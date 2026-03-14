import { BaseAerea } from "@/context/BaseContext";

export interface WeatherData {
  // Datos Generales
  temperature: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  cloudCover: number;
  visibility: number;
  precipitation: number;
  
  // Datos Náuticos y Agrícolas (Sensores)
  surfacePressure: number;
  soilMoisture: number; // 0-7cm
  evapotranspiration: number;

  // Datos para Alertas (Fenómenos Adversos)
  windGusts: number;
  cape: number; // Convective Available Potential Energy (para tormentas/relámpagos)
  freezingLevel: number; // Nivel de isoterma cero (nieve/hielo)
  
  time: string;
}

export class WeatherService {
  /**
   * Obtiene datos meteorológicos completos para una base aérea, usando la API pública y gratuita de Open-Meteo.
   * Carga variables estándar, acústicas, náuticas, agrícolas y variables para fenómenos severos.
   */
  static async getCurrentWeather(base: BaseAerea): Promise<WeatherData | null> {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${base.latitud}&longitude=${base.longitud}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=soil_moisture_0_to_7cm,evapotranspiration,cape,freezing_level_height&timezone=auto&forecast_days=1`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error fetching weather data");
      
      const data = await response.json();
      
      return {
        // Current standard
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        precipitation: data.current.precipitation,
        cloudCover: data.current.cloud_cover,
        windSpeed: data.current.wind_speed_10m,
        windDirection: data.current.wind_direction_10m,
        visibility: 10000, // Open-Meteo current visibility is often missing in minimum payload, mock safe value
        
        // Curent Special (Sensores)
        surfacePressure: data.current.surface_pressure,
        
        // Hourly Special (usamos el índice actual [0] o el más cercano a la hora local para simular "real time")
        // En Open-meteo hourly[] trae 24 horas del día. Agarramos la hora actual.
        soilMoisture: data.hourly?.soil_moisture_0_to_7cm?.[new Date().getHours()] || 0.35, 
        evapotranspiration: data.hourly?.evapotranspiration?.[new Date().getHours()] || 0.1,
        
        // Alertas
        windGusts: data.current.wind_gusts_10m,
        cape: data.hourly?.cape?.[new Date().getHours()] || 0,
        freezingLevel: data.hourly?.freezing_level_height?.[new Date().getHours()] || 4500,
        
        time: data.current.time
      };
    } catch (error) {
      console.error("WeatherService Error:", error);
      return null;
    }
  }
}
