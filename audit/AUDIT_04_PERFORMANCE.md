# ETAP 4 — PERFORMANCE

**Data:** 2026-04-19  
**Projekt:** BarberSpace

---

## Wyniki buildu (punkt wyjścia)

| Plik | Rozmiar raw | Rozmiar gzip |
|---|---|---|
| fryzjer.jpg | **2.28 MB** | — |
| wlosy.jpg | **2.90 MB** | — |
| maszynka.jpg | **3.29 MB** | — |
| logo.jpg | 940 KB | — |
| logos.png | 143 KB | — |
| hero.jpg | 633 KB | **⚠ NIEUŻYWANE** |
| index.css | 51.8 KB | 9.0 KB |
| index.js | 243 KB | 76 KB |
| react.js | 11.3 KB | 4.1 KB |
| emailjs.js | 3.5 KB | 1.5 KB |

**Łącznie obrazy: ~9.5 MB** — bez WebP, bez srcset, bez optymalizacji.

---

## Priorytety

### P0 — hero.jpg (619 KB) — martwy asset
`src/assets/images/hero.jpg` nie jest importowany w żadnym pliku. Żyje w bundlu jako dead weight.

**Fix:** usunąć plik.

---

### P0 — Brak WebP dla obrazów galerii i hero
`fryzjer.jpg` (2.28 MB) to obraz LCP Hero — pierwszy duży element widoczny dla użytkownika. Serwowanie JPG zamiast WebP to strata ~60–70% rozmiaru za darmo.

| Obraz | JPG | Szacowany WebP |
|---|---|---|
| fryzjer.jpg | 2.28 MB | ~400–550 KB |
| maszynka.jpg | 3.29 MB | ~550–700 KB |
| wlosy.jpg | 2.90 MB | ~500–650 KB |
| logo.jpg | 940 KB | ~80–120 KB (lub SVG) |

**Fix:** `vite-imagetools` — import z query `?format=webp&w=1200`. Zero zmian w HTML, Vite robi konwersję w build time.

---

### P1 — Brak `srcset` / responsywnych obrazów
Wszystkie `<img>` serwują pełne desktop resolution (~2400px) na telefon 390px. Użytkownik mobile pobiera 8× więcej danych niż potrzebuje.

**Fix:** `vite-imagetools` generuje kilka szerokości (`800w`, `1200w`, `1920w`) + `sizes` attribute.

---

### P1 — logo.jpg 940 KB — absurd
Logo to plik fotograficzny ~940 KB. Powinno być SVG lub WebP <20 KB. Prawdopodobnie wyeksportowane przez pomyłkę bez optymalizacji.

**Fix:** Skonwertować do WebP 400px max-width (użycie: `Services.tsx` — pole `logoSrc` w content.ts) lub zamienić na SVG.

---

### P2 — Brak Cache-Control dla statycznych assetów
`vercel.json` ustawia security headers, ale nie ma cache policy dla `/assets/*` (hashed JS/CSS/images). Vite generuje pliki z hashem w nazwie (`fryzjer-Cuk0sNeh.jpg`) — można bezpiecznie ustawić `max-age=1year`.

**Fix:** Dodać do `vercel.json`:
```json
{
  "source": "/assets/(.*)",
  "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
}
```

---

### P2 — `fetchPriority="high"` jest, ale brak `width`/`height` na obrazach
`fryzjer.jpg` ma `fetchPriority="high"` ✓ i `loading="eager"` ✓ — dobrze. Ale brak `width` i `height` na `<img>` powoduje CLS (Cumulative Layout Shift), bo przeglądarka nie zna proporcji przed pobraniem.

Wyjątek: obraz hero jest w `aspect-ratio: 3/4` kontenerze — CLS nie wystąpi. Pozostałe obrazy (Gallery) nie mają kontenera z aspect-ratio i brak wymiarów.

**Fix:** Dodać `width` i `height` (lub `aspect-ratio` wrapper) na `<img>` w Gallery.

---

### P3 — JS bundle 243 KB (przed gzip: 76 KB po gzip)
Rozkład jest akceptowalny dla landing page z Lenis, dużym content.ts i animacjami. Nie ma lazy loading sekcji — wszystko ładuje się na starcie. Dla landing page to uzasadnione (brak routingu). Monitoring: jeśli bundle przekroczy 350 KB gzip — wdrożyć lazy imports sekcji Below The Fold.

**Nie wymaga działania na tym etapie.**

---

## Plan implementacji (po GO)

| # | Zmiana | Trudność | Czas |
|---|---|---|---|
| 1 | Usuń `hero.jpg` | Trivial | 1 min |
| 2 | Zainstaluj `vite-imagetools` | Łatwa | 5 min |
| 3 | Konwertuj `fryzjer.jpg` na WebP w Hero | Łatwa | 10 min |
| 4 | Konwertuj `maszynka.jpg` + `wlosy.jpg` na WebP w Services/Gallery | Łatwa | 15 min |
| 5 | Konwertuj `logo.jpg` na WebP | Łatwa | 5 min |
| 6 | Cache-Control w `vercel.json` | Trivial | 5 min |
| 7 | `width`/`height` na `<img>` w Gallery | Łatwa | 10 min |

**Estymowany zysk:** 9.5 MB → ~1.5–2 MB (redukcja ~80%).

---

→ **WAITING FOR GO.**  
**Sugerowany commit po implementacji:** `perf(images): convert to WebP, remove unused hero.jpg, add cache headers`
