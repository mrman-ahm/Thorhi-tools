"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <main className="utility-v2 utility-error-page" id="main"><div className="container"><article><p className="eyebrow">APPLICATION ERROR</p><span className="utility-error-code">500 / RECOVERABLE</span><h1>The page could not complete this request.</h1><p>Retry the current route or return to the catalogue. Saved inquiry products remain in browser storage unless the user removes them.</p>{error.digest && <code>Reference: {error.digest}</code>}<div className="button-row"><button className="button primary" type="button" onClick={reset}>Retry page</button><Link className="button secondary" href="/products">Return to products</Link><Link className="button secondary" href="/inquiry">Review inquiry</Link></div></article></div></main>;
}
