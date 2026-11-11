# aroma-pacifico-web

Website with the technical solution of the Aroma Pacífico project, the 2026 update of the coffee traceability pilot for Cauca, Huila and Tolima, in detail.

The site is in Spanish and presents the full technical solution of the project in detail: the 2020 legacy and what changes, an explorer of the 22 architecture diagrams, the four architecture decisions, no-signal operation, drones and event-driven inference, infrastructure as code, cost, observability and the design system. It is plain HTML, CSS and JavaScript with no build step and no external requests.

Four sections go deep: costs (the full A23 breakdown with a normal and harvest month toggle and Infracost in CI), governance (landing zone, identities, the 28 pc-iac rules and how CI enforces each, review gates, the decision log), the 100-hour plan (B01 to B13 by role, week, module and stack split, dependencies and deliverables, plus the whole-project effort) and infrastructure as code (module catalog by tag, stacks, the pipeline from pull request to plan to approval, and the plan-only scope). Their figures come from the current `main` of the Aroma repositories and from the project planning workbook.

The site is built mobile first: it is tested at 360, 390, 768, 1024 and 1440 px, wide tables scroll inside their own container, tap targets are at least 44 px, and the diagram viewer works with touch (pinch, drag, swipe or buttons). The home page loads only lazy WebP thumbnails; the viewer opens a 1600 px WebP and loads the full PNG or the SVG only on request.

## Layout

```text
aroma-pacifico-web/
|-- index.html              single page, semantic sections
|-- styles.css              site layout, built only on the design tokens
|-- app.js                  interactions: explorer, lightbox, toggles
|-- diagrams.js             catalog of the 22 diagrams with captions and boxes
|-- DIAGRAM_INVENTORY.md    one row per diagram with its source and box IDs
|-- assets/diagrams/        per diagram: sanitized SVG, full PNG, WebP view (1600 px) and WebP thumbnail (720 px)
|   `-- index.json          slug list for deep links: slug, title, category, IaC boxes
|-- tokens/ components/     copied unchanged from aroma-pacifico-design-system
|-- brand/ icons/           copied unchanged from aroma-pacifico-design-system
|-- scripts/
|   |-- sync-diagrams.py    copies and sanitizes the diagrams from the diagrams repository
|   |-- diagram-index.js    builds and checks assets/diagrams/index.json from diagrams.js
|   `-- publication-scan.sh scan that blocks identifiers, ARNs, hosts, emails and stray URLs
`-- .github/workflows/      pages.yml (deploy) and pr-conventions.yml
```

## Diagram deep links

Every diagram opens from a link of the form `<site>/#diagrama/<slug>`, where `<slug>` is the file stem under `assets/diagrams/` (for example `complete-architecture` or `network-no-signal-sequence`). When the page loads or the hash changes to such a link, the page scrolls to the explorer and opens that diagram in the viewer at full resolution with zoom. While the viewer is open the hash names the open diagram, so the address can be shared; the "Copiar enlace" button copies it. Closing the viewer, or pressing Back, clears the hash and closes the viewer. An unknown slug opens the explorer and shows a short notice.

Slugs are stable: never rename an existing file under `assets/diagrams/`. The full list is `assets/diagrams/index.json`, generated from `diagrams.js`:

```bash
node scripts/diagram-index.js          # write assets/diagrams/index.json
node scripts/diagram-index.js --check  # fail if it is stale or an asset is missing
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

The script copies each PNG, writes a sanitized SVG (the embedded draw.io source, the dark-mode style block and two literal strings flagged by the publication scan are removed or reworded), a 1600 px WebP view for the lightbox and a 720 px WebP thumbnail for the gallery. The diagrams repository is read only.

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

Every figure comes from the current `main` of the Aroma repositories; the case statement in `aroma-pacifico-architecture` is the only source of requirements. Only the public modules repository is linked; the other components of the project are described by role, without links. Governance follows [`AGENTS.md`](AGENTS.md).
