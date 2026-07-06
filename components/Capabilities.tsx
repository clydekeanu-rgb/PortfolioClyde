"use client";
import styles from "./Capabilities.module.css";

const items = [
  "Websites that convert.",
  "Booking systems.",
  "Admin dashboards.",
  "AI tools.",
];

export function Capabilities() {
  return (
    <section
      className={styles.wrapper}
      style={{ "--count": items.length } as React.CSSProperties}
    >
      <header className={styles.header}>
        <div className={styles.inner}>
          <h2 className={styles.label}>
            <span aria-hidden="true">I do </span>
            <span className={styles.srOnly}>
              I do websites that convert, booking systems, admin
              dashboards, and AI tools.
            </span>
          </h2>
          <ul aria-hidden="true" className={styles.list}>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </header>
    </section>
  );
}
