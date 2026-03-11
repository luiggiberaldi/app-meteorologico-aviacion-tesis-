# Plataforma Meteorológica SERMETAVIA - Base Aérea Logística BARAGUA
[![Deploy en Vercel](https://vercel.com/button)](https://app-meteorologico-aviacion-tesis.vercel.app)

## Descripción General
Esta aplicación web es el resultado de un proyecto de tesis enfocado en el diseño de una plataforma de pronóstico meteorológico para apoyar el control de las aeronaves por parte del Servicio de Meteorología de la Aviación (SERMETAVIA) en la Base Aérea Logística BARAGUA, ubicada en Maracay, estado Aragua. 

El sistema consolida información en tiempo real, decodificación de reportes estándar e instrumentos de validación académica en una sola interfaz moderna, oscura y responsiva pensada para entornos operativos 24/7.

## Stack Tecnológico
El proyecto está construido bajo una arquitectura moderna de frontend acoplada a un Backend-as-a-Service (BaaS):
- **Framework:** Next.js (App Router)
- **Librería UI:** React 18
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Base de Datos & Auth:** Supabase (PostgreSQL)
- **API Externa:** Open-Meteo API (Datos meteorológicos globales)

## Requisitos del Sistema
Para desplegar y ejecutar este proyecto, necesitas:
- **Node.js**: v18.17.0 o superior.
- **Gestor de paquetes**: npm (incluido en Node.js), yarn o pnpm.
- **Git**: Para el control de versiones.
- **Cuenta en Supabase**: Para la gestión de la base de datos PostgreSQL.

## Configuración y Despliegue Local

### 1. Clonar el repositorio
Abre una terminal y ejecuta:
```bash
git clone https://github.com/luiggiberaldi/app-meteorologico-aviacion-tesis-
cd app-meteorologico-aviacion-tesis-
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crea un archivo llamado `.env.local` en la raíz del proyecto y añade las siguientes variables proporcionadas por tu proyecto de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-id-de-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-publica
```

### 4. Entorno de Desarrollo
Para correr el servidor local con recarga en caliente:
```bash
npm run dev
```
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### 5. Compilación y Producción
Para desplegar el sistema verificando que no existan errores de código o TypeScript:
```bash
npm run build
npm start
```

## Estructura de Carpetas Principal
- `/src/app/`: Define el enrutador principal de Next.js (App Router), el layout general (`layout.tsx`), navegación (`Sidebar.tsx`, `Topbar.tsx`), estilos globales y la página principal (`page.tsx`).
- `/src/components/`: Contiene la lógica modular y visual. Todos los bloques de la aplicación son componentes Client-Side de React (`.tsx`).
- `/src/lib/`: Librerías de utilidades, incluyendo la inicialización del cliente de Supabase (`supabase.ts`).
- `/docs/`: Manuales técnicos y de usuario del sistema (documentación de la tesis).
- `/public/`: Recursos estáticos.

## Módulos del Sistema

1. **Pronóstico Actual (`CurrentForecast`)**: Se conecta a la API de Open-Meteo usando las coordenadas de Maracay y registra variables (Temperatura, Viento, Humedad Relativa) en la base de datos de manera automática.
2. **METAR / TAF / GAMET (`MetarTafGamet`)**: Interfaz para transcribir y resaltar reportes aeronáuticos oficiales codificados, facilitando su legibilidad en la base.
3. **Alertas Operacionales (`OperationalAlerts`)**: Sistema semafórico que analiza los datos de viento y visibilidad para generar advertencias automáticas a las operaciones aéreas.
4. **Encuesta de Validación (`SurveyBaragua`)**: Instrumento metodológico de 7 ítems dicotómicos integrado directamente en el software. Incluye un módulo seguro para administradores.
5. **Dashboard de Reportes (`ReportDashboard`)**: Consolida la tabla histórica de datos meteorológicos y los resultados estadísticos (incluyendo cálculo del coeficiente KR-20) listos para impresión.
