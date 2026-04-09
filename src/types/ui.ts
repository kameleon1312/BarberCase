export type NavItem = {
  label: string;
  href: string;
};

export type ServiceItem = {
  title: string;
  desc: string;
  meta: string;
  bg: string;
};

export type PriceItem = {
  name: string;
  time: string;
  price: string;
  note?: string;
  featured?: boolean;
};

export type ProcessStep = {
  num: string;
  title: string;
  desc: string;
};

export type TestimonialItem = {
  quote: string;
  author: string;
  service: string;
  date: string;
};

export type TeamMember = {
  name: string;
  role: string;
  specialty: string;
  years: number;
  bio: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};
