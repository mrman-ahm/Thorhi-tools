import styles from "./home-hero.module.css";

export function HomeCatalogueSearch() {
  return (
    <form
      className={styles.search}
      action="/rebuild/products"
      role="search"
      aria-label="Catalogue search"
    >
      <label htmlFor="home-catalogue-query">
        Find an instrument by name or product code
      </label>
      <div>
        <input
          id="home-catalogue-query"
          name="q"
          type="search"
          placeholder="04-0101 or operating scissors"
          autoComplete="off"
        />
        <button type="submit">Find product</button>
      </div>
      <p>Exact code, compact code, instrument name, or product family.</p>
    </form>
  );
}
