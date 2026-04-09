import styles from "./team.module.scss";
import { team } from "../../../data/content";

export function Team() {
  return (
    <section className={styles.section} id="ekipa" aria-label="Nasz zespół">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow} aria-hidden="true">
            <span className={styles.eyebrowNum}>06</span>
            Ekipa
          </p>
          <h2 className={styles.title}>Ludzie za nożyczkami.</h2>
          <p className={styles.subtitle}>
            Znasz swój styl — my znamy swój zawód. Reszta to rozmowa.
          </p>
        </header>

        <div className={styles.grid}>
          {team.map((member) => (
            <article key={member.name} className={styles.card}>
              {/* Monogram — intentional editorial design, no photo */}
              <div className={styles.avatar} aria-hidden="true">
                <span className={styles.initial}>{member.name[0]}</span>
              </div>

              <div className={styles.info}>
                <div className={styles.nameRow}>
                  <h3 className={styles.name}>{member.name}</h3>
                  <div className={styles.expBadge}>
                    <span className={styles.expNum}>{member.years}</span>
                    <span className={styles.expUnit}>lat</span>
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
