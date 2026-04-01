import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM ?? "Zaelyn@national.expert";
const APP_URL = process.env.NEXTAUTH_URL ?? "https://zaelyn.ai";

export async function sendMagicLinkEmail(
  to: string,
  token: string
): Promise<{ ok: boolean; error?: string }> {
  const link = `${APP_URL}/api/auth/verify?token=${encodeURIComponent(token)}`;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tu acceso a Zaelyn</title>
</head>
<body style="margin:0;padding:0;background:#06070b;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#06070b;min-height:100vh;">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table width="100%" style="max-width:480px;" cellpadding="0" cellspacing="0">

          <!-- Logo -->
          <tr>
            <td style="padding-bottom:40px;">
              <span style="font-size:22px;font-weight:600;letter-spacing:-0.03em;color:#eceef4;">
                Z<span style="color:#818cf8;">ae</span>lyn
              </span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#0a0c12;border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:40px 36px;">

              <p style="margin:0 0 8px 0;font-size:11px;font-weight:500;letter-spacing:0.08em;color:#818cf8;text-transform:uppercase;">
                Acceso al portal
              </p>

              <h1 style="margin:0 0 20px 0;font-size:24px;font-weight:600;color:#eceef4;line-height:1.3;letter-spacing:-0.02em;">
                Tu link de acceso
              </h1>

              <p style="margin:0 0 32px 0;font-size:15px;color:#8891a8;line-height:1.65;">
                Haz click en el botón para entrar a Zaelyn. Este link es válido por
                <strong style="color:#eceef4;">15 minutos</strong> y solo funciona una vez.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="border-radius:12px;background:#6366f1;">
                    <a href="${link}"
                       style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:-0.01em;">
                      Entrar a Zaelyn →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:0 0 4px 0;font-size:12px;color:#8891a8;">
                ¿El botón no funciona? Copia este link:
              </p>
              <p style="margin:0;font-size:12px;word-break:break-all;">
                <a href="${link}" style="color:#818cf8;text-decoration:none;">${link}</a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#3d4560;line-height:1.6;">
                Si no solicitaste este acceso, ignora este email.<br>
                Zaelyn · NE DevIA · national.expert
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from: `Zaelyn <${FROM}>`,
      to,
      subject: "Tu link de acceso a Zaelyn",
      html,
    });

    if (error) {
      console.error("[Resend]", error);
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error desconocido";
    console.error("[Resend]", msg);
    return { ok: false, error: msg };
  }
}
