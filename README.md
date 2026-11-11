# aroma-pacifico-web

Technical showcase website of the Aroma Pacífico pilot, the 2026 update of the coffee traceability pilot for Cauca, Huila and Tolima.

The site is in Spanish and shows in detail what the defense could not cover: the 2020 legacy and what changes, an explorer of the 22 architecture diagrams, the four architecture decisions, no-signal operation, drones and event-driven inference, infrastructure as code, cost, observability and the design system. It is plain HTML, CSS and JavaScript with no build step and no external requests.

## Layout

```text
aroma-pacifico-web/
|-- index.html              single page, semantic sections
|-- styles.css              site layout, built only on the design tokens
|-- app.js                  interactions: explorer, lightbox, toggles
|-- diagrams.js             catalog of the 22 diagrams with captions and boxes
|-- DIAGRAM_INVENTORY.md    one row per diagram with its source and box IDs
|-- assets/diagrams/        sanitized SVG, PNG preview and WebP thumbnail per diagram
|-- tokens/ components/     copied unchanged from aroma-pacifico-design-system
|-- brand/ icons/           copied unchanged from aroma-pacifico-design-system
|-- scripts/
|   |-- sync-diagrams.py    copies and sanitizes the diagrams from the diagrams repository
|   `-- publication-scan.sh scan that blocks identifiers, ARNs, hosts, emails and stray URLs
`-- .github/workflows/      pages.yml (deploy) and pr-conventions.yml
```

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000/
```

## Refresh the diagrams

```bash
python3 -I scripts/sync-diagrams.py ../aroma-pacifico-diagrams
```

The script copies each PNG, writes a sanitized SVG (the embedded draw.io source, the dark-mode style block and two literal strings flagged by the publication scan are removed or reworded) and a WebP thumbnail. The diagrams repository is read only.

## Publication scan

The tree is public. Run this before every push; the Pages workflow runs it before it deploys.

```bash
bash scripts/publication-scan.sh
# optional: refuse extra terms such as names or logins, pipe-separated
FORBIDDEN_TERMS='term-one|term-two' bash scripts/publication-scan.sh
```

## Deployment

`.github/workflows/pages.yml` deploys on every push to `main` with `actions/configure-pages`, `actions/upload-pages-artifact` and `actions/deploy-pages`, pinned by commit SHA, with minimal permissions. It stages only the site files. The repository Pages source is "GitHub Actions".

## Sources and rules

Every figure comes from the current `main` of the Aroma repositories; the case statement in `aroma-pacifico-architecture` is the only source of requirements. Private repositories are named on the site but never linked. Governance follows [`AGENTS.md`](AGENTS.md).
