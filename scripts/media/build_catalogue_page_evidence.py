#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path

import fitz

CODE_PATTERNS = [
    re.compile(r"\b\d{2,3}-\d{4}[A-Z]?\b", re.I),
    re.compile(r"\b[A-Z]{1,3}-\d{2,4}[A-Z0-9-]*\b", re.I),
    re.compile(r"\b\d{3}/\d{2,3}(?:\s*[A-Z])?\b", re.I),
]

SOURCES = [
    ("knives", "Knives Catalog(1).pdf", "knives"),
    ("cutters", "Cutters Catalog(1).pdf", "cutters"),
    ("scissors", "Scissors Catalog(1).pdf", "scissors"),
    ("punches", "Punches Catalog(1).pdf", "punches"),
    ("chisels", "Chisels Catalog(1).pdf", "chisels-and-osteotomes"),
]


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def normalize_text(text: str) -> str:
    normalized = text.replace("\r\n", "\n").replace("\r", "\n")
    return "\n".join(line.rstrip() for line in normalized.split("\n")).strip()


def extract_codes(text: str) -> list[str]:
    values: set[str] = set()
    for pattern in CODE_PATTERNS:
        for match in pattern.findall(text):
            values.add(re.sub(r"\s+", " ", match.strip().upper()))
    return sorted(values)


def text_layer_quality(text_chars: int) -> str:
    if text_chars >= 200:
        return "rich"
    if text_chars >= 20:
        return "sparse"
    return "image-only"


def review_state(page_number: int, quality: str, observed_codes: list[str]) -> str:
    if page_number == 1:
        return "cover-verified"
    if quality == "rich" and observed_codes:
        return "text-layer-review"
    return "manual-visual-review-required"


def build_evidence(source_dir: Path) -> dict:
    sources = []
    all_pages = []
    total_bytes = 0
    total_text_chars = 0
    total_images = 0

    for source_id, file_name, category in SOURCES:
        pdf_path = source_dir / file_name
        pdf_bytes = pdf_path.read_bytes()
        document = fitz.open(pdf_path)
        pages = []
        quality_counts = {"rich": 0, "sparse": 0, "image-only": 0}
        review_counts: dict[str, int] = {}
        source_text_chars = 0
        source_images = 0

        for index, page in enumerate(document):
            page_number = index + 1
            source_text = normalize_text(page.get_text("text"))
            text_chars = len(source_text)
            embedded_image_count = len(page.get_images(full=True))
            observed_codes = extract_codes(source_text)
            quality = text_layer_quality(text_chars)
            state = review_state(page_number, quality, observed_codes)
            pixmap = page.get_pixmap(
                matrix=fitz.Matrix(1, 1),
                alpha=False,
                colorspace=fitz.csRGB,
            )
            record = {
                "sourceId": source_id,
                "pageNumber": page_number,
                "pageLabel": "cover" if page_number == 1 else str(page_number - 1),
                "widthPt": round(page.rect.width, 3),
                "heightPt": round(page.rect.height, 3),
                "renderWidthPx": pixmap.width,
                "renderHeightPx": pixmap.height,
                "renderSha256": sha256_bytes(pixmap.samples),
                "textLayerQuality": quality,
                "textChars": text_chars,
                "embeddedImageCount": embedded_image_count,
                "observedCodes": observed_codes,
                "reviewState": state,
                "sourceText": source_text,
                "notes": (
                    ["Cover page; no product identity assignment."]
                    if page_number == 1
                    else (
                        [
                            "Text layer is insufficient for automatic product naming; inspect the rendered catalogue page."
                        ]
                        if quality != "rich" or not observed_codes
                        else []
                    )
                ),
            }
            pages.append(record)
            all_pages.append(record)
            quality_counts[quality] += 1
            review_counts[state] = review_counts.get(state, 0) + 1
            source_text_chars += text_chars
            source_images += embedded_image_count

        sources.append(
            {
                "id": source_id,
                "fileName": file_name,
                "division": "surgical",
                "category": category,
                "licenseStatus": "client-owned",
                "byteSize": len(pdf_bytes),
                "sha256": sha256_bytes(pdf_bytes),
                "pageCount": len(document),
                "textChars": source_text_chars,
                "embeddedImageCount": source_images,
                "textLayerQualityCounts": quality_counts,
                "reviewStateCounts": review_counts,
                "pages": pages,
            }
        )
        total_bytes += len(pdf_bytes)
        total_text_chars += source_text_chars
        total_images += source_images

    return {
        "schemaVersion": 1,
        "generatedAt": datetime.now(timezone.utc)
        .replace(microsecond=0)
        .isoformat()
        .replace("+00:00", "Z"),
        "generator": {
            "name": "scripts/media/build_catalogue_page_evidence.py",
            "renderer": "PyMuPDF",
            "renderScale": 1,
            "ocrUsed": False,
            "policy": (
                "Text-layer extraction is evidence only. Sparse and image-only pages require "
                "visual review; no product name is inferred from OCR."
            ),
        },
        "summary": {
            "sources": len(sources),
            "pages": len(all_pages),
            "bytes": total_bytes,
            "textChars": total_text_chars,
            "embeddedImageCount": total_images,
            "richPages": sum(
                page["textLayerQuality"] == "rich" for page in all_pages
            ),
            "sparsePages": sum(
                page["textLayerQuality"] == "sparse" for page in all_pages
            ),
            "imageOnlyPages": sum(
                page["textLayerQuality"] == "image-only" for page in all_pages
            ),
            "manualVisualReviewRequired": sum(
                page["reviewState"] == "manual-visual-review-required"
                for page in all_pages
            ),
        },
        "sources": sources,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", required=True)
    parser.add_argument("--output", required=True)
    arguments = parser.parse_args()
    output_path = Path(arguments.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    evidence = build_evidence(Path(arguments.source_dir))
    output_path.write_text(
        json.dumps(evidence, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(json.dumps(evidence["summary"], separators=(",", ":")))


if __name__ == "__main__":
    main()
