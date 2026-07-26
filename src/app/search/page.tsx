import Link from "next/link";
import { ProductCard, SeedDataNotice } from "@/components/catalogue-ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { divisionSlugs, divisions, families, type DivisionSlug } from "@/lib/catalogue";
import { searchProducts } from "@/lib/search";

export const metadata = { title: "Search" };

const pageSize = 48;
const materialFilters = [
  { value: "surgical stainless steel", label: "Surgical stainless steel" },
  { value: "matte finish", label: "Matte finish" },
  { value: "tungsten carbide", label: "Tungsten carbide" },
  { value: "titanium", label: "Titanium" },
  { value: "ceramic", label: "Ceramic" },
  { value: "plastic", label: "Plastic / polymer" }
] as const;

function matchTone(reason: string) {
  if (reason === "exact code") return "exact";
  if (reason.includes("code")) return "technical";
  if (reason.includes("family") || reason.includes("division")) return "contextual";
  return "name";
}

function productContains(product: ReturnType<typeof searchProducts>[number]["product"], term: string) {
  const searchable = [
    product.description,
    ...product.specifications.map(item => item.value),
    ...product.variants.map(variant => variant.value)
  ].join(" ").toLowerCase();
  return searchable.includes(term);
}

function searchHref(params: { q: string; division?: string; family?: string; sort: string; material?: string; page?: number }) {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.division) query.set("division", params.division);
  if (params.family) query.set("family", params.family);
  if (params.sort !== "relevance") query.set("sort", params.sort);
  if (params.material) query.set("material", params.material);
  if (params.page && params.page > 1) query.set("page", String(params.page));
  const value = query.toString();
  return value ? `/search?${value}` : "/search";
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; division?: string; family?: string; sort?: string; material?: string; page?: string }> }) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const division = divisionSlugs.includes(params.division as DivisionSlug) ? params.division as DivisionSlug : undefined;
  const family = params.family && families.some(item => item.slug === params.family && (!division || item.division === division)) ? params.family : undefined;
  const material = materialFilters.some(item => item.value === params.material) ? params.material : undefined;
  const sort = params.sort === "code" || params.sort === "name" ? params.sort : "relevance";
  const searched = searchProducts(q, { division, family });
  const filtered = material ? searched.filter(result => productContains(result.product, material)) : searched;
  const sorted = sort === "code"
    ? [...filtered].sort((a, b) => a.product.code.localeCompare(b.product.code))
    : sort === "name"
      ? [...filtered].sort((a, b) => a.product.name.localeCompare(b.product.name))
      : filtered;
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const currentPage = Number.isFinite(requestedPage) ? Math.min(totalPages, Math.max(1, requestedPage)) : 1;
  const pageResults = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const relevantFamilies = division ? families.filter(item => item.division === division) : families;
  const activeContext = [
    division && divisions.find(item => item.slug === division)?.label,
    family && families.find(item => item.slug === family && (!division || item.division === division))?.label,
    material && materialFilters.find(item => item.value === material)?.label
  ].filter(Boolean);

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
            <div><label htmlFor="search-material">Material or finish</label><select id="search-material" name="material" defaultValue={material ?? ""}><option value="">All documented materials</option>{materialFilters.map(item => <option value={item.value} key={item.value}>{item.label}</option>)}</select></div>
            <div><label htmlFor="search-sort">Sort</label><select id="search-sort" name="sort" defaultValue={sort}><option value="relevance">Relevance</option><option value="name">Product name</option><option value="code">Product code</option></select></div>
            <button type="submit">Search catalogue <span aria-hidden="true">↗</span></button>
          </form>
        </details>
      </div>
    </section>

    <div className="container"><SeedDataNotice /></div>

    <section className="search-results-section" aria-labelledby="search-results-title">
      <div className="container">
        <header className="search-results-heading">
          <div><p className="eyebrow">RANKED RESULTS</p><h2 id="search-results-title">{q || material ? `${sorted.length} ${sorted.length === 1 ? "match" : "matches"}` : `${sorted.length} catalogue records`}</h2></div>
          <div className="search-result-context"><span>{q ? `Query: ${q}` : "Browse state"}</span>{activeContext.map(item => <span key={item}>{item}</span>)}<span>Page {currentPage} of {totalPages}</span>{(q || division || family || material) && <Link href="/search">Clear search</Link>}</div>
        </header>

        {pageResults.length > 0 ? <>
          <div className="search-results-grid">{pageResults.map((result, index) => <article className={`search-result-object match-${matchTone(result.reason)}`} key={result.product.id}>
            <header><span>{String((currentPage - 1) * pageSize + index + 1).padStart(3, "0")}</span><strong>{result.reason}</strong><small>SCORE {result.score}</small></header>
            <ProductCard product={result.product} />
          </article>)}</div>
          {totalPages > 1 ? <nav className="catalogue-pagination" aria-label="Catalogue result pages">
            {currentPage > 1 ? <Link rel="prev" href={searchHref({ q, division, family, sort, material, page: currentPage - 1 })}>← Previous</Link> : <span aria-disabled="true">← Previous</span>}
            <strong>{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, sorted.length)} of {sorted.length}</strong>
            {currentPage < totalPages ? <Link rel="next" href={searchHref({ q, division, family, sort, material, page: currentPage + 1 })}>Next →</Link> : <span aria-disabled="true">Next →</span>}
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
