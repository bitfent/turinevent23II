require("dotenv").config();

const express = require("express");
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

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post("/api/leads", async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    company,
    website,
    role,
    company_size,
    monthly_volume,
    use_case,
    description,
  } = req.body;

  if (!first_name || !last_name || !email || !company) {
    return res.status(422).json({
      error: "First name, last name, email, and company are required.",
    });
  }

  const domain = (email.split("@")[1] || "").toLowerCase();
  if (!domain || BLOCKED_DOMAINS.has(domain)) {
    return res.status(422).json({
      error: "Please use a corporate email address. Free email providers are not accepted.",
    });
  }

  try {
    await pool.query(
      `INSERT INTO landing_page_leads
        (first_name, last_name, email, company, website, role, company_size, monthly_volume, use_case, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        first_name.trim(),
        last_name.trim(),
        email.trim().toLowerCase(),
        company.trim(),
        website ? website.trim() : null,
        role ? role.trim() : null,
        company_size || null,
        monthly_volume || null,
        use_case || null,
        description ? description.trim() : null,
      ]
    );

    return res.json({ success: true });
  } catch (err) {
    if (err.code === "23505") {
      const detail = (err.detail || "").toLowerCase();
      const constraint = (err.constraint || "").toLowerCase();
      let msg;
      if (detail.includes("(email)") || constraint.includes("email")) {
        msg = "This email address has already been registered. If you need access, contact your team admin.";
      } else if (detail.includes("(company)") || constraint.includes("company")) {
        msg = "A team member from this company has already signed up. Contact us if you need access.";
      } else {
        msg = "This submission conflicts with an existing registration. Please contact us for help.";
      }
      return res.status(409).json({ error: msg });
    }
    console.error("Lead insert error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

async function start() {
  try {
    await initDb();
    console.log("Database ready — landing_page_leads table ensured.");
  } catch (err) {
    console.error("Failed to initialize database:", err.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start();
