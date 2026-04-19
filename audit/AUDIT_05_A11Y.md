# Etap 5 — Dostępność (A11Y)
_BarberSpace · audyt A11Y · data: 2026-04-19_

---

## Przegląd komponentów

| Komponent | Stan | Główne problemy |
|---|---|---|
| QuickBookingDrawer | ★★★★☆ | Brak redirect focus przy success |
| FAQ | ★★★★★ | OK |
| Hero | ★★★☆☆ | Obraz w `aria-hidden` kontenerze |
| Services | ★★★★☆ | OK |
| Pricing | ★★★☆☆ | `role="listitem"` na `<button>` |
| Team | ★★★★☆ | Badge bez aria-label |
| Testimonials | ★★★★★ | OK (`<blockquote>` + `<footer>`) |
| Gallery | ★★★★☆ | OK |
| Process | ★★★★☆ | OK (`<ol>`) |
| Header | ★★★★☆ | Brak focus trap w mobilnym menu |
| Footer | ★★★★☆ | ↑ znak czytany przez SR |
| Ticker | ★★★★★ | `aria-hidden="true"` ✅ |

---

## P0 — WCAG fail / krytyczne

### P0-1: Hero — obraz w `aria-hidden` kontenerze
**Plik:** `src/components/sections/Hero/Hero.tsx:94`

```tsx
<div className={styles.visual} aria-hidden="true">   // ← ukrywa WSZYSTKO dla AT
  <img
    src={fryzjer}
    alt="Barber podczas precyzyjnego strzyżenia w BarberSpace"  // ← nigdy nie przeczytane
```

`aria-hidden="true"` na wrappingu `div` ukrywa cały podgląd dla AT — alt tekst obrazu jest martwy.
`aria-hidden` powinien być tylko na dekoracyjnych dzieciach (`.frame`, `.tag`, `.sweep`), nie na całym `div`.

**Fix:** Usuń `aria-hidden` z `.visual`, dodaj je do dekoracyjnych dzieci.

---

### P0-2: Pricing — `role="listitem"` na `<button>` nadpisuje rolę przycisku
**Plik:** `src/components/sections/Pricing/Pricing.tsx:74,81`

```tsx
<div className={styles.grid} role="list" aria-label="Lista usług i cen">
  <button
    role="listitem"     // ← ARIA spec: button nie może mieć roli listitem
    aria-label={`Wybierz ${p.name} i przejdź do rezerwacji`}
```

ARIA spec (APG) wymaga, żeby element z rolą `listitem` był dzieckiem `list` lub `menu`, ale `<button>` ma _natywną_ rolę `button` i dodanie `role="listitem"` ją nadpisuje — AT nie ogłosi elementu jako przycisku.

**Fix:** Zamień na `<ul><li><button>` — natywna semantyka nie wymaga atrybutów `role`.

---

## P1 — Znacząca bariera

### P1-1: Header — brak focus trap w mobilnym menu
**Plik:** `src/components/layout/Header/Header.tsx:130–175`

Hamburger menu otwiera `<aside id="mobile-menu">` z overlaym, ale:
- Tab pozwala "uciec" focus poza drawer do treści w tle
- Header implementuje ESC + lock body scroll, ale brakuje pętli Tab
- QuickBookingDrawer ma już `useFocusTrap` — dokładnie tego samego można użyć tutaj

**Fix:** Przenieść `useFocusTrap` do `Header` (lub wyeksportować shared hook).

---

### P1-2: QuickBookingDrawer — focus nie przenoszony przy success state
**Plik:** `src/components/sections/Booking/QuickBookingDrawer.tsx:135–146`

Po wysłaniu formularza renderuje się success state. Focus zostaje na ostatnim aktywnym elemencie (przycisku Submit), który znika z drzewa. SR użytkownik nie wie, że coś się zmieniło.

**Fix:** `useEffect` obserwujący `status === "success"` → focus na `.successTitle` lub przycisk "Zamknij".

---

## P2 — Znaczące poprawki

