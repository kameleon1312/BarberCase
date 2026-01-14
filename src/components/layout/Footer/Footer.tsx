import styles from "./footer.module.scss";
import { brand } from "../../../data/content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} aria-label="Stopka">
      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.brandLine}>{brand.name}</div>
          <div className={styles.muted}>
            © {year} • Projekt portfolio • TypeScript + React
          </div>
        </div>

        <div className={styles.right}>
          <a className={styles.link} href="#kontakt">
            Kontakt
          </a>
          <a className={styles.link} href="#cennik">
            Cennik
          </a>
          <a className={styles.link} href="#top">
            Do góry ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
