-- Eliminar tablas si existen (para resetear fácilmente durante la tesis)
DROP TABLE IF EXISTS weather_logs;
DROP TABLE IF EXISTS survey_responses;

-- 1. Tabla para registrar los datos meteorológicos históricos
CREATE TABLE weather_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    location TEXT DEFAULT 'BARAGUA' NOT NULL,
    wind_speed NUMERIC, -- Nudos (KT)
    wind_direction NUMERIC, -- Grados (°)
    visibility NUMERIC, -- Metros o Km
    temperature NUMERIC, -- Grados Celsius (°C)
    pressure_qnh NUMERIC, -- hPa
    cloud_cover TEXT, -- Ej: FEW, SCT, BKN, OVC
    raw_metar TEXT -- Opcional, por si se usa en la Fase 3
);

-- Comentarios descriptivos para PostgreSQL
COMMENT ON TABLE weather_logs IS 'Historial de lecturas meteorológicas para la Base Aérea Logística Baragua';

-- 2. Tabla para registrar las respuestas del cuestionario dicotómico (7 ítems)
CREATE TABLE survey_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    respondent_code TEXT, -- Identificador anónimo del encuestado (opcional)
    -- Preguntas Dicotómicas (Booleano: TRUE = Sí, FALSE = No)
    q1_forecast_current BOOLEAN NOT NULL,
    q2_records_kept BOOLEAN NOT NULL,
    q3_operations_control BOOLEAN NOT NULL,
    q4_effectiveness BOOLEAN NOT NULL,
    q5_design_steps BOOLEAN NOT NULL,
    q6_techniques BOOLEAN NOT NULL,
    q7_results_impact BOOLEAN NOT NULL,
    comments TEXT -- Comentarios adicionales u observaciones
);

-- Comentarios descriptivos
COMMENT ON TABLE survey_responses IS 'Respuestas al instrumento dicotómico de recolección de datos (Tesis Baragua)';

-- ==========================================
-- FASE 6: SEGURIDAD Y BUENAS PRÁCTICAS (RLS)
-- ==========================================
-- Nota Académica para la Defensa:
-- En un entorno de producción estricto, es obligatorio habilitar Row Level Security (RLS) 
-- para evitar escrituras y consultas no autorizadas. 
-- Aquí se documentan las políticas sugeridas que se usarían para proteger las tablas:

/*
-- 1. Habilitar RLS en ambas tablas
ALTER TABLE weather_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- 2. Política para weather_logs: 
-- Solo permitir inserciones desde el cliente autenticado (o anon)
-- Si hay un proceso backend, se usaría un rol "service_role" en lugar del acceso público.
CREATE POLICY "Permitir inserción anónima de clima" 
ON weather_logs FOR INSERT 
TO anon 
WITH CHECK (true);

-- Permitir lectura a todos (para dashboard)
CREATE POLICY "Permitir lectura pública de clima" 
ON weather_logs FOR SELECT 
TO public 
USING (true);

-- 3. Política para survey_responses:
-- Los usuarios (anon) solo pueden insertar. Nadie más que el admin puede leer esto.
CREATE POLICY "Permitir inserción de encuestas" 
ON survey_responses FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Solo Administradores pueden leer encuestas" 
ON survey_responses FOR SELECT 
TO authenticated 
USING (auth.uid() IN (SELECT id FROM admin_users)); -- Asumiendo una tabla de admins
*/
