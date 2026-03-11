# Manual de Usuario - Plataforma SERMETAVIA Baragua

## 1. Introducción
El presente manual tiene como propósito orientar al personal de meteorología de la Base Aérea Logística BARAGUA en el uso correcto y eficiente de la Plataforma Web de Meteorología Aeronáutica. A continuación se describen los módulos disponibles y los procedimientos para su operación.

## 2. Requisitos para el Usuario
- Una computadora, tablet o teléfono inteligente con conexión a internet estable.
- Un navegador web moderno actualizado (Google Chrome, Mozilla Firefox, Microsoft Edge o Safari).
- El enlace de acceso a la plataforma proporcionado por la Base.

## 3. Acceso al Sistema
La dirección de acceso al sistema es: https://sermetavia-baragua.vercel.app
Para ingresar al sistema, únicamente necesita abrir el enlace web en su navegador. La plataforma está diseñada de forma inmediata (sin pantallas de inicio de sesión complejas por ahora) para permitir una rápida consulta operativa 24/7. 

### 3.1 Instalación como Aplicación (Opcional)

Si desea tener acceso más rápido al sistema sin abrir el navegador cada vez:

1. Abra la URL https://sermetavia-baragua.vercel.app en Chrome, Edge o Safari.
2. Busque el ícono de "Instalar" o "Agregar a inicio" en la barra de direcciones del navegador (generalmente un símbolo de + o de descarga).
3. Haga clic en "Instalar" y confirme.
4. La aplicación aparecerá en su escritorio o menú de inicio como cualquier programa instalado.
5. A partir de ese momento, podrá abrirla directamente desde el ícono sin necesidad de abrir el navegador primero.

**Nota:** Esta instalación no requiere descargar archivos grandes ni ocupar mucho espacio. Es solo un acceso directo mejorado que funciona como aplicación nativa.

Una vez dentro, observará el Panel Principal, diseñado en tonos oscuros (modo nocturno) para reducir la fatiga visual durante las jornadas nocturnas y resaltar indicadores críticos de colores (Alertas).

## 4. Descripción de la Pantalla Principal
El lado izquierdo (o en menú deslizable en celulares) muestra la barra de navegación con enlaces rápidos a cada módulo.
El cuerpo principal de la página se divide fluidamente en módulos funcionales, con barras de desplazamiento horizontales en las tablas cuando la pantalla es pequeña.

### 4.1 Uso del Módulo de Pronóstico Actual
Al inicio del panel, verá tarjetas con la información atmosférica actual de Maracay (Temperatura, Dirección y Velocidad del Viento, Presión Atmosférica, Visibilidad y Humedad Relativa).
- **Lectura Automática**: Estos datos se actualizan solos de manera periódica.
- **Registro Automático**: Cada vez que el sistema detecta nueva información, la guarda silenciosamente en la base de datos para construir el historial climático de la Base.

### 4.2 Uso del Módulo METAR / TAF / GAMET
Esta sección es una herramienta de apoyo dedicada al manejo de los reportes estandarizados por la OACI.
1. En cada cuadro de texto, usted escribirá o pegará directamente el código METAR, TAF o GAMET recibido.
2. A medida que escribe, el sistema cuenta los caracteres y resalta en negrita/colores ciertas variables clave, facilitándole la lectura rápida a los despachadores de vuelo.

### 4.3 Uso del Módulo de Alertas Operacionales
Este panel semafórico interpreta las condiciones actuales del clima sin que usted deba calcular los riesgos manualmente.
- **VERDE**: Condiciones óptimas de vuelo.
- **AMARILLO**: Precaución (Vientos fuertes moderados o visibilidad reducida).
- **ROJO**: Riesgo alto operacional (Vientos severos, visibilidad muy reducida).
Usted solo debe verificar el panel; el color dicta de inmediato el estado actual prescrito para facilitar el despegue/aterrizaje seguro.

---

## 5. Módulos de Evaluación Institucional y Académica

### 5.1 Uso de la Encuesta (`Instrumento Baragua`)
Como parte del control de calidad y validación del sistema, se requiere la participación del personal.
**Cómo registrar una respuesta en la encuesta:**
1. Desplácese hacia abajo hasta el módulo "Cuestionario Baragua".
2. Ubique el campo de texto "Código de Identificación (Encuestado)" y escriba su identificador asignado (Por ejemplo: `TEC-05` u `OF-12`). Este código no dejará que usted vote dos veces.
3. Lea cuidadosamente las 7 preguntas mostradas en pantalla.
4. Elija `Sí` o `No` haciendo clic en el círculo correspondiente para **cada una** de las preguntas.
5. Al verificar que respondió todo, presione el botón verde **"Enviar Respuestas"**.
6. Aparecerá un icono verde confirmando que su respuesta fue enviada.

### 5.2 Consulta de Resultados y Reportes
Más abajo, encontrará la sección de reportes gerenciales:
- **Historial de Clima:** Una tabla que lista los parámetros pasados registrados por el sistema.
- **Resultados de Encuesta:** Gráficos de barras automáticas representando la proporción total de votaciones de "Sí" y "No".
- **Confiabilidad (KR-20):** Por debajo de las gráficas verá un número estadístico (ejemplo: 0.85). Si está por encima de 0.70 indicará que cuenta con un "Instrumento Confiable". *Nota: Este indicador solo aparece después de que participan al menos 5 personas.*

### 5.3 Impresión
En la cabecera superior de toda la pantalla encontrará el botón **"Imprimir Resumen"**.
Si presiona este botón, la interfaz cambiará mágicamente de oscuro a blanco y se preparará un formato limpio en A4 o Carta para que pueda anexarlo en sus reportes físicos o archivos PDF, ahorrando tinta y priorizando las tablas de historial y encuestas.

---

*Desarrollado y pensado exclusivamente para las necesidades operativas de la Base Aérea Logística BARAGUA.*

## 6. Solución de Problemas Frecuentes

**P: La página no carga o aparece en blanco.**
R: Verifique que su dispositivo tenga conexión a internet activa. Intente recargar la página presionando F5. Si el problema persiste, intente desde otro navegador.

**P: Aparece un error al enviar la encuesta.**
R: Asegúrese de haber respondido las 7 preguntas antes de presionar "Enviar Respuestas". Si el error persiste, cierre la pestaña, vuelva a abrir el sistema e intente de nuevo.

**P: El sistema indica que el código de empleado ya fue registrado.**
R: Cada código solo puede usarse una vez. Si usted no ha respondido antes y recibe este mensaje, comuníquese con el administrador del sistema.

**P: El pronóstico no muestra datos actualizados.**
R: Los datos se actualizan de forma automática y periódica. Espere unos minutos y recargue la página. Si continúa, notifique al responsable técnico de la base.
