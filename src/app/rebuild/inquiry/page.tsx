import type { Metadata } from "next";
import { Suspense } from "react";
import { InquiryClient } from "./inquiry-client";
import styles from "../rebuild.module.css";
export const metadata:Metadata={title:"Inquiry List | THROHI Medical Tools",description:"Review selected instruments and send one organized inquiry to THROHI.",robots:{index:false,follow:false}};
export default function InquiryPage(){return <main id="main"><section className={styles.pageIntro}><div className={styles.shell}><p className={styles.kicker}>THROHI / Inquiry List</p><h1>Send several products in one inquiry.</h1><p>Review instruments, requirements, and buyer details before submitting one structured request.</p><div className={styles.inquiryProgress} aria-label="Inquiry stages"><span>01 Products</span><span>02 Requirements</span><span>03 Buyer details</span><span>04 Review</span></div></div></section><section className={`${styles.shell} ${styles.inquiryBody}`}><Suspense fallback={<p>Loading saved inquiry…</p>}><InquiryClient/></Suspense></section></main>}
