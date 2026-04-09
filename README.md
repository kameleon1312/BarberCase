# BarberSpace — Premium Barber Landing Page

Production-ready landing page for a modern barbershop. Built as a portfolio-grade project with the quality bar of a real client handoff — full setup documentation, customisation guide and deployment instructions included.

**Live demo:** https://barber-case-world.vercel.app

---

## Overview

BarberSpace is a single-page marketing site for a premium barbershop brand. The design concept draws from editorial print culture — warm paper tones, deep red accent, condensed display type — creating a look that feels intentional rather than template-generated.

**What's included:**

- Sticky header with mobile drawer and scroll-compact behaviour
- Hero with stats band and primary CTA
- Services section — numbered list with live photo preview
- 4-step process walkthrough
- Pricing grid — 4 cards, featured state, booking integration
- Gallery — 3-column editorial portrait grid
- Testimonials — blockquote cards
- Team section — dark editorial block with monogram avatars
- FAQ — CSS grid accordion (smooth animation, no height JS)
- CTA / Contact section with business details
- Quick Booking Drawer — slide-in panel with real email sending via EmailJS
- Scroll-reveal animations on every section (IntersectionObserver, no library)
- Fully responsive, mobile-first
- SEO meta tags, Open Graph, JSON-LD structured data (HairSalon schema)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 7 |
| Styles | SCSS Modules + design token system |
| Fonts | Barlow Condensed · DM Sans · Playfair Display (Google Fonts CDN) |
| Email | EmailJS — client-side, no backend required |
| Animations | Custom `useInView` hook backed by native `IntersectionObserver` |
| Deployment | Static build — Vercel, Netlify or any static host |

No animation libraries. No CSS utility frameworks. Motion is designed, not installed.

---

## Project Structure

```
src/
├── app/
│   └── App.tsx               # Root component — section order, booking state
├── assets/images/            # JPG / PNG assets
├── components/
│   ├── layout/
│   │   ├── Header/           # Sticky nav, mobile drawer
│   │   └── Footer/           # Dark footer
│   └── sections/
│       ├── Hero/
│       ├── Services/
│       ├── Process/
│       ├── Pricing/
│       ├── Gallery/
│       ├── Testimonials/
│       ├── Team/
│       ├── FAQ/
│       ├── CTA/
│       └── Booking/          # QuickBookingDrawer
├── data/
│   └── content.ts            # All copy, pricing, team, FAQ — edit here
├── hooks/
│   └── useInView.ts          # Scroll-reveal hook
├── styles/
│   ├── base/
│   │   └── globals.scss      # Reset, scroll-reveal CSS, bg-shell texture
│   └── tokens/
│       ├── _colors.scss      # Full colour palette
│       ├── _typography.scss  # Font families, scale, line heights
│       ├── _radii.scss       # Border radius scale
│       ├── _shadows.scss     # Box shadow scale
│       └── _z.scss           # Z-index layers
└── types/
    └── ui.ts                 # Shared TypeScript interfaces
```

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables (see Booking section below)
cp .env.example .env

# 3. Start dev server
npm run dev

# 4. Production build
npm run build

