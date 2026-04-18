# AUDIT 02 — ARCHITEKTURA I JAKOŚĆ KODU

## TL;DR

- Zero `any`, zero `@ts-ignore` — baza TypeScript jest czysta. Jeden wyjątek: `as unknown as` w Hero.tsx:23 (double assertion — P1, do naprawy w 3 liniach).
- Eyebrow numeracja jest zepsuta od sekcji 5 — Gallery i Pricing mają "04", wszystkie następne są o 1 za małe.
- `useCounter.ts` (singular) jest dead code — `useCounters.ts` (plural) go zastępuje, obu nie potrzeba.
- Cztery hooki bez explicit return type — szybki P1.
- Brak Error Boundary, brak path alias, brak `noImplicitReturns` w tsconfig — solidne P2.

---

## Znaleziska

### P0 — Krytyczne

Brak.

---

### P1 — Istotne

**1. `as unknown as` w Hero.tsx:23 — double type assertion**

Obserwacja: `STAT_CONFIGS as unknown as { target: number; duration?: number; decimals?: number }[]` — `as const` tworzy `readonly` tuple, `useCounters` oczekuje mutowalnej tablicy. Programista przebił się przez system typów zamiast naprawić sygnatury.

Ryzyko: Każdy senior patrzący na PR z `as unknown as` pyta „co tu jest nie tak" — ta konstrukcja jest markerem ukrytego problemu typów. Dla projektu portfolio to czerwona flaga.

Propozycja: Zmienić `useCounters` żeby przyjmował `ReadonlyArray<CounterConfig>`. Jeden wyraz, zero assertionów.

Effort: XS

---

**2. Eyebrow numeracja — kolizja i kaskadowy błąd**

Obserwacja: Pricing i Gallery obie mają eyebrow `"04"`. Wszystkie sekcje za Gallery są o 1 za małe:

| Sekcja | Jest | Powinno być |
|---|---|---|
| Pricing | 04 | 04 ✓ |
| Gallery | 04 | 05 ❌ |
| Testimonials | 05 | 06 ❌ |
| Team | 06 | 07 ❌ |
| FAQ | 07 | 08 ❌ |

Ryzyko: Widoczny błąd treści na stronie. Klient scrolluje i widzi dwa razy "04". To jest zauważalne.

Propozycja: Zmienić 4 liczby w 4 plikach.

Effort: XS

---

**3. `useCounter.ts` (singular) — dead code**

Obserwacja: `src/hooks/useCounter.ts` istnieje i animuje jedną wartość. `src/hooks/useCounters.ts` (plural) animuje wiele wartości jednym RAF loop i jest aktywnie używany w Hero.tsx. `useCounter.ts` nie jest importowany nigdzie.

Ryzyko: Martwy kod w repozytorium portfolio. `noUnusedLocals` nie łapie tego bo to osobny plik — TypeScript nie analizuje cross-file dead exports bez dodatkowych narzędzi.

Propozycja: Usunąć `src/hooks/useCounter.ts`.

Effort: XS

---

**4. Brak explicit return type na 4 hookach**

Obserwacja:

| Hook | Brakuje |
|---|---|
| `useBookingForm.ts:35` | return type — 14-polowy obiekt |
| `useInView.ts:14` | return type — `{ ref, inView }` |
| `useLenis.ts:10` | return type — `void` |
| `useMagnetic.ts:14` | return type — union z callbackami |

`useCounter.ts` i `useCounters.ts` i `usePrefersReducedMotion.ts` mają explicit return types ✓.

Ryzyko: Bez explicit return type zmiany w ciele hooka nie powodują błędu TypeScript przy incompatybilnym interface użycia. Dla autora hook to pułapka na refaktor.

Propozycja: Dodać typy. Dla `useBookingForm` — wyeksportować dedykowany typ `UseBookingFormReturn`.

Effort: S

---

### P2 — Ulepszenia

**5. Brakujące flagi TypeScript: `noImplicitReturns` i `noUncheckedIndexedAccess`**

Obserwacja: `tsconfig.app.json` ma `strict: true`, `noUnusedLocals`, `noUnusedParameters`, ale brakuje `noImplicitReturns` (funkcja może nie zwrócić wartości w części ścieżek bez błędu) i `noUncheckedIndexedAccess` (dostęp przez index może zwrócić `undefined` bez ostrzeżenia).

Ryzyko/Koszt: `noUncheckedIndexedAccess` może wprowadzić wiele nowych błędów w istniejącym kodzie (wymaga testowania). `noImplicitReturns` jest bezpieczna i powinna być od razu.

Propozycja: Dodać `noImplicitReturns: true` teraz. `noUncheckedIndexedAccess` — osobna iteracja po sprawdzeniu ile zmian wywołuje.

Effort: S

---

**6. Brak Error Boundary**

Obserwacja: `App.tsx` nie ma żadnego `<ErrorBoundary>`. Niezłapany wyjątek w runtime unmontuje całe drzewo React — user widzi białą stronę bez żadnego komunikatu.

Ryzyko: Dla projektu portfolio białe screeny to najgorszy scenariusz kiedy klient testuje stronę. React error boundary musi być klasowym komponentem lub używać `react-error-boundary` (1.5kB).

