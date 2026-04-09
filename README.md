<p align="center">
  <img src="public/favicon.png" alt="BarberSpace" width="96" height="96" style="border-radius: 18px;" />
</p>

# ✂️ BarberSpace — Premium Barber Landing Page

**BarberSpace** to landing page dla premium salonu barberskiego, zbudowany w stylu editorial — ciepłe tło jak papier, głęboka czerwień jako akcent, Barlow Condensed w roli kroju display. Inspiracja: NYC barbershop culture przez pryzmat magazynu Dazed.

Projekt miał wyglądać jak zaprojektowany przez człowieka, nie wygenerowany.

> 🔗 **Live:** [barber-case-world.vercel.app](https://barber-case-world.vercel.app)

---

## ⚙️ Stack

| | |
|---|---|
| ⚛️ React 19 + TypeScript | architektura komponentów |
| 🎨 SCSS Modules | własny system tokenów, zero Tailwinda |
| ⚡ Vite | build + HMR |
| 📧 EmailJS | wysyłka maili bez backendu |
| 🌀 Lenis | smooth scroll z momentum |

---

## ✨ Co jest w projekcie

**Sekcje**
- 🔝 Hero — oversized display type, statystyki z animowanym licznikiem, zdjęcie 3:4
- ⚡ Services — numerowana lista + live preview z crossfade'em zdjęcia
- 🔄 Process — 4-krokowy grid z separatorami
- 💰 Pricing — 4 karty, featured wariant, klik otwiera booking
- 🖼 Gallery — editorial portrait grid, hover overlay
- 💬 Testimonials — blockquote cards, Playfair Display
- 👥 Team — ciemna sekcja, monogram avatary
- ❓ FAQ — accordion animowany przez `grid-template-rows` (zero JS height)

**Booking drawer**
- Slide-in panel z focus trapem i scroll lockiem
- Stany: `sending / success / error`
- Wysyłka przez EmailJS, logika formularza wydzielona do hooka

**Pod maską**
- Ticker strip między sekcjami — czysty CSS, zero JS
- Magnetic button na głównych CTA (`getBoundingClientRect` + RAF)
- Scroll reveal na każdej sekcji (własny `useInView`, `IntersectionObserver`)
- `usePrefersReducedMotion` bramkuje wszystkie animacje JS
- Pełne SEO: Open Graph, JSON-LD `HairSalon` schema, meta tagi

---

## ⚡ Uruchomienie

```bash
npm install
cp .env.example .env   # uzupełnij klucze EmailJS
npm run dev
```

> Klucze EmailJS — sprawdź [.env.example](.env.example)

---

Szymon Pochopień
