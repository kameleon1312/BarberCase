# AUDIT 01 — BEZPIECZEŃSTWO

## TL;DR

- Zero CVE w produkcyjnych zależnościach. Zero hardcoded secrets w kodzie i historii git. Zero XSS. Clean baseline.
- Brak `vercel.json` — projekt jest dostępny bez żadnych security headers. Każdy skaner (securityheaders.com, Mozilla Observatory) da grade F.
- Formularz booking nie ma honeypot ani time-gate — bot może opróżnić darmowy limit EmailJS (200 req/miesiąc) w kilka sekund.
- Walidacja pól jest tylko length-based — brak maxLength, brak regex dla telefonu, pole `note` nie ma limitu znaków.
- Jeden błąd ESLint (setState w efekcie) musi być naprawiony przed deployem.

---

## Znaleziska

### P0 — Krytyczne

Brak. Zero hardcoded secrets, zero XSS wektorów, zero CVE.

### P1 — Istotne

**1. Brak security headers — vercel.json nie istnieje**

Obserwacja: Projekt nie ma `vercel.json`. Serwer Vercel nie dodaje CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy ani Permissions-Policy.

Ryzyko: Każdy klient sprawdzający „co za człowiek to zbudował" może wejść na securityheaders.com i zobaczyć grade F. Brak X-Frame-Options otwiera możliwość clickjackingu (strona może być osadzona w iframe). Brak HSTS oznacza brak wymuszenia HTTPS. Dla projektu portfolio brak tych headerów to bezpośredni marker „nie zna security basics".

Propozycja: Dodać `vercel.json` z kompletem headerów (gotowy blok poniżej).

Effort: S

---

**2. Formularz bez honeypot i time-gate**

Obserwacja: `QuickBookingDrawer` nie ma ukrytego pola honeypot ani minimalnego czasu między otwarciem a submitem. `canSubmit` sprawdza tylko czy pola są wypełnione — bot może wysyłać formularz w pętli.

Ryzyko: EmailJS free tier = 200 maili/miesiąc. Automatyczny scraper lub celowy atak wyzeruje limit w < 1 minutę. Klient zgłasza się po godzinach, formularz nie działa. Nieprofesjonalne.

Propozycja: (a) Ukryte pole `website` (honeypot) — jeśli wypełnione, submit jest cicho blokowany. (b) Zapis `openedAt: Date.now()` w momencie otwarcia drawera i sprawdzenie czy minęło minimum 3 sekundy przed submitem.

Effort: S

---

**3. Brak maxLength na polach i brak regex dla telefonu**

Obserwacja: `form.phone.trim().length >= 7` akceptuje „1234567" jako poprawny telefon. Pole `note` nie ma żadnego limitu — można wysłać megabajt tekstu. Brak `maxLength` na `name` (akceptuje 10 000 znaków).

Ryzyko: Payload injection w EmailJS template (duże note mogą rozbić template lub przekroczyć limity API). Brak walidacji phone oznacza że klient dostaje bezużyteczne dane kontaktowe.

Propozycja: (a) Regex `^(\+?48)?[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{3}$` dla polskich numerów. (b) `maxLength={300}` na `note`, `maxLength={80}` na `name`.

Effort: S

---

**4. Błąd ESLint — setState w efekcie (QuickBookingDrawer.tsx:141)**

Obserwacja: `useEffect(() => { if (open) setStatus("idle"); }, [open])` wywołuje `setStatus` synchronicznie w ciele efektu. ESLint plugin `react-hooks` blokuje to jako błąd.

Ryzyko: Cascading render przy każdym otwarciu drawera. Niezaliczony lint = projekt wygląda na niedokończony w oczach seniora.

Propozycja: Usunąć useEffect, dodać reset `status` w lokalnym handlerze zamknięcia (handleClose), który wywołuje `onClose` po ustawieniu `setStatus("idle")`.

Effort: S

---

### P2 — Ulepszenia

**5. EmailJS domain allowlist (konfiguracja w dashboardzie)**

Obserwacja: Klucze VITE_EMAILJS_* trafiają do bundla klienta — to jest zamierzone (EmailJS public key jest z definicji publiczny). Jednak bez domain allowlist w panelu EmailJS każdy może użyć tych kluczy ze swojej strony.

Ryzyko: Ktoś znajdzie klucze w devtools i zaspamuje EmailJS z własnej domeny korzystając z cudzego limitu.

Propozycja: W dashboardzie EmailJS → Service Settings → Allowed origins: dodać `https://barberspace.pl` i `https://barber-case-world.vercel.app`. To jest konfiguracja serwera, nie kodu.

