import styles from "./team.module.scss";
import { team } from "../../../data/content";
import { useInView } from "../../../hooks/useInView";

export function Team() {
  const { ref, inView } = useInView<HTMLElement>();
  const rv = inView ? "visible" : "hidden";

  return (
    <section
      className={styles.section}
      id="ekipa"
      aria-label="Nasz zespół"
      ref={ref}
    >
      <div className={styles.inner}>
        <header className={styles.header} data-reveal={rv}>
          <p className={styles.eyebrow} aria-hidden="true">
            <span className={styles.eyebrowNum}>07</span>
            Ekipa
          </p>
          <h2 className={styles.title}>Ludzie za nożyczkami.</h2>
          <p className={styles.subtitle}>
            Znasz swój styl — my znamy swój zawód. Reszta to rozmowa.
          </p>
        </header>

        <div className={styles.grid}>
          {team.map((member, i) => (
            <article
              key={member.name}
              className={styles.card}
              data-reveal={rv}
              style={{ "--reveal-delay": `${100 + i * 130}ms` } as React.CSSProperties}
            >
              <div className={styles.avatar} aria-hidden="true">
                <span className={styles.initial}>{member.name[0]}</span>
              </div>

              <div className={styles.info}>
                <div className={styles.nameRow}>
                  <h3 className={styles.name}>{member.name}</h3>
                  <div className={styles.expBadge} aria-label={`Doświadczenie: ${member.years} lat`}>
                    <span className={styles.expNum} aria-hidden="true">{member.years}</span>
                    <span className={styles.expUnit} aria-hidden="true">lat</span>
                  </div>
                </div>
                <p className={styles.role}>{member.role}</p>
                <p className={styles.specialty}>{member.specialty}</p>
                <p className={styles.bio}>{member.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
