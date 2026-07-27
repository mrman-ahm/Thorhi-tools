import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, ProductCard, ProductImage, SeedDataNotice } from "@/components/catalogue-ui";
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
import { families, getDivision, getFamily, getProductsForFamily } from "@/lib/catalogue";
import { searchProducts } from "@/lib/search";

export function generateStaticParams() {
  return families.map(family => ({ division: family.division, family: family.slug }));
}

type FamilySearchParams = {
  q?: string;
  sort?: string;
  material?: string;
  finish?: string;
  page?: string;
};

function familyHref(
  route: string,
  params: { q: string; sort: string; material?: string; finish?: string; page?: number }
) {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.sort !== "name") query.set("sort", params.sort);
  if (params.material) query.set("material", params.material);
  if (params.finish) query.set("finish", params.finish);
  if (params.page && params.page > 1) query.set("page", String(params.page));
  const value = query.toString();
  return value ? `${route}?${value}` : route;
}

export default async function FamilyPage({
  params,
  searchParams
}: {
  params: Promise<{ division: string; family: string }>;
  searchParams: Promise<FamilySearchParams>;
}) {
  const [{ division: divisionSlug, family: familySlug }, query] = await Promise.all([params, searchParams]);
  const division = getDivision(divisionSlug);
  const family = getFamily(divisionSlug, familySlug);
  if (!division || !family) notFound();

  const q = query.q?.trim() ?? "";
  const sort = query.sort === "code" || query.sort === "variants" ? query.sort : "name";
  const material = resolveMaterial(query.material);
  const finish = resolveFinish(query.finish);
  const familyProducts = getProductsForFamily(division.slug, family.slug);
  const searchedProducts = q
    ? searchProducts(q, { division: division.slug, family: family.slug }).map(result => result.product)
    : familyProducts;
  const filteredProducts = searchedProducts.filter(product =>
    productContainsFacet(product, material) && productContainsFacet(product, finish)
  );
  const listedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "code") return a.code.localeCompare(b.code);
    if (sort === "variants") return b.variants.length - a.variants.length || a.name.localeCompare(b.name);
    return a.name.localeCompare(b.name);
  });
  const totalPages = Math.max(1, Math.ceil(listedProducts.length / cataloguePageSize));
  const currentPage = clampPage(query.page, totalPages);
  const pageProducts = listedProducts.slice(
    (currentPage - 1) * cataloguePageSize,
    currentPage * cataloguePageSize
  );
  const siblingFamilies = families.filter(item => item.division === division.slug && item.slug !== family.slug);
  const representative = familyProducts[0];
  const route = `/products/${division.slug}/${family.slug}`;
  const activeFilters = [
    q && `Query: ${q}`,
    material && `Material: ${materialLabel(material)}`,
    finish && `Finish: ${finishLabel(finish)}`,
    `Sort: ${sort === "code" ? "Code" : sort === "variants" ? "Variant count" : "Name"}`
  ].filter(Boolean);

  return <><SiteHeader /><main id="main" className={`catalogue-v2 family-catalogue tone-${division.slug}`}>
    <section className="family-catalogue-hero" aria-labelledby="family-title"><div className="container">
      <Breadcrumbs items={[{ label: "Catalogue", href: "/products" }, { label: division.label, href: `/products/${division.slug}` }, { label: family.label }]} />
      <div className="family-catalogue-hero-grid"><div><p className="eyebrow">{division.index}.{family.index} · INSTRUMENT FAMILY</p><h1 id="family-title">{family.label}</h1><p>{family.description}</p><div className="division-route-meta"><span>{family.productCount} instrument groups</span><span>{family.variantCount} documented variants</span><span>Source pages retained</span></div><div className="family-hero-routes"><Link href={`/products/${division.slug}`}>All {division.label} families</Link><Link href={`/search?division=${division.slug}&family=${family.slug}`}>Search this family</Link></div></div>{representative ? <div className="family-catalogue-object"><ProductImage product={representative} /><small>REPRESENTATIVE FAMILY OBJECT</small><strong>{representative.name}</strong><code>{representative.code}</code></div> : null}</div>
    </div></section>

    <div className="container"><SeedDataNotice /></div>

    <section className="family-listing-section"><div className="container family-listing-layout">
      <details className="catalogue-filter-shell" open><summary><span>Filter and sort</span><b>{listedProducts.length} results</b></summary><aside className="catalogue-filter-panel"><header><span>FILTER FAMILY</span><small>{family.label.toUpperCase()}</small></header><form action={route}>
        <label htmlFor="family-search">Search within {family.label}</label>
        <input id="family-search" name="q" type="search" defaultValue={q} placeholder="Name, representative code, variant code, material, or finish" />
        <label htmlFor="family-material">Material</label>
        <select id="family-material" name="material" defaultValue={material ?? ""}><option value="">All documented materials</option>{materialFilters.map(item => <option value={item.value} key={item.value}>{item.label}</option>)}</select>
        <label htmlFor="family-finish">Finish</label>
        <select id="family-finish" name="finish" defaultValue={finish ?? ""}><option value="">All documented finishes</option>{finishFilters.map(item => <option value={item.value} key={item.value}>{item.label}</option>)}</select>
        <label htmlFor="family-sort">Sort results</label>
        <select id="family-sort" name="sort" defaultValue={sort}><option value="name">Product name</option><option value="code">Product code</option><option value="variants">Most variants</option></select>
        <button className="catalogue-filter-submit" type="submit">APPLY FILTERS ↗</button>
        {(q || material || finish || sort !== "name") && <Link className="catalogue-filter-clear" href={route}>Clear filters</Link>}
      </form><div className="catalogue-active-filters" aria-label="Active catalogue filters"><span>Catalogue: {division.label}</span><span>Family: {family.label}</span>{activeFilters.map(filter => <span key={filter}>{filter}</span>)}<span>Page {currentPage} of {totalPages}</span></div><div className="catalogue-sibling-routes"><h3>Related families</h3>{siblingFamilies.map(item => <Link href={`/products/${division.slug}/${item.slug}`} key={item.slug}>{item.label}<span aria-hidden="true">↗</span></Link>)}</div></aside></details>

      <div className="catalogue-results-column"><header className="catalogue-results-toolbar"><div><p className="eyebrow">CATALOGUE RESULTS</p><h2>{listedProducts.length} {listedProducts.length === 1 ? "instrument group" : "instrument groups"}</h2></div><div className="catalogue-result-state"><span>{q || material || finish ? "Filtered family catalogue" : `${family.variantCount} documented variants in this family`}</span><small>PAGE {currentPage} OF {totalPages}</small></div></header>{pageProducts.length > 0 ? <>
        <div className="catalogue-listing-grid">{pageProducts.map(product => <ProductCard key={product.id} product={product} />)}</div>
        {totalPages > 1 ? <nav className="catalogue-pagination" aria-label={`${family.label} result pages`}>
          {currentPage > 1 ? <Link rel="prev" href={familyHref(route, { q, sort, material, finish, page: currentPage - 1 })}>← Previous</Link> : <span aria-disabled="true">← Previous</span>}
          <strong>{(currentPage - 1) * cataloguePageSize + 1}–{Math.min(currentPage * cataloguePageSize, listedProducts.length)} of {listedProducts.length}</strong>
          {currentPage < totalPages ? <Link rel="next" href={familyHref(route, { q, sort, material, finish, page: currentPage + 1 })}>Next →</Link> : <span aria-disabled="true">Next →</span>}
        </nav> : null}
      </> : <section className="catalogue-empty-state"><span className="empty-code">00 / NO MATCH</span><h2>No instruments matched these family filters.</h2><p>Remove a material or finish filter, broaden the search term, or preserve the known code in a manual inquiry.</p><div><Link href={route}>Clear filters</Link><Link className="primary-empty-action" href={`/inquiry?manual=1&division=${division.slug}&family=${family.slug}&reference=${encodeURIComponent(q)}`}>Add unlisted item ↗</Link></div></section>}</div>
    </div></section>
  </main><SiteFooter /></>;
}
