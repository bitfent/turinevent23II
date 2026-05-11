# The New Money — Torino Event Landing Page

Landing page for **The New Money — What Digital Assets Can Do for Your Business Today**, the YouHodler invitation-only business event at **Stadio Olimpico Grande Torino** on **23 May 2026**.

YouHodler is the **official sponsor of Torino FC**. The event takes place in the Press Room of the stadium, with a complimentary derby ticket (Torino vs Juventus) for every confirmed participant.

## Stack

- **Backend:** Node.js + Express
- **Database:** Postgres (`pg`) — works with Supabase, Render Postgres, or any standard Postgres
- **Frontend:** static HTML + vanilla CSS + vanilla JS (no build step)

## Local development

```bash
cp .env.example .env
# fill in DATABASE_URL with a Postgres connection string

npm install
npm run dev
# open http://localhost:8080
```

The server will:

1. Auto-create the `event_applications` table on boot (if `DATABASE_URL` is set).
2. Serve the static frontend (`index.html`, `styles.css`, `script.js`, images).
3. Expose `POST /api/applications` for the invitation form.

## Environment variables

| Variable        | Purpose                                          |
| --------------- | ------------------------------------------------ |
| `PORT`          | HTTP port (defaults to `8080`)                   |
| `DATABASE_URL`  | Postgres connection string                       |

## Database schema

The schema is created automatically by `db.js#initDb()` and matches:

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

## Deployment (Render)

`render.yaml` is preconfigured for a Render web service:

- Node 20
- `npm install` build, `npm start` runtime
- Health check on `/healthz`
- `DATABASE_URL` must be set in the Render dashboard

## Files

```
turinevent23II/
├── index.html         The New Money event landing page
├── styles.css         Dark theme + Torino granata accents
├── script.js          Form, reveal-on-scroll, nav, FAQ
├── server.js          Express server + /api/applications
├── db.js              Postgres pool + initDb()
├── stadio-torino.jpg  Stadium hero image
├── yh_logo.png        YouHodler logo (PNG)
├── yh-logo.webp       YouHodler logo (WebP, favicon)
├── package.json
├── render.yaml
└── .env.example
```

## Production checklist

Before publishing publicly:

- [ ] Confirm event check-in time (14:30 vs 15:00).
- [ ] Confirm whether the *Torino vs Juventus* wording can be used in public advertising.
- [ ] Replace the placeholder consent line with approved legal copy.
- [ ] Add the final YouHodler Privacy Notice link in the footer.
- [ ] Add rate limiting / Turnstile / honeypot on `POST /api/applications`.
- [ ] Add server-side email notifications to the event team for new applications.
- [ ] Decide whether the Private Preview block stays generic or switches to the public Business API reveal.