Effort: S (5 minut w panelu)

---

**6. `vite.svg` w public/ — nieużywany default asset**

Obserwacja: `public/vite.svg` to domyślny zasób z szablonu Vite. Nie jest używany nigdzie w projekcie.

Ryzyko: Klient przeglądający repozytorium lub `/vite.svg` URL widzi że projekt zaczął od szablonu. Mały, ale zauważalny marker „template starter".

Propozycja: Usunąć plik.

Effort: XS

---

### P3 — Nice to have

**7. Emoji 📍 w CTA.tsx jako content**

Obserwacja: `<div className={styles.pin}>📍</div>` w komponencie CTA.

Ryzyko: Zero — emoji jest statycznym contentem. Nie jest to wektor ataku. Jednak dla spójności z resztą projektu (który używa CSS/SVG zamiast emoji) warto zastąpić SVG ikoną lub CSS pseudo-elementem.

Effort: XS

---

## Gotowy blok vercel.json

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=(), payment=()"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://api.emailjs.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
        }
      ]
    }
  ]
}
```

Uzasadnienie każdego nagłówka:

- `X-Content-Type-Options: nosniff` — blokuje MIME-type sniffing. Bez tego browser może zinterpretować odpowiedź z błędnym Content-Type jako wykonywalny skrypt.
- `X-Frame-Options: DENY` — zapobiega osadzeniu strony w `<iframe>`. Chroni przed clickjackingiem.
- `Referrer-Policy: strict-origin-when-cross-origin` — przy nawigacji cross-origin wysyła tylko origin (bez path/query). Standard dla prywatności bez łamania analytics.
- `Permissions-Policy` — wyłącza dostęp do kamera/mikrofon/geolokalizacja/płatności. Na barbershopie żadna z tych funkcji nie jest potrzebna.
- `Strict-Transport-Security` — wymusza HTTPS przez 2 lata, z subdomains i wpisem do preload list. Bez tego możliwy SSL stripping.
- `Content-Security-Policy` — szczegóły poniżej.

Uzasadnienie CSP linijka po linijce:

- `default-src 'self'` — fallback: wszystko tylko z własnej domeny jeśli nie ma bardziej szczegółowej dyrektywy.
- `script-src 'self'` — tylko skrypty z własnej domeny. JSON-LD `<script type="application/ld+json">` nie jest wykonywalnym JS — nie podlega tej dyrektywie w CSP2/CSP3.
- `style-src 'self' https://fonts.googleapis.com` — arkusze CSS z własnej domeny + Google Fonts CSS (wczytywane przez `<link rel="stylesheet">`).
- `font-src 'self' https://fonts.gstatic.com` — pliki fontów. Google Fonts CSS wskazuje na `fonts.gstatic.com`.
- `img-src 'self' data:` — obrazy z własnej domeny + `data:` URI (grain texture w globals.scss jest jako `url("data:image/svg+xml,...")`).
- `connect-src 'self' https://api.emailjs.com` — fetch/XHR tylko do własnej domeny i EmailJS API.
- `frame-ancestors 'none'` — CSP-level odpowiednik X-Frame-Options DENY (nowocześniejszy i bardziej wpierany przez przeglądarki).
- `base-uri 'self'` — blokuje wstrzyknięcie `<base>` tagu który mógłby przekierować wszystkie relatywne URLe.
- `form-action 'self'` — blokuje przesłanie formularza do zewnętrznej domeny przez HTML action (EmailJS używa fetch, nie form action, więc to nie przeszkadza).

---

## Rekomendacja dla Szymona

Wdróż `vercel.json` i napraw formularz (honeypot + maxLength + phone regex + ESLint error) — łącznie < 2 godziny pracy, a efekt widoczny w każdym narzędziu security scoring.

---

## Waiting for GO

Po akceptacji wdrożę następujące zmiany:

1. Utworzę `vercel.json` z kompletem security headers (blok powyżej).
2. Naprawię błąd ESLint w `QuickBookingDrawer.tsx` — usunę `useEffect` resetujący status, zastąpię lokalnym `handleClose`.
3. Dodam honeypot (ukryte pole `website`) i time-gate (3 sekundy od otwarcia drawera).
4. Dodam `maxLength` na polach `name` (80), `phone` (20), `note` (300) oraz regex walidację dla telefonu.
5. Usunę `public/vite.svg`.

Nie modyfikuję `.env`, `package.json` ani konfiguracji EmailJS w dashboardzie (to po Twojej stronie).
