/**
 * Google Sheets integration for Sphirex contact form.
 * Sends form data to a deployed Google Apps Script web app
 * that appends rows to a Google Sheet.
 */

const GOOGLE_SHEET_URL = import.meta.env.VITE_GOOGLE_SHEET_URL as string | undefined;

if (!GOOGLE_SHEET_URL) {
  console.warn(
    "[google-sheets] Missing VITE_GOOGLE_SHEET_URL. " +
      "Add it to your .env file after deploying your Google Apps Script.",
  );
}

export interface ContactPayload {
  name: string;
  business: string;
  email: string;
  phone: string;
  service: string | null;
  message: string;
}

/**
 * Submit a contact form payload to the Google Sheet via Apps Script.
 * Returns { ok: true } on success, or { ok: false, error: string } on failure.
 */
export async function submitToGoogleSheet(
  payload: ContactPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!GOOGLE_SHEET_URL) {
    return { ok: false, error: "Google Sheet URL is not configured." };
  }

  try {
    const response = await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      mode: "no-cors", // Google Apps Script doesn't support CORS preflight
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // With mode: "no-cors", the response is opaque (status 0).
    // A successful POST to Apps Script will not throw, so if we
    // reach here without an error, the request was sent.
    return { ok: true };
  } catch (err) {
    console.error("[google-sheets] Submission failed:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown network error",
    };
  }
}
