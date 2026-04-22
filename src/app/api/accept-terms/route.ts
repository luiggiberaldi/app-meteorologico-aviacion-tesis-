export const runtime = 'edge';

import { NextResponse } from 'next/server';

const DOCUMENT_VERSION = '1.0';
const DEVELOPER_EMAIL = 'luiggiberaldi94@gmail.com';
const CLIENT_EMAIL = 'veronicanaaup@gmail.com';
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_8v3SVU12_GvYRpCB938p54mtvgqLmXaGr';

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'SERMETAVIA <onboarding@resend.dev>',
      to,
      subject,
      html,
    }),
  });
  return res.ok;
}

export async function POST(req: Request) {
  try {
    const { fullName, userAgent } = await req.json();
    const email = CLIENT_EMAIL;

    const acceptedAt = new Date().toISOString();
    const ip = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'desconocida';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    // 1. GUARDAR EN SUPABASE
    const dbRes = await fetch(`${supabaseUrl}/rest/v1/legal_acceptances`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        email,
        full_name: fullName || null,
        ip_address: ip,
        user_agent: userAgent,
        document_version: DOCUMENT_VERSION,
        accepted: true,
        accepted_at: acceptedAt,
      }),
    });

    if (!dbRes.ok) {
      return NextResponse.json({ error: 'Error al guardar aceptación.' }, { status: 500 });
    }

    const fechaLegible = new Date(acceptedAt).toLocaleString('es-VE', {
      timeZone: 'America/Caracas',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const htmlCliente = `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#0f172a;color:#e2e8f0;padding:32px;border-radius:12px">
        <div style="text-align:center;margin-bottom:24px">
          <h1 style="color:#10b981;font-size:22px;margin:0">SERMETAVIA</h1>
          <p style="color:#94a3b8;font-size:13px;margin:4px 0">Plataforma Meteorológica Aeronáutica</p>
        </div>
        <h2 style="color:#f1f5f9;font-size:16px">Confirmación de Aceptación de Términos Legales</h2>
        <p style="color:#cbd5e1;font-size:14px;line-height:1.6">
          Este correo confirma que usted ha aceptado los <strong>Términos y Condiciones de Uso</strong> de la plataforma SERMETAVIA,
          quedando constancia electrónica de dicha aceptación conforme a la <strong>Ley de Mensajes de Datos y Firmas Electrónicas</strong>
          de la República Bolivariana de Venezuela (G.O. N° 37.148, 2001).
        </p>
        <div style="background:#1e293b;border-radius:8px;padding:16px;margin:20px 0;border-left:4px solid #10b981">
          ${fullName ? `<p style="margin:4px 0;font-size:13px;color:#94a3b8"><strong style="color:#e2e8f0">Nombre completo:</strong> ${fullName}</p>` : ''}
          <p style="margin:4px 0;font-size:13px;color:#94a3b8"><strong style="color:#e2e8f0">Correo registrado:</strong> ${email}</p>
          <p style="margin:4px 0;font-size:13px;color:#94a3b8"><strong style="color:#e2e8f0">Fecha y hora:</strong> ${fechaLegible} (hora de Venezuela)</p>
          <p style="margin:4px 0;font-size:13px;color:#94a3b8"><strong style="color:#e2e8f0">Dirección IP:</strong> ${ip}</p>
          <p style="margin:4px 0;font-size:13px;color:#94a3b8"><strong style="color:#e2e8f0">Versión del documento:</strong> ${DOCUMENT_VERSION}</p>
        </div>
        <p style="color:#64748b;font-size:12px;margin-top:24px;border-top:1px solid #1e293b;padding-top:16px">
          Este es un mensaje automático generado por la plataforma SERMETAVIA. Consérvelo como comprobante de aceptación.
        </p>
      </div>
    `;

    const htmlDesarrollador = `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#0f172a;color:#e2e8f0;padding:32px;border-radius:12px">
        <h2 style="color:#10b981">Nueva aceptación de términos — SERMETAVIA</h2>
        <div style="background:#1e293b;border-radius:8px;padding:16px;margin:16px 0">
          ${fullName ? `<p style="margin:4px 0;font-size:14px"><strong>Nombre completo:</strong> ${fullName}</p>` : ''}
          <p style="margin:4px 0;font-size:14px"><strong>Correo:</strong> ${email}</p>
          <p style="margin:4px 0;font-size:14px"><strong>Fecha/hora (VE):</strong> ${fechaLegible}</p>
          <p style="margin:4px 0;font-size:14px"><strong>IP:</strong> ${ip}</p>
          <p style="margin:4px 0;font-size:14px"><strong>User Agent:</strong> ${userAgent}</p>
          <p style="margin:4px 0;font-size:14px"><strong>Versión doc:</strong> ${DOCUMENT_VERSION}</p>
        </div>
        <p style="color:#64748b;font-size:12px">Registro guardado en Supabase · tabla legal_acceptances</p>
      </div>
    `;

    // 2. ENVIAR CORREOS (en paralelo, sin bloquear si falla)
    await Promise.allSettled([
      sendEmail(email, 'SERMETAVIA — Confirmación de aceptación de términos legales', htmlCliente),
      sendEmail(DEVELOPER_EMAIL, `[SERMETAVIA] Nueva aceptación de términos — ${fullName || email}`, htmlDesarrollador),
    ]);

    return NextResponse.json({ ok: true, acceptedAt });

  } catch (error: any) {
    console.error('[ACCEPT-TERMS ERROR]', error.message);
    return NextResponse.json({ error: 'Error interno.' }, { status: 500 });
  }
}
