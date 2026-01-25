import { useMemo, useState } from "react";
import styles from "./services.module.scss";
import { services } from "../../../data/content";

import hairBg from "../../../assets/images/wlosy.jpg";
import beardBg from "../../../assets/images/maszynka.jpg";
import comboBg from "../../../assets/images/fryzjer.jpg";

const bgByTitle: Record<string, string> = {
  Strzyżenie: hairBg,
  Broda: beardBg,
  Combo: comboBg,
};

type CardStyle = React.CSSProperties & Record<"--card-bg", string>;

function wrap(i: number, len: number) {
  return (i + len) % len;
}

export function Services() {
  const items = useMemo(() => services, []);
  const [active, setActive] = useState(0);

  const current = items[active];
  const bg = bgByTitle[current.title] ?? hairBg;
  const cardStyle: CardStyle = { "--card-bg": `url(${bg})` };

  const next = () => setActive((i) => wrap(i + 1, items.length));
  const prev = () => setActive((i) => wrap(i - 1, items.length));

  return (
    <section className={styles.section} id="uslugi" aria-label="Usługi">
      <div className={styles.inner}>
        <div className={styles.layout}>
          {/* LEFT: tylko copy */}
          <header className={styles.copy}>
            <div className={styles.eyebrow}>USŁUGI</div>
            <h2 className={styles.title}>Wybierz usługę. Resztę dowozimy my.</h2>
            <p className={styles.subtitle}>
              Premium strzyżenie i broda w klimacie „night studio”. Szybki wybór, powtarzalny efekt i zero chaosu.
            </p>

            <a className={styles.cta} href="#rezerwacja" aria-label="Przejdź do rezerwacji">
              Rezerwuj termin
              <span className={styles.ctaArrow} aria-hidden="true">
                →
              </span>
            </a>
          </header>

         
          <article className={styles.preview} style={cardStyle} aria-label={`Podgląd usługi: ${current.title}`}>
            <div className={styles.previewTop}>
              <div className={styles.previewTitleWrap}>
                <h3 className={styles.previewTitle}>{current.title}</h3>
                <p className={styles.previewDesc}>{current.desc}</p>
              </div>

              <span className={styles.badge}>{current.meta}</span>
            </div>

            <div className={styles.previewBottom}>
              <div className={styles.pager} aria-label="Wybór usługi">
                <button type="button" className={styles.previewArrow} onClick={prev} aria-label="Poprzednia usługa">
                  ←
                </button>

                <div className={styles.dots} role="tablist" aria-label="Paginacja usług">
                  {items.map((s, idx) => (
                    <button
                      key={s.title}
                      type="button"
                      role="tab"
                      aria-selected={idx === active}
                      className={`${styles.dot} ${idx === active ? styles.dotActive : ""}`}
                      onClick={() => setActive(idx)}
                      aria-label={`Wybierz: ${s.title}`}
                    />
                  ))}
                </div>

                <button type="button" className={styles.previewArrow} onClick={next} aria-label="Następna usługa">
                  →
                </button>
              </div>

              <div className={styles.pillRow} aria-label="Atuty">
                <span className={styles.pill}>Precyzja</span>
                <span className={styles.pill}>Czystość</span>
                <span className={styles.pill}>Styl</span>
              </div>

              <a className={styles.previewCta} href="#rezerwacja" aria-label="Umów wizytę dla tej usługi">
                Umów wizytę <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
