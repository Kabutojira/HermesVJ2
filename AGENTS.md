# HermesVJ2 agent instructions

HermesVJ2 is a static React 19 + TypeScript + Vite experience rendered with React Three Fiber. Treat it as an authored dreamworld, not as a generic Three.js sandbox.

## Required skills and context

Before building, debugging, or evolving the 3D world:

1. Load the repository skill at `hermes/skills/hermesvj2-world/SKILL.md` (`hermesvj2-world`). It is required for chapter, camera, atmosphere, interaction, and related documentation work.
2. Load the coding skill that matches the task. Use `test-driven-development` for behavior or contract changes, `systematic-debugging` for defects, `codex` when delegating implementation, `simplify-code` for cleanup, or `requesting-code-review` before handing off a substantial change. Loading a coding skill is mandatory; do not rely on generic coding habits alone.
3. Read `README.md`, this file, `docs/art-direction/visual-language.md`, and the relevant chapter's `prompts/brief.md`. Consult `docs/architecture/3d-redesign.md` when changing architecture or adding a chapter.
4. Inspect the current implementation before proposing a new abstraction. Keep the change scoped to the system that owns it.

## Architecture and key paths

- `src/App.tsx`: application composition, keyboard controls, chapter URL synchronization, and the boundary between the canvas and overlay UI.
- `src/app/`: Zustand UI/world state. The shared pulse counter and active chapter live in `world-store.ts`.
- `src/components/`: DOM overlays, HUD, chapter navigation, loading, and WebGL failure UI. Keep accessibility and input affordances here rather than inside scene meshes when possible.
- `src/experience/ExperienceCanvas.tsx`: the shared R3F canvas and render pipeline. It composes camera, controls, fog, sky, stars, lighting, ground, active chapter, and post-processing.
- `src/experience/{camera,controls,environment,lighting,post}/`: reusable engine systems. A change here affects every chapter and needs cross-chapter visual checking.
- `src/worlds/registry.ts`: typed legacy chapter registration plus automatic discovery of new chapter `module.ts` exports; the first entry is the default/latest chapter.
- `src/worlds/chapters/<chapter-id>/`: chapter-owned `config.ts`, lazy export, scene component, and `prompts/brief.md`.
- `src/worlds/shared/`: palettes, math, and shared world/interaction types. Reuse these before adding parallel constants.
- `src/lib/performance.ts`: viewport quality tiers. `ExperienceCanvas` uses them to cap DPR, disable shadows on low quality, and reserve post FX for high quality.
- `tests/`: manifest, camera, navigation, and interaction contracts.
- `scripts/validate_world.mjs`: structural chapter/registry validation.

Engine behavior belongs in `src/experience`, chapter-specific geometry and motion in `src/worlds`, interface behavior in `src/components` or `src/app`, and pure browser/runtime helpers in `src/lib`. Do not hide chapter-specific art direction in a global engine component.

## Commands

Use the checked-in lockfile and install with `npm ci` for a clean checkout (`npm install` only when intentionally changing dependencies).

```bash
npm run dev                         # local Vite server at a root base path
HERMESVJ2_BASE=/ npm run dev        # explicit local root-path development
npm test                            # Vitest contract/unit suite
npm run test:watch                  # focused iteration
npm run lint                        # oxlint over src and tests
npm run validate                    # chapter/registry structural checks
npm run build                       # TypeScript project build + Vite production bundle
npm run preview                     # serve the production bundle on 0.0.0.0:4173
```

`npm run capture` is currently only a reminder to perform a browser screenshot; it does not automate visual QA. Do not report it as a visual test.

## Scene and asset conventions