### P2-1: `$muted` kolor — kontrast poniżej WCAG AA
**Plik:** `src/styles/tokens/_colors.scss:12`

`$muted: #7A7060` na tle `$bg: #F7F4EF` = **≈4.1:1** (WCAG AA wymaga 4.5:1 dla normalnego tekstu).
Używany w `.subtitle`, `.meta`, `.role` i innych elementach pomocniczego tekstu.

**Fix:** Ściemnić do `#6B6254` (≈4.6:1) lub `#655D4E` (≈5.2:1).

---

### P2-2: `$gold` kolor — kontrast tylko dla large text
**Plik:** `src/styles/tokens/_colors.scss:19`

`$gold: #B8762E` na tle `$bg: #F7F4EF` = **≈3.1:1** — dopuszczalne tylko dla large text (≥18px lub ≥14px bold).
Używany dla wartości statystyk Hero (duże), ale też potencjalnie dla mniejszych elementów.

**Fix:** Ograniczyć użycie `$gold` do tekstu ≥18px; lub ściemnić do `#9A6025` (≈4.6:1) dla universal use.

---

### P2-3: Footer — strzałka w tekście linku
**Plik:** `src/components/layout/Footer/Footer.tsx:24`

```tsx
<a className={styles.link} href="#top">
  Do góry ↑        {/* ← "↑" może być odczytane przez SR jako "upwards arrow" */}
</a>
```

**Fix:** `aria-label="Do góry"` na tym linku.

---

### P2-4: Team — badge doświadczenia bez kontekstu
**Plik:** `src/components/sections/Team/Team.tsx:43–46`

```tsx
<div className={styles.expBadge}>
  <span className={styles.expNum}>{member.years}</span>
  <span className={styles.expUnit">lat</span>
</div>
```

SR odczyta "5 lat" — bez kontekstu "Doświadczenie". Wizualnie lokalizacja badge obok nazwy daje kontekst, ale AT tego nie widzi.

**Fix:** `aria-label={`Doświadczenie: ${member.years} lat`}` na `div.expBadge`.

---

## P3 — Drobne udoskonalenia (opcjonalne)

| ID | Opis | Plik |
|---|---|---|
| P3-1 | `key={i}` w Testimonials i FAQ — nie wpływ na A11Y ale warto | FAQ.tsx:34, Testimonials.tsx:27 |
| P3-2 | Stats w Hero — animowane liczniki bez `aria-live`; ok (nie spam AT) | Hero.tsx:69 |
| P3-3 | `<aside>` mobile menu — brak `role="dialog"` | Header.tsx:138 |
| P3-4 | Drawer close button label "Zamknij" — rozważyć "Zamknij menu" | QuickBookingDrawer.tsx:130 |

---

## Plan implementacji (P0→P1→P2)

```
[P0-1] Hero: usuń aria-hidden z .visual, dodaj do .frame/.tag/.sweep
[P0-2] Pricing: <ul><li><button> — usuń role=list/listitem
[P1-1] Header: wyeksportuj useFocusTrap ze shared hook, podepnij w Header
[P1-2] QuickBookingDrawer: useEffect na status==='success' → focus Zamknij
[P2-1] _colors.scss: $muted #7A7060 → #6B6254
[P2-2] (opcjonalne) $gold — tylko large text
[P2-3] Footer: aria-label="Do góry"
[P2-4] Team: aria-label na expBadge
```

---

## Co działa dobrze (nie ruszać)

- FAQ accordion: `aria-expanded`, `aria-controls`, `<dl><dt><dd>` — ✅ wzorcowe
- QuickBookingDrawer: focus trap, `aria-modal`, `role="dialog"`, `role="alert"`, `aria-invalid`, `aria-describedby` — ✅ bardzo dobre
- Ticker: `aria-hidden="true"` ✅
- Process: `<ol>`, stepNum `aria-hidden` ✅
- Testimonials: `<blockquote>` + `<footer>` ✅
- Honeypot: `tabIndex={-1}` + `aria-hidden="true"` ✅
- Wszystkie sekcje mają `aria-label` ✅
