import styles from "./header.module.scss";
import { brand, nav } from "../../../data/content";

export function Header() {
  return (
    <header className={styles.header} aria-label="Górna nawigacja">
      <div className={styles.inner}>
        <a className={styles.brand} href="#top" aria-label={brand.name}>
          <span className={styles.mark} aria-hidden="true">
            BS
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandName}>{brand.name}</span>
            <span className={styles.brandTagline}>{brand.tagline}</span>
          </span>
        </a>

        <nav className={styles.nav} aria-label="Nawigacja">
          {nav.map((item) => (
            <a key={item.href} className={styles.link} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a className={styles.cta} href="#rezerwacja">
          Umów wizytę
        </a>
      </div>
    </header>
  );
}
