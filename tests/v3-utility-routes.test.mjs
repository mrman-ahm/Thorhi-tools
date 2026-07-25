import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const layout = readFileSync("src/app/layout.tsx", "utf8");
const inquiryPage = readFileSync("src/app/inquiry/page.tsx", "utf8");
const workflow = readFileSync("src/components/inquiry-workflow.tsx", "utf8");
const company = readFileSync("src/app/company/page.tsx", "utf8");
const resources = readFileSync("src/app/resources/page.tsx", "utf8");
const contact = readFileSync("src/app/contact/page.tsx", "utf8");
const privacy = readFileSync("src/app/privacy/page.tsx", "utf8");
const success = readFileSync("src/components/inquiry-success.tsx", "utf8");
const styles = readFileSync("src/app/v3-utility-routes.css", "utf8");

test("V3 utility layer loads after catalogue system", () => {
  const catalogue = layout.indexOf('import "./v3-catalogue-system.css"');
  const utility = layout.indexOf('import "./v3-utility-routes.css"');
  assert.ok(catalogue >= 0);
  assert.ok(utility > catalogue);
});

test("inquiry remains explicitly non-transactional", () => {
  assert.match(inquiryPage, /NOT AN ONLINE ORDER/);
  assert.match(inquiryPage, /NO PAYMENT COLLECTION/);
  assert.match(inquiryPage, /does not create an order/);
  assert.doesNotMatch(inquiryPage, /checkout|payment form|card number/i);
});

test("inquiry workflow preserves all validation and recovery behavior", () => {
  assert.match(workflow, /allowedAttachmentTypes/);
  assert.match(workflow, /maxAttachmentBytes/);
  assert.match(workflow, /submissionToken/);
  assert.match(workflow, /addManualItem/);
  assert.match(workflow, /restoreItem/);
  assert.match(workflow, /generalRequirements/);
  assert.match(workflow, /preferredContact/);
  assert.match(workflow, /consent/);
  assert.match(workflow, /\/api\/inquiries/);
  assert.match(workflow, /Your products and form information remain available/);
});

test("supporting pages preserve evidence-first publication boundaries", () => {
  assert.match(company, /UNVERIFIED CLAIMS REMAIN UNPUBLISHED/);
  assert.match(company, /pendingEvidence/);
  assert.match(resources, /REAL FILES ONLY · NO FALSE DOWNLOADS/);
  assert.match(resources, /<DocumentList documents=\{division\.documents\} \/>/);
  assert.match(contact, /Publication pending/);
  assert.match(contact, /Do not send passwords/);
  assert.match(privacy, /LEGAL REVIEW REQUIRED/);
  assert.match(privacy, /No analytics or advertising behaviour is claimed/);
});

test("confirmation preserves truthful delivery and response boundaries", () => {
  assert.match(success, /Development memory adapter/);
  assert.match(success, /Production delivery is not configured/);
  assert.match(success, /NO RESPONSE-TIME PROMISE/);
  assert.match(success, /clearInquiry\(\)/);
});

test("utility styles provide clinical controls, readable legal layout, and responsive fallbacks", () => {
  assert.match(styles, /\.inquiry-workflow\{/);
  assert.match(styles, /\.inquiry-review\{/);
  assert.match(styles, /\.company-evidence-list/);
  assert.match(styles, /\.resource-archive-grid/);
  assert.match(styles, /\.contact-guidance-grid/);
  assert.match(styles, /\.legal-reading-grid/);
  assert.match(styles, /\.success-card-v2/);
  assert.match(styles, /@media \(max-width:960px\)/);
  assert.match(styles, /@media \(max-width:720px\)/);
  assert.match(styles, /prefers-reduced-motion:reduce/);
  assert.match(styles, /prefers-reduced-transparency:reduce/);
});
