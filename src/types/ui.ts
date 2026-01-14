export type NavItem = {
  label: string;
  href: string;
};

export type ServiceItem = {
  title: string;
  desc: string;
  meta: string;
};

export type PriceItem = {
  name: string;
  time: string;
  price: string;
  note?: string;
  featured?: boolean;
};
