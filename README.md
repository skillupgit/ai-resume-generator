# AI Resume Generator — Functional MVP
Unified Next.js + Prisma + Auth (demo) + Stripe (test) + jsPDF export.

## Quickstart
1. `cp .env.example .env` and fill in values.
2. `docker compose up -d` (starts Postgres 16 on :5432).
3. `npm i`
4. `npm run db:migrate`
5. `npm run db:seed`
6. `npm run dev`

Open http://localhost:3000

- Admin dashboard: /admin (send header `x-demo-email: admin@skillup.study` in a client or via a proxy extension). Replace with real Auth.js in production.
- Onboarding: /onboarding
- Generator: /generator

### Notes
- Auth.js magic link is simplified for the demo. Wire SMTP when ready.
- Resume export returns a server-generated placeholder PDF; for best fidelity, use client-side jsPDF + html2canvas on the preview DOM.
- Stripe is in test mode with webhook stub. Add entitlement logic on `checkout.session.completed`.
