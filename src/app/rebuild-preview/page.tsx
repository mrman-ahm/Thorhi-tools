import { RebuildPreviewClient } from "./preview-client";

export const metadata = {
  title: "Rebuild Preview",
  robots: { index: false, follow: false },
};

export default function RebuildPreviewPage() {
  return <RebuildPreviewClient />;
}
