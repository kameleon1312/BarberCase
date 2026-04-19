# Etap 7 — Funkcjonalność i edge cases
_BarberSpace · data: 2026-04-19_

---

## Co działa dobrze (nie ruszamy)

| Element | Stan |
|---|---|
| Honeypot + time-gate w formularzu | ✅ silent drop |
| Podwójne wysyłanie (`canSubmit` + disabled) | ✅ zablokowane |
| EmailJS fallback na błąd → `status="error"` zachowuje dane formularza | ✅ |
| `useMagnetic` — `(hover: hover) and (pointer: fine)` guard | ✅ |
| `useLenis` — `(pointer: coarse)` guard | ✅ działa |
| `useInView` `once: true` — brak re-triggerów | ✅ |
| `useCounters` — jeden start, RAF cleanup | ✅ |
| Preselect usługi po kliknięciu w Pricing | ✅ |
| `openedAtRef` — time-gate 3s | ✅ |
| Zamknięcie drawera przez backdrop (onMouseDown) | ✅ |
| Lenis `stop()`/`start()` przy otwartym drawerze | ✅ |

---

## P1 — Znaczące bariery funkcjonalne

### P1-1: Anchor linki na mobile scrollują pod header
**Pliki:** `src/styles/index.scss` (lub globals), `useLenis.ts`

Lenis aktywuje się tylko na `pointer: fine` (desktop z myszą).
Na mobilnym (`pointer: coarse`), kliknięcie:
- `#rezerwacja` (Services, CTA, Header)
- `#cennik` (Hero)
- `#top`, `#kontakt`, `#galeria`, `#uslugi`, `#faq`, etc.

powoduje natywny scroll przeglądarki bez offsetu — target ląduje **pod sticky headerem** (84px).
Lenis używa `offset: -84` tylko na desktopie.

**Fix:** `scroll-padding-top: 84px` na `html` — działa natywnie, bez JS:
```css
html {
  scroll-padding-top: 84px;
}
```
Lenis i tak nadpisuje to swoim `offset` na desktopie, więc nie ma konfliktu.

---

### P1-2: Brak skip-to-content linku
**Plik:** `src/app/App.tsx`, `src/styles/index.scss`

Klawiaturowy użytkownik wchodzi na stronę i musi Tab przez cały header
(logo + 5 linków nav + CTA + burger) zanim dotrze do głównej treści.
WCAG 2.1 SC 2.4.1 wymaga mechanizmu ominięcia bloków nawigacyjnych.

`<main id="main">` istnieje, ale brak linku `<a href="#main">`.

**Fix:** Wizualnie ukryty link na samym początku `<App>`, widoczny przy focus:
```tsx
<a className="skip-link" href="#main">Przejdź do treści</a>
```
```css
.skip-link {
  position: absolute;
  top: -40px;
  &:focus { top: 8px; }
}
```

---

## P2 — Brak ErrorBoundary

**Plik:** `src/main.tsx`

Nieobsłużony wyjątek Reacta (np. błąd w EmailJS module, null ref, JSON parse) usuwa cały DOM i zostawia białą stronę bez żadnego komunikatu.

Był w backlogu P2 z Etapu 2, teraz czas go wdrożyć.

**Fix:** Prosty komponent + owinięcie `<App>` w `main.tsx`:
```tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## P3 — Drobne edge case'y (nie implementujemy)

| ID | Opis | Wpływ |
|---|---|---|
| P3-1 | `today` memoized `[]` — staje się wczoraj po północy | Minimalny, użytkownik odświeży |
| P3-2 | Slot 19:30 dla usługi 90 min przekracza zamknięcie (20:00) | Brak walidacji po stronie klienta — OK bo barber potwierdza ręcznie |
| P3-3 | `reset()` nie czyści pól formularza — dane pozostają przy ponownym otwarciu | Prawdopodobnie celowe (wygoda stałych klientów) |
| P3-4 | `isCoarsePointer` ewaluowany na moduł load — nie aktualizuje się przy zmianie device mode w DevTools | Nie dotyczy produkcji |

---

## Plan implementacji

```
[P1-1] globals/index.scss: scroll-padding-top: 84px na html
[P1-2] App.tsx + globals: skip-link (wizualnie ukryty, widoczny na focus)
[P2]   ErrorBoundary: nowy komponent + owinięcie w main.tsx
```
