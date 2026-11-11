@AGENTS.md

# Claude Project Instructions - Aroma Pacífico Web

`AGENTS.md`, imported above, is normative: language, zero-emoji policy, trunk-based development, conventional commits, requirements origin, academic delivery model and agent publishing boundaries. It is not repeated here.

## Repository context

This public repository is the static site with the technical solution of the Aroma Pacífico project, in detail, published with GitHub Pages. It holds no Terraform and no application code: plain HTML, CSS and JavaScript, no build step, no external requests.

- The site copy is Spanish because the site is a deliverable for a Spanish-speaking audience. Everything else (code, comments, file names, README, commits, pull requests) is English.
- Colors, type, spacing and components come only from the copied design system (`tokens/`, `components/`, `brand/`, `icons/`). Never edit those copies; re-copy them from `aroma-pacifico-design-system`.
- Every figure on the site comes from the current `main` of the Aroma repositories. Never invent a value.
- The tree is public: no account identifiers, ARNs, host names, emails, tokens, or people's names and logins (use the roles SR1, SR2, JR1 and JR2). Run `bash scripts/publication-scan.sh` before every push.
- Only the public `aroma-pacifico-terraform-modules` repository may be linked. Describe the private components of the project by role (for example "Arquitectura y decisiones"), without a link, a "privado" badge or any remark about access.
