import styles from "./ticker.module.scss";

const ITEMS = [
  "Premium Cuts",
  "Precision Fades",
  "Beard Shaping",
  "Night Studio",
  "NYC Culture",
  "Clean Lines",
  "Editorial Style",
];

export function Ticker() {
  const repeated = [...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div className={styles.track} aria-hidden="true">
      <div className={styles.inner}>
        {repeated.map((item, i) => (
          <span key={i} className={styles.item}>
            {item}
            <span className={styles.dot}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
