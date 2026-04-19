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
            © {year} BarberSpace
          </div>
        </div>

        <div className={styles.right}>
          <a className={styles.link} href="#kontakt">
            Kontakt
          </a>
          <a className={styles.link} href="#cennik">
            Cennik
          </a>
          <a className={styles.link} href="#top" aria-label="Do góry">
            Do góry ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
