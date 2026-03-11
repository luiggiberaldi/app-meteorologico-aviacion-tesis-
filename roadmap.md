# Roadmap por fases con tests

## Fase 1 – Setup y UI base “Baragua”
**Objetivo:** Tener el cascarón funcional del sistema, alineado con el título y contexto de la tesis.

**Incluye:**
- Proyecto Next.js + Tailwind / Shadcn UI / lo que uses en Antigravity.
- Layout oscuro estilo militar, con encabezado: “Diseño de una plataforma de pronóstico meteorológico para el control de las aeronaves por parte de la Base Aérea Logística BARAGUA, Maracay estado Aragua”.
- Secciones vacías (placeholders) para:
  - Módulo “Pronóstico actual” (viento, visibilidad, presión QNH, nubosidad, temperatura).
  - Módulo “Pronósticos METAR / TAF / GAMET”.
  - Módulo “Alertas operacionales”.
  - Módulo “Cuestionario Baragua” (para el instrumento dicotómico de 7 ítems).
  - Módulo “Reportes / Exportación”.

**Test Fase 1:**
- El dashboard carga sin errores.
- Es totalmente responsivo (PC y móvil).
- Todas las secciones placeholder están visibles con títulos correctos.

**Prompt sugerido Fase 1 para Antigravity:**
> Actúa como experto en Next.js + Tailwind. Crea la base de una plataforma web tipo dashboard oscuro para la “Base Aérea Logística BARAGUA” en Maracay, Venezuela, basada en una tesis titulada “Diseño de una plataforma de pronóstico meteorológico para el control de las aeronaves por parte de la Base Aérea Logística BARAGUA, Maracay estado Aragua”.
> Requerimientos de esta fase (solo estructura y UI, sin lógica de datos aún):
>
> - Usa Next.js con app router y Tailwind CSS.
> - Crea un layout principal con barra lateral y topbar estilo militar (tonos negro, gris oscuro, acentos verde y ámbar).
> - Añade secciones claramente separadas para:
>   - “Pronóstico actual” (viento, visibilidad, presión QNH, nubosidad, temperatura).
>   - “METAR / TAF / GAMET”.
>   - “Alertas operacionales”.
>   - “Cuestionario Baragua (7 ítems Sí/No)”.
>   - “Reportes y exportación”.
> - Deja componentes placeholder con textos de ejemplo y tarjetas vacías para los datos.
> - Asegúrate de que todo sea responsivo (desktop y mobile).
>
> Genera el código de la estructura de archivos y de la página principal del dashboard sin integrar aún APIs ni lógica compleja.

## Fase 2 – Integración de datos en tiempo real (clima)
**Objetivo:** Mostrar datos meteorológicos reales para el área de Maracay / Baragua en el módulo “Pronóstico actual”.

**Incluye:**
- Llamada a API gratuita (p.ej. Open-Meteo o similar) usando coordenadas aproximadas de Baragua (Maracay).
- Mostrar: viento (velocidad/dirección), visibilidad (si la API lo permite o aproximación), temperatura, presión QNH (o equivalente) y nubosidad.
- Actualización automática cada X minutos o botón “Actualizar”.

**Test Fase 2:**
- Al cargar el dashboard con conexión a internet, se muestran valores reales (no hardcode).
- Si la API falla, se muestra un mensaje de error controlado, no rompe la app.

**Prompt sugerido Fase 2:**
> Ahora toma el dashboard creado en la fase anterior y agrega integración real de datos meteorológicos.
> Objetivo: Llenar el módulo “Pronóstico actual” con datos en tiempo real para la zona de Maracay / Base Aérea Logística Baragua (aprox. lat 10.24, lon -67.59).
>
> Requerimientos:
>
> - Usa una API meteorológica gratuita (por ejemplo Open-Meteo u otra que no requiera clave para pruebas).
> - Obtén al menos: velocidad y dirección del viento, temperatura, presión atmosférica (usar el campo más cercano a QNH) y nubosidad.
> - Mapea esos datos a las tarjetas del módulo “Pronóstico actual” ya creadas.
> - Implementa manejo de estados: cargando, éxito, error.
> - Estructura la llamada en un hook o servicio separado para poder cambiar de API en el futuro.
> - Actualiza los datos automáticamente cada 5 minutos o agrega un botón “Actualizar datos”.
>
> Ajusta solo los archivos necesarios, manteniendo el estilo visual militar definido en la fase anterior.

