# Roadmap por fases con Supabase

## Fase 1 – Setup y UI base “Baragua” (COMPLETADA)
**Objetivo:** Tener el cascarón funcional del sistema, alineado con el título y contexto de la tesis.

---

## Fase 2: Diseño de Base de Datos en Supabase
**Objetivo técnico:** Establecer la estructura de persistencia en la nube utilizando Supabase para almacenar el historial de clima y los resultados del cuestionario.
**Tareas:**
- Crear la tabla `weather_logs` para registrar los reportes meteorológicos con su timestamp.
- Crear la tabla `survey_responses` para almacenar los resultados dicotómicos del personal.
- Configurar las políticas base (sin RLS complejo aún, asumiendo ambiente de desarrollo/tesis).
**Test Fase 2:**
- Desde el panel de Supabase o usando el MCP, verificar que las tablas existen con los tipos de datos correctos.
- Insertar una fila de prueba manual en cada tabla y leerla exitosamente.

---

## Fase 3: Persistencia del pronóstico actual
**Objetivo técnico:** Conectar el módulo "Pronóstico Actual" a Supabase para que guarde un registro histórico cada vez que se obtienen/actualizan los datos meteorológicos en la plataforma.
**Tareas:**
- Instalar y configurar el cliente de Supabase en Next.js (`@supabase/supabase-js`).
- Modificar el flujo de obtención de datos (actualmente Fase 2 original) para que, tras buscar el clima en la API (ej. Open-Meteo), ejecute un `INSERT` en la tabla `weather_logs`.
- Implementar manejo de errores silencioso (si falla el guardado, no debe romper la visualización del clima actual).
**Test Fase 3:**
- Al presionar "Actualizar" o al cargar el dashboard, verificar en la consola de Supabase que ha aparecido una nueva fila en `weather_logs` con los datos exactos que se reflejan en pantalla.

---

## Fase 4: Persistencia del cuestionario “Baragua”
**Objetivo técnico:** Hacer que el formulario dicotómico sea funcional y guarde las respuestas reales de los usuarios/encuestados en la base de datos.
**Tareas:**
- Reemplazar el "placeholder" del Cuestionario Baragua por un formulario real en Next.js con manejo de estado (React Server Actions o Route Handlers).
- Al hacer submit, insertar un registro en `survey_responses` mapeando los 7 ítems (booleanos) a las columnas de la tabla.
- Mostrar estado de carga (loading) y mensaje de éxito o error al guardar.
**Test Fase 4:**
- Llenar el cuestionario en la interfaz, enviarlo, y constatar que aparece la pantalla de "Éxito".
- Revisar la tabla `survey_responses` en Supabase y confirmar que los `true`/`false` coinciden con lo seleccionado.

---

## Fase 5: Pantallas de historial y reportes
**Objetivo técnico:** Construir la visualización y exportación de la información recolectada histórica para cumplir con los requerimientos de análisis cuantitativo de la tesis.
**Tareas:**
- Crear la vista de "Historial Meteorológico" que consulte los últimos registros de `weather_logs` y los presente en una tabla de datos.
- Construir el gráfico de resultados del cuestionario (usando Recharts o similar) extrayendo un `SELECT` consolidado (conteo de Sí/No) de `survey_responses`.
- Implementar la exportación/impresión de estas pantallas (window.print o PDF básico).
**Test Fase 5:**
- Navegar a la pestaña Historial/Reportes y observar la data histórica renderizada correctamente sin crasheos.
- La función de "Imprimir/Exportar" activa el diálogo nativo del navegador con el diseño limpio y formateado con cabecera de la Base.

---

## Fase 6: Ajustes de seguridad básicos
**Objetivo técnico:** Preparar la aplicación prototipo para la presentación, asegurando las tablas frente a escrituras/lecturas públicas no deseadas.
**Tareas:**
- Activar Row Level Security (RLS) en las tablas de Supabase.
- Configurar políticas básicas (ej. permitir lecturas anónimas pero escrituras solo autenticadas, o dejar abierto vía clave anónima pero restringiendo operaciones DELETE/UPDATE a roles de base de datos).
**Test Fase 6:**
- Intentar borrar registros directamente desde un cliente sin privilegios (debe denegarse el acceso).
- La aplicación sigue pudiendo insertar datos con las llaves proporcionadas.
