"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sun, Moon } from "@phosphor-icons/react";

// ── Types ────────────────────────────────────────────────────────────────────

type Tab = "privacy" | "terms" | "cookies" | "data";

// ── Helpers ──────────────────────────────────────────────────────────────────

const S: Record<string, React.CSSProperties> = {
  // Shared inline styles used across the page
};

// ── Sub-components ───────────────────────────────────────────────────────────

function InfoBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "rgba(155,127,232,0.08)", border: "1px solid rgba(155,127,232,0.2)",
      borderRadius: "10px", padding: "16px 18px", margin: "16px 0",
    }}>
      <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--z-violet)", marginBottom: "6px" }}>{title}</div>
      <div style={{ fontSize: "13px", color: "var(--l-text2)", lineHeight: 1.6, fontWeight: 300 }}>{children}</div>
    </div>
  );
}

function WarningBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
      borderRadius: "10px", padding: "16px 18px", margin: "16px 0",
    }}>
      <div style={{ fontSize: "13px", fontWeight: 600, color: "#f87171", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>{title}</div>
      <div style={{ fontSize: "13px", color: "var(--l-text2)", lineHeight: 1.6, fontWeight: 300 }}>{children}</div>
    </div>
  );
}

function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ overflowX: "auto", margin: "16px 0", borderRadius: "10px", border: "1px solid var(--l-border)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
        {children}
      </table>
    </div>
  );
}

const Th = ({ children }: { children: React.ReactNode }) => (
  <th style={{
    background: "var(--l-surface2)", color: "var(--l-text2)", fontWeight: 500,
    fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase",
    padding: "10px 14px", textAlign: "left", fontFamily: "var(--font-jetbrains)",
  }}>{children}</th>
);

const Td = ({ children, colSpan }: { children: React.ReactNode; colSpan?: number }) => (
  <td colSpan={colSpan} style={{
    padding: "10px 14px", borderTop: "1px solid var(--l-border)",
    color: "var(--l-text2)", fontWeight: 300, verticalAlign: "top",
  }}>{children}</td>
);

function ContactBox({ rows }: { rows: { label: string; value: string; href?: string }[] }) {
  return (
    <div style={{
      background: "var(--l-surface)", border: "1px solid var(--l-border)",
      borderRadius: "12px", padding: "20px 22px", margin: "16px 0",
      display: "flex", flexDirection: "column", gap: "10px",
    }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "var(--l-text2)" }}>
          <span style={{ fontSize: "11px", fontFamily: "var(--font-jetbrains)", color: "var(--l-text3)", width: "80px", flexShrink: 0 }}>{r.label}</span>
          {r.href
            ? <a href={r.href} style={{ color: "var(--z-violet)", textDecoration: "none", fontWeight: 400 }}>{r.value}</a>
            : <span style={{ color: "var(--l-text)", fontWeight: 400 }}>{r.value}</span>}
        </div>
      ))}
    </div>
  );
}

function DocSection({ id, num, title, children }: { id: string; num: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} style={{ marginBottom: "48px", scrollMarginTop: "140px" }}>
      <div style={{ fontSize: "11px", fontFamily: "var(--font-jetbrains)", color: "var(--z-violet)", marginBottom: "4px", letterSpacing: ".08em" }}>{num}</div>
      <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "22px", fontWeight: 700, color: "var(--l-text)", marginBottom: "16px", letterSpacing: "-0.5px" }}>{title}</h2>
      {children}
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ color: "var(--l-text2)", fontWeight: 300, marginBottom: "12px", lineHeight: 1.7 }}>{children}</p>;
}

function Sub({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "16px", fontWeight: 600, color: "var(--l-text)", margin: "20px 0 10px" }}>{children}</h3>;
}

function UL({ children }: { children: React.ReactNode }) {
  return <ul style={{ color: "var(--l-text2)", fontWeight: 300, paddingLeft: "20px", marginBottom: "12px" }}>{children}</ul>;
}

function OL({ children }: { children: React.ReactNode }) {
  return <ol style={{ color: "var(--l-text2)", fontWeight: 300, paddingLeft: "20px", marginBottom: "12px" }}>{children}</ol>;
}

function LI({ children }: { children: React.ReactNode }) {
  return <li style={{ marginBottom: "6px", lineHeight: 1.6 }}>{children}</li>;
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code style={{
      fontFamily: "var(--font-jetbrains)", fontSize: "13px",
      background: "var(--l-surface2)", padding: "2px 6px",
      borderRadius: "4px", color: "var(--z-violet)",
    }}>{children}</code>
  );
}

// ── TOC per tab ──────────────────────────────────────────────────────────────

