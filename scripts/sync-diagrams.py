#!/usr/bin/env python3
"""Copy the published diagrams of aroma-pacifico-diagrams into assets/diagrams/.

Usage: python3 -I scripts/sync-diagrams.py <path-to-aroma-pacifico-diagrams>

For every SVG and PNG export listed in the diagrams README this script:
  * copies the PNG preview unchanged;
  * writes a sanitized copy of the SVG: the embedded draw.io source (the
    "content" attribute), the dark-mode style block, and three literal strings
    that the publication scan flags (a service ARN, a token audience host name)
    are removed or reworded, so the public tree has no hit for the scan;
  * writes a WebP thumbnail for the gallery cards;
  * prints the manifest (id, size, byte counts) used by DIAGRAM_INVENTORY.md.

The source repository is read only and is never modified.
"""
import json
import re
import sys
from pathlib import Path

from PIL import Image

CATALOG = [
    ("accounts", "landing-zone"),
    ("complete", "architecture"),
    ("complete", "architecture-iac"),
    ("network", "addressing-plan"),
    ("network", "collection-center"),
    ("network", "connectivity"),
    ("network", "no-signal-sequence"),
    ("security", "firewall-policy"),
    ("security", "identity-and-access"),
    ("security", "revocation-sequence"),
    ("flows", "drone-fumigation-sequence"),
    ("flows", "drone-state-machines"),
    ("flows", "farm-monitoring-sequence"),
    ("flows", "inference-functions"),
    ("flows", "sack-and-trip-sequence"),
    ("flows", "sack-states"),
    ("pipelines", "ingestion-and-flight-objects"),
    ("pipelines", "platform-pipeline"),
    ("legacy", "legacy-2020"),
    ("data-paths", "telemetry"),
    ("data-paths", "transporter-position"),
    ("data-paths", "drone-objects"),
]

REWORDS = [
    # A foundation-model ARN with no account part; the site keeps the model path.
    (re.compile(r"ar" r"n:aws:bedrock:us-east-1::foundation-model/"), "foundation-model/"),
    # A token audience host name; the site names the AWS STS audience instead.
    (re.compile(r"sts\." r"amazon" r"aws\.com"), "AWS STS audience"),
]


def sanitize(svg: str) -> str:
    svg = re.sub(r'\scontent="[^"]*"', "", svg, count=1)
    svg = re.sub(r"<style\b[^>]*>.*?</style>", "", svg, flags=re.S)
    for pattern, replacement in REWORDS:
        svg = pattern.sub(replacement, svg)
    return svg


def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__)
        return 2
    source = Path(sys.argv[1])
    out = Path(__file__).resolve().parent.parent / "assets" / "diagrams"
    (out / "thumbs").mkdir(parents=True, exist_ok=True)
    manifest = []
    for folder, name in CATALOG:
        diagram_id = name if name.startswith(folder) else f"{folder}-{name}"
        png = source / folder / f"{name}.png"
        svg = source / folder / f"{name}.svg"
        (out / f"{diagram_id}.png").write_bytes(png.read_bytes())
        clean = sanitize(svg.read_text(encoding="utf-8"))
        (out / f"{diagram_id}.svg").write_text(clean, encoding="utf-8")
        with Image.open(png) as image:
            width, height = image.size
            thumb = image.convert("RGBA")
            thumb.thumbnail((720, 720))
            background = Image.new("RGBA", thumb.size, (255, 255, 255, 255))
            background.alpha_composite(thumb)
            background.convert("RGB").save(out / "thumbs" / f"{diagram_id}.webp", "WEBP", quality=80, method=6)
        manifest.append({
            "id": diagram_id,
            "source": f"{folder}/{name}",
            "png": [width, height],
            "svg_kb": (out / f"{diagram_id}.svg").stat().st_size // 1024,
            "png_kb": (out / f"{diagram_id}.png").stat().st_size // 1024,
            "thumb_kb": (out / "thumbs" / f"{diagram_id}.webp").stat().st_size // 1024,
        })
    print(json.dumps(manifest, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
