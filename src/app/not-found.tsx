import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return <><SiteHeader /><main id="main" className="utility-v2 not-found-v2"><section className="not-found-shell"><div className="container not-found-grid"><div className="not-found-code" aria-hidden="true"><span>4</span><i /><span>4</span></div><article><p className="eyebrow">404 · ROUTE NOT FOUND</p><h1>This catalogue route does not exist.</h1><p>The product may have a different family route, the address may be incomplete, or the item may not yet appear in the public catalogue.</p><div className="utility-action-row"><Link className="utility-action primary" href="/search">Search products</Link><Link className="utility-action" href="/products">Browse divisions</Link><Link className="utility-action warning" href="/inquiry?manual=1">Add unlisted item</Link></div></article></div></section></main><SiteFooter /></>;
}