Propozycja: Prosty klasowy `ErrorBoundary` w `src/components/layout/ErrorBoundary/` z fallback w stylu projektu. Nie potrzeba zewnętrznej biblioteki.

Effort: S

---

**7. Brak path alias — głębokie relative imports**

Obserwacja: Wszystkie komponenty importują przez `../../../` — np. w `QuickBookingDrawer.tsx`:
```typescript
import { bookingServices } from "../../../data/content";
import { useBookingForm } from "../../../hooks/useBookingForm";
```

Ryzyko: Przy refaktorze struktury folderów każdy import się psuje. Senior patrzy na `../../../` i wie że nie ma path aliases skonfigurowanych.

Propozycja: Dodać `"@": "./src"` alias w `tsconfig.app.json` (paths) i `vite.config.ts` (resolve.alias). Zmienić importy — można stopniowo.

Effort: M (zmiana konfiguracji S + update importów M)

---

**8. `useLockBodyScroll` zduplikowany w Header.tsx i QuickBookingDrawer.tsx**

Obserwacja: `Header.tsx` ma inline `useEffect` blokujący body scroll (linie 36–45). `QuickBookingDrawer.tsx` ma dedykowaną funkcję `useLockBodyScroll` (linie 14–21). Ta sama logika, dwie implementacje.

Ryzyko: Przy zmianie (np. dodanie `padding-right` żeby zapobiec layout shift przy ukryciu scrollbara) trzeba zmieniać w dwóch miejscach.

Propozycja: Wyekstrahować `useLockBodyScroll` do `src/hooks/useLockBodyScroll.ts`, zaimportować w obu komponentach.

Effort: S

---

### P3 — Nice to have

**9. `Ticker.tsx` używa index jako `key`**

Obserwacja: `{repeated.map((item, i) => <span key={i} ...>)}` — index jako key w tablicy gdzie elementy są duplikowane. React nie rozróżni elementów przy re-render.

Ryzyko: Minimalny — Ticker jest statyczny, nie re-renderuje się. Ale to wzorzec który lepiej nie propagować.

Propozycja: `key={`${item}-${i}`}` — unikalne, deterministyczne.

Effort: XS

---

**10. Magic values w hookach**

- `useLenis.ts:18` — `lerp: 0.09` — bez nazwanej stałej
- `useMagnetic.ts` — `520` ms timeout bez komentarza dlaczego akurat tyle (powinno pokrywać LEAVE_TRANSITION 500ms + margines)

Propozycja: Dodać `const MAGNETIC_LEAVE_DURATION_MS = 520` i `const LENIS_LERP = 0.09` nad funkcją.

Effort: XS

---

## Lista plików z największym smell score

| Plik | Problem | Linie |
|---|---|---|
| [Hero.tsx:23](src/components/sections/Hero/Hero.tsx#L23) | `as unknown as` double assertion | 1 |
| [Gallery.tsx:27](src/components/sections/Gallery/Gallery.tsx#L27) | eyebrow "04" → "05" | 1 |
| [Testimonials.tsx:19](src/components/sections/Testimonials/Testimonials.tsx#L19) | eyebrow "05" → "06" | 1 |
| [Team.tsx:19](src/components/sections/Team/Team.tsx#L19) | eyebrow "06" → "07" | 1 |
| [FAQ.tsx:23](src/components/sections/FAQ/FAQ.tsx#L23) | eyebrow "07" → "08" | 1 |
| [useCounter.ts](src/hooks/useCounter.ts) | dead code — cały plik do usunięcia | 41 |
| [useBookingForm.ts:35](src/hooks/useBookingForm.ts#L35) | brak explicit return type | 1 |
| [useInView.ts:14](src/hooks/useInView.ts#L14) | brak explicit return type | 1 |
| [useLenis.ts:10](src/hooks/useLenis.ts#L10) | brak explicit return type | 1 |
| [useMagnetic.ts:14](src/hooks/useMagnetic.ts#L14) | brak explicit return type | 1 |

---

## Architektura — ocena

Brak zmian strukturalnych do wprowadzenia na tym etapie. Podział `sections/` | `layout/` | `hooks/` | `data/` | `types/` jest czytelny i konsekwentny. Nowe komponenty z remote (Ticker, useLenis, useMagnetic, useCounters) pasują do tej architektury. Jedyna rekomendacja strukturalna to wyciągnięcie `useLockBodyScroll` do wspólnego hooka (P2).

---

## Rekomendacja dla Szymona

Napraw `as unknown as` w Hero.tsx i eyebrow numerację — to są jedyne rzeczy widoczne dla oka seniora w code review, reszta to wewnętrzna jakość.

---

## Waiting for GO

Po akceptacji wdrożę P1:

1. `useCounters.ts` — zmiana sygnatury na `ReadonlyArray<CounterConfig>`, usunięcie `as unknown as` w `Hero.tsx`
2. Eyebrow numeracja — 4 pliki, 4 zmiany: Gallery→05, Testimonials→06, Team→07, FAQ→08
3. Usunięcie `src/hooks/useCounter.ts`
4. Explicit return types na hookach: `useBookingForm`, `useInView`, `useLenis`, `useMagnetic`
5. Dodanie `noImplicitReturns: true` do `tsconfig.app.json`