# 5. Preview production build locally
npm run preview
```

---

## Booking — EmailJS Setup

The `QuickBookingDrawer` sends reservation emails directly from the browser using [EmailJS](https://www.emailjs.com/). No backend or server required.

### How it works

1. User fills out the form: service, date, time, name, phone number, optional note
2. On submit, `emailjs.send()` fires to EmailJS servers
3. EmailJS forwards the message to the configured inbox using a saved template
4. The drawer shows a success confirmation screen or an inline error message

### Step 1 — Create an EmailJS account

Go to [emailjs.com](https://www.emailjs.com/) and create a free account (3,000 emails/month on free tier).

### Step 2 — Add an Email Service

In the EmailJS dashboard: **Email Services → Add New Service** (Gmail, Outlook, custom SMTP). Copy the **Service ID**.

### Step 3 — Create an Email Template

In the dashboard: **Email Templates → Create New Template**. Use these variables in the template body:

| Variable | Value |
|---|---|
| `{{service_name}}` | Selected service (e.g. "Skin Fade") |
| `{{booking_date}}` | Date — YYYY-MM-DD |
| `{{booking_time}}` | Time — HH:MM |
| `{{duration}}` | Duration (e.g. "55 min") |
| `{{price}}` | Price range (e.g. "110–160 zł") |
| `{{client_name}}` | Client's first name |
| `{{client_phone}}` | Client's phone number |
| `{{client_note}}` | Optional note (defaults to "—") |

Copy the **Template ID**.

### Step 4 — Get your Public Key

**Account → General → Public Key**. Copy it.

### Step 5 — Configure .env

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

### Security note

`VITE_*` variables are embedded into the JS bundle at build time — they are visible in the page source. This is an accepted trade-off with EmailJS: the **Public Key is by design public**. Protect against abuse by whitelisting your domain in **EmailJS → Email Services → your service → Allowed Origins**.

For a fully locked-down production setup, replace EmailJS with a serverless function (e.g. [Resend](https://resend.com/) + Vercel Edge Function) where the API key never reaches the client.

---

## Customisation Guide

### Copy and content

All text is centralised in [src/data/content.ts](src/data/content.ts). Edit this file to change:

- Brand name and tagline — `brand`
- Navigation links — `nav`
- Services list — `services`
- Process steps — `processSteps`
- Pricing cards — `pricing`
- Testimonials — `testimonials`
- Team members — `team`
- FAQ questions and answers — `faq`
- Booking service options (name, duration, price range) — `bookingServices`

Components pull data from this file automatically — no hunting through JSX.

### Design tokens

All visual variables live in [src/styles/tokens/](src/styles/tokens/). Changing one token cascades through every component that uses it.

**To change the accent colour** — edit `$accent` in `_colors.scss`:

```scss
$accent: #B01C2E; // → replace with your colour
```

This propagates to: buttons, focus rings, active states, borders, icon colours, section numbers.

**Font stack** — `_typography.scss`:

```scss
$font-display: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif;
$font-sans:    'DM Sans', system-ui, -apple-system, Arial, sans-serif;
$font-accent:  'Playfair Display', Georgia, serif; // used for prices
```

If you change fonts, also update the Google Fonts URL in [index.html](index.html).

### Images

Replace the files in [src/assets/images/](src/assets/images/):

| File | Used in |
|---|---|
| `fryzjer.jpg` | Hero section, Services preview (Combo), Gallery |
| `wlosy.jpg` | Services preview (Strzyżenie), Gallery |
| `maszynka.jpg` | Services preview (Broda), Gallery |
| `logo.jpg` | CTA section decorative element |
| `logos.png` | Header logo + favicon |

Keep the same filenames or update the imports in the relevant component files.

**Recommended image dimensions:**
- Hero / Services preview: 800×1200px (portrait 3:4)
- Gallery: 600×800px (portrait 3:4)
- Logo: square, min 200×200px

### SEO and business info

Update [index.html](index.html) — find and replace all placeholder values:

```
barberspace.pl         → real domain
Warszawa               → real city
+48-000-000-000        → real phone number
ul. Przykładowa 1      → real street address
00-000                 → real postal code
```

Also replace the `aggregateRating.ratingCount` value in the JSON-LD block with the real number of reviews when available.

For the `og:image` (social sharing preview), create a 1200×630px image and place it at `public/og-image.jpg`.

---

## Scroll Animations

Scroll-reveal uses a custom hook at [src/hooks/useInView.ts](src/hooks/useInView.ts) backed by the native `IntersectionObserver` API — no external dependency.

Each section component attaches the hook to the `<section>` element. When the section enters the viewport, child elements transition from `opacity: 0; translateY(22px)` to their final state. Stagger between items is controlled via the `--reveal-delay` CSS custom property.

Automatically disabled for users with `prefers-reduced-motion: reduce`.

To adjust the animation:
- Easing and duration — `[data-reveal]` block in `globals.scss`
- Stagger timing — `--reveal-delay` values in each component
- Trigger threshold — `threshold` option in each `useInView()` call

---

## Deployment

The build outputs a static `dist/` folder — deploy to any static host:

```bash
npm run build
# → dist/ is ready
```

**Vercel (recommended)** — connect the GitHub repository. Vercel detects Vite automatically and deploys on every push to `main`. Add `VITE_EMAILJS_*` environment variables in **Project Settings → Environment Variables**.

**Netlify** — drag and drop the `dist/` folder, or connect the repository. Add env vars in **Site Settings → Environment Variables**.

**Apache / Nginx** — copy `dist/` to the web root. No special server configuration needed for a single-page site without client-side routing.

---

## Browser Support

All modern browsers (Chrome, Firefox, Safari, Edge). Uses `IntersectionObserver` (supported everywhere since 2019) and CSS `grid-template-rows` animation trick for the FAQ accordion.

---

Built by Szymon Pochopień
