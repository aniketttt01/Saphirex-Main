/**
 * Security utilities for the Sphirex contact form.
 * Protects against XSS, injection, spam bots, and abuse.
 */

// ── Input Sanitisation ──────────────────────────────────────────────────

/** Strip HTML tags and collapse whitespace to neutralise XSS payloads. */
export function sanitize(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, "")           // strip HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "") // strip control chars
    .trim()
    .slice(0, 2000);                   // hard length cap
}

// ── Validation ──────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[\d+\-().\s]{6,20}$/;

export interface ContactPayload {
  name: string;
  business: string;
  email: string;
  phone: string;
  service: string | null;
  message: string;
}

const ALLOWED_SERVICES = new Set([
  "billing", "web", "marketing", "ai", "social", "other",
]);

export function validatePayload(
  p: ContactPayload,
): { ok: true } | { ok: false; reason: string } {
  if (!p.name || p.name.length < 2)
    return { ok: false, reason: "Name must be at least 2 characters." };
  if (!p.business || p.business.length < 2)
    return { ok: false, reason: "Business name must be at least 2 characters." };
  if (!EMAIL_RE.test(p.email))
    return { ok: false, reason: "Please enter a valid email address." };
  if (!PHONE_RE.test(p.phone))
    return { ok: false, reason: "Please enter a valid phone number." };
  if (p.service && !ALLOWED_SERVICES.has(p.service))
    return { ok: false, reason: "Invalid service selection." };
  if (!p.message || p.message.length < 5)
    return { ok: false, reason: "Message must be at least 5 characters." };
  return { ok: true };
}

// ── Rate Limiting (client‑side) ─────────────────────────────────────────

const RATE_WINDOW_MS = 60_000; // 1 minute
const MAX_SUBMISSIONS = 3;     // max 3 per window

const timestamps: number[] = [];

export function isRateLimited(): boolean {
  const now = Date.now();
  // purge old entries
  while (timestamps.length > 0 && now - timestamps[0] > RATE_WINDOW_MS) {
    timestamps.shift();
  }
  if (timestamps.length >= MAX_SUBMISSIONS) return true;
  timestamps.push(now);
  return false;
}

// ── Honeypot check ──────────────────────────────────────────────────────

/** Returns true if the hidden honeypot field was filled (= bot). */
export function isBot(formData: FormData): boolean {
  const hp = formData.get("website") as string | null;
  return !!hp && hp.trim().length > 0;
}
