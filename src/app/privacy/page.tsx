import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Privacy" };

const sections = [
  ["01", "Information collected", "The inquiry requests product selections, quantities, notes, buyer name, company, country, email, optional phone information, preferred contact method, and optional attachment metadata."],
  ["02", "Purpose", "The information is used only to review and respond to the product inquiry. The current development adapter is not durable production storage."],
  ["03", "Attachments", "This build validates attachment metadata but does not upload files to production object storage. Storage, retention, and deletion rules must be approved before launch."],
  ["04", "Analytics and cookies", "No analytics or advertising behaviour is claimed here. Any future analytics must be documented and consent requirements resolved before activation."],
  ["05", "Contact and rights", "Verified privacy-contact information and jurisdiction-specific rights will be added after legal review."]
] as const;

export default function PrivacyPage() {
  return <><SiteHeader /><main id="main" className="utility-v2 legal-v2">
    <section className="utility-hero legal-utility-hero"><div className="container utility-hero-grid"><div><p className="eyebrow dark">PRIVACY</p><h1>Collect less.<br /><span>Explain every field.</span></h1></div><div className="utility-hero-copy"><p>This working notice documents the implemented inquiry behaviour. Final legal wording and effective dates require THROHI approval before launch.</p><span>WORKING NOTICE · LEGAL REVIEW REQUIRED</span></div></div></section>
    <section className="legal-reading-section"><div className="container legal-reading-grid"><aside className="legal-index"><span>NOTICE INDEX</span>{sections.map(([index, title]) => <a key={index} href={`#privacy-${index}`}>{index} · {title}</a>)}<Link href="/terms">Terms of use ↗</Link></aside><article className="legal-article">{sections.map(([index, title, body]) => <section id={`privacy-${index}`} key={index}><span>{index}</span><h2>{title}</h2><p>{body}</p></section>)}</article></div></section>
    <section className="utility-warning-band"><div className="container utility-assurance-grid"><span>FINAL REVIEW PENDING</span><p>No jurisdiction, retention period, privacy contact, or data-rights promise is published without approval.</p><Link href="/contact">Contact route ↗</Link></div></section>
  </main><SiteFooter /></>;
}
