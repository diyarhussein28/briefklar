# BriefKlar

**DE:** Behördenbrief fotografieren, in der eigenen Sprache verstehen, Frist nicht verpassen.
**EN:** Photograph an official German letter, understand it in your language, never miss the deadline.

BriefKlar is a small, free web app (PWA) for people in Germany who struggle with official letters — speakers of Arabic, Ukrainian and Turkish, older people and people with low literacy. A photo of the letter is explained by AI (Claude by Anthropic) in three short sentences, the deadline (Frist), amount and reference number are extracted, and the user can add a reminder to their calendar and find free counselling nearby. No account, no bank access, no chat.

## Features (v1)

- Language picker: العربية, Українська, Türkçe, English, Leichte Sprache (plain German); RTL for Arabic
- AI disclosure and explicit consent before the first upload (AI Act Art. 50, GDPR Art. 9 (2)(a))
- Photograph or upload a letter (image or PDF) → three-sentence explanation in the chosen language
- Extracted deadline, amount and reference, highlighted and easy to check against the original
- Calendar reminder (.ics) and an on-device list of deadlines
- Links to free counselling services (e.g. by postcode)
- Datenschutzerklärung and Impressum (with placeholders to fill in — see below)

## Tech stack

- Next.js 16 (App Router, `cacheComponents`), React 19, TypeScript
- Tailwind CSS v4
- Anthropic SDK (`@anthropic-ai/sdk`) on the server, `zod` for validating the AI output
- `ics` for calendar files
- Vitest + jsdom + Testing Library
- Fonts: Noto Sans + Noto Sans Arabic via `next/font/google` (self-hosted at build time; the build needs network access to Google Fonts once)

## Setup

```bash
npm install
cp .env.example .env.local   # then set ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000
```

`ANTHROPIC_API_KEY` is only used on the server (`/api/analyze`) and never sent to the browser.

## Scripts

| Script              | What it does                    |
| ------------------- | ------------------------------- |
| `npm run dev`       | Development server              |
| `npm run build`     | Production build                |
| `npm start`         | Serve the production build      |
| `npm test`          | Run all tests once (Vitest)     |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run lint`      | ESLint                          |

## Privacy by design

- **Letters are not stored.** The image is sent over HTTPS to our server, processed in memory, forwarded to the AI provider for this one request and then discarded. Letter content is not written to logs.
- **No training.** Data sent through Anthropic's commercial API is not used to train models.
- **No account, no cookies, no tracking.**
- **On the device only:** chosen language, consent (`briefklar.consent.v1`), deadlines and postcode live in the browser's `localStorage`.
- Users can withdraw consent on `/datenschutz` at any time.

## Legal notes

- **Rechtsdienstleistungsgesetz (RDG):** BriefKlar explains what a letter says, in general terms. It must not assess an individual decision or recommend legal steps such as an objection (Widerspruch) — that is legal advice reserved for lawyers and counselling services. The app points to free counselling instead.
- **AI Act Art. 50:** AI use is disclosed on the first screen after the language choice, not only in the terms.
- **GDPR Art. 9:** letters can contain special-category data (health, benefits, residence status) → explicit consent before the first upload (`src/features/consent`).
- **Before launch, the operator must:**
  - fill in every `[TODO: …]` placeholder (highlighted in yellow) in `src/app/impressum/page.tsx` and `src/app/datenschutz/page.tsx`;
  - sign the Data Processing Addendum with Anthropic and confirm data retention (ideally Zero Data Retention, so "not stored" holds for the AI provider too), the contracting entity and the legal basis for the transfer to the USA (EU-US Data Privacy Framework and/or Standard Contractual Clauses) — or choose EU-only processing;
  - name the hosting provider (with a DPA) and its log retention;
  - name the competent data protection supervisory authority.

## Project structure

```
src/
  app/                  routes: home, /deadlines, /datenschutz, /impressum, /api/analyze,
                        layout, manifest, icons
  features/
    scan/               capture/upload, image preparation, call to /api/analyze
    result/             explanation, highlighted deadline/amount/reference
    deadlines/          on-device deadline list, reminders, .ics export
    help/               free counselling links
    consent/            language picker, AI disclosure + consent gate, language switcher
  server/               Claude prompt and letter analysis (server only)
  lib/                  shared contracts (letter analysis schema)
  i18n/                 languages, LanguageProvider, useT()
```

## Roadmap

- **v2 – Entlastungsbetrag monitor:** for people caring for someone at home (131 €/month care relief amount). Triggered by a letter from the Pflegekasse: shows the remaining budget, reminds before the 30 June expiry, suggests recognised service providers by postcode.
- **v3 – Cost radar:** detects letters about health insurance contribution increases (Sonderkündigungsrecht), reminds of the 30 November car insurance switching date, and does a first check of the Nebenkostenabrechnung.

Every module starts from a letter, so the app stays simple for the user.