## Fase 3 – Lógica aeronáutica básica y alertas
**Objetivo:** Simular la “inteligencia” que la tesis menciona (modelos predictivos, redes neuronales, etc.) mediante reglas lógicas simples para el prototipo.

**Incluye:**
- Componente “Traductor METAR simple”: text area donde el usuario pega un METAR y el sistema:
  - Extrae viento, visibilidad, nubes básicas.
  - Muestra un resumen en lenguaje humano (ej: “Viento 090° a 12 KT, visibilidad 6 km, nubes dispersas a 2000 ft”).
- Sistema de alertas visuales:
  - Verde: condiciones seguras VFR.
  - Amarillo: condiciones marginales.
  - Rojo: condiciones no seguras para operación (reglas simples, ej. visibilidad < X, viento > Y nudos, etc.).

**Test Fase 3:**
- Simulas un METAR con viento fuerte y baja visibilidad y ves que cambia a alerta roja.
- Cuando los parámetros están dentro de rangos normales, el estado pasa a verde.

**Prompt sugerido Fase 3:**
> Extiende el dashboard añadiendo lógica aeronáutica básica para METAR y alertas.
> Requerimientos:
>
> - Crea un componente “Traductor METAR” donde el usuario pega un código METAR completo en un textarea.
> - Implementa un parser simple en JavaScript (no hace falta 100% de cobertura) que extraiga: viento (dirección/velocidad), visibilidad en metros, nubosidad básica, temperatura y presión.
> - Muestra debajo un resumen en lenguaje claro, orientado a control de aeronaves (ejemplos: “Viento cruzado fuerte”, “Visibilidad reducida”, etc.).
> - Agrega un sistema de alertas visuales con estados Verde / Amarillo / Rojo dependiendo de umbrales configurables (por ejemplo: visibilidad < 4000 m o viento > 25 KT = rojo).
> - Usa componentes ya existentes del dashboard (tarjetas, badges, etc.) para mostrar el estado de alerta.
> - Mantén el código modular para que en el futuro pueda ser reemplazado por modelos predictivos más complejos.

## Fase 4 – Módulo cuestionario Baragua (instrumento dicotómico)
**Objetivo:** Representar el instrumento de recolección de datos (cuestionario dicotómico Sí/No de 7 ítems) que describe el marco metodológico.

**Incluye:**
- Formulario con 7 preguntas (puedes usar las dimensiones/indicadores de la tabla de “Operacionalización de variables”: pronóstico, registros, control, operaciones, etc.).
- Tipo de respuesta: radio buttons “Sí / No” por ítem.
- Al enviar:
  - Mostrar un resumen: porcentaje de respuestas “Sí”.
  - Gráfico sencillo (barra o donuts) con conteo de Sí/No.

**Test Fase 4:**
- Puedes completar el cuestionario, enviar y ver el gráfico sin errores.
- Si dejas ítems sin responder, el sistema muestra validación.

**Prompt sugerido Fase 4:**
> Agrega al dashboard el módulo “Cuestionario Baragua (7 ítems Sí/No)” basado en el instrumento dicotómico descrito en la tesis.
> Requerimientos:
>
> - Crea un formulario con 7 preguntas cerradas de tipo Sí/No, representando dimensiones como: situación actual del pronóstico, registros, control de operaciones, efectividad, pasos de diseño, técnicas y resultados (puedes redactar en lenguaje simple).
> - Cada ítem se responde con radio buttons “Sí” y “No”.
> - Al enviar el formulario, muestra:
>   - Un resumen numérico de cuántos “Sí” y cuántos “No”.
>   - Un gráfico (puede ser un simple gráfico de barras con una librería ligera) comparando Sí vs No.
> - Valida que todos los ítems estén respondidos antes de permitir enviar.
> - No uses backend ni base de datos en esta fase, maneja todo en estado local.

