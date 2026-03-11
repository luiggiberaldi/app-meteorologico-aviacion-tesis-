# Manual Técnico y de Arquitectura - SERMETAVIA Baragua

## 1. Introducción y Público Objetivo
Este documento está dirigido a los desarrolladores, mantenedores técnicos y al equipo de Tecnologías de la Información (TI) de la Base Aérea Logística BARAGUA. 
Proporciona la documentación de fondo sobre cómo está estructurada la plataforma web de meteorología, el flujo de datos y cómo administrar/extender la funcionalidad.

## 2. Arquitectura General
El proyecto sigue una arquitectura sin servidor (Serverless) separada en Frontend (Capa de Presentación) y Backend-as-a-Service (BaaS).
- **Capa Cliente (Frontend):** Se basa en **Next.js 14+ (App Router)** usando componentes interactivos de `React` etiquetados con la directiva `"use client"`, utilizando **Tailwind CSS** para un diseño `UI Dark Mode` eficiente.
- **Capa de Datos y Autenticación (Backend):** Utiliza **Supabase**, que expone interfaces API y WebSockets encima de un motor subyacente de base de datos **PostgreSQL**.

### Capacidades PWA (Progressive Web App)

El sistema está configurado como PWA instalable, permitiendo:
- Instalación directa en escritorio y dispositivos móviles sin pasar por tiendas de aplicaciones.
- Funcionamiento offline parcial mediante Service Workers (los módulos METAR/TAF/GAMET y alertas mantienen la última sesión cargada).
- Acceso rápido desde íconos nativos en el escritorio o pantalla de inicio del dispositivo.
- Rendimiento optimizado con caché de recursos estáticos.

**Instalación para usuarios:** Al acceder desde Chrome, Edge o Safari, aparecerá un botón "Instalar" en la barra de direcciones que permite agregar la app al sistema operativo.

### Diagrama de Arquitectura (Esquema General)

[Usuario / Navegador]
        ↓
[Next.js + React — Vercel (Frontend)]
        ↕
[Supabase / PostgreSQL (BaaS — Base de Datos + Realtime)]
        ↕
[Open-Meteo API (Datos meteorológicos externos)]

- **Frontend:** Renderiza la interfaz, consume datos y gestiona el estado del cliente.
- **Supabase:** Gestiona persistencia, canal Realtime (WebSocket) y autenticación.
- **Open-Meteo:** Provee datos meteorológicos globales vía REST API sin autenticación.

## 3. Flujo de Datos (Next.js ↔ Supabase)
El ciclo de vida de los datos se maneja vía peticiones asíncronas REST API o suscripciones a canal WebSocket.
1. Cuando se instancia la UI (e.g. `CurrentForecast.tsx`), se realiza primero un POST Request `fetch()` a `Open-Meteo API`.
2. Con los datos retornados, se hace llamada al cliente de Supabase instanciado en `@/lib/supabase.ts` (el cual utiliza las keys `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` del archivo `.env.local`).
3. El supabase-js wrapper compila estas peticiones e interactúa con la base de datos PostgreSQL, ejecutando INSERTS, DELETES o SELECTS.

## 4. Esquema de Tablas (PostgreSQL)
Existen dos entidades de gestión principales:

### `weather_logs`
Almacena la recolección horaria o periódica del área local meteorológica.
- **Columnas clave:** `id` (UUID_V4), `created_at` (Timestamp), `temperature` (Numeric), `wind_direction` (Numeric), `wind_speed` (Numeric), `pressure` (Numeric), `visibility` (Numeric), `humidity` (Numeric, ingresado recientemente).
- **Lógica:** Implementa estrategias para eludir inserciones masivas redundantes comparando la fecha de la última fila `created_at`.

### `survey_responses`
Almacena el registro exacto de las encuestas dicotómicas del personal para fines académicos y de retroalimentación de la tesis.
- **Columnas clave:** `id` (UUID), `respondent_code` (Text, Unique identifier proporcionado en el form), y 7 boolean variables correspondientes a `q1` a `q7` de la encuesta.

## 5. Componentes Clave

### A. `SurveyBaragua.tsx`
Componente asíncrono para Inserción. Posee:
- Prevención de duplicados consultando en DB el ID del `respondent_code` antes de reescribir.
- **Modal de Reset (Admin):** Interfaz altamente dinámica con 4 pasos (States: 1, 2, 3, 4). Protege un `.delete()` general sin RLS, exigiendo un string hardcodeado ("ELIMINAR") para autorizar el DROP de filas.

### B. `SurveyResults.tsx`
Módulo estadístico reactivo. 
- Realiza el cálculo matemático directo de la base instalada para conseguir el **Coeficiente de Kuder-Richardson (KR-20)** a través de las sumatorias y varianzas totales del cuestionario. Bloqueado lógicamente para activarse únicamente si en el fetch count `nResponses >= 5`.
- **Canal de Suscripción (Realtime):** Integra la directiva `.channel("realtime_survey_responses")` que invoca `on('postgres_changes', ...)` cada que detecta un INSERT o DELETE, forzando un re-fetc automático de todas las gráficas estadísticas y barras.

## 6. Consideraciones de Seguridad
Para acelerar la implementación piloto y como requerimiento académico funcional, las políticas RLS *(Row Level Security)* de PostgreSQL están en modo transparente, haciendo un bypass de credenciales e insertando datos por medio del token `anon`.
- **Producción Definitiva:** En ambiente de operaciones reales fuera de tesis, Esta configuración representa una limitación deliberada del prototipo académico, justificada por el alcance del proyecto de tesis. Es adecuada para el entorno piloto de validación y no representa un riesgo operacional en el contexto de uso controlado de la investigación.. **DEBES** configurar roles (Roles Supabase Auth), iniciar sesión en frontend (`supabase.auth.signIn()`) y activar RLS requiriendo autenticación autenticada por Bearer Tokens para mutar (INSERT/DELETE) tablas. Las de consulta pueden ser de esquema público.

## 7. Despliegue en Producción
Se recomienda el uso exclusivo de servidor PaaS en la nube, especialmente **Vercel** o **Render**, dado su matrimonio estrecho con el framework de enrutamiento Server-Side de Next.js.
1. Hacer un push de tu código a GitHub.
2. Ingresar a Vercel.com, cliquear "Add New Project" y seleccionar el repo.
3. Importar el proyecto. Antes de cliquear "Deploy", es OBLIGATORIO abrir settings (Environment Variables) y pegar desde tu `.env.local` las credenciales: 
  - `NEXT_PUBLIC_SUPABASE_URL` 
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy automatizado. El proyecto levantará un dominio propio `.vercel.app`.

## 8. Mantenimiento y Futuras Mejoras
Como toda arquitectura viva, la plataforma tiene considerables hitos de mejora continua:
- **Agregar nuevas estaciones AWOS:** Extender el Client open-meteo recibiendo dinámicamente varios arreglos de LAT/LON.
- **Variables Extra de Operaciones:** Implementar Ceiling, QNH o tipos nubes según necesidades de despachadores.
- **Refactorización de Autenticación de Usuario:** Establecer portal Login (JWT en Supabase) donde un administrador valide los resultados vía Roles en vez de ocultar el botón general en capa cliente.
