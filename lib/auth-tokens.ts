import { SignJWT, jwtVerify } from "jose";

function getSecret() {
  const s =
    process.env.MAGIC_LINK_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    "zaelyn-dev-secret-CHANGE-IN-PROD";
  return new TextEncoder().encode(s);
}

/** Short-lived token embedded in the magic link email (15 min) */
export async function createMagicToken(email: string): Promise<string> {
  return new SignJWT({ email, type: "magic" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(getSecret());
}

export async function verifyMagicToken(
  token: string
): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.type !== "magic") return null;
    return { email: payload.email as string };
  } catch {
    return null;
  }
}

/** Long-lived session token stored in httpOnly cookie (30 days) */
export async function createSessionToken(email: string): Promise<string> {
  return new SignJWT({ email, type: "session" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());
}

export async function verifySessionToken(
  token: string
): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.type !== "session") return null;
    return { email: payload.email as string };
  } catch {
    return null;
  }
}
