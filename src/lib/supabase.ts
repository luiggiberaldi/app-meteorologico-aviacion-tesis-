import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Faltan variables NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==========================================
// NOTA ACADÉMICA - FASE 6 (Seguridad)
// ==========================================
// El cliente inicializado arriba usa la 'anon_key', lo cual es suficiente
// para un prototipo interactivo. En un entorno productivo de la Aviación,
// se exigirían validaciones de dominio (CORS estrictos en Supabase) y  
// políticas RLS (Row Level Security) activadas en la base de datos para
// evitar accesos no autorizados a las inserciones de datos.
