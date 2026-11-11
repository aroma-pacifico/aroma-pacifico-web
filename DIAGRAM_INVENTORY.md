# Diagram inventory

All 22 diagrams of `aroma-pacifico-diagrams` are published in the explorer of this site. The SVG is the vector publication export, the PNG is the preview, a 720 px WebP thumbnail serves the gallery cards and a 1600 px WebP view opens first in the lightbox. Files live in `assets/diagrams/`, named `<id>.svg`, `<id>.png`, `thumbs/<id>.webp` and `view/<id>.webp`.

Each row keeps the source file of the diagrams repository, the IaC boxes D01 to D13 that the diagram badges (a dash means the diagram carries no box), and the byte size of the published files. The captions shown on the site are in `diagrams.js`.

Sanitization of the SVG copies: the embedded draw.io source (`content` attribute) and the dark-mode style block are removed, and one service ARN and one token audience host name in the text are reworded, so the public tree has no hit for the publication scan. The PNG files are copied unchanged. Refresh everything with `python3 -I scripts/sync-diagrams.py <path-to-aroma-pacifico-diagrams>`.

| ID | Category | Title | IaC boxes | Source | SVG size (px) | SVG / PNG |
|---|---|---|---|---|---|---|
| `complete-architecture` | complete | Complete Architecture (Runtime) | D01, D02, D03, D04, D05, D06, D07, D08, D09, D10, D11, D12, D13 | `complete/architecture.drawio (page 1)` | 2924 x 2409 | 6699 KB / 1722 KB |
| `complete-architecture-iac` | complete | Complete Architecture (IaC Traceability) | D01, D02, D03, D04, D05, D06, D07, D08, D09, D10, D11, D12, D13 | `complete/architecture.drawio (page 2)` | 2933 x 1157 | 2009 KB / 477 KB |
| `accounts-landing-zone` | accounts | Landing Zone, Governance and Auditing | D02, D03, D04, D06, D09 | `accounts/landing-zone.drawio` | 2373 x 2207 | 204 KB / 2561 KB |
| `network-addressing-plan` | network | Cloud and Site Addressing Plan | D04, D05 | `network/addressing-plan.drawio` | 2753 x 2026 | 8472 KB / 1960 KB |
| `network-collection-center` | network | Collection Center Network Pattern | D04, D05, D07 | `network/collection-center.drawio` | 2394 x 1621 | 3167 KB / 997 KB |
| `network-connectivity` | network | End-to-End Connectivity Architecture | D04, D05, D06, D07, D08, D09, D10 | `network/connectivity.drawio` | 3653 x 2272 | 11805 KB / 1809 KB |
| `network-no-signal-sequence` | network | No-Signal Handling and Alert Sequence | D09, D10 | `network/no-signal-sequence.drawio` | 3746 x 2277 | 6643 KB / 1117 KB |
| `security-firewall-policy` | security | Perimeter and Cloud Firewall Policy | D04, D05, D07 | `security/firewall-policy.drawio` | 2693 x 1603 | 6523 KB / 1656 KB |
| `security-identity-and-access` | security | Identity and Access Architecture | D02, D06, D08, D09 | `security/identity-and-access.drawio` | 3413 x 1782 | 7235 KB / 1148 KB |
| `security-revocation-sequence` | security | Credential and Revocation Sequence | D06, D08 | `security/revocation-sequence.drawio` | 3713 x 2657 | 4976 KB / 944 KB |
| `flows-drone-fumigation-sequence` | flows | Drone Fumigation Sequence | D04, D06, D08, D09, D10 | `flows/drone-fumigation-sequence.drawio` | 4247 x 5262 | 5140 KB / 1154 KB |
| `flows-drone-state-machines` | flows | Drone State Machines | D06, D09, D10 | `flows/drone-state-machines.drawio` | 4132 x 1607 | 6461 KB / 767 KB |
| `flows-farm-monitoring-sequence` | flows | Farm Monitoring and Alert Sequence | D06, D08, D09, D10 | `flows/farm-monitoring-sequence.drawio` | 3154 x 3027 | 7319 KB / 1606 KB |
| `flows-inference-functions` | flows | Inference Functions Architecture | D06, D09, D10 | `flows/inference-functions.drawio` | 2753 x 2332 | 13030 KB / 2903 KB |
| `flows-sack-and-trip-sequence` | flows | Sack and Trip Custody Sequence | D04, D05, D06, D07 | `flows/sack-and-trip-sequence.drawio` | 3453 x 3757 | 6039 KB / 2112 KB |
| `flows-sack-states` | flows | Sack Lifecycle State Machine | D04, D05, D06 | `flows/sack-states.drawio` | 3333 x 1442 | 5953 KB / 1675 KB |
| `pipelines-ingestion-and-flight-objects` | pipelines | Ingestion and Flight-Object Pipelines | D08, D09, D10 | `pipelines/ingestion-and-flight-objects.drawio` | 2613 x 1292 | 4473 KB / 1111 KB |
| `pipelines-platform-pipeline` | pipelines | Platform CI/CD Deployment Pipeline | D01, D02, D03, D04, D05, D06, D08, D10, D11, D12, D13 | `pipelines/platform-pipeline.drawio` | 2613 x 1152 | 4134 KB / 982 KB |
| `legacy-2020` | legacy | 2020 Legacy Mapping (Keep/Retire/Replace) | D01, D03, D04, D05, D06, D08, D09, D10 | `legacy/legacy-2020.drawio` | 3153 x 2527 | 7703 KB / 1512 KB |
| `data-paths-telemetry` | data-paths | Telemetry Data Path | - | `data-paths/telemetry.drawio` | 2883 x 972 | 1257 KB / 377 KB |
| `data-paths-transporter-position` | data-paths | Transporter Position Data Path | - | `data-paths/transporter-position.drawio` | 2822 x 912 | 1229 KB / 345 KB |
| `data-paths-drone-objects` | data-paths | Drone Objects Data Path | - | `data-paths/drone-objects.drawio` | 2893 x 1222 | 1503 KB / 470 KB |

## IaC boxes

| Box | Meaning |
|---|---|
| D01 | Layout of the IaC repositories |
| D02 | Remote state |
| D03 | Variables and secrets |
| D04 | Network module |
| D05 | Collection center association |
| D06 | Security baseline |
| D07 | Firewall rules |
| D08 | Farm module |
| D09 | Telemetry ingestion |
| D10 | Inference function pattern |
| D11 | CI |
| D12 | CD |
| D13 | Final validation |
