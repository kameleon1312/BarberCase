# AUDIT 00 — DISCOVERY

## TL;DR

- Build przechodzi czysto, TypeScript strict jest włączony, jeden błąd ESLint (setState w efekcie w QuickBookingDrawer).
- Największy problem techniczny to obrazy — surowe oryginały JPEG o łącznej wadze ~9.5 MB trafiają do bundla 1:1. To zabija LCP i każdy Core Web Vital na mobile.
- `.bg-shell` (grain texture + radial gradient) jest zdefiniowany w globals.scss, ale nigdy nie jest stosowany do żadnego elementu w DOM — efekt premium tła nie istnieje w produkcji.
- `hero.jpg` (633 KB) jest w assets, ale żaden komponent go nie importuje — martwy asset.
- Brak `vercel.json` — zero security headers (CSP, HSTS, X-Frame-Options).
- Projekt nie ma `sitemap.xml` ani `og-image.jpg`, mimo że oba są już referencowane w HTML.

---

## Stan projektu

BarberSpace to dojrzały, samodzielnie zbudowany landing page bez zewnętrznych bibliotek UI i animacji. Architektura jest czytelna: sekcje, layout, hooks, typy i dane są rozdzielone. Design system oparty na tokenach SCSS (kolory, typografia, radii, shadows, z-index) jest spójny i przemyślany. TypeScript strict jest włączony z `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`. Build przechodzi bezbłędnie — 80 modułów, czas kompilacji 2.12s.

Projekt ma jeden lint error (P1) i kilka miejsc gdzie intencja projektowa nie dotarła do produkcji (bg-shell, hero.jpg, sitemap, og-image). Największym wektorem ryzyka technicznego są nieskompresowane obrazy — `maszynka.jpg` waży 3.3 MB przy rozdzielczości 3456×5184 px, co na mobile oznacza LCP rzędu 8–12 sekund.

Nie ma `vercel.json` — platforma deploymentu jest zidentyfikowana, ale zero security headers nie jest skonfigurowane.

Historia commitów pokazuje aktywny, iteracyjny development przez 3 tygodnie — od prototypu przez redesign po dopięcie animacji i EmailJS. Kod nie ma niedokończonych wątków, brak feature branchów, jeden merge commit nie wskazuje na konflikty.

---

## Tabela zależności runtime

| Pakiet | Wersja | Bundle (min) | Bundle (gzip) | Uwagi |
|---|---|---|---|---|
| react | 19.2.0 | ~11.32 kB | ~4.07 kB | Chunked oddzielnie |
| react-dom | 19.2.0 | (w chunck react) | — | React DOM zbudowany razem |
| @emailjs/browser | 4.4.1 | ~3.51 kB | ~1.45 kB | Chunked oddzielnie |

Łączny JS (gzip): react 4.07 kB + emailjs 1.45 kB + app 69.41 kB = **74.93 kB**. Bez Framer Motion — to znacząca zaleta. CSS gzip: 8.56 kB.

Obrazy (nieskompresowane, trafiają do dist 1:1):

| Plik | Wymiary | Rozmiar |
|---|---|---|
| maszynka.jpg | 3456×5184 | 3.29 MB |
| wlosy.jpg | 7360×4912 | 2.90 MB |
| fryzjer.jpg | 3926×5889 | 2.27 MB |
| logo.jpg | 5184×3456 | 0.94 MB |
| logos.png | — | 0.14 MB |
| hero.jpg | 4272×2848 | 0.63 MB (nieużywany) |

Łącznie obrazy: **~10.17 MB** (dist). Docelowo po optymalizacji: < 500 kB.

---

## Mapa struktury folderów

```
src/
├── app/
│   └── App.tsx                   # root — state bookingOpen, routing sekcji
├── assets/
│   └── images/                   # 6 JPG/PNG, wszystkie surowe oryginały
├── components/
│   ├── layout/
│   │   ├── Header/               # scroll-aware, mobile drawer, focus trap
│   │   └── Footer/               # minimal — brand + linki
│   └── sections/
│       ├── Booking/              # QuickBookingDrawer — EmailJS, focus trap, form
│       ├── CTA/                  # rezerwacja + mapa-mock + kontakt
│       ├── FAQ/                  # accordion (grid-template-rows, zero JS height)
│       ├── Gallery/              # editorial grid 3 zdjęcia + hover overlay
│       ├── Hero/                 # LCP section — display type + stats + zdjęcie
│       ├── Pricing/              # 4 karty, klik → booking, featured badge
│       ├── Process/              # 4-krokowy timeline
│       ├── Services/             # live preview — wybór usługi zmienia bg
│       ├── Team/                 # monogram avatary, 2 osoby
│       └── Testimonials/        # blockquote cards
├── data/
│   └── content.ts                # cały content strony w jednym pliku
├── hooks/
│   └── useInView.ts              # IntersectionObserver — scroll reveal
├── styles/
│   ├── base/
│   │   ├── _reset.scss
│   │   └── globals.scss          # scroll, bg-shell (NIEUŻYWANY), skip-link, [data-reveal]
│   ├── tokens/
│   │   ├── _colors.scss          # paleta: bg, surface, line, text, accent, gold
│   │   ├── _radii.scss           # sm/md/lg/xl/pill
│   │   ├── _shadows.scss         # soft/lift/heavy/inner
│   │   ├── _typography.scss      # 3 fonty, 6 size steps, lh, ls
│   │   └── _z.scss               # tylko $header: 30
│   ├── tools/
│   │   └── _mixins.scss          # container, card, card-dark, focusRing, reduceMotion
│   └── index.scss                # entry point — importuje reset + globals
├── types/
│   └── ui.ts                     # NavItem, ServiceItem, PriceItem, ProcessStep, etc.
└── main.tsx                      # ReactDOM.createRoot, StrictMode
```

