#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import fitz
import numpy as np
from PIL import Image, ImageOps

BATCH_PAGES = (2, 3, 4)
MAX_DIMENSION = 1600
RENDER_SCALE = 6


def ordered_image_blocks(page: fitz.Page, page_number: int) -> list[dict]:
    images = [block for block in page.get_text("dict")["blocks"] if block["type"] == 1]
    if page_number in (2, 3):
        top = sorted((block for block in images if block["bbox"][1] < 350), key=lambda block: block["bbox"][0])
        bottom = sorted((block for block in images if block["bbox"][1] >= 350), key=lambda block: block["bbox"][0])
        return [*top, *bottom]
    if page_number == 4:
        return sorted((block for block in images if block["bbox"][1] < 300), key=lambda block: block["bbox"][0])
    raise ValueError(f"Unsupported batch page: {page_number}")


def trim_white(image: Image.Image) -> Image.Image:
    pixels = np.asarray(image)
    mask = (pixels < 248).any(axis=2)
    y_values, x_values = np.where(mask)
    if not len(x_values):
        return image
    padding = 24
    x0 = max(0, int(x_values.min()) - padding)
    x1 = min(image.width, int(x_values.max()) + 1 + padding)
    y0 = max(0, int(y_values.min()) - padding)
    y1 = min(image.height, int(y_values.max()) + 1 + padding)
    return image.crop((x0, y0, x1, y1))


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def generate(source_pdf: Path, normalization_dir: Path, output_root: Path) -> dict:
    product_dir = output_root / "public/media/products/scissors"
    product_dir.mkdir(parents=True, exist_ok=True)
    manifest_path = output_root / "data/media/scissors-image-batch-01.generated.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)

    document = fitz.open(source_pdf)
    products: list[dict] = []

    for page_number in BATCH_PAGES:
        normalization = json.loads((normalization_dir / f"page-{page_number:02d}.json").read_text())
        product_ids = [product["id"] for product in normalization["products"]]
        page = document[page_number - 1]
        image_blocks = ordered_image_blocks(page, page_number)
        if len(product_ids) != len(image_blocks):
            raise RuntimeError(
                f"Page {page_number}: {len(product_ids)} product groups but {len(image_blocks)} representative images"
            )

        for product_id, block in zip(product_ids, image_blocks, strict=True):
            x0, y0, x1, y1 = block["bbox"]
            clip = fitz.Rect(
                max(0, x0 - 5),
                max(0, y0 - 5),
                min(page.rect.width, x1 + 5),
                max(y0 + 1, y1 - 2),
            )
            pixmap = page.get_pixmap(
                matrix=fitz.Matrix(RENDER_SCALE, RENDER_SCALE),
                clip=clip,
                alpha=False,
                colorspace=fitz.csRGB,
            )
            image = Image.frombytes("RGB", [pixmap.width, pixmap.height], pixmap.samples)
            image = trim_white(image)
            image = ImageOps.contain(image, (MAX_DIMENSION, MAX_DIMENSION), method=Image.Resampling.LANCZOS)

            output_path = product_dir / f"{product_id}.avif"
            image.save(output_path, format="AVIF", quality=82, speed=6)
            relative_path = output_path.relative_to(output_root).as_posix()
            products.append(
                {
                    "id": product_id,
                    "sourceFile": source_pdf.name,
                    "sourcePdfPage": page_number,
                    "sourceBboxPdf": [round(value, 2) for value in block["bbox"]],
                    "extraction": "rendered-visible-clip",
                    "renderScale": RENDER_SCALE,
                    "width": image.width,
                    "height": image.height,
                    "format": "avif",
                    "path": relative_path,
                    "bytes": output_path.stat().st_size,
                    "sha256": sha256(output_path),
                    "identityApproved": False,
                    "reviewStatus": "visual-match-pending-final",
                }
            )

    manifest = {
        "schemaVersion": 1,
        "sourceFile": source_pdf.name,
        "policy": "Client-supplied catalogue imagery only. Product geometry is not generated or altered.",
        "summary": {"products": len(products), "pages": list(BATCH_PAGES)},
        "products": products,
    }
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")
    return manifest


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-pdf", type=Path, required=True)
    parser.add_argument("--normalization-dir", type=Path, required=True)
    parser.add_argument("--output-root", type=Path, required=True)
    arguments = parser.parse_args()
    manifest = generate(arguments.source_pdf, arguments.normalization_dir, arguments.output_root)
    print(json.dumps(manifest["summary"]))


if __name__ == "__main__":
    main()
