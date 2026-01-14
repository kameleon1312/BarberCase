import type { NavItem, PriceItem, ServiceItem } from "../types/ui";

export const brand = {
  name: "BarberSpace",
  tagline: "Night Studio • Editorial Cuts",
};

export const nav: NavItem[] = [
  { label: "Usługi", href: "#uslugi" },
  { label: "Cennik", href: "#cennik" },
  { label: "Kontakt", href: "#kontakt" },
];

export const services: ServiceItem[] = [
  {
    title: "Strzyżenie",
    desc: "Precyzyjne proporcje, czyste linie, pełna kontrola detalu. Bez pośpiechu.",
    meta: "30–45 min",
  },
  {
    title: "Broda",
    desc: "Kontur + pielęgnacja. Wykończenie, które robi różnicę w codziennym stylu.",
    meta: "20–35 min",
  },
  {
    title: "Combo",
    desc: "Włosy + broda w jednym rytmie. Spójność, która wygląda premium z każdej strony.",
    meta: "50–70 min",
  },
];

export const pricing: PriceItem[] = [
  { name: "Strzyżenie", time: "40 min", price: "90 zł" },
  { name: "Broda", time: "30 min", price: "70 zł" },
  {
    name: "Combo",
    time: "70 min",
    price: "150 zł",
    note: "Najczęstszy wybór",
    featured: true,
  },
  { name: "Fade / Skin", time: "45 min", price: "110 zł", note: "Dokładne cieniowanie" },
];
