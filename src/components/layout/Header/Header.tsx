import { useEffect, useState } from "react";
import styles from "./header.module.scss";
import { brand, nav } from "../../../data/content";
import logos from "../../../assets/images/logos.png";

export function Header() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    let raf = 0;

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        setCompact((window.scrollY || 0) > 18); // próg zmniejszania
        raf = 0;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // init
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header
      className={styles.header}
      aria-label="Górna nawigacja"
      data-compact={compact ? "true" : "false"}
    >
      <div className={styles.inner}>
        <a className={styles.brand} href="#top" aria-label={brand.name}>
          <span className={styles.logoWrap} aria-hidden="true">
            <img src={logos} alt="" className={styles.logo} />
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
