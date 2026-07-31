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
          <p>
            Surgical, dental, orthodontic, veterinary and beauty instrument
            ranges from Sialkot, Pakistan.
          </p>
          <span>Sialkot, Pakistan</span>
        </div>
        <nav aria-label="Footer navigation">
          <div>
            <p>Products</p>
            <Link href="/rebuild/products">Browse products</Link>
            <Link href="/rebuild/inquiry">Inquiry List</Link>
          </div>
          <div>
            <p>THROHI</p>
            <Link href="/rebuild/company">Company</Link>
            <Link href="/rebuild/company/scissors-through-time">Scissors Through Time</Link>
            <Link href="/rebuild/catalogues">Catalogues</Link>
            <Link href="/rebuild/contact">Contact</Link>
          </div>
          <div>
            <p>Review</p>
            <Link href="/rebuild/privacy">Privacy notice</Link>
            <Link href="/rebuild/terms">Terms of use</Link>
          </div>
        </nav>
      </div>
      <div className={styles.status}>
        <p>Development preview. Search indexing is disabled.</p>
        <p>Catalogue and legal details remain under review.</p>
      </div>
    </footer>
  );
}
