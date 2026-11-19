# Diagram inventory

All 25 diagrams of `aroma-pacifico-diagrams` are published in the explorer of this site. The SVG is the vector publication export, the PNG is the preview, a 720 px WebP thumbnail serves the gallery cards and a 1600 px WebP view opens first in the lightbox. Files live in `assets/diagrams/`, named `<id>.svg`, `<id>.png`, `thumbs/<id>.webp` and `view/<id>.webp`.

Each row keeps the source file of the diagrams repository, the IaC boxes D01 to D13 that the diagram badges (a dash means the diagram carries no box), and the byte size of the published files. The captions shown on the site are in `diagrams.js`.

Sanitization of the SVG copies: the embedded draw.io source (`content` attribute) and the dark-mode style block are removed, and one service ARN and one token audience host name in the text are reworded, so the public tree has no hit for the publication scan. The PNG files are copied unchanged. Refresh everything with `python3 -I scripts/sync-diagrams.py <path-to-aroma-pacifico-diagrams>`.

| ID | Category | Title | IaC boxes | Source | SVG size (px) | SVG / PNG |
|---|---|---|---|---|---|---|
| `complete-architecture` | complete | Complete Architecture (Runtime) | D01, D02, D03, D04, D05, D06, D07, D08, D09, D10, D11, D12, D13 | `complete/architecture.drawio (page 1)` | 2425 x 1935 | 3179 KB / 1154 KB |
| `complete-architecture-iac` | complete | Complete Architecture (IaC Traceability) | D01, D02, D03, D04, D05, D06, D07, D08, D09, D10, D11, D12, D13 | `complete/architecture.drawio (page 2)` | 2381 x 900 | 1206 KB / 407 KB |
| `accounts-landing-zone` | accounts | Landing Zone, Governance and Auditing | D02, D03, D04, D06, D09 | `accounts/landing-zone.drawio` | 2423 x 1828 | 2679 KB / 907 KB |
| `network-addressing-plan` | network | Cloud and Site Addressing Plan | D04, D05 | `network/addressing-plan.drawio` | 1803 x 1264 | 2200 KB / 1046 KB |
| `network-collection-center` | network | Collection Center Network Pattern | D04, D05, D07 | `network/collection-center.drawio` | 1923 x 1315 | 1507 KB / 720 KB |
| `network-connectivity` | network | End-to-End Connectivity Architecture | D04, D05, D06, D07, D08, D09, D10 | `network/connectivity.drawio` | 2012 x 1167 | 1380 KB / 643 KB |
| `network-no-signal-sequence` | network | No-Signal Handling and Alert Sequence | D09, D10 | `network/no-signal-sequence.drawio` | 2047 x 1194 | 1181 KB / 531 KB |
| `security-firewall-policy` | security | Perimeter and Cloud Firewall Policy | D04, D05, D07 | `security/firewall-policy.drawio` | 2113 x 1215 | 1678 KB / 728 KB |
| `security-identity-and-access` | security | Identity and Access Architecture | D02, D06, D08, D09 | `security/identity-and-access.drawio` | 2003 x 1307 | 1347 KB / 659 KB |
| `security-revocation-sequence` | security | Credential and Revocation Sequence | D06, D08 | `security/revocation-sequence.drawio` | 1905 x 1411 | 1091 KB / 573 KB |
| `flows-drone-fumigation-sequence` | flows | Drone Fumigation Sequence | D04, D06, D08, D09, D10 | `flows/drone-fumigation-sequence.drawio` | 1905 x 1492 | 1143 KB / 582 KB |
| `flows-drone-state-machines` | flows | Drone State Machines | D06, D10 | `flows/drone-state-machines.drawio` | 1993 x 1125 | 1264 KB / 578 KB |
| `flows-farm-monitoring-sequence` | flows | Farm Monitoring and Alert Sequence | D06, D08, D09, D10 | `flows/farm-monitoring-sequence.drawio` | 1903 x 1392 | 1401 KB / 676 KB |
| `flows-inference-functions` | flows | Inference Functions Architecture | D06, D09, D10 | `flows/inference-functions.drawio` | 1973 x 1101 | 1158 KB / 607 KB |
| `flows-sack-and-trip-sequence` | flows | Sack and Trip Custody Sequence | D04, D05, D06, D07 | `flows/sack-and-trip-sequence.drawio` | 1903 x 1532 | 1210 KB / 599 KB |
| `flows-sack-states` | flows | Sack Lifecycle State Machine | D04, D05, D06 | `flows/sack-states.drawio` | 1938 x 890 | 666 KB / 352 KB |
| `pipelines-ingestion-and-flight-objects` | pipelines | Ingestion and Flight-Object Pipelines | D08, D09, D10 | `pipelines/ingestion-and-flight-objects.drawio` | 1863 x 986 | 1304 KB / 627 KB |
| `pipelines-platform-pipeline` | pipelines | Platform CI/CD Deployment Pipeline | D01, D02, D03, D04, D05, D06, D08, D10, D11, D12, D13 | `pipelines/platform-pipeline.drawio` | 1903 x 754 | 1093 KB / 475 KB |
| `pipelines-iac-ci-sequence` | pipelines | IaC CI and Module Release Sequence | D01, D11, D13 | `pipelines/iac-ci-sequence.drawio` | 1863 x 1760 | 954 KB / 623 KB |
| `pipelines-iac-provisioning-sequence` | pipelines | IaC CD Provisioning Sequence | D01, D02, D04, D05, D06, D10, D12, D13 | `pipelines/iac-provisioning-sequence.drawio` | 1863 x 1870 | 1046 KB / 664 KB |
| `pipelines-iac-teardown-and-rollback-sequence` | pipelines | IaC Teardown and Rollback Sequence | D01, D02, D04, D05, D06, D09, D10, D12 | `pipelines/iac-teardown-and-rollback-sequence.drawio` | 1863 x 1520 | 927 KB / 553 KB |
| `legacy-2020` | legacy | 2020 Legacy Mapping (Keep/Retire/Replace) | D01, D03, D04, D05, D06, D08, D09, D10 | `legacy/legacy-2020.drawio` | 2033 x 1444 | 1583 KB / 643 KB |
| `data-paths-telemetry` | data-paths | Telemetry Data Path | - | `data-paths/telemetry.drawio` | 1823 x 705 | 878 KB / 483 KB |
| `data-paths-transporter-position` | data-paths | Transporter Position Data Path | - | `data-paths/transporter-position.drawio` | 1823 x 675 | 798 KB / 421 KB |
| `data-paths-drone-objects` | data-paths | Drone Objects Data Path | - | `data-paths/drone-objects.drawio` | 1863 x 848 | 1155 KB / 593 KB |

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
