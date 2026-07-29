import Image from "next/image";
import Link from "next/link";
import styles from "./rebuild-footer.module.css";

export function RebuildFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.identity}>
          <Image
            src="/brand/throhi-logo-temporary.webp"
            alt="THROHI Medical Tools"
            width={1086}
            height={816}
          />
          <p>Medical instrument catalogue and structured inquiry workspace.</p>
        </div>
        <nav aria-label="Footer navigation">
          <div>
            <p>Catalogue</p>
            <Link href="/rebuild/products">Browse products</Link>
            <Link href="/rebuild/inquiry">Inquiry List</Link>
          </div>
          <div>
            <p>Rebuild</p>
            <Link href="/rebuild#company">Company</Link>
            <Link href="/rebuild#contact">Contact</Link>
          </div>
        </nav>
      </div>
      <div className={styles.status}>
        <p>Development preview. Search indexing is disabled.</p>
        <p>Technical catalogue details remain under client review.</p>
      </div>
    </footer>
  );
}
