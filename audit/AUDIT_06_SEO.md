# Etap 6 — SEO i sharing
_BarberSpace · audyt SEO/OG · data: 2026-04-19_

---

## Co już działa dobrze

| Element | Stan |
|---|---|
| `lang="pl"` na `<html>` | ✅ |
| `<title>` z kluczowymi słowami | ✅ |
| `<meta name="description">` (156 znaków) | ✅ |
| `<meta name="robots" content="index, follow">` | ✅ |
| `<link rel="canonical">` | ✅ |
| Open Graph (`og:type/locale/url/title/description/image`) | ✅ strukturalnie |
| Twitter Card `summary_large_image` | ✅ strukturalnie |
| JSON-LD `HairSalon` + `AggregateRating` + `hasOfferCatalog` | ✅ bardzo dobry |
| `<link rel="preconnect">` dla Google Fonts | ✅ |
| `robots.txt` z Allow: / | ✅ |

---

## P0 — Blokujące dla sharingu

### P0-1: `og-image.jpg` nie istnieje w `/public`
```
# robots.txt sitemap → plik nie istnieje:
public/
  favicon.png  ✅
  robots.txt   ✅
  og-image.jpg ❌  ← 404 dla crawlerów Facebooka/Twittera/LinkedIn
```

OG/Twitter meta odwołują się do `https://barberspace.pl/og-image.jpg`.
Crawlerzy społecznościowi (Facebot, Twitterbot) przy 404 nie pokażą podglądu linku.

**Fix:** Skopiować `src/assets/images/fryzjer.jpg` → `public/og-image.jpg`
(1200×630 crop byłby idealny, ale pełna wersja też przejdzie walidator).

---

### P0-2: `sitemap.xml` nie istnieje
```
robots.txt line 4:
  Sitemap: https://barberspace.pl/sitemap.xml  ← plik nieobecny → 404
```

Googlebot odczyta `robots.txt`, spróbuje pobrać sitemap i dostanie 404.
Brak sitemap nie blokuje indeksowania, ale deklaracja nieistniejącego pliku to sygnał negatywny.

**Fix:** Stworzyć `public/sitemap.xml` z jedną URL (landing page).

---

## P1 — Znaczący wpływ na SEO

### P1-1: Google Fonts — render-blocking stylesheet
```html
<link href="https://fonts.googleapis.com/css2?..." rel="stylesheet" />
```

Zewnętrzny stylesheet blokuje rendering do czasu pobrania (nawet z preconnect).
Na wolnym łączu/mobilnym wydłuża FCP o 100–400ms.

**Fix:** Technika non-render-blocking:
```html
<link href="..." rel="stylesheet" media="print" onload="this.media='all'" />
<noscript><link href="..." rel="stylesheet" /></noscript>
```

---

## P2 — Dobre praktyki

### P2-1: Brak `og:image:type` w Open Graph
```html
<!-- brakuje: -->
<meta property="og:image:type" content="image/jpeg" />
```
LinkedIn i część crawlerów wymaga explicite typu. Bez tego mogą pominąć obraz.

### P2-2: Brak `<meta name="author">`
Drobny sygnał dla Google E-E-A-T.
```html
<meta name="author" content="BarberSpace" />
```

### P2-3: JSON-LD — placeholder dane kontaktowe
```json
"telephone": "+48-000-000-000",
"streetAddress": "ul. Przykładowa 1",
"postalCode": "00-000"
```
Dla portfolio OK, ale warto dodać komentarz że do zastąpienia.
Fikcyjny telefon w structured data może być flagowany przez Google Search Console.

---

## P3 — Nice to have

| ID | Opis |
|---|---|
| P3-1 | `<link rel="preload">` dla hero image — niemożliwe przy Vite hash, skip |
| P3-2 | PWA manifest.json — out of scope dla landing page |
| P3-3 | hreflang (EN) — jeśli pojawi się wersja angielska |
| P3-4 | `twitter:site` / `twitter:creator` — jeśli jest konto Twitter |

---

## Plan implementacji

```
[P0-1] Skopiować fryzjer.jpg → public/og-image.jpg
[P0-2] Stworzyć public/sitemap.xml
[P1-1] Google Fonts → non-render-blocking (media=print trick + noscript)
[P2-1] Dodać og:image:type do index.html
[P2-2] Dodać meta name="author"
```
