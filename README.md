# HermesVJ2

HermesVJ2 is an authored, browser-based dreamworld built with React, TypeScript, Three.js, and React Three Fiber. It is an independent, static-deployable experience designed for visual exploration and careful agent-driven iteration.

The current world contains seventeen chapters. Alongside the original landmarks and five visual studies, five elemental chapters and five space chapters extend the procedural world:

- **Lotus Gate** — a luminous ceremonial threshold in a dark reflective field.
- **Wormhole Spire** — a vertical cosmic landmark shaped by orbital motion and restrained bloom.
- **Tempest Lantern** — rain, charged particles, and branching lightning around a strong ritual light.
- **Cinder Sanctum** — procedural fire, sparks, and molten paths radiating from an obsidian hearth.
- **Nebula Fountain** — eleven unique plasma arcs rising from a toroidal stellar well through particle mist.
- **Frost Oracle** — snow streaks, an ice crown, and cold blue-white light.
- **Thunder Forge** — electric branches and sparks around a floating hammer ring in gold and blue light.
- **Event Horizon Gala** — a gold-violet spiral gathering around a lightless gravitational heart.
- **Comet Shipyard** — a ceremonial spacecraft escorting five luminous comets through deep space.
- **Trinary Orrery** — three suns and their planets moving through a shared gravitational instrument.
- **Spiral Galaxy Sanctuary** — a dense, many-colored spiral galaxy turning around a radiant heart.
- **Deep-Space Convergence** — a pulsar, quasar, and spacecraft answering across a shared cosmic gulf.

The intermediate Prism Orchard, Solar Choir, Tide Cathedral, Ember Loom, and Aurora Reliquary chapters remain available through the chapter rail and direct URLs.

Production: **https://kabutojira.github.io/HermesVJ2/**

## Prerequisites

- Git
- Node.js `^20.19.0` or `>=22.12.0` (Node 22 LTS recommended)
- npm 10 or newer
- A browser with WebGL 2 support

No server, database, environment secrets, or external asset service is required.

## Install

Clone the repository and install the exact dependency versions from the lockfile:

```bash
git clone https://github.com/Kabutojira/HermesVJ2.git
cd HermesVJ2
npm ci
```

Use `npm install` instead only when intentionally changing dependencies and committing the resulting `package-lock.json` update.

## Develop

Start the Vite development server:

```bash
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173/`). Development uses the root base path. To set it explicitly:

```bash
HERMESVJ2_BASE=/ npm run dev
```

Useful scripts:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot reload. |
| `npm test` | Run the Vitest unit and contract suite once. |
| `npm run test:watch` | Run Vitest in watch mode while iterating. |
| `npm run lint` | Run oxlint over `src/` and `tests/`. |
| `npm run validate` | Validate chapter directories and registry entries. |
| `npm run build` | Type-check and create the production bundle in `dist/`. |
| `npm run preview` | Serve `dist/` on port 4173. |

`npm run capture` currently prints the manual capture workflow; it is not an automated visual test.

## Build and test

Run the complete pre-handoff validation from a clean checkout:

```bash
npm ci
npm test
npm run lint
npm run validate
npm run build
```

The production build defaults to the case-sensitive GitHub Pages base path `/HermesVJ2/`. Preview it locally with:

```bash
npm run preview
```

Then open `http://127.0.0.1:4173/HermesVJ2/` and smoke-test every changed chapter. For a root-hosted production build, override the base path:

```bash
HERMESVJ2_BASE=/ npm run build
npm run preview
```

A change is not complete merely because TypeScript compiles. Visual, camera, interaction, lighting, asset, or post-processing changes must also be checked in a real browser at narrow and wide viewports, with the console free of errors.

## Interaction controls

| Input | Action |
| --- | --- |
| Pointer drag / one-finger drag | Orbit within the authored camera envelope. |
| Wheel / pinch | Move closer to or farther from the landmark. |
| Double-click / double-tap | Pulse the active chapter. |
| `Space` | Pulse the active chapter. |
| `A`, `D`, `←`, `→` | Move between chapters. |
| HUD buttons | Pulse or navigate without keyboard gestures. |

