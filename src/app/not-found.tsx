import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return <><SiteHeader /><main id="main" className="not-found-page"><div className="container"><article><p className="eyebrow">404 · ROUTE NOT FOUND</p><h1>This catalogue route does not exist.</h1><p>Search the catalogue, browse a product division, or add an unlisted instrument directly to an inquiry.</p><div className="button-row"><Link className="button primary" href="/search">Search products</Link><Link className="button secondary" href="/products">Browse divisions</Link><Link className="button secondary" href="/inquiry?manual=1">Add unlisted item</Link></div></article></div></main><SiteFooter /></>;
}
