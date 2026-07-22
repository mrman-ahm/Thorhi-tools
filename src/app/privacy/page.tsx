import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return <><SiteHeader /><main id="main"><section className="content-hero section-dark"><div className="container"><p className="eyebrow dark">PRIVACY</p><h1>Data minimization is the default.</h1><p>This working notice documents the implemented inquiry behaviour. Final legal wording requires THROHI approval before launch.</p></div></section><section className="section legal-section"><div className="container legal-content"><h2>Information collected</h2><p>The inquiry requests product selections, quantities, notes, buyer name, company, country, email, optional phone information, preferred contact method, and optional attachment metadata.</p><h2>Purpose</h2><p>The information is used only to review and respond to the product inquiry. The current development adapter is not durable production storage.</p><h2>Attachments</h2><p>This build validates attachment metadata but does not upload files to production object storage. Storage, retention, and deletion rules must be approved before launch.</p><h2>Analytics and cookies</h2><p>No analytics or advertising behaviour is claimed here. Any future analytics must be documented before activation.</p><h2>Contact and rights</h2><p>Verified privacy-contact information and jurisdiction-specific rights will be added after legal review.</p></div></section></main><SiteFooter /></>;
}
