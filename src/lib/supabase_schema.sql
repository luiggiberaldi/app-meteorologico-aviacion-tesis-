-- Schema Updates for SERMETAVIA National Expansion

-- 1. Crear tabla de bases_aereas
CREATE TABLE IF NOT EXISTS public.bases_aereas (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(10) UNIQUE NOT NULL, -- Ej: 'SVBS'
  nombre VARCHAR(255) NOT NULL,
  ciudad VARCHAR(100),
  estado VARCHAR(100),
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  altitud INTEGER, -- Elevación en pies (ft)
  tipo VARCHAR(20) DEFAULT 'military', -- 'military', 'civil'
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Insertar las 5 bases principales por defecto
INSERT INTO public.bases_aereas (codigo, nombre, ciudad, estado, latitud, longitud, altitud, tipo)
VALUES 
  ('SVBS', 'Base Aérea Logística Baragua', 'Maracay', 'Aragua', 10.2475, -67.5953, 1400, 'military'),
  ('SVBL', 'Base Aérea Libertador', 'Palo Negro', 'Aragua', 10.1833, -67.5500, 1420, 'military'),
  ('SVFM', 'Base Aérea Gral. Francisco de Miranda', 'Caracas', 'Miranda', 10.4833, -66.8500, 2743, 'military'),
  ('SVMC', 'Base Aérea Mayor Gral. Rafael Urdaneta', 'Maracaibo', 'Zulia', 10.5500, -71.7333, 213, 'military'),
  ('SVBC', 'Base Aérea Mariscal Sucre', 'Barcelona', 'Anzoátegui', 10.1167, -64.6833, 13, 'military')
ON CONFLICT (codigo) DO NOTHING;

-- 3. Modificar weather_logs para aceptar el ID de la base
-- OJO: Si tienes tabla weather_logs, habilitar esto:
/*
ALTER TABLE public.weather_logs 
ADD COLUMN IF NOT EXISTS base_id INTEGER REFERENCES public.bases_aereas(id);

-- Opcionalmente, asignar todos los logs viejos a Baragua (ID suponiendo que sea 1 o buscando su ID)
UPDATE public.weather_logs
SET base_id = (SELECT id FROM public.bases_aereas WHERE codigo = 'SVBS')
WHERE base_id IS NULL;
*/

-- 4. Modificar RLS o políticas si es necesario (Opcional, de acuerdo a la config de tu BD)
-- ALTER TABLE public.bases_aereas ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Bases are visible to everyone" ON public.bases_aereas FOR SELECT USING (true);
