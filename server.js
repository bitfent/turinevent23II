require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");
const { pool, initDb } = require("./db");

const app = express();
const PORT = process.env.PORT || 8080;

const BLOCKED_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "yandex.ru",
  "yandex.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
]);

/**
 * Load the index.html template once at boot and substitute {{BASE_URL}}
 * on every request so Open Graph / WhatsApp link previews always resolve
 * to absolute https:// URLs.
 *
 * Resolution order:
 *   1. PUBLIC_BASE_URL env var (recommended in production)
 *   2. Forwarded headers (Render / proxies) -> https://<host>
 *   3. Plain host header (dev)
 *
 * The result is cached per base-URL so we only re-render when it changes.
 */
const INDEX_PATH = path.join(__dirname, "index.html");
const INDEX_TEMPLATE = fs.readFileSync(INDEX_PATH, "utf8");
const renderedCache = new Map();

function stripTrailingSlash(url) {
  return typeof url === "string" ? url.replace(/\/+$/, "") : "";
}

function getBaseUrl(req) {
  const fromEnv = stripTrailingSlash(process.env.PUBLIC_BASE_URL);
  if (fromEnv) return fromEnv;

  const proto = (req.get("x-forwarded-proto") || req.protocol || "http").split(",")[0].trim();
  const host = (req.get("x-forwarded-host") || req.get("host") || "").split(",")[0].trim();
  if (host) return `${proto}://${host}`;
  return "";
}

function renderIndex(baseUrl) {
  const safe = baseUrl || "";
  if (renderedCache.has(safe)) return renderedCache.get(safe);
  const html = INDEX_TEMPLATE.replace(/\{\{BASE_URL\}\}/g, safe);
  renderedCache.set(safe, html);
  return html;
}

function sendIndex(req, res) {
  res.set("Cache-Control", "public, max-age=0, must-revalidate");
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(renderIndex(getBaseUrl(req)));
}

app.set("trust proxy", 1);
app.use(express.json({ limit: "32kb" }));

app.get(["/", "/index.html"], sendIndex);

app.use(
  express.static(path.join(__dirname), {
    index: false,
    setHeaders(res, filePath) {
      if (/\.(css|js|png|jpg|jpeg|webp|svg|woff2?)$/i.test(filePath)) {
        res.set("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  })
);

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.post("/api/applications", async (req, res) => {
  const firstName = normalizeString(req.body.first_name);
  const lastName = normalizeString(req.body.last_name);
  const email = normalizeString(req.body.email).toLowerCase();
  const company = normalizeString(req.body.company);
  const role = normalizeString(req.body.role);

  if (!firstName || !lastName || !email || !company || !role) {
    return res.status(422).json({
      error: "First name, last name, work email, company and role are required.",
    });
  }

  if (!isValidEmail(email)) {
    return res.status(422).json({ error: "A valid work email is required." });
  }

  const domain = (email.split("@")[1] || "").toLowerCase();
  if (!domain || BLOCKED_DOMAINS.has(domain)) {
    return res.status(422).json({
      error: "Please use a corporate email address. Free email providers are not accepted.",
    });
  }

  if (req.body.consent !== true) {
    return res.status(422).json({ error: "Consent is required to submit this form." });
  }

  const payload = {
    first_name: firstName,
    last_name: lastName,
    email,
    phone: normalizeString(req.body.phone) || null,
    company,
    website: normalizeString(req.body.website) || null,
    role,
    company_size: normalizeString(req.body.company_size) || null,
    industry: normalizeString(req.body.industry) || null,
    business_challenge: normalizeString(req.body.business_challenge) || null,
    private_preview_interest: req.body.private_preview_interest === true,
    vip_skybox_interest: req.body.vip_skybox_interest === true,
    description: normalizeString(req.body.description) || null,
    consent: req.body.consent === true,
    user_agent: req.get("user-agent") || null,
    ip_address: req.ip || null,
  };

  try {
    await pool.query(
      `INSERT INTO event_applications
        (first_name, last_name, email, phone, company, website, role,
         company_size, industry, business_challenge,
         private_preview_interest, vip_skybox_interest, description, consent,
         user_agent, ip_address)
       VALUES
        ($1, $2, $3, $4, $5, $6, $7,
         $8, $9, $10,
         $11, $12, $13, $14,
         $15, $16)`,
      [
        payload.first_name,
        payload.last_name,
        payload.email,
        payload.phone,
        payload.company,
        payload.website,
        payload.role,
        payload.company_size,
        payload.industry,
        payload.business_challenge,
        payload.private_preview_interest,
        payload.vip_skybox_interest,
        payload.description,
        payload.consent,
        payload.user_agent,
        payload.ip_address,
      ]
    );

    return res.status(201).json({ success: true });
  } catch (err) {
    console.error("Application insert error:", err);
    return res.status(500).json({ error: "Could not save your application. Please try again." });
  }
});

app.get("/healthz", (_req, res) => {
  res.json({ ok: true });
});

// SPA-style fallback: serve the rendered index.html for any unknown GET route.
// Express 5 requires a named wildcard (no bare "*"), so we use a middleware.
app.use((req, res, next) => {
  if (req.method !== "GET") return next();
  sendIndex(req, res);
});

async function start() {
  try {
    if (process.env.DATABASE_URL) {
      await initDb();
      console.log("Database ready — event_applications table ensured.");
    } else {
      console.warn("DATABASE_URL is not set. /api/applications will fail until configured.");
    }
  } catch (err) {
    console.error("Failed to initialize database:", err.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`The New Money landing page running on port ${PORT}`);
  });
}

start();
