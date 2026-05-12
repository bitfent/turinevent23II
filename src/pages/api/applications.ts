import type { APIRoute } from "astro";
import { neon } from "@neondatabase/serverless";

const BLOCKED_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk",
  "yandex.ru", "yandex.com", "outlook.com", "hotmail.com",
  "live.com", "msn.com",
]);

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }

  const firstName = normalizeString(body.first_name);
  const lastName  = normalizeString(body.last_name);
  const email     = normalizeString(body.email).toLowerCase();
  const company   = normalizeString(body.company);
  const role      = normalizeString(body.role);

  if (!firstName || !lastName || !email || !company || !role) {
    return json({ error: "First name, last name, work email, company and role are required." }, 422);
  }
  if (!isValidEmail(email)) {
    return json({ error: "A valid work email is required." }, 422);
  }
  const domain = (email.split("@")[1] ?? "").toLowerCase();
  if (!domain || BLOCKED_DOMAINS.has(domain)) {
    return json({ error: "Please use a corporate email address. Free email providers are not accepted." }, 422);
  }
  if (body.consent !== true) {
    return json({ error: "Consent is required to submit this form." }, 422);
  }

  const connectionString = import.meta.env.DATABASE_URL ?? import.meta.env.STORAGE_POSTGRES_URL;
  const sql = neon(connectionString);

  try {
    await sql.query(
      `INSERT INTO event_applications
        (first_name, last_name, email, phone, company, website, role,
         company_size, industry, business_challenge,
         private_preview_interest, vip_skybox_interest, description, consent,
         user_agent, ip_address)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
      [
        firstName,
        lastName,
        email,
        normalizeString(body.phone) || null,
        company,
        normalizeString(body.website) || null,
        role,
        normalizeString(body.company_size) || null,
        normalizeString(body.industry) || null,
        normalizeString(body.business_challenge) || null,
        body.private_preview_interest === true,
        body.vip_skybox_interest === true,
        normalizeString(body.description) || null,
        true,
        request.headers.get("user-agent") ?? null,
        (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || null,
      ]
    );
    return json({ success: true }, 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Application insert error:", message);
    return json({ error: "Could not save your application. Please try again.", detail: message }, 500);
  }
};
