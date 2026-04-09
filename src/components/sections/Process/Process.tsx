import styles from "./process.module.scss";
import { processSteps } from "../../../data/content";

export function Process() {
  return (
    <section className={styles.section} id="proces" aria-label="Jak to działa">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow} aria-hidden="true">
            <span className={styles.eyebrowNum}>03</span>
            Jak to działa
          </p>
          <h2 className={styles.title}>
            Cztery kroki.<br />Zero komplikacji.
          </h2>
        </header>

        <ol className={styles.steps}>
          {processSteps.map((step) => (
            <li key={step.num} className={styles.step}>
              <div className={styles.stepNum} aria-hidden="true">{step.num}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
