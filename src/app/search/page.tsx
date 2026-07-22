import Link from "next/link";
import { ProductCard, SeedDataNotice } from "@/components/catalogue-ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { divisionSlugs, divisions, families, type DivisionSlug } from "@/lib/catalogue";
import { searchProducts } from "@/lib/search";

export const metadata = { title: "Search" };

function matchTone(reason: string) {
  if (reason === "exact code") return "exact";
  if (reason.includes("code")) return "technical";
  if (reason.includes("family") || reason.includes("division")) return "contextual";
  return "name";
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; division?: string; family?: string; sort?: string }> }) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const division = divisionSlugs.includes(params.division as DivisionSlug) ? params.division as DivisionSlug : undefined;
  const family = params.family && families.some(item => item.slug === params.family && (!division || item.division === division)) ? params.family : undefined;
  const results = searchProducts(q, { division, family });
  const sorted = params.sort === "code" ? [...results].sort((a, b) => a.product.code.localeCompare(b.product.code)) : results;
  const relevantFamilies = division ? families.filter(item => item.division === division) : families;
  const activeContext = [division && divisions.find(item => item.slug === division)?.label, family && families.find(item => item.slug === family && (!division || item.division === division))?.label].filter(Boolean);

  return <><SiteHeader /><main id="main" className="search-v2">
    <section className="search-v2-hero">
      <div className="container search-v2-hero-grid">
        <div className="search-v2-intro">
          <p className="eyebrow dark">CATALOGUE SEARCH / 07</p>
          <h1>Find the instrument.<br /><span>Keep the context.</span></h1>
          <p>Search exact or partial codes, product names, aliases, families, and divisions through the existing ranked catalogue engine.</p>
          <div className="search-shortcut-note"><kbd>⌘ K</kbd><span>Open the command from any page</span></div>
        </div>

        <details className="search-filter-shell" open>
          <summary><span>Search and refine</span><small>{activeContext.length ? activeContext.join(" · ") : "All catalogue records"}</small></summary>
          <form className="search-v2-form" action="/search">
            <div className="search-query-field"><label htmlFor="search-q">Search query</label><input id="search-q" name="q" type="search" defaultValue={q} placeholder="Product name or exact / partial code" autoComplete="off" /></div>
            <div><label htmlFor="search-division">Division</label><select id="search-division" name="division" defaultValue={division ?? ""}><option value="">All divisions</option>{divisions.map(item => <option value={item.slug} key={item.slug}>{item.label}</option>)}</select></div>
            <div><label htmlFor="search-family">Family</label><select id="search-family" name="family" defaultValue={family ?? ""}><option value="">All families</option>{relevantFamilies.map(item => <option value={item.slug} key={`${item.division}-${item.slug}`}>{item.label}</option>)}</select></div>
            <div><label htmlFor="search-sort">Sort</label><select id="search-sort" name="sort" defaultValue={params.sort ?? "relevance"}><option value="relevance">Relevance</option><option value="code">Product code</option></select></div>
            <button type="submit">Search catalogue <span aria-hidden="true">↗</span></button>
          </form>
        </details>
      </div>
    </section>

    <div className="container"><SeedDataNotice /></div>

    <section className="search-results-section" aria-labelledby="search-results-title">
      <div className="container">
        <header className="search-results-heading">
          <div><p className="eyebrow">RANKED RESULTS</p><h2 id="search-results-title">{q ? `${sorted.length} ${sorted.length === 1 ? "match" : "matches"}` : `${sorted.length} catalogue records`}</h2></div>
          <div className="search-result-context"><span>{q ? `Query: ${q}` : "Browse state"}</span>{activeContext.map(item => <span key={item}>{item}</span>)}{(q || division || family) && <Link href="/search">Clear search</Link>}</div>
        </header>

        {sorted.length > 0 ? <div className="search-results-grid">{sorted.map((result, index) => <article className={`search-result-object match-${matchTone(result.reason)}`} key={result.product.id}>
          <header><span>{String(index + 1).padStart(2, "0")}</span><strong>{result.reason}</strong><small>SCORE {result.score}</small></header>
          <ProductCard product={result.product} />
        </article>)}</div> : <section className="search-empty-state">
          <div><p className="eyebrow">NO CATALOGUE MATCH</p><h2>Keep the known reference.</h2><p>Broaden the filters, check the code formatting, or send the product name, code, or reference directly through the inquiry system.</p></div>
          <div className="search-empty-actions"><Link href="/search">Clear search</Link><Link href={`/inquiry?manual=1&reference=${encodeURIComponent(q)}`}>Add unlisted item <span aria-hidden="true">↗</span></Link></div>
        </section>}
      </div>
    </section>

    <section className="search-recovery-band">
      <div className="container"><div><span>SEARCH IS A ROUTE, NOT A DEAD END</span><h2>Still missing the object?</h2></div><p>Preserve the name, code, or description in a structured inquiry. No catalogue match is required.</p><Link href={`/inquiry?manual=1&reference=${encodeURIComponent(q)}`}>Open manual inquiry <span aria-hidden="true">↗</span></Link></div>
    </section>
  </main><SiteFooter /></>;
}
