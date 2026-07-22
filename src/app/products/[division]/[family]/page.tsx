import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, ProductCard, SeedDataNotice } from "@/components/catalogue-ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { divisions, families, getDivision, getFamily, getProductsForFamily } from "@/lib/catalogue";
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
  const baseProducts = q ? searchProducts(q, { division: division.slug, family: family.slug }).map(result => result.product) : getProductsForFamily(division.slug, family.slug);
  const listedProducts = [...baseProducts].sort((a, b) => query.sort === "code" ? a.code.localeCompare(b.code) : a.name.localeCompare(b.name));
  const siblingFamilies = families.filter(item => item.division === division.slug && item.slug !== family.slug);

  return <><SiteHeader /><main id="main">
    <section className="catalogue-family-header"><div className="container family-header-grid"><div><Breadcrumbs items={[{ label: "Products", href: "/products" }, { label: division.label, href: `/products/${division.slug}` }, { label: family.label }]} /><p className="eyebrow">{division.index}.{family.index} · PRODUCT FAMILY</p><h1>{family.label}</h1><p>{family.description}</p></div><div className="family-visual" role="img" aria-label={`Replaceable visual placeholder for ${family.label}`}><span>Family image placeholder</span><strong>{family.label}</strong></div></div></section>
    <div className="container"><SeedDataNotice /></div>
    <section className="section listing-section"><div className="container listing-layout"><aside className="filter-panel"><h2>Filter family</h2><form action={`/products/${division.slug}/${family.slug}`}><label htmlFor="family-search">Search within {family.label}</label><input id="family-search" name="q" type="search" defaultValue={q} placeholder="Name or product code" /><label htmlFor="family-sort">Sort results</label><select id="family-sort" name="sort" defaultValue={query.sort ?? "name"}><option value="name">Product name</option><option value="code">Product code</option></select><button className="button primary full" type="submit">Apply</button>{q && <Link className="button secondary full" href={`/products/${division.slug}/${family.slug}`}>Clear search</Link>}</form><div className="sibling-routes"><h3>Related families</h3>{siblingFamilies.map(item => <Link href={`/products/${division.slug}/${item.slug}`} key={item.slug}>{item.label}<span aria-hidden="true">→</span></Link>)}</div></aside><div><div className="results-toolbar"><div><p className="eyebrow">CATALOGUE RESULTS</p><h2>{listedProducts.length} {listedProducts.length === 1 ? "product" : "products"}</h2></div><span>{q ? `Search: “${q}”` : "Showing family catalogue"}</span></div>{listedProducts.length > 0 ? <div className="listing-grid">{listedProducts.map(product => <ProductCard key={product.id} product={product} />)}</div> : <section className="empty-state"><p className="eyebrow">NO MATCH FOUND</p><h2>No products matched this family search.</h2><p>Remove the search term or add an unlisted product to the inquiry with the name or code you know.</p><div className="button-row"><Link className="button secondary" href={`/products/${division.slug}/${family.slug}`}>Clear search</Link><Link className="button primary" href={`/inquiry?manual=1&division=${division.slug}&family=${family.slug}`}>Add unlisted item</Link></div></section>}</div></div></section>
  </main><SiteFooter /></>;
}
