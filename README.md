# BriefKlar

**DE:** Behördenbrief fotografieren, in der eigenen Sprache verstehen, Frist nicht verpassen.
**EN:** Photograph an official German letter, understand it in your language, never miss the deadline.

BriefKlar is a small, free web app (PWA) for people in Germany who struggle with official letters — speakers of Arabic, Ukrainian and Turkish, older people and people with low literacy. A photo of the letter is explained by AI (Mistral AI, a provider based in the EU) in three short sentences, the deadline (Frist), amount and reference number are extracted, and the user can add a reminder to their calendar and find free counselling nearby. No account, no bank access, no chat.

## بالعربية: تشغيل التطبيق بمفتاح Mistral المجاني

<div dir="rtl">

يستخدم BriefKlar الذكاء الاصطناعي من شركة **Mistral AI** (شركة فرنسية في الاتحاد الأوروبي). الخطة المجانية «Experiment» لا تحتاج إلى بطاقة ائتمان.

**1. الحصول على المفتاح المجاني**

1. افتح الموقع https://console.mistral.ai وأنشئ حسابًا.
2. اختر الخطة المجانية **Experiment** وأكّد رقم هاتفك.
3. افتح قسم **API Keys** وأنشئ مفتاحًا جديدًا، ثم انسخه واحفظه في مكان آمن.
4. **مهم قبل الإطلاق:** في لوحة الإدارة **Admin ← Privacy** أوقف خيار **Anonymous improvement data**. بدون ذلك قد تستخدم Mistral الرسائل لتدريب نماذجها، وهذا يخالف ما نَعِد به المستخدمين.

**2. تشغيل التطبيق على جهازك**

1. في مجلد المشروع نفّذ:

   ```bash
   npm install
   cp .env.example .env.local
   ```

2. افتح الملف `.env.local` واكتب مفتاحك بعد `MISTRAL_API_KEY=`.
3. شغّل التطبيق بالأمر `npm run dev` ثم افتح http://localhost:3000 في المتصفح.

**ملاحظة:** للخطة المجانية حدود في عدد الطلبات. يجب التحقق من شروط Mistral: هل يُسمح باستخدام الخطة المجانية لخدمة عامة؟ إذا لم يكن ذلك مسموحًا، انتقل لاحقًا إلى خطة مدفوعة (الدفع حسب الاستخدام).

</div>

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
- Mistral AI SDK (`@mistralai/mistralai`) on the server: Mistral OCR (`mistral-ocr-latest`) turns the photo/PDF into text, then `mistral-medium-latest` explains it using structured outputs; `zod` validates the AI output
- `ics` for calendar files
- Vitest + jsdom + Testing Library
- Fonts: Noto Sans + Noto Sans Arabic via `next/font/google` (self-hosted at build time; the build needs network access to Google Fonts once)

## Setup

```bash
npm install
cp .env.example .env.local   # then set MISTRAL_API_KEY
npm run dev                  # http://localhost:3000
```

`MISTRAL_API_KEY` is only used on the server (`/api/analyze`) and never sent to the browser.

**Getting a free key:** go to https://console.mistral.ai, choose the free **Experiment** plan (phone verification, no credit card), then create an API key under **API Keys** and put it into `.env.local`. The free plan has rate limits. Before going live, read the pre-launch checklist below — in particular the training toggle.

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

- **Letters are not stored.** The image is sent over HTTPS to our server, processed in memory, forwarded to the AI provider (Mistral AI) for this one request and then discarded. Letter content is not written to logs.
- **Two steps at Mistral:** Mistral OCR turns the photo/PDF into text, then a Mistral language model explains the text.
- **No training — only if configured.** According to Mistral's help center, Mistral OCR is not used for training (Experiment and Scale plans) and has Zero Data Retention by default. On the free Experiment plan, however, requests to the language models **may be used to train Mistral's models unless** the account owner switches off **"Anonymous improvement data"** in the Mistral Admin panel → Privacy. The consent text promises "not used to train AI", so this toggle must be off (see pre-launch checklist).
- **EU provider.** Mistral AI SAS is based in France (EU) and states that it hosts data in the EU by default, so no transfer to the USA is needed (to be confirmed, see checklist).
- **No account, no cookies, no tracking.**
- **On the device only:** chosen language, consent (`briefklar.consent.v1`), deadlines and postcode live in the browser's `localStorage`.
- Users can withdraw consent on `/datenschutz` at any time.

## Legal notes

- **Rechtsdienstleistungsgesetz (RDG):** BriefKlar explains what a letter says, in general terms. It must not assess an individual decision or recommend legal steps such as an objection (Widerspruch) — that is legal advice reserved for lawyers and counselling services. The app points to free counselling instead.
- **AI Act Art. 50:** AI use is disclosed on the first screen after the language choice, not only in the terms.
- **GDPR Art. 9:** letters can contain special-category data (health, benefits, residence status) → explicit consent before the first upload (`src/features/consent`).
- **Before launch, the operator must:**
  - fill in every `[TODO: …]` placeholder (highlighted in yellow) in `src/app/impressum/page.tsx` and `src/app/datenschutz/page.tsx`;
  - **switch off "Anonymous improvement data"** in the Mistral Admin panel → Privacy (otherwise, on the free Experiment plan, requests to the language models may be used for training and the consent text would be wrong), then remove the matching `[TODO]` in the Datenschutzerklärung;
  - confirm with Mistral's terms/DPA: the contracting entity and address (Mistral AI SAS, 15 rue des Halles, 75001 Paris, France), the Data Processing Agreement, the retention period for language-model (chat) API data, EU hosting, and whether sub-processors outside the EU are used;
  - **TODO:** check Mistral's terms whether the free Experiment plan may be used for a public/commercial service; if not, switch to a paid plan (pay-as-you-go). Also keep its rate limits in mind;
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
  server/               Mistral OCR + prompt and letter analysis (server only)
  lib/                  shared contracts (letter analysis schema)
  i18n/                 languages, LanguageProvider, useT()
```

## Roadmap

- **v2 – Entlastungsbetrag monitor:** for people caring for someone at home (131 €/month care relief amount). Triggered by a letter from the Pflegekasse: shows the remaining budget, reminds before the 30 June expiry, suggests recognised service providers by postcode.
- **v3 – Cost radar:** detects letters about health insurance contribution increases (Sonderkündigungsrecht), reminds of the 30 November car insurance switching date, and does a first check of the Nebenkostenabrechnung.

Every module starts from a letter, so the app stays simple for the user.
