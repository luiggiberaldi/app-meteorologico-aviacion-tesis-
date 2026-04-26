# Guía de Usuario - AEROMETRIX

Bienvenido a la Guía de Usuario Oficial de AEROMETRIX (Red Meteorológica Nacional). Este documento está diseñado para operadores de consola, despachadores de vuelo y meteorólogos encargados de la toma de decisiones en rampa.

## 1. Guía de Uso por Sección

### Panel de Control (Menú Lateral)
- **Pronóstico Actual**: Muestra las condiciones del tiempo en tiempo real para la base aérea seleccionada.
- **Mapa Nacional**: Muestra un mapa interactivo de Venezuela con las principales bases militares e incluye capas de precipitación, nubes y temperatura.
- **Planificación de Vuelos**: Herramienta predictiva que simula el escenario y calcula temporalidades ("Ventanas Óptimas") para despegues, analizando el rendimiento de combustible en base a posibles factores de viento.
- **METAR / TAF / GAMET**: Traductor alfanumérico para reportes aeronáuticos crudos.
- **Alertas Operacionales**: Sistema crítico de toma de decisión que genera restricciones automáticas VFR/IFR.
- **Efectividad Operacional**: Estadísticas de rendimiento aéreo cruzadas con variables de disrupción climática.
- **Gestión de Operaciones**: Supervisor de logística que contabiliza flota disponible, aeronaves en mantenimiento y próximas misiones.
- **Reportes**: Generador de expedientes meteorológicos diarios en formato PDF.

### Selector de Bases (Menú Superior)
En la parte superior de su pantalla (o dentro del botón menú en celulares), encontrará un selector que le permite cambiar el contexto global de la aplicación. Puede elegir una Base Aérea específica (Ej. *Base Aérea Libertador*) o visualizar el estado general de Venezuela escogiendo "Todas las Bases".

---

## 2. Interpretación de Códigos Meteorológicos

| Acrónimo | Significado | Función en AEROMETRIX |
| :--- | :--- | :--- |
| **METAR** | *Meteorological Terminal Air Report* | Reporte de observación meteorológica rutinaria, emitido cada hora o media hora. Describe las condiciones actuales en el aeródromo. |
| **TAF** | *Terminal Aerodrome Forecast* | Pronóstico meteorológico del aeródromo enfocado a las próximas 24 o 30 horas. Crítico para la planificación de vuelos futuros. |
| **GAMET** | *General Aviation Meteorological Forecast* | Pronóstico meteorológico de área para vuelos a baja altura (típicamente por debajo del nivel de vuelo 100). |
| **VFR** | *Visual Flight Rules* | Reglas de Vuelo Visual. Requiere condiciones de buen tiempo (techos altos y buena visibilidad (> 5km)). |
| **IFR** | *Instrument Flight Rules* | Reglas de Vuelo por Instrumentos. Requerido cuando la meteorología impide navegar con referencias visuales externas. |
| **QNH** | *Altimeter Setting* | Presión barométrica ajustada al nivel del mar. Fundamental para calibrar los altímetros de las aeronaves. |

---

## 3. Significado de las Alertas Operacionales

El módulo de alertas evalúa las condiciones actuales simulando umbrales de seguridad críticos exigidos por las regulaciones aéreas.

- 🟢 **ESTADO ÓPTIMO (Verde)**
  - *Condición:* Clima estable.
  - *Visibilidad:* > 5 km.
  - *Viento:* < 25 KT.
  - *Acción:* Operaciones normales (VFR / IFR) permitidas.

- 🟡 **PRECAUCIÓN (Amarillo)**
  - *Condición:* Condiciones marginales (ej. Nubosidad densa que amenaza bajar techos).
  - *Acción:* Extremar precaución por posibles aproximaciones frustradas. Mantener monitoreo continuo.

- 🔴 **RESTRICCIÓN OPERACIONAL (Rojo)**
  - *Condición:* Violación de un mínimo VFR.
  - *Ejemplos:* Visibilidad cae por debajo de 5 km o hay vientos cruzados mayores a 25 Nudos.
  - *Acción:* Restricción de despegues visuales. Solo IFR permitido o desvío a pistas alternativas recomendadas.

- 🛑 **ALERTA CRÍTICA (Púrpura / Intermitente)**
  - *Condición:* Peligro inminente severo.
  - *Ejemplos:* Presencia de tormentas eléctricas estáticas o en desarrollo cerca del aeródromo.
  - *Acción:* Cancelación o suspensión de toda operación aérea y prohibición de movilización de personal de rampa.

---

## 4. Preguntas Frecuentes (FAQ)

**Q1: ¿Por qué aparece un cintillo rojo que dice "Sin conexión a Internet"?**
A: AEROMETRIX es una Aplicación Web Progresiva (PWA). Si el equipo pierde señal Wi-Fi o red móvil, el sistema seguirá funcionando gracias a su Worker de Caché, mostrando el tablero tal y como estaba antes de caerse la conexión. Las gráficas no se actualizarán en vivo hasta que se restablezca el servicio.

**Q2: ¿Puedo instalar Aerometrix en mi Teléfono o Tablet?**
A: Sí. Al abrir la herramienta desde un navegador moderno (Chrome, Safari, Edge), verá una sugerencia o ícono (usualmente al lado de la barra de direcciones o en el menú central) que dice "Agregar a la Pantalla de Inicio" o "Instalar App".

**Q3: ¿Cómo exporto el reporte a PDF?**
A: Navegue al módulo "Reportes" en la barra lateral. Allí encontrará un botón verde indicando la generación automática del documento PDF foliado.

**Q4: Algunos datos en Planificación o Efectividad lucen fijos, ¿por qué?**
A: Debido a limitantes actuales donde los radares del Grupo 10 no exponen APIs públicas unificadas, secciones estadísticas como Desempeño Operativo se visualizan a través de simulaciones controladas (Mock Data) para demostrar las capacidades analíticas exigidas en las fases experimentales de la investigación aprobada. Operan como plantillas conectables para bases de datos reales.
