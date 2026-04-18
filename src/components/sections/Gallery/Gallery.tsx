import styles from "./gallery.module.scss";
import fryzjer from "../../../assets/images/fryzjer.jpg?w=900";
import maszynka from "../../../assets/images/maszynka.jpg?w=900";
import wlosy from "../../../assets/images/wlosy.jpg?w=900";
import { useInView } from "../../../hooks/useInView";

const items = [
  { num: "01", label: "Skin Fade", img: fryzjer },
  { num: "02", label: "Beard Shaping", img: maszynka },
  { num: "03", label: "Classic Cut", img: wlosy },
];

export function Gallery() {
  const { ref, inView } = useInView<HTMLElement>();
  const rv = inView ? "visible" : "hidden";

  return (
    <section
      className={styles.section}
      id="galeria"
      aria-label="Galeria prac"
      ref={ref}
    >
      <div className={styles.inner}>
        <header className={styles.header} data-reveal={rv}>
          <p className={styles.eyebrow} aria-hidden="true">
            <span className={styles.eyebrowNum}>05</span>
            Nasze prace
          </p>
          <h2 className={styles.title}>The Book.</h2>
          <p className={styles.subtitle}>
            Każde cięcie to osobna historia. Tu pokazujemy te, z których jesteśmy dumni.
          </p>
        </header>

        <div className={styles.grid}>
          {items.map((item, i) => (
            <article
              key={item.num}
              className={styles.item}
              data-reveal={rv}
              style={{ "--reveal-delay": `${80 + i * 110}ms` } as React.CSSProperties}
            >
              <div className={styles.imgWrap}>
                <img
                  src={item.img}
                  alt={item.label}
                  className={styles.img}
                  loading="lazy"
                  decoding="async"
                />
                <div className={styles.overlay} aria-hidden="true">
                  <span className={styles.overlayLabel}>{item.label}</span>
                </div>
              </div>
              <div className={styles.meta}>
                <span className={styles.metaNum} aria-hidden="true">{item.num}</span>
                <span className={styles.metaLabel}>{item.label}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