const TOC: Record<Tab, { label: string; href: string }[]> = {
  privacy: [
    { label: "1. Responsable", href: "#p1" },
    { label: "2. Qué datos recopilamos", href: "#p2" },
    { label: "3. Cómo los usamos", href: "#p3" },
    { label: "4. Modos de privacidad", href: "#p4" },
    { label: "5. Con quién compartimos", href: "#p5" },
    { label: "6. Retención", href: "#p6" },
    { label: "7. Tus derechos", href: "#p7" },
    { label: "8. Seguridad", href: "#p8" },
    { label: "9. Transferencias", href: "#p9" },
    { label: "10. Menores", href: "#p10" },
    { label: "11. Cambios", href: "#p11" },
    { label: "12. Contacto", href: "#p12" },
  ],
  terms: [
    { label: "1. Aceptación", href: "#t1" },
    { label: "2. El servicio", href: "#t2" },
    { label: "3. Fase Beta", href: "#t3" },
    { label: "4. Tu cuenta", href: "#t4" },
    { label: "5. Uso aceptable", href: "#t5" },
    { label: "6. Tu contenido", href: "#t6" },
    { label: "7. Limitación de responsabilidad", href: "#t7" },
    { label: "8. Precios y pagos", href: "#t8" },
    { label: "9. Propiedad intelectual", href: "#t9" },
    { label: "10. Terminación", href: "#t10" },
    { label: "11. Ley aplicable", href: "#t11" },
    { label: "12. Contacto", href: "#t12" },
  ],
  cookies: [
    { label: "1. ¿Qué son las cookies?", href: "#c1" },
    { label: "2. Cookies que usamos", href: "#c2" },
    { label: "3. Lo que NO hacemos", href: "#c3" },
    { label: "4. Gestión", href: "#c4" },
    { label: "5. Contacto", href: "#c5" },
  ],
  data: [
    { label: "1. Tabla de retención", href: "#d1" },
    { label: "2. Qué pasa al vencer", href: "#d2" },
    { label: "3. Eliminar tu cuenta", href: "#d3" },
    { label: "4. Exportar tus datos", href: "#d4" },
    { label: "5. Derecho al olvido", href: "#d5" },
    { label: "6. Contacto", href: "#d6" },
  ],
};

// ── Tab content ───────────────────────────────────────────────────────────────

