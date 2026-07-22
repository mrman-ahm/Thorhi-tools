import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default async function TemporaryPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const title = slug.map(part => part.replaceAll("-", " ")).join(" / ");

  return <>
    <SiteHeader />
    <main className="temporary-page" id="main">
      <article>
        <p className="eyebrow dark">PRODUCTION ROUTE RESERVED</p>
        <h1>{title || "Page"}</h1>
        <p>This route is part of the approved THROHI catalogue and inquiry architecture. Its production template will be implemented after the homepage milestone without inventing unverified product or company content.</p>
        <div className="button-row"><Link className="button inverse-light" href="/">Return home</Link><Link className="button primary" href="/#products">Browse homepage catalogue</Link></div>
      </article>
    </main>
  </>;
}
