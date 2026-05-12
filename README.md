# The New Money — Torino Event Landing Page

Landing page for **The New Money — What Digital Assets Can Do for Your Business Today**, the YouHodler invitation-only business event at **Stadio Olimpico Grande Torino** on **Sunday, 24 May 2026**.

YouHodler is the **official sponsor of Torino FC**. The event takes place in the Press Room of the stadium, with a complimentary derby ticket (Torino vs Juventus) for every confirmed participant.

## Stack

- **Framework:** Astro 6
- **Deployment:** Vercel (`vercel.json` + `@astrojs/vercel` adapter)
- **Database:** Neon serverless Postgres (`@neondatabase/serverless`)

## Local development

```bash
cp .env.example .env
# set DATABASE_URL (or STORAGE_POSTGRES_URL) to your Neon connection string

pnpm install
pnpm dev
# open http://localhost:4321
```

## Environment variables

| Variable               | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| `DATABASE_URL`         | Neon serverless Postgres connection string    |
| `STORAGE_POSTGRES_URL` | Alternative name for the same connection string (either works) |
| `PUBLIC_BASE_URL`      | Canonical URL used for OG tags and schema.org |

## Database schema

The table is **not** auto-created. Run this SQL in your Neon project before the first deploy:

```sql
create table if not exists event_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  company text not null,
  website text,
  role text not null,
  company_size text,
  industry text,
  business_challenge text,
  private_preview_interest boolean not null default false,
  vip_skybox_interest boolean not null default false,
  description text,
  consent boolean not null default false,

  status text not null default 'new',
  source text not null default 'torino_event_landing_page',
  user_agent text,
  ip_address text
);
```

Recommended workflow statuses for triage:

- `new`
- `reviewing`
- `approved`
- `rejected`
- `vip_candidate`
- `vip_confirmed`

## API

`POST /api/applications` — Astro API route at `src/pages/api/applications.ts`. Inserts a row into `event_applications` via the Neon serverless driver.

## File structure

```
src/
├── layouts/Layout.astro       HTML shell, meta, OG tags, schema.org
├── pages/
│   ├── index.astro            Single page, assembles all sections
│   └── api/applications.ts   POST /api/applications → Neon insert
└── components/
    ├── Header.astro
    ├── Hero.astro
    ├── WhyNow.astro
    ├── Program.astro
    ├── UseCases.astro
    ├── PrivatePreview.astro
    ├── Experience.astro
    ├── ApplicationForm.astro
    ├── Faq.astro
    └── Footer.astro
public/
├── styles.css
├── script.js
├── stadio-torino.jpg
├── og-image.jpg
├── yh_logo.png
└── yh-logo.webp
```

## Production checklist

Before publishing publicly:

- [ ] Create the `event_applications` table in Neon before first deploy (see schema above).
- [ ] Confirm whether the *Torino vs Juventus* wording can be used in public advertising.
- [ ] Replace the placeholder consent line with approved legal copy.
- [ ] Add the final YouHodler Privacy Notice link in the footer.
- [ ] Add rate limiting / Turnstile / honeypot on `POST /api/applications`.
- [ ] Add server-side email notifications to the event team for new applications.
- [ ] Decide whether the Private Preview block stays generic or switches to the public Business API reveal.
