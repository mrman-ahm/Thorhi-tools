import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, ProductCard, SeedDataNotice } from "@/components/catalogue-ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { families, getDivision, getFamily, getProductsForFamily } from "@/lib/catalogue";
import { searchProducts } from "@/lib/search";

export function generateStaticParams() {
  return families.map(family => ({ division: family.division, family: family.slug }));
}

export default async function FamilyPage({ params, searchParams }: { params: Promise<{ division: string; family: string }>; searchParams: Promise<{ q?: string; sort?: string }> }) {
  const [{ division: divisionSlug, family: familySlug }, query] = await Promise.all([params, searchParams]);
  const division = getDivision(divisionSlug);
  const family = getFamily(divisionSlug, familySlug);
  if (!division || !family) notFound();
  const q = query.q?.trim() ?? "";
  const sort = query.sort === "code" ? "code" : "name";
  const baseProducts = q ? searchProducts(q, { division: division.slug, family: family.slug }).map(result => result.product) : getProductsForFamily(division.slug, family.slug);
  const listedProducts = [...baseProducts].sort((a, b) => sort === "code" ? a.code.localeCompare(b.code) : a.name.localeCompare(b.name));
  const siblingFamilies = families.filter(item => item.division === division.slug && item.slug !== family.slug);

  return <><SiteHeader /><main id="main" className={`catalogue-v2 family-catalogue tone-${division.slug}`}>
    <section className="family-catalogue-hero" aria-labelledby="family-title"><div className="container">
      <Breadcrumbs items={[{ label: "Products", href: "/products" }, { label: division.label, href: `/products/${division.slug}` }, { label: family.label }]} />
      <div className="family-catalogue-hero-grid"><div><p className="eyebrow">{division.index}.{family.index} · PRODUCT FAMILY</p><h1 id="family-title">{family.label}</h1><p>{family.description}</p><div className="family-hero-routes"><Link href={`/products/${division.slug}`}>All {division.label} families</Link><Link href={`/search?division=${division.slug}&family=${family.slug}`}>Search this family</Link></div></div><div className="family-catalogue-object" role="img" aria-label={`Replaceable visual placeholder for ${family.label}`}><span className="family-object-grid" aria-hidden="true" /><span className="family-object-form" aria-hidden="true"><i /><i /><b /></span><small>FAMILY IMAGE PLACEHOLDER</small><strong>{family.label}</strong><code>{division.index}.{family.index}</code></div></div>
    </div></section>

    <div className="container"><SeedDataNotice /></div>

    <section className="family-listing-section"><div className="container family-listing-layout">
      <details className="catalogue-filter-shell" open><summary><span>Filter and sort</span><b>{listedProducts.length} results</b></summary><aside className="catalogue-filter-panel"><header><span>FILTER FAMILY</span><small>{family.label.toUpperCase()}</small></header><form action={`/products/${division.slug}/${family.slug}`}><label htmlFor="family-search">Search within {family.label}</label><input id="family-search" name="q" type="search" defaultValue={q} placeholder="Name or product code" /><label htmlFor="family-sort">Sort results</label><select id="family-sort" name="sort" defaultValue={sort}><option value="name">Product name</option><option value="code">Product code</option></select><button className="catalogue-filter-submit" type="submit">APPLY FILTERS ↗</button>{q && <Link className="catalogue-filter-clear" href={`/products/${division.slug}/${family.slug}`}>Clear search</Link>}</form><div className="catalogue-active-filters" aria-label="Active catalogue filters"><span>Division: {division.label}</span><span>Family: {family.label}</span><span>Sort: {sort === "code" ? "Code" : "Name"}</span>{q && <span>Query: {q}</span>}</div><div className="catalogue-sibling-routes"><h3>Related families</h3>{siblingFamilies.map(item => <Link href={`/products/${division.slug}/${item.slug}`} key={item.slug}>{item.label}<span aria-hidden="true">↗</span></Link>)}</div></aside></details>

      <div className="catalogue-results-column"><header className="catalogue-results-toolbar"><div><p className="eyebrow">CATALOGUE RESULTS</p><h2>{listedProducts.length} {listedProducts.length === 1 ? "object" : "objects"}</h2></div><div className="catalogue-result-state"><span>{q ? `Search: “${q}”` : "Showing family catalogue"}</span><small>SORTED BY {sort.toUpperCase()}</small></div></header>{listedProducts.length > 0 ? <div className="catalogue-listing-grid">{listedProducts.map(product => <ProductCard key={product.id} product={product} />)}</div> : <section className="catalogue-empty-state"><span className="empty-code">00 / NO MATCH</span><h2>No products matched this family search.</h2><p>Remove the search term or add an unlisted product using the name or code you already know.</p><div><Link href={`/products/${division.slug}/${family.slug}`}>Clear search</Link><Link className="primary-empty-action" href={`/inquiry?manual=1&division=${division.slug}&family=${family.slug}`}>Add unlisted item ↗</Link></div></section>}</div>
    </div></section>
  </main><SiteFooter /></>;
}