---

## Inwentarz sekcji strony

| Sekcja | id | Eyebrow # | Co robi |
|---|---|---|---|
| Header | — | — | Sticky nav, scroll-compact state, mobile drawer z focus trapem |
| Hero | #top | 01 | LCP sekcja — display typography, stats (4.9★ / czas / rezerwacja), CTA |
| Services | #uslugi | 02 | Interaktywna lista usług — klik zmienia zdjęcie w preview article |
| Process | #proces | 03 | 4-krokowy ol z numerowanymi krokami |
| Pricing | #cennik | **04** | 4 karty usług, klik otwiera booking z preselekcją, featured badge |
| Gallery | #galeria | **04** | 3-zdjęciowy grid, hover overlay z etykietą |
| Testimonials | #opinie | 05 | 3 blockquote z cytatem, autorem, usługą, datą |
| Team | #ekipa | 06 | 2 karty barberów, monogram avatar, lata doświadczenia |
| FAQ | #faq | 07 | Accordion 6 pytań, animacja przez grid-template-rows |
| CTA | #kontakt | — | Rezerwacja online + telefon + email + meta (adres, godziny) |
| Footer | — | — | Copyright + linki do góry |

**Uwaga:** Zarówno Pricing jak i Gallery mają eyebrow "04" — kolizja numeracji.

---

## 5 rzeczy, które zrobiłeś dobrze

1. **Brak Framer Motion — świadoma decyzja.** Własny hook `useInView` + CSS transitions z `cubic-bezier(0.22, 1, 0.36, 1)` + `data-reveal` atrybuty to rozwiązanie, które nie dokłada 31 kB do bundla i działa płynnie. Easing jest niestandardowy — nie `ease`, nie `linear`. Widać że to przemyślana decyzja, nie oszczędność.

2. **Tokeny design systemu są spójne i kompletne.** Masz 5 plików tokenów (kolory, typografia, radii, shadows, z-index), `clamp()` dla fluid typography, sensowne nomenklaturę (`$text-2`, `$muted`, `$line-strong`). Żaden komponent nie ma magic number dla kolorów.

3. **QuickBookingDrawer ma focus trap, ESC, body scroll lock i aria-modal.** To rzadkość w projektach portfolio — większość pomija dostępność modali. Masz też dedykowany hook `useFocusTrap` i `useLockBodyScroll` wydzielone z komponentu.

4. **TypeScript strict z `noUnusedLocals` i `noUnusedParameters` od razu.** Żadnego `any`, żadnego `@ts-ignore`. Typy danych (`BookingService`, `BookingServiceId`) są wyprowadzone z `as const` — nie duplikujesz definicji. `satisfies` i discriminated unions nie są jeszcze używane, ale baza jest dobra.

5. **SEO i meta tagi są na miejscu przed audytem.** `lang="pl"`, OG tagi, Twitter Card, JSON-LD HairSalon schema z `openingHoursSpecification`, `aggregateRating`, `hasOfferCatalog` — większość projektów portfolio nie ma nic z tej listy.

---

## 5 największych wątpliwości / obszarów wymagających uwagi

1. **Obrazy bez kompresji i bez WebP.** Serwujesz 3-megapikselowe oryginały jako LCP image. `fryzjer.jpg` jako LCP (ma `fetchPriority="high"`) waży 2.27 MB i ma 3926×5889 px. Na łączu 4G to 6–10 sekund do załadowania. LCP będzie katastrofalne na mobile.

2. **`.bg-shell` istnieje tylko w CSS, nigdy w DOM.** Grain texture, radial gradient z `$glow-a/$glow-b` — całe to tło premium jest zdefiniowane w `globals.scss` jako klasa `.bg-shell`, ale żaden element w HTML tej klasy nie ma. Strona wygląda płasko, bez tej warstwy.

3. **Brak `vercel.json` — zero security headers.** Nie ma CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy. Każde narzędzie do security headersów (securityheaders.com) da F.

4. **`og-image.jpg` i `sitemap.xml` są referencowane ale nie istnieją.** `index.html` wskazuje na `https://barberspace.pl/og-image.jpg` (404), `robots.txt` wskazuje na `https://barberspace.pl/sitemap.xml` (404). To psuje social sharing i crawling.

5. **Eyebrow numeracja jest nieciągła — Pricing i Gallery obie mają "04".** To błąd treści, widoczny na stronie. Pricing powinno być "03" lub kolejność sekcji powinna być przemyślana od nowa.

---

## Rekomendacja dla Szymona

Przed jakimkolwiek innym etapem: zoptymalizuj obrazy — to jeden fix, który zmieni Lighthouse score z ~30 na ~85 na mobile bez żadnych innych zmian.

---

## Waiting for GO

Po akceptacji tego raportu przechodzę do **Etapu 1 — Bezpieczeństwo**. Nic nie modyfikuję na podstawie Etapu 0 — discovery jest tylko obserwacją. Zmiany zaczynam od Etapu 1 po Twoim GO.