## Fase 5 – Reporte para tesis (exportación simple)
**Objetivo:** Darles algo que parezca “capítulo V – propuesta” hecho software: un reporte descargable con el estado actual.

**Incluye:**
- Botón “Generar reporte” en el módulo de Reportes.
- El reporte puede ser:
  - Versión simple: nueva página imprimible (usa window.print) con:
    - Datos actuales del clima.
    - Estado de alerta.
    - Resultado del cuestionario (Sí/No, y totales).
  - Si quieres ir más allá: generar PDF en cliente con una lib (jsPDF o similar), pero con plantillas sencillas.

**Test Fase 5:**
- Haces clic en “Generar Reporte” y obtienes un documento legible listo para imprimir o guardar como PDF desde el navegador.
- Incluye fecha/hora y nombre de la base: “Base Aérea Logística BARAGUA, Maracay – Estado Aragua”.

**Prompt sugerido Fase 5:**
> Implementa el módulo de “Reportes y exportación” para el dashboard.
> Requerimientos:
>
> - Agrega un botón “Generar reporte” que construya una vista imprimible con:
>   - Fecha y hora actuales.
>   - Nombre de la unidad: “Base Aérea Logística BARAGUA, Maracay – Estado Aragua”.
>   - Los datos más recientes del módulo “Pronóstico actual”.
>   - El estado de alerta (Verde/Amarillo/Rojo).
>   - Un resumen del último resultado del “Cuestionario Baragua” (conteo de Sí/No).
> - Implementa la opción de imprimir o guardar como PDF usando las capacidades nativas del navegador (diseña la vista con CSS para que se imprima bien).
> - Mantén el estilo sobrio y formal, alineado con una tesis militar.

## 2. Prompt maestro inicial (para arrancar todo el proyecto)
Si quieres que Antigravity arranque de una sola vez con la visión completa y luego ir refinando por fases:

> Actúa como un experto desarrollador de software para aviación militar y un arquitecto de dashboards. Vamos a construir, por fases, una plataforma web de pronóstico meteorológico para el control de aeronaves, basada en una tesis titulada “Diseño de una plataforma de pronóstico meteorológico para el control de las aeronaves por parte de la Base Aérea Logística BARAGUA, Maracay estado Aragua”.
>
> Contexto clave de la tesis:
> - Organización: Base Aérea Logística Baragua, Maracay, Estado Aragua, componente de la Aviación Militar Bolivariana.
> - Problema: análisis meteorológico actual limitado en rapidez, precisión y acceso a datos en tiempo real; información dispersa y obtenida de forma manual.
> - Objetivo general: diseñar una plataforma de pronóstico meteorológico para el control de aeronaves en Baragua que automatice la recopilación, procesamiento y visualización de datos para mejorar la toma de decisiones.
> - Alcances: recopilar y procesar datos históricos y en tiempo real, aplicar modelos predictivos (en este prototipo se simularán con reglas lógicas), generar alertas y recomendaciones, y visualizar la información mediante dashboards interactivos y reportes automatizados.
>
> Stack deseado: Next.js + Tailwind CSS (PWA, tema oscuro estilo militar) con componentes modulares para:
> - Pronóstico actual (viento, visibilidad, QNH, nubosidad, temperatura).
> - Visualizador / traductor de METAR / TAF / GAMET.
> - Sistema de alertas visuales (Verde/Amarillo/Rojo).
> - Módulo de cuestionario dicotómico de 7 ítems (Sí/No) para el personal de pronóstico.
> - Módulo de reportes imprimibles / exportables para la defensa de tesis.
>
> Fase actual: genera solo la estructura base del proyecto y la UI principal con todos los módulos como placeholders, totalmente responsivos, sin integrar aún APIs ni lógica de negocio. Después iremos iterando fase por fase.
>
> Entrega: código completo del layout principal, páginas y componentes iniciales necesarios para este dashboard.
