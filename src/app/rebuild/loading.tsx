import styles from "./utility-state.module.css";

export default function RebuildLoading() {
  return (
    <main
      id="main"
      className={styles.page}
      data-utility-state="loading"
      role="status"
      aria-live="polite"
      aria-label="Preparing THROHI content"
    >
      <div className={styles.loadingGrid}>
        <p className={styles.eyebrow}>Preparing catalogue content</p>
        <div className={styles.loadingHead} aria-hidden="true">
          <div className={styles.loadingTitle} />
          <div className={styles.loadingMeta} />
        </div>
        <div className={styles.loadingRows} aria-hidden="true">
          {[0, 1, 2].map((row) => (
            <div className={styles.loadingRow} key={row}>
              <span className={styles.loadingBlock} />
              <span className={styles.loadingBlock} />
              <span className={styles.loadingBlock} />
            </div>
          ))}
        </div>
        <span className={styles.srOnly}>Preparing the requested THROHI page.</span>
      </div>
    </main>
  );
}