function PrivacyContent() {
  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: "48px", paddingBottom: "32px", borderBottom: "1px solid var(--l-border)" }}>
        <div style={{ fontSize: "11px", fontFamily: "var(--font-jetbrains)", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--z-violet)", marginBottom: "12px" }}>Política de Privacidad</div>
        <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(32px,4vw,48px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-2px", marginBottom: "12px", color: "var(--l-text)" }}>Tus datos,<br />bajo tu control.</h1>
        <div style={{ fontSize: "13px", color: "var(--l-text2)", fontFamily: "var(--font-jetbrains)" }}>
          <span style={{ marginRight: "20px" }}>Última actualización: Abril 2026</span>
          <span>Versión 1.0 — Fase Beta</span>
        </div>
      </div>

      <InfoBox title="Resumen en una línea">
        Recopilamos solo lo necesario para prestarte el servicio. No vendemos tus datos. No mostramos publicidad. Tú controlas cuánto guarda Zaelyn a través de los modos de privacidad.
      </InfoBox>

      <DocSection id="p1" num="01" title="Responsable del tratamiento">
        <P><strong>NE América LLC</strong> (Estados Unidos) y <strong>NE México S.A. de C.V.</strong> (México), en conjunto denominadas <strong>"NE DevIA"</strong>, son las empresas responsables del tratamiento de tus datos personales a través del servicio <strong>Zaelyn</strong>.</P>
        <ContactBox rows={[
          { label: "Correo", value: "privacidad@zaelyn.ai", href: "mailto:privacidad@zaelyn.ai" },
          { label: "Web", value: "zaelyn.ai/privacidad", href: "https://zaelyn.ai/privacidad" },
          { label: "México", value: "Chihuahua, Chihuahua, México" },
          { label: "USA", value: "Houston, Texas, USA" },
        ]} />
      </DocSection>

      <DocSection id="p2" num="02" title="Qué datos recopilamos">
        <Sub>Datos que tú nos proporcionas</Sub>
        <UL>
          <LI><strong>Nombre y correo electrónico</strong> — al registrarte</LI>
          <LI><strong>Ciudad de residencia</strong> — para calcular tu zona horaria y enviarte notificaciones a la hora correcta</LI>
          <LI><strong>Contenido de tus conversaciones</strong> — mensajes que escribes a Zaelyn (según tu modo de privacidad)</LI>
          <LI><strong>Entradas de diario, metas, recordatorios y notas</strong> — que guardas en los módulos Aura, Orion, Sirius y Polaris</LI>
          <LI><strong>Preferencias de configuración</strong> — personalidad, idioma, horario del briefing, modo de privacidad</LI>
        </UL>
        <Sub>Datos que generamos automáticamente</Sub>
        <UL>
          <LI><strong>Timestamps</strong> de mensajes y acciones</LI>
          <LI><strong>Identificador de sesión</strong> — técnico, no rastreable a terceros</LI>
          <LI><strong>Metadata de uso</strong> — plan activo, módulos utilizados</LI>
        </UL>
        <Sub>Lo que NO recopilamos</Sub>
        <UL>
          <LI>Datos bancarios o de tarjetas (Stripe los gestiona independientemente)</LI>
          <LI>Geolocalización en tiempo real</LI>
          <LI>Cookies de rastreo publicitario</LI>
          <LI>Datos de terceros sin tu conocimiento</LI>
        </UL>
      </DocSection>

      <DocSection id="p3" num="03" title="Cómo usamos tus datos">
        <TableWrap>
          <thead><tr><Th>Finalidad</Th><Th>Base legal</Th></tr></thead>
          <tbody>
            <tr><Td>Prestarte el servicio de Zaelyn</Td><Td>Ejecución del contrato</Td></tr>
            <tr><Td>Enviarte el morning briefing y notificaciones</Td><Td>Ejecución del contrato</Td></tr>
            <tr><Td>Mejorar la personalización de Zaelyn</Td><Td>Interés legítimo / Consentimiento</Td></tr>
            <tr><Td>Detectar y prevenir fraude o abuso</Td><Td>Interés legítimo</Td></tr>
            <tr><Td>Cumplir obligaciones legales</Td><Td>Obligación legal</Td></tr>
            <tr><Td>Comunicarte cambios en el servicio</Td><Td>Ejecución del contrato</Td></tr>
          </tbody>
        </TableWrap>
        <P><strong>No usamos tus datos para publicidad.</strong> Zaelyn no muestra anuncios ni vende datos a terceros.</P>
      </DocSection>

      <DocSection id="p4" num="04" title="Modos de privacidad">
        <P>Zaelyn ofrece cuatro modos que tú controlas en cualquier momento desde Configuración. Cada uno define qué datos se tratan.</P>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", margin: "16px 0" }}>
          {[
            { icon: "☁️", name: "Comfort", desc: "Tus conversaciones se guardan para que Zaelyn aprenda tus patrones y mejore el briefing. Retención según tu plan." },
            { icon: "🛡️", name: "Sovereign", desc: "Zaelyn funciona normalmente en la sesión. El historial de chat se borra al cerrar sesión. Tus módulos siempre persisten." },
            { icon: "👻", name: "Phantom", desc: "Sin análisis ni historial. Zaelyn solo guarda lo que tú le pides explícitamente. Control total. Activo por defecto en Beta." },
            { icon: "🔒", name: "Full Sovereign", desc: "Todo local. Sin servidores de NE DevIA. BYOK (trae tu propia API key). Plan Pro — próximamente." },
          ].map((m) => (
            <div key={m.name} style={{ background: "var(--l-surface)", border: "1px solid var(--l-border)", borderRadius: "12px", padding: "16px" }}>
              <span style={{ fontSize: "22px", marginBottom: "8px", display: "block" }}>{m.icon}</span>
              <div style={{ fontFamily: "var(--font-syne)", fontSize: "15px", fontWeight: 700, color: "var(--l-text)", marginBottom: "6px" }}>{m.name}</div>
              <div style={{ fontSize: "13px", color: "var(--l-text2)", lineHeight: 1.55, fontWeight: 300 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="p5" num="05" title="Con quién compartimos tus datos">
        <P>Solo con proveedores necesarios para operar el servicio, bajo contratos de confidencialidad. <strong>Nunca vendemos tus datos.</strong></P>
        <TableWrap>
          <thead><tr><Th>Proveedor</Th><Th>Propósito</Th><Th>Datos compartidos</Th></tr></thead>
          <tbody>
            <tr><Td><strong>Anthropic</strong></Td><Td>Procesamiento de lenguaje natural (IA)</Td><Td>Contenido de mensajes (sin ID personal)</Td></tr>
            <tr><Td><strong>Supabase</strong></Td><Td>Base de datos y autenticación</Td><Td>Todos los datos del servicio</Td></tr>
            <tr><Td><strong>Fly.io</strong></Td><Td>Infraestructura de servidores</Td><Td>Datos en tránsito</Td></tr>
            <tr><Td><strong>Stripe</strong></Td><Td>Procesamiento de pagos</Td><Td>Email, nombre, plan</Td></tr>
            <tr><Td><strong>Resend</strong></Td><Td>Correos transaccionales</Td><Td>Email, nombre</Td></tr>
            <tr><Td><strong>Telegram</strong></Td><Td>Notificaciones (si lo activas)</Td><Td>Telegram ID, mensajes</Td></tr>
            <tr><Td><strong>Open-Meteo</strong></Td><Td>Datos meteorológicos para el briefing</Td><Td>Ciudad (sin ID personal)</Td></tr>
          </tbody>
        </TableWrap>
      </DocSection>

      <DocSection id="p6" num="06" title="Retención de datos">
        <TableWrap>
          <thead><tr><Th>Tipo de dato</Th><Th>Free</Th><Th>Essential</Th><Th>Pro / Family</Th></tr></thead>
          <tbody>
            <tr><Td>Historial de conversaciones</Td><Td>30 días</Td><Td>90 días</Td><Td>365 días</Td></tr>
            <tr><Td>Módulos (diario, metas, notas, recordatorios)</Td><Td>90 días</Td><Td>Permanente</Td><Td>Permanente</Td></tr>
            <tr><Td>Datos de cuenta</Td><Td colSpan={3}>Hasta eliminación de cuenta</Td></tr>
          </tbody>
        </TableWrap>
        <P>Al vencer la retención, el contenido de las conversaciones se elimina automáticamente. Los metadatos se conservan hasta 12 meses adicionales por razones técnicas.</P>
      </DocSection>

      <DocSection id="p7" num="07" title="Tus derechos">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", margin: "16px 0" }}>
          {[
            {
              country: "México", law: "LFPDPPP — Derechos ARCO",
              items: ["Acceso a tus datos", "Rectificación de datos incorrectos", "Cancelación (eliminación)", "Oposición al tratamiento"],
              note: "Respondemos en 20 días hábiles",
            },
            {
              country: "USA — California", law: "CCPA — California Consumer Privacy Act",
              items: ["Conocer qué datos recopilamos", "Solicitar eliminación", "No ser discriminado por ejercer derechos", "Opt-out de venta de datos (no aplicable — no vendemos)"],
              note: "Respondemos en 45 días",
            },
            {
              country: "Brasil", law: "LGPD — Lei Geral de Proteção de Dados",
              items: ["Confirmación del tratamiento", "Acceso y corrección", "Anonimización o eliminación", "Portabilidad", "Revocación del consentimiento"],
              note: null,
            },
          ].map((r) => (
            <div key={r.country} style={{ background: "var(--l-surface)", border: "1px solid var(--l-border)", borderRadius: "10px", padding: "14px" }}>
              <div style={{ fontSize: "10px", fontFamily: "var(--font-jetbrains)", color: "var(--z-violet)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "6px" }}>{r.country}</div>
              <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--l-text)", marginBottom: "8px" }}>{r.law}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {r.items.map((item) => (
                  <div key={item} style={{ fontSize: "12px", color: "var(--l-text2)", display: "flex", alignItems: "flex-start", gap: "5px" }}>
                    <span style={{ color: "var(--z-violet)", flexShrink: 0, fontSize: "10px", marginTop: "3px" }}>→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              {r.note && <p style={{ fontSize: "12px", color: "var(--l-text3)", marginTop: "10px", marginBottom: 0 }}>{r.note}</p>}
            </div>
          ))}
        </div>
        <P>Para ejercer cualquier derecho, escribe a <a href="mailto:privacidad@zaelyn.ai" style={{ color: "var(--z-violet)" }}>privacidad@zaelyn.ai</a></P>
        <P>También puedes presentar una queja ante las autoridades regulatorias de tu país:</P>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", margin: "12px 0" }}>
          {[
            { label: "INAI — México", href: "https://inai.org.mx" },
            { label: "CPPA — California", href: "https://cppa.ca.gov" },
            { label: "ANPD — Brasil", href: "https://gov.br/anpd" },
          ].map((c) => (
            <a key={c.label} href={c.href} target="_blank" rel="noreferrer" style={{
              fontSize: "12px", padding: "6px 12px", borderRadius: "8px",
              background: "var(--l-surface)", border: "1px solid var(--l-border)",
              color: "var(--l-text2)", textDecoration: "none", transition: "all .15s",
            }}>{c.label}</a>
          ))}
        </div>
      </DocSection>

      <DocSection id="p8" num="08" title="Seguridad">
        <UL>
          <LI>Cifrado en tránsito — TLS 1.3</LI>
          <LI>Cifrado en reposo en la base de datos</LI>
          <LI>Row Level Security (RLS) — cada usuario solo accede a sus propios datos</LI>
          <LI>Autenticación mediante magic links (sin contraseñas)</LI>
          <LI>Acceso restringido del equipo de NE DevIA a los datos</LI>
        </UL>
      </DocSection>

      <DocSection id="p9" num="09" title="Transferencias internacionales">
        <P>NE DevIA opera con proveedores en Estados Unidos. Si estás en México, Brasil u otros países de América Latina, tus datos pueden transferirse a servidores en USA bajo las garantías de nuestros contratos con Supabase, Fly.io y Anthropic, quienes cumplen con marcos de adecuación aplicables.</P>
      </DocSection>

      <DocSection id="p10" num="10" title="Menores de edad">
        <P>Zaelyn no está dirigido a personas menores de <strong>13 años</strong>. No recopilamos conscientemente datos de menores. Si detectamos que un menor ha creado una cuenta, eliminaremos sus datos de inmediato. Si eres padre o tutor y crees que tu hijo tiene una cuenta, escríbenos a privacidad@zaelyn.ai.</P>
      </DocSection>

      <DocSection id="p11" num="11" title="Cambios a esta política">
        <P>Notificaremos cualquier cambio material mediante correo electrónico y aviso en zaelyn.ai. Los cambios entran en vigor <strong>30 días</strong> después de la notificación.</P>
      </DocSection>

      <DocSection id="p12" num="12" title="Contacto">
        <ContactBox rows={[
          { label: "Privacidad", value: "privacidad@zaelyn.ai", href: "mailto:privacidad@zaelyn.ai" },
          { label: "Legal", value: "legal@zaelyn.ai", href: "mailto:legal@zaelyn.ai" },
          { label: "Empresa", value: "NE América LLC / NE México S.A. de C.V." },
        ]} />
        <p style={{ fontSize: "13px", color: "var(--l-text3)", fontStyle: "italic" }}>Esta política cumple con LFPDPPP (México), CCPA (California, USA) y LGPD (Brasil).</p>
      </DocSection>
    </>
  );
}

function TermsContent() {
  return (
    <>
      <div style={{ marginBottom: "48px", paddingBottom: "32px", borderBottom: "1px solid var(--l-border)" }}>
        <div style={{ fontSize: "11px", fontFamily: "var(--font-jetbrains)", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--z-violet)", marginBottom: "12px" }}>Términos de Uso</div>
        <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(32px,4vw,48px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-2px", marginBottom: "12px", color: "var(--l-text)" }}>Las reglas del juego,<br />en lenguaje claro.</h1>
        <div style={{ fontSize: "13px", color: "var(--l-text2)", fontFamily: "var(--font-jetbrains)" }}>
          <span style={{ marginRight: "20px" }}>Última actualización: Abril 2026</span>
          <span>Versión 1.0 — Fase Beta</span>
        </div>
      </div>

      <DocSection id="t1" num="01" title="Aceptación">
        <P>Al registrarte y usar Zaelyn, aceptas estos Términos de Uso. Si no estás de acuerdo, no uses el servicio. Estos términos son un acuerdo legal entre tú y <strong>NE América LLC / NE México S.A. de C.V.</strong> ("NE DevIA").</P>
      </DocSection>

      <DocSection id="t2" num="02" title="El servicio">
        <P>Zaelyn es un asistente personal de IA para gestionar tu diario emocional, recordatorios, metas, notas y bienestar. Incluye zaelyn.ai, @ZaelynBot en Telegram, y los módulos Aura, Orion, Sirius, Polaris y futuros.</P>
      </DocSection>

      <DocSection id="t3" num="03" title="Fase Beta">
        <InfoBox title="Durante el Beta">
          Todos los usuarios acceden a funciones del Plan Pro sin costo adicional. Pueden existir interrupciones y cambios. Al terminar el Beta, avisaremos con 30 días de anticipación. Los usuarios Beta tienen precio preferencial de lanzamiento.
        </InfoBox>
      </DocSection>

      <DocSection id="t4" num="04" title="Tu cuenta">
        <UL>
          <LI>Debes tener al menos <strong>13 años</strong></LI>
          <LI>Debes proporcionar información veraz</LI>
          <LI>Eres responsable de la seguridad de tu acceso</LI>
          <LI>Una cuenta es personal e intransferible (salvo planes Family: hasta 5 usuarios)</LI>
        </UL>
      </DocSection>

      <DocSection id="t5" num="05" title="Uso aceptable">
        <Sub>Está permitido</Sub>
        <UL>
          <LI>Usar Zaelyn para productividad y bienestar personal</LI>
          <LI>Integrar vía Telegram para uso personal</LI>
          <LI>Exportar tus propios datos</LI>
        </UL>
        <Sub>Está prohibido</Sub>
        <UL>
          <LI>Usar Zaelyn para actividades ilegales</LI>
          <LI>Intentar acceder a datos de otros usuarios</LI>
          <LI>Hacer ingeniería inversa del servicio</LI>
          <LI>Generar contenido dañino, engañoso o ilegal</LI>
          <LI>Revender o redistribuir el servicio sin autorización</LI>
          <LI>Sobrecargar la infraestructura con uso automatizado</LI>
        </UL>
      </DocSection>

      <DocSection id="t6" num="06" title="Tu contenido">
        <UL>
          <LI>Tú eres propietario del contenido que creas (diario, metas, notas, etc.)</LI>
          <LI>Nos otorgas una licencia limitada solo para prestarte el servicio</LI>
          <LI>No reclamamos derechos sobre tu contenido</LI>
          <LI>Al eliminar tu cuenta, tu contenido se elimina conforme a la Política de Privacidad</LI>
        </UL>
      </DocSection>

      <DocSection id="t7" num="07" title="Limitación de responsabilidad">
        <WarningBox title="⚠️ Zaelyn no es un servicio médico ni terapéutico">
          Zaelyn es una herramienta de productividad y bienestar personal. No somos médicos, psicólogos ni terapeutas. El contenido generado por Zaelyn no constituye diagnóstico médico, no reemplaza atención profesional y no debe usarse como única fuente de decisiones de salud. Si vives una emergencia de salud mental o física, contacta los servicios de emergencia de tu país.
        </WarningBox>
        <Sub>Limitación general</Sub>
        <P>En la máxima medida permitida por la ley, NE DevIA no es responsable por pérdida de datos por fallas técnicas, daños indirectos o consecuentes, interrupciones del servicio, ni decisiones tomadas con base en el contenido de la IA. La responsabilidad máxima está limitada al monto pagado en los últimos 3 meses.</P>
      </DocSection>

      <DocSection id="t8" num="08" title="Precios y pagos">
        <UL>
          <LI>Precios en <strong>USD (dólares estadounidenses)</strong></LI>
          <LI>Facturación mensual, procesada por Stripe</LI>
          <LI>No almacenamos datos de tarjetas de crédito</LI>
        </UL>
        <Sub>Cancelación y reembolsos</Sub>
        <UL>
          <LI>Cancela cuando quieras desde Configuración — conservas el acceso hasta el fin del período pagado</LI>
          <LI>No ofrecemos reembolsos por períodos parciales, salvo que la ley lo requiera</LI>
          <LI>En México aplica la Ley Federal de Protección al Consumidor (PROFECO)</LI>
        </UL>
      </DocSection>

      <DocSection id="t9" num="09" title="Propiedad intelectual">
        <P>Zaelyn, sus módulos, diseño, código y nombre son propiedad de NE DevIA. Los nombres de módulos (Aura, Orion, Sirius, Polaris, Luna, Vega) son marcas en proceso de registro. No puedes usar nuestra propiedad intelectual sin autorización escrita.</P>
      </DocSection>

      <DocSection id="t10" num="10" title="Terminación">
        <P>Podemos suspender tu cuenta si violas estos términos, no pagas, o el servicio deja de operar. Al terminar, tienes <strong>30 días</strong> para exportar tus datos antes de que se eliminen.</P>
      </DocSection>

      <DocSection id="t11" num="11" title="Ley aplicable">
        <UL>
          <LI><strong>México y LATAM:</strong> legislación mexicana, tribunales de Chihuahua, México</LI>
          <LI><strong>USA:</strong> ley del Estado de Texas, tribunales de Houston, Texas</LI>
        </UL>
        <P>Intentaremos resolver cualquier disputa de forma amigable antes de recurrir a instancias legales.</P>
      </DocSection>

      <DocSection id="t12" num="12" title="Contacto">
        <ContactBox rows={[
          { label: "Legal", value: "legal@zaelyn.ai", href: "mailto:legal@zaelyn.ai" },
          { label: "Web", value: "zaelyn.ai/terminos", href: "https://zaelyn.ai/terminos" },
        ]} />
      </DocSection>
    </>
  );
}

function CookiesContent() {
  return (
    <>
      <div style={{ marginBottom: "48px", paddingBottom: "32px", borderBottom: "1px solid var(--l-border)" }}>
        <div style={{ fontSize: "11px", fontFamily: "var(--font-jetbrains)", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--z-violet)", marginBottom: "12px" }}>Política de Cookies</div>
        <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(32px,4vw,48px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-2px", marginBottom: "12px", color: "var(--l-text)" }}>Solo las cookies<br />estrictamente necesarias.</h1>
        <div style={{ fontSize: "13px", color: "var(--l-text2)", fontFamily: "var(--font-jetbrains)" }}>Última actualización: Abril 2026</div>
      </div>

      <InfoBox title="Resumen">
        Zaelyn usa solo 3 cookies técnicas para funcionar. Cero publicidad. Cero rastreo. Cero cookies de terceros.
      </InfoBox>

      <DocSection id="c1" num="01" title="¿Qué son las cookies?">
        <P>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Permiten que el sitio recuerde información sobre tu visita.</P>
      </DocSection>

      <DocSection id="c2" num="02" title="Cookies que usamos">
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "16px 0" }}>
          {[
            { name: "zaelyn-token", purpose: "Mantiene tu sesión iniciada de forma segura", duration: "30 días" },
            { name: "zae-theme", purpose: "Recuerda tu preferencia de tema (claro / oscuro)", duration: "1 año" },
            { name: "zae-lang", purpose: "Recuerda tu idioma preferido (ES / EN / PT)", duration: "1 año" },
          ].map((c) => (
            <div key={c.name} style={{
              background: "var(--l-surface)", border: "1px solid var(--l-border)",
              borderRadius: "8px", padding: "12px 14px",
              display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "16px", alignItems: "center",
            }}>
              <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: "12px", color: "var(--z-violet)" }}>{c.name}</span>
              <span style={{ fontSize: "13px", color: "var(--l-text2)" }}>{c.purpose}</span>
              <span style={{ fontSize: "11px", fontFamily: "var(--font-jetbrains)", color: "var(--l-text3)" }}>{c.duration}</span>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="c3" num="03" title="Lo que NO hacemos">
        <UL>
          <LI>No instalamos cookies de publicidad</LI>
          <LI>No compartimos datos de cookies con anunciantes</LI>
          <LI>No rastreamos tu comportamiento entre sitios web</LI>
          <LI>No usamos Google Analytics ni herramientas similares de terceros</LI>
        </UL>
      </DocSection>

      <DocSection id="c4" num="04" title="Gestión de cookies">
        <P>Puedes gestionar o eliminar las cookies desde la configuración de tu navegador. Ten en cuenta que desactivar <Code>zaelyn-token</Code> impedirá el acceso al servicio.</P>
      </DocSection>

      <DocSection id="c5" num="05" title="Contacto">
        <ContactBox rows={[{ label: "Correo", value: "privacidad@zaelyn.ai", href: "mailto:privacidad@zaelyn.ai" }]} />
      </DocSection>
    </>
  );
}

function DataContent() {
  return (
    <>
      <div style={{ marginBottom: "48px", paddingBottom: "32px", borderBottom: "1px solid var(--l-border)" }}>
        <div style={{ fontSize: "11px", fontFamily: "var(--font-jetbrains)", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--z-violet)", marginBottom: "12px" }}>Retención y Eliminación de Datos</div>
        <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(32px,4vw,48px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-2px", marginBottom: "12px", color: "var(--l-text)" }}>Cuánto tiempo guardamos<br />tus datos y cómo eliminarlos.</h1>
        <div style={{ fontSize: "13px", color: "var(--l-text2)", fontFamily: "var(--font-jetbrains)" }}>Última actualización: Abril 2026</div>
      </div>

      <DocSection id="d1" num="01" title="Tabla de retención por plan">
        <TableWrap>
          <thead><tr><Th>Tipo de dato</Th><Th>Free</Th><Th>Essential</Th><Th>Pro / Family</Th></tr></thead>
          <tbody>
            <tr><Td>Historial de conversaciones</Td><Td>30 días</Td><Td>90 días</Td><Td>365 días</Td></tr>
            <tr><Td>Entradas de diario (Aura)</Td><Td>90 días</Td><Td>Permanente</Td><Td>Permanente</Td></tr>
            <tr><Td>Recordatorios y hábitos (Orion)</Td><Td>90 días</Td><Td>Permanente</Td><Td>Permanente</Td></tr>
            <tr><Td>Notas y segundo cerebro (Sirius)</Td><Td>90 días</Td><Td>Permanente</Td><Td>Permanente</Td></tr>
            <tr><Td>Metas (Polaris)</Td><Td>90 días</Td><Td>Permanente</Td><Td>Permanente</Td></tr>
            <tr><Td>Datos de cuenta y perfil</Td><Td colSpan={3}>Hasta eliminación de cuenta</Td></tr>
            <tr><Td>Logs técnicos</Td><Td colSpan={3}>30 días</Td></tr>
          </tbody>
        </TableWrap>
      </DocSection>

      <DocSection id="d2" num="02" title="Qué pasa cuando vence la retención">
        <UL>
          <LI>El <strong>contenido</strong> del mensaje se elimina y se reemplaza por <Code>[contenido expirado]</Code></LI>
          <LI>Los <strong>metadatos</strong> (fecha, conteo de mensajes) se conservan hasta 12 meses adicionales por razones técnicas</LI>
          <LI>El historial en el sidebar del portal muestra la conversación como expirada — no desaparece abruptamente</LI>
        </UL>
      </DocSection>

      <DocSection id="d3" num="03" title="Cómo eliminar tu cuenta">
        <Sub>Desde el portal</Sub>
        <OL>
          <LI>Ve a <strong>Configuración → Cuenta</strong></LI>
          <LI>Selecciona <strong>Eliminar cuenta</strong></LI>
          <LI>Confirma con tu correo electrónico</LI>
          <LI>Tus datos se eliminan en un plazo de <strong>30 días</strong></LI>
        </OL>
        <Sub>Por solicitud directa</Sub>
        <P>Escribe a <a href="mailto:privacidad@zaelyn.ai" style={{ color: "var(--z-violet)" }}>privacidad@zaelyn.ai</a> con el asunto "Solicitud de eliminación de cuenta" desde tu correo registrado. Procesamos en <strong>20 días hábiles</strong> (México/LATAM) o <strong>45 días</strong> (USA).</P>
      </DocSection>

      <DocSection id="d4" num="04" title="Exportar tus datos">
        <InfoBox title="Disponible en Plan Essential+">
          Desde Configuración → Datos → Exportar mis datos puedes descargar todas tus entradas de diario, metas, notas de Sirius e historial de conversaciones en formato JSON. El archivo se envía a tu correo en un plazo de 24 horas.
        </InfoBox>
      </DocSection>

      <DocSection id="d5" num="05" title="Derecho al olvido">
        <P>Si solicitas la eliminación completa de tu cuenta, eliminamos todos los datos de módulos, historial de conversaciones, perfil y preferencias. Stripe conserva registros fiscales por obligación legal.</P>
        <WarningBox title="⚠️ Importante">
          La eliminación completa es irreversible. No es posible recuperar los datos después de completar el proceso. Asegúrate de exportar lo que necesites antes de proceder.
        </WarningBox>
      </DocSection>

      <DocSection id="d6" num="06" title="Contacto">
        <ContactBox rows={[{ label: "Correo", value: "privacidad@zaelyn.ai", href: "mailto:privacidad@zaelyn.ai" }]} />
      </DocSection>
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string }[] = [
  { id: "privacy", label: "Política de Privacidad" },
  { id: "terms", label: "Términos de Uso" },
  { id: "cookies", label: "Cookies" },
  { id: "data", label: "Retención de Datos" },
];

export default function LegalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawTab = searchParams.get("tab");
  const activeTab: Tab = (["privacy", "terms", "cookies", "data"].includes(rawTab ?? "") ? rawTab : "privacy") as Tab;

  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeTocId, setActiveTocId] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);

  // Init theme
  useEffect(() => {
    const saved = localStorage.getItem("zae-theme");
    const sys = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const t = (saved ?? (sys ? "dark" : "light")) as "dark" | "light";
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    document.documentElement.classList.toggle("dark", t === "dark");
  }, []);

  function toggleTheme() {
    const next: "dark" | "light" = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("zae-theme", next);
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  function switchTab(tab: Tab) {
    router.push(`/legal?tab=${tab}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveTocId("");
  }

  // TOC scroll highlight
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActiveTocId("#" + e.target.id);
            break;
          }
        }
      },
      { rootMargin: "-120px 0px -60% 0px" }
    );

    const sections = document.querySelectorAll(".doc-section[id]");
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [activeTab]);

  const toc = TOC[activeTab];

  return (
    <div style={{ background: "var(--l-bg)", color: "var(--l-text)", minHeight: "100vh", fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)" }}>
      {/* ── Nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px", background: "var(--l-nav-bg)",
        backdropFilter: "blur(20px)", borderBottom: "1px solid var(--l-border)", zIndex: 100,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", fontFamily: "var(--font-syne)", fontSize: "18px", fontWeight: 700, color: "var(--l-text)" }}>
          z<span style={{ color: "var(--z-violet)" }}>ae</span>lyn
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link href="/" style={{
            fontSize: "13px", color: "var(--l-text2)", textDecoration: "none",
            padding: "5px 10px", borderRadius: "7px", transition: "all .15s",
          }}>← Inicio</Link>
          <button
            onClick={toggleTheme}
            style={{
              width: "32px", height: "32px", borderRadius: "8px",
              border: "1px solid var(--l-border)", background: "var(--l-surface)",
              color: "var(--l-text2)", fontSize: "15px", display: "flex",
              alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}
            aria-label="Cambiar tema"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </nav>

      {/* ── Tabs ── */}
      <div style={{
        position: "sticky", top: "60px", zIndex: 90,
        background: "var(--l-nav-bg)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--l-border)",
        padding: "0 48px", display: "flex", gap: 0, overflowX: "auto",
      }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            style={{
              padding: "14px 20px", fontSize: "13px", fontWeight: 500,
              color: activeTab === tab.id ? "var(--z-violet)" : "var(--l-text2)",
              cursor: "pointer", background: "none", border: "none",
              borderBottom: activeTab === tab.id ? "2px solid var(--z-violet)" : "2px solid transparent",
              transition: "all .15s", whiteSpace: "nowrap",
              fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
            }}
          >{tab.label}</button>
        ))}
      </div>

      {/* ── Layout ── */}
      <div style={{
        display: "grid", gridTemplateColumns: "240px 1fr",
        maxWidth: "1100px", margin: "0 auto",
        padding: "40px 48px 80px", gap: "48px",
        minHeight: "calc(100vh - 110px)", marginTop: "110px",
      }}>
        {/* Sidebar TOC */}
        <aside style={{ position: "sticky", top: "130px", height: "fit-content", display: "flex", flexDirection: "column", gap: "2px" }}>
          <div style={{ fontSize: "10px", fontFamily: "var(--font-jetbrains)", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--l-text3)", marginBottom: "10px" }}>En esta página</div>
          {toc.map((item) => {
            const isActive = activeTocId === item.href || (!activeTocId && item === toc[0]);
            return (
              <a
                key={item.href}
                href={item.href}
                style={{
                  fontSize: "13px", color: isActive ? "var(--z-violet)" : "var(--l-text2)",
                  textDecoration: "none", padding: "5px 10px", borderRadius: "6px",
                  borderLeft: isActive ? "2px solid var(--z-violet)" : "2px solid transparent",
                  background: isActive ? "rgba(155,127,232,0.06)" : "transparent",
                  transition: "all .15s", display: "block",
                }}
              >{item.label}</a>
            );
          })}
        </aside>

        {/* Main content */}
        <main ref={contentRef} style={{ minWidth: 0 }}>
          {activeTab === "privacy" && <PrivacyContent />}
          {activeTab === "terms" && <TermsContent />}
          {activeTab === "cookies" && <CookiesContent />}
          {activeTab === "data" && <DataContent />}
        </main>
      </div>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: "1px solid var(--l-border)", padding: "24px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        fontSize: "12px", color: "var(--l-text3)", fontFamily: "var(--font-jetbrains)",
        flexWrap: "wrap", gap: "12px",
      }}>
        <span>© 2026 NE América LLC · NE México S.A. de C.V. · NE DevIA</span>
        <div style={{ display: "flex", gap: "16px" }}>
          <a href="https://national.expert" target="_blank" rel="noreferrer" style={{ color: "var(--l-text3)", textDecoration: "none" }}>national.expert</a>
          <Link href="/" style={{ color: "var(--l-text3)", textDecoration: "none" }}>zaelyn.ai</Link>
          <a href="mailto:privacidad@zaelyn.ai" style={{ color: "var(--l-text3)", textDecoration: "none" }}>privacidad@zaelyn.ai</a>
        </div>
      </footer>
    </div>
  );
}