Chapter URLs are shareable through `?chapter=<chapter-id>`, for example:

`https://kabutojira.github.io/HermesVJ2/?chapter=chapter-002-wormhole-spire`

The interface provides visible keyboard focus, touch-sized controls, safe-area-aware layout, reduced-motion behavior, and a readable recovery screen when WebGL initialization fails.

Reduced motion applies to both CSS and WebGL: it switches to demand rendering and disables camera drift, autorotation, nonessential scene and particle motion, and post-processing. Quality reacts to viewport, orientation, and basic device capability: low tier removes reflections and shadows and reduces procedural density; medium reduces reflector resolution and DPR; high may lazy-load post-processing. See `docs/performance-budget.md` for budgets and the evidence procedure.

Reuse and licensing boundaries are recorded in `docs/source-audit.md`, `docs/reuse-and-attribution.md`, and `LICENSE`.

## Repository structure

```text
.github/workflows/       GitHub Pages build and deployment workflow
hermes/skills/           Repo-local worldbuilding skill and templates
public/                  Static icons and social-preview assets
scripts/                 World validation, capture, and publish helpers
src/app/                 Zustand UI and serializable world state
src/components/          DOM shell, HUD, chapter rail, loading, fallbacks
src/content/             Onboarding copy and world lore
src/experience/          Shared camera, controls, environment, light, post FX
src/lib/                 Runtime, navigation, viewport, and quality helpers
src/worlds/              Typed chapter registry, shared contracts, scenes
src/worlds/chapters/     Chapter-owned config, scene, and creative brief
tests/                   Manifest, camera, navigation, and interaction tests
docs/                    Art direction, architecture, and implementation plans
AGENTS.md                 Mandatory guidance for coding agents
```

Read `AGENTS.md` before contributing. Agents must also load `hermes/skills/hermesvj2-world/SKILL.md` and an appropriate coding skill before changing the 3D world. The art direction is defined in `docs/art-direction/visual-language.md`; architecture decisions live in `docs/architecture/3d-redesign.md` and `docs/architecture/runtime-architecture.md`.

## Adding or changing a chapter

1. Start from the chapter brief under `src/worlds/chapters/<chapter-id>/prompts/brief.md`.
2. Keep chapter-owned geometry, animation, and constants inside that chapter.
3. Register the chapter through a typed config and lazy import in `src/worlds/registry.ts`.
4. Keep chapter IDs stable because they are part of shareable URLs.
5. Add or update tests and run the full validation sequence above.
6. Preview every registered chapter after changing shared camera, controls, environment, lighting, or post-processing.

Prefer original procedural geometry. External assets must have a verified license compatible with distribution, be optimized before commit, and have their source, author, license, and modifications recorded. Do not copy source code or assets from `hermesvj`, and do not introduce unversioned runtime asset URLs.

## Deployment

GitHub Pages uses **GitHub Actions** as its source. `.github/workflows/pages.yml` is the single deployment workflow. Every push to `main` runs installation, tests, world validation, linting, and the production build before deploying `dist/` to the `github-pages` environment. The workflow can also be started manually from the Actions tab and requires no repository secrets.

To deploy:

1. Merge a reviewed change into `main`, or run **Actions → deploy-pages → Run workflow**.
2. Wait for both the `build` and `deploy` jobs to pass.
3. Open the production URL and verify the changed chapter query URLs, controls, and browser console.
4. Confirm JavaScript, CSS, icons, and lazy chapter chunks load without 404s.

Keep **Settings → Pages → Build and deployment → Source** set to **GitHub Actions**. The workflow intentionally uses only `pages: write` and `id-token: write` permissions.

### Roll back

Restore a known-good version with a new revert commit; do not rewrite shared history:

```bash
git checkout main
git pull --ff-only origin main
git revert <faulty-commit-sha>
git push origin main
```

The push deploys the reverted state. Monitor the Pages workflow and repeat the production smoke test. Re-running an older successful workflow can provide a temporary restore, but follow it with a revert so the next deployment cannot reintroduce the faulty commit.
