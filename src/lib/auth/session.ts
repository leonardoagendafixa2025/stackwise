/**
 * STACKWISE ADMIN AUTHENTICATION & SESSION ENGINE
 * Web Crypto API compliant - Runs on Node.js, Next.js Server Components, and Edge Middleware.
 */

export const ADMIN_COOKIE_NAME = "stackwise_admin_session";

function getSecretKey(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "stackwise_prod_session_secret_fallback_key_2025"
  );
}

/**
 * Creates a cryptographically signed session token: timestamp.sha256Hex(timestamp:secret)
 */
export async function createSessionToken(): Promise<string> {
  const secret = getSecretKey();
  const timestamp = Date.now().toString();
  const encoder = new TextEncoder();
  const data = encoder.encode(`${timestamp}:${secret}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${timestamp}.${hashHex}`;
}

/**
 * Verifies if the session token is valid and not expired (default: 7 days)
 */
export async function verifySessionToken(
  token: string | null | undefined,
  maxAgeMs = 7 * 24 * 60 * 60 * 1000
): Promise<boolean> {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return false;
  }

  const [timestampStr, hashHex] = token.split(".");
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Check expiration
  if (Date.now() - timestamp > maxAgeMs) {
    return false;
  }

  const secret = getSecretKey();
  const encoder = new TextEncoder();
  const data = encoder.encode(`${timestampStr}:${secret}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const expectedHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  return hashHex === expectedHex;
}
