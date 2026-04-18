# ETAP 3 — UNIKALNOŚĆ I ESTETYKA

**Data:** 2026-04-18  
**Projekt:** BarberSpace  
**Ocena ogólna:** 6.5 / 10

---

## Oceny składowe (1–10)

| Obszar | Ocena | Uzasadnienie |
|---|---|---|
| **System typograficzny** | 9/10 | Fluid clamp, 3 rodziny krojów, precyzyjne letter-spacing — klasa pro |
| **FAQ accordion** | 9/10 | grid-template-rows: 0fr→1fr bez JS — rzadko spotykane |
| **Ticker / Infinite strip** | 9/10 | will-change, linear infinite, poprawne prefixes |
| **Nagłówek** | 8/10 | backdrop-filter blur, scaleX underline — solidne |
| **Booking Drawer** | 8/10 | Easing cubic-bezier(0.2, 0.9, 0.2, 1), focus-trap, praca |
| **Services** | 8/10 | Crossfade zdjęć, slide strzałki — ponadprzeciętne |
| **Hero** | 7/10 | Sweep animation, brak will-change na animowanych elementach |
| **Pricing** | 7/10 | Gradient featured card, generyczny layout |
| **CTA** | 7/10 | mix-blend-mode: luminosity — ładny detal, sekcja mała |
| **Gallery** | 6/10 | scale + overlay — schematyczne, easing liniowy |
| **Team** | 4/10 | Zero animacji, zero hover states — wygląda jak szkielet |
| **Testimonials** | 4/10 | Zero animacji, statyczne karty |
| **Process** | 3/10 | Kompletnie statyczna — żaden element nie reaguje |

---

## Krytyczny bug produkcyjny

**`.bg-shell` nie jest nigdzie zastosowane.**

Klasa definiuje całą tożsamość wizualną projektu (grain texture + radial gradient z `--c-amber`), ale żaden element w JSX jej nie używa. W produkcji tło strony jest czarne bez tekstury — premium efekt nie istnieje.

```scss
// globals.scss — zdefiniowane, ale nigdzie nie aplicowane
.bg-shell {
  background: radial-gradient(...), url("/grain.png");
}
```

To P0 dla wyglądu — priorytet natychmiastowy.

---

## Najważniejsza rekomendacja

**Ożyw sekcje Team, Testimonials i Process — to czarna dziura energii.**

Przez 3/4 przewijania strony użytkownik przechodzi przez kompletnie statyczne sekcje. Po dynamicznych Services i FAQ-u efekt jest gwałtowny. Sekcje Team, Testimonials i Process razem zajmują ~50% scrollu i nie dają żadnej nagrody za eksplorację.

Minimum MVP: stagger reveal dla kart + jeden hover state per karta.

---

## 3 Signature Moments — propozycje

### SM-1: Hero counter "warp start" (P1)
Liczniki statystyk (lat, klientów, opinii) uruchamiają się z efektem "warp" — cyfry lecą od zera z ease-out który zwalnia tuż przy wartości docelowej, a tło lekko pulsuje złotym blaskiem (`--c-amber` @15% opacity, radial gradient scale 1→1.08→1). Działa 1.2s przy pierwszym wejściu w viewport.

**Implementacja:** CSS `@keyframes` + `animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1)` — już mamy useCounters, tylko easing i glow do dodania.

### SM-2: Team card "reveal na hover" (P2)
Karta teamów ma dwie warstwy: domyślnie zdjęcie + imię. Po hover: zdjęcie przesuwa się 8px w górę, spod niego wysuwa się bio (`max-height: 0 → auto` z grid trick jak w FAQ). Subtelny border-top z `--c-amber` pojawia się z lewej strony (`scaleY: 0→1`).

**Implementacja:** SCSS only — `overflow: hidden` + `grid-template-rows: 0fr → 1fr` na `.card__bio`.

### SM-3: Gallery "cursor follower" (P3)
Kursor na galerii zmienia się na własny okrągły element (24px circle, `--c-amber`, `mix-blend-mode: difference`) który podąża za myszą z `lerp(0.12)`. Na hover konkretnego zdjęcia kursor rośnie do 48px z etykietą "ZOOM".

**Implementacja:** jeden `<div>` w Gallery.tsx, `useRef` + RAF `mousemove` — ~50 linii JS/CSS. Wzorzec jak w useMagnetic (capture e.clientX przed RAF).

---

## Moodboard — projekty referencyjne

| Projekt | URL | Co pożyczamy |
|---|---|---|
| Lusion | lusion.co | Cursor follower, grain overlay |
| Resn | resn.co.nz | Stagger reveals z charakterem |
| Basement Studio | basement.studio | Team cards z bio reveal |
| Awwwards SOTD typical | awwwards.com | Liczniki z ease "warp" |

---

## Plan implementacji (po GO)

| Priorytet | Zmiana | Pliki | Czas |
|---|---|---|---|
| P0 | Dodaj `bg-shell` do `<body>` lub `#root` | globals.scss / main.tsx | 5 min |
| P1 | Team: stagger reveal + hover bio | Team.module.scss + Team.tsx | 45 min |
| P1 | Testimonials: stagger reveal kart | Testimonials.module.scss | 20 min |
| P1 | Process: number pulse przy wejściu w viewport | Process.module.scss + Process.tsx | 30 min |
| P1 | Hero: amber glow pulse na counterach | Hero.module.scss | 15 min |
| P2 | Gallery: lepszy easing, stagger w grid | Gallery.module.scss | 20 min |
| P3 | Gallery cursor follower | Gallery.tsx + Gallery.module.scss | 60 min |

---

→ **WAITING FOR GO.**  
Ten etap wymaga dłuższej dyskusji — prawdopodobnie zrobimy kilka iteracji zanim wdrożysz.  
**Sugerowany commit po implementacji:** `feat(ui): animate Team/Testimonials/Process + fix bg-shell application`
