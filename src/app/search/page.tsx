import Link from "next/link";
import { ProductCard, SeedDataNotice } from "@/components/catalogue-ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  cataloguePageSize,
  clampPage,
  finishFilters,
  finishLabel,
  materialFilters,
  materialLabel,
  productContainsFacet,
  resolveFinish,
  resolveMaterial
} from "@/lib/catalogue-facets";
import { divisionSlugs, divisions, families, type DivisionSlug } from "@/lib/catalogue";
import { searchProducts } from "@/lib/search";

export const metadata = { title: "Search" };

type CatalogueSearchParams = {
  q?: string;
  division?: string;
  family?: string;
  sort?: string;
  material?: string;
  finish?: string;
  page?: string;
};

function matchTone(reason: string) {
  if (reason === "exact code") return "exact";
  if (reason.includes("code")) return "technical";
  if (reason.includes("family") || reason.includes("division")) return "contextual";
  return "name";
}

function searchHref(params: {
  q: string;
  division?: string;
  family?: string;
  sort: string;
  material?: string;
  finish?: string;
  page?: number;
}) {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.division) query.set("division", params.division);
  if (params.family) query.set("family", params.family);
  if (params.sort !== "relevance") query.set("sort", params.sort);
  if (params.material) query.set("material", params.material);
  if (params.finish) query.set("finish", params.finish);
  if (params.page && params.page > 1) query.set("page", String(params.page));
  const value = query.toString();
  return value ? `/search?${value}` : "/search";
}

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<CatalogueSearchParams>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const division = divisionSlugs.includes(params.division as DivisionSlug)
    ? params.division as DivisionSlug
    : undefined;
  const family = params.family && families.some(item =>
    item.slug === params.family && (!division || item.division === division)
  ) ? params.family : undefined;
  const material = resolveMaterial(params.material);
  const finish = resolveFinish(params.finish);
  const sort = params.sort === "code" || params.sort === "name" || params.sort === "variants"
    ? params.sort
    : "relevance";
  const searched = searchProducts(q, { division, family });
  const filtered = searched.filter(result =>
    productContainsFacet(result.product, material) && productContainsFacet(result.product, finish)
  );
  const sorted = sort === "code"
    ? [...filtered].sort((a, b) => a.product.code.localeCompare(b.product.code))
    : sort === "name"
      ? [...filtered].sort((a, b) => a.product.name.localeCompare(b.product.name))
      : sort === "variants"
        ? [...filtered].sort((a, b) => b.product.variants.length - a.product.variants.length || a.product.name.localeCompare(b.product.name))
        : filtered;
  const totalPages = Math.max(1, Math.ceil(sorted.length / cataloguePageSize));
  const currentPage = clampPage(params.page, totalPages);
  const pageResults = sorted.slice(
    (currentPage - 1) * cataloguePageSize,
    currentPage * cataloguePageSize
  );
  const relevantFamilies = division ? families.filter(item => item.division === division) : families;
  const activeContext = [
    division && divisions.find(item => item.slug === division)?.label,
    family && families.find(item => item.slug === family && (!division || item.division === division))?.label,
    material && materialLabel(material),
    finish && finishLabel(finish)
  ].filter((item): item is string => Boolean(item));
  const filteredState = Boolean(q || division || family || material || finish);

  return <><SiteHeader /><main id="main" className="search-v2">
    <section className="search-v2-hero">
      <div className="container search-v2-hero-grid">
        <div className="search-v2-intro">
          <p className="eyebrow dark">CATALOGUE SEARCH / 07</p>
          <h1>Find the instrument.<br /><span>Keep the context.</span></h1>
          <p>Search all 626 representative instrument groups and 1,434 documented variants by exact or partial code, name, family, source wording, material, and finish.</p>
          <div className="search-shortcut-note"><kbd>⌘ K</kbd><span>Open the command from any page</span></div>
        </div>

        <details className="search-filter-shell" open>
          <summary><span>Search and refine</span><small>{activeContext.length ? activeContext.join(" · ") : "All catalogue records"}</small></summary>
          <form className="search-v2-form" action="/search">
            <div className="search-query-field"><label htmlFor="search-q">Search query</label><input id="search-q" name="q" type="search" defaultValue={q} placeholder="Name, exact / partial code, material, or finish" autoComplete="off" /></div>
            <div><label htmlFor="search-division">Catalogue</label><select id="search-division" name="division" defaultValue={division ?? ""}><option value="">All catalogues</option>{divisions.map(item => <option value={item.slug} key={item.slug}>{item.label}</option>)}</select></div>
            <div><label htmlFor="search-family">Family</label><select id="search-family" name="family" defaultValue={family ?? ""}><option value="">All families</option>{relevantFamilies.map(item => <option value={item.slug} key={`${item.division}-${item.slug}`}>{item.label}</option>)}</select></div>
            <div><label htmlFor="search-material">Material</label><select id="search-material" name="material" defaultValue={material ?? ""}><option value="">All documented materials</option>{materialFilters.map(item => <option value={item.value} key={item.value}>{item.label}</option>)}</select></div>
            <div><label htmlFor="search-finish">Finish</label><select id="search-finish" name="finish" defaultValue={finish ?? ""}><option value="">All documented finishes</option>{finishFilters.map(item => <option value={item.value} key={item.value}>{item.label}</option>)}</select></div>
            <div><label htmlFor="search-sort">Sort</label><select id="search-sort" name="sort" defaultValue={sort}><option value="relevance">Relevance</option><option value="name">Product name</option><option value="code">Product code</option><option value="variants">Most variants</option></select></div>
            <button type="submit">Search catalogue <span aria-hidden="true">↗</span></button>
          </form>
        </details>
      </div>
    </section>

    <div className="container"><SeedDataNotice /></div>

    <section className="search-results-section" aria-labelledby="search-results-title">
      <div className="container">
        <header className="search-results-heading">
          <div><p className="eyebrow">RANKED RESULTS</p><h2 id="search-results-title">{filteredState ? `${sorted.length} ${sorted.length === 1 ? "match" : "matches"}` : `${sorted.length} catalogue records`}</h2></div>
          <div className="search-result-context"><span>{q ? `Query: ${q}` : "Browse state"}</span>{activeContext.map(item => <span key={item}>{item}</span>)}<span>Page {currentPage} of {totalPages}</span>{filteredState && <Link href="/search">Clear search</Link>}</div>
        </header>

        {pageResults.length > 0 ? <>
          <div className="search-results-grid">{pageResults.map((result, index) => <article className={`search-result-object match-${matchTone(result.reason)}`} key={result.product.id}>
            <header><span>{String((currentPage - 1) * cataloguePageSize + index + 1).padStart(3, "0")}</span><strong>{result.reason}</strong><small>SCORE {result.score}</small></header>
            <ProductCard product={result.product} />
          </article>)}</div>
          {totalPages > 1 ? <nav className="catalogue-pagination" aria-label="Catalogue result pages">
            {currentPage > 1 ? <Link rel="prev" href={searchHref({ q, division, family, sort, material, finish, page: currentPage - 1 })}>← Previous</Link> : <span aria-disabled="true">← Previous</span>}
            <strong>{(currentPage - 1) * cataloguePageSize + 1}–{Math.min(currentPage * cataloguePageSize, sorted.length)} of {sorted.length}</strong>
            {currentPage < totalPages ? <Link rel="next" href={searchHref({ q, division, family, sort, material, finish, page: currentPage + 1 })}>Next →</Link> : <span aria-disabled="true">Next →</span>}
          </nav> : null}
        </> : <section className="search-empty-state">
          <div><p className="eyebrow">NO CATALOGUE MATCH</p><h2>Keep the known reference.</h2><p>Broaden the filters, check the code formatting, or send the product name, code, material, finish, or reference directly through the inquiry system.</p></div>
          <div className="search-empty-actions"><Link href="/search">Clear search</Link><Link href={`/inquiry?manual=1&reference=${encodeURIComponent(q)}`}>Add unlisted item <span aria-hidden="true">↗</span></Link></div>
        </section>}
      </div>
    </section>

    <section className="search-recovery-band">
      <div className="container"><div><span>SEARCH IS A ROUTE, NOT A DEAD END</span><h2>Still missing the object?</h2></div><p>Preserve the name, code, material, finish, or description in a structured inquiry. No catalogue match is required.</p><Link href={`/inquiry?manual=1&reference=${encodeURIComponent(q)}`}>Open manual inquiry <span aria-hidden="true">↗</span></Link></div>
    </section>
  </main><SiteFooter /></>;
}