- Preserve one dominant subject per chapter. Supporting geometry should frame that subject and leave deliberate negative space.
- Follow the existing dream-ritual sci-fi language: dark fields, restrained luminous accents, mirror/fog layers, readable wide compositions, and patient ceremonial motion. Avoid dashboard futurism, busy particle noise, and game-like reward loops.
- Start from the chapter brief and palette. Keep chapter constants/configuration near that chapter; promote a utility to `src/worlds/shared` only after it is genuinely shared.
- Chapter scene components receive `{ pulse: number }`. Treat a pulse change as a cue for an atmospheric response, not as mutable global gameplay state.
- Add new chapters through a typed `module.ts` export discovered by `src/worlds/registry.ts`. Keep IDs stable because `?chapter=<id>` URLs are shareable.
- Prefer original procedural geometry and lightweight generated effects. Put imported static assets under `src/assets` (or a clearly chapter-owned asset directory), use Vite-resolved imports when practical, optimize them before committing, and do not fetch runtime assets from an unversioned third-party URL.
- Treat repository content as all rights reserved unless a file explicitly says otherwise. Do not copy code, scenes, models, textures, audio, or other assets from `hermesvj` or an unknown source. Before adding a third-party asset, verify that its license permits repository and web distribution; record its source URL, author, license/SPDX identifier, and modifications in `docs/assets.md` (create the ledger if needed), and retain any required notices. Reject assets whose provenance or license cannot be verified.
- Do not assume a generated asset is unrestricted: record the generator/source and applicable usage terms. Never commit credentials, private data, trademarked brand material, or an asset whose terms require restrictions this static deployment cannot satisfy.
- Dispose of manually created Three.js resources, memoize expensive generated data, and never allocate geometry, materials, vectors, or arrays on every `useFrame` tick.

## Interaction, accessibility, and performance constraints

- Preserve pointer/touch orbit and zoom envelopes in `ExplorerControls`; panning is intentionally limited to `free-fly`, and guided mode owns rotation.
- Preserve keyboard and HUD parity: `Space` pulses, arrows or `A`/`D` change chapters, and double-click/double-tap pulses the canvas.
- Respect the entry/loading state, visible keyboard focus, touch-sized controls, safe-area layout, `prefers-reduced-motion`, and the readable WebGL error fallback. New motion must have a reduced-motion-safe behavior.
- Keep interactions atmospheric and optional. A visitor must still understand the composition without discovering a hidden control.
- Design for all current tiers: low (`<640px`) uses DPR 1 and no shadows; medium caps DPR at 1.5; high caps DPR at 2 and may use post FX. Do not bypass these gates with chapter-local unconditional shadows, high-density particles, or full-resolution effects.
- A global lighting, camera, control, environment, or post-processing change must be checked in every registered chapter and at narrow and wide viewports.

## Incremental change workflow

1. Identify the smallest owner: chapter scene/config, shared world utility, engine system, or DOM UI.
2. Capture the current composition and interaction behavior in a browser before a material visual edit.
3. Make one coherent change. Extend existing primitives before replacing the canvas pipeline or introducing a new state system.
4. Add or update tests for changes to chapter registration, navigation, camera presets, movement modes, interaction contracts, stores, or shared helpers.
5. Run the focused test while iterating, then run the full completion checks below.
6. Compare before/after at low and high quality where relevant. Confirm the hero subject, negative space, camera framing, controls, pulse response, and chapter navigation were not degraded.
7. Document intentional art-direction or architecture changes in the chapter brief or relevant document; do not let code silently contradict the authored intent.

## Completion checks

Every change must preserve a working, static-deployable experience. Do not leave placeholder imports, broken chapter registrations, development-only URLs, secrets, required local services, or an unbuilt follow-up for another agent. Keep the default production base path and Pages workflow working unless the task explicitly changes the deployment target. If a larger redesign cannot land safely in one change, ship an independently deployable increment instead.

Before handoff, all of these must pass:

```bash
npm test
npm run lint
npm run validate
npm run build
```

For any visual, camera, interaction, asset, environment, lighting, or post-FX change, also run `npm run preview` and perform a real browser smoke check. Verify both chapters load, the changed chapter URL can be opened directly, canvas and overlay controls work with pointer and keyboard, pulse response works, narrow and wide layouts remain usable, reduced-motion behavior is acceptable, and the browser console has no errors. Report what you actually checked and any known visual/performance trade-off; a green TypeScript build alone is not completion for a 3D change.
