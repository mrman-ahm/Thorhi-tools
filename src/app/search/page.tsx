import Link from "next/link";
import { ProductCard, SeedDataNotice } from "@/components/catalogue-ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { divisionSlugs, divisions, families, type DivisionSlug } from "@/lib/catalogue";
import { searchProducts } from "@/lib/search";

export const metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; division?: string; family?: string; sort?: string }> }) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const division = divisionSlugs.includes(params.division as DivisionSlug) ? params.division as DivisionSlug : undefined;
  const family = params.family && families.some(item => item.slug === params.family && (!division || item.division === division)) ? params.family : undefined;
  const results = searchProducts(q, { division, family });
  const sorted = params.sort === "code" ? [...results].sort((a, b) => a.product.code.localeCompare(b.product.code)) : results;
  const relevantFamilies = division ? families.filter(item => item.division === division) : families;

  return <><SiteHeader /><main id="main">
    <section className="search-page-header section-dark"><div className="container"><p className="eyebrow dark">CATALOGUE SEARCH</p><h1>Search names, families, and product codes.</h1><form className="search-page-form" action="/search"><div><label htmlFor="search-q">Search query</label><input id="search-q" name="q" type="search" defaultValue={q} placeholder="Product name or exact / partial code" /></div><div><label htmlFor="search-division">Division</label><select id="search-division" name="division" defaultValue={division ?? ""}><option value="">All divisions</option>{divisions.map(item => <option value={item.slug} key={item.slug}>{item.label}</option>)}</select></div><div><label htmlFor="search-family">Family</label><select id="search-family" name="family" defaultValue={family ?? ""}><option value="">All families</option>{relevantFamilies.map(item => <option value={item.slug} key={`${item.division}-${item.slug}`}>{item.label}</option>)}</select></div><div><label htmlFor="search-sort">Sort</label><select id="search-sort" name="sort" defaultValue={params.sort ?? "relevance"}><option value="relevance">Relevance</option><option value="code">Product code</option></select></div><button className="button primary" type="submit">Search catalogue</button></form></div></section>
    <div className="container"><SeedDataNotice /></div>
    <section className="section"><div className="container"><div className="results-toolbar"><div><p className="eyebrow">SEARCH RESULTS</p><h2>{q ? `${sorted.length} ${sorted.length === 1 ? "match" : "matches"} for “${q}”` : `${sorted.length} catalogue records`}</h2></div>{(q || division || family) && <Link className="button secondary" href="/search">Clear search</Link>}</div>{sorted.length > 0 ? <><div className="listing-grid">{sorted.map(result => <div className="search-result-wrap" key={result.product.id}><span className="match-reason">{result.reason}</span><ProductCard product={result.product} /></div>)}</div></> : <section className="empty-state"><p className="eyebrow">NO MATCH FOUND</p><h2>No catalogue products matched this request.</h2><p>Check the code formatting, broaden the filters, or add the known item directly to an inquiry.</p><div className="button-row"><Link className="button secondary" href="/search">Clear search</Link><Link className="button primary" href={`/inquiry?manual=1&reference=${encodeURIComponent(q)}`}>Add unlisted item</Link></div></section>}</div></section>
  </main><SiteFooter /></>;
}
