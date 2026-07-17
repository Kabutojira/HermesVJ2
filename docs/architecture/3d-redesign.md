# HermesVJ2: independent 3D redesign

## Product decision

HermesVJ2 is an explorable, contemplative Three.js world, not a fork of HermesVJ and not a gallery wrapped around old sketches. The visitor enters one continuous full-viewport experience, moves between authored **chapters**, and uses a small set of atmospheric interactions to alter light, motion, sound-ready state, and camera composition. Chapters are code-owned scene modules rather than downloaded executable sketches.

The launch experience has two landmarks derived from HermesVJ's strongest late visual studies: a moonlit Lotus Gate and an off-axis Wormhole Spire. They are spatial reinterpretations, not ports of p5/Hydra code or pixels.

## Source audit: what is worth carrying forward

`kabutojira/hermesvj` is a static GitHub Pages/PWA display pipeline. A React/Vite client reads `manifest.json`, selects p5 or Hydra runtimes, builds an iframe document, and displays generated sketches in `sandbox="allow-scripts"`. It supports latest/gallery selection, previous/next, refresh and polling, fullscreen, runtime errors, and aspect-specific landscape/portrait/square/ultrawide variants. New immutable sketch directories plus a manifest update are the publishing unit; repository commits provide history and rollback. GitHub Actions builds `app/` and deploys static output.

Carry forward these behaviors and conventions:

- repository-as-source-of-truth, static hosting, reviewable commits, and deterministic GitHub Pages deployment;
- an ordered manifest/registry, a clear current selection, previous/next navigation, fullscreen-first presentation, visible loading/error state, and resilient continuation when optional content fails;
- responsive composition chosen for the actual viewport rather than stretching a fixed canvas;
- agent-friendly authoring: timestamped/identified content, metadata and prompt briefs, validation scripts, preview capture, concise commits, and repo-local skills/templates;
- a visual identity built from deep indigo/graphite voids, restrained cyan/amethyst/auric accents, one dominant off-axis subject, layered depth, slow ceremonial motion, haze/particles, and disciplined negative space.

Do **not** carry forward the iframe runtime, arbitrary generated JavaScript, p5/Hydra engine split, 30-second manifest polling, gallery-card-first UI, or a growing archive of unrelated canvases. Those solve remote sketch playback; HermesVJ2 owns a typed 3D runtime and curated spatial continuity. Existing source assets are inspiration only; no upstream runtime code or raster output is required.

## Intended user experience

1. **Threshold:** a lightweight HTML hero renders immediately and offers “Enter world”; WebGL and the first chapter preload behind it.
2. **Arrival:** the camera eases to a stable authored vista. The HUD briefly teaches drag/look, scroll or pinch/dolly, chapter navigation, and the primary `pulse` interaction.
3. **Exploration:** pointer/touch movement produces bounded parallax/orbit; wheel/pinch changes distance; keyboard offers arrows/WASD and `Space` for pulse. Controls never permit the visitor to leave the authored camera envelope.
4. **Resonance:** hovering/focusing a marked landmark reveals a subtle label; click/tap/Space emits a short world pulse that modulates emissive intensity, particles and post-processing. It is atmospheric feedback, not scoring or combat.
5. **Passage:** selecting next/previous chapter (HUD, rail, or keyboard) fades UI, transitions camera/fog, swaps the chapter scene, and restores focus. A URL query such as `?chapter=lotus-gate` is shareable.
6. **Rest:** after inactivity, idle drift resumes. Any input cancels it immediately. Reduced-motion mode substitutes crossfades and static ambience.

UI remains a thin accessible DOM layer above the canvas: title/lore, chapter rail, help, mute-ready toggle, quality control, performance status only when degraded, and fullscreen. All actions are keyboard reachable with visible focus. Canvas gestures use pointer events; controls remain at least 44px on touch screens.

## Chosen stack and build contract

- Node 20+, npm, Vite, React, and strict TypeScript.
- Three.js through `@react-three/fiber`; `@react-three/drei` for proven scene helpers; official `three/addons` passes for a tightly budgeted shared effects chain.
- Zustand for serializable UI/world state; React state is not updated per frame.
- Vitest + Testing Library for registry, stores, control contracts and DOM UI. Playwright is the later smoke/visual-regression layer.
- ESLint/Oxlint plus `tsc --noEmit`; no backend, SSR, database, CMS, remote executable content, or required runtime API.
- Vite base defaults to `/hermesvj2/`; the Pages workflow runs install, test, validation, build, uploads `dist`, and deploys only from `main`.

## Repository and runtime boundaries

```text
src/app/                 serializable stores, routing/query synchronization
src/components/          accessible DOM shell, HUD, loading and errors
src/experience/          Canvas plus reusable engine systems
  camera/                authored rigs, transitions, bounded controls
  controls/              normalized pointer/touch/keyboard intents
  environment/           sky, fog, ground, shared particles
  lighting/              shared light rigs
  post/                  quality-aware effects
src/worlds/
  manifest.ts            ordered metadata; no component imports
  registry.ts            lazy chapter loaders keyed by stable id
  shared/                chapter types, palette and interaction contracts
  chapters/<id>/
    config.ts            metadata, camera bounds, palette, quality budgets
    scene/               chapter-owned R3F components
    prompts/brief.md     intent, composition, interaction and exclusions
tests/
scripts/                 validate, capture and publish helpers
public/assets/            optimized, licensed runtime assets only
```

`ExperienceCanvas` owns renderer configuration, Suspense/error boundaries, shared environment, camera director and post FX. A chapter owns only its landmark geometry, local ambience and handlers. `manifest.ts` stays data-only so metadata is available before loading scene code; `registry.ts` uses dynamic imports so each chapter is a separate chunk. Chapter modules implement one stable contract: metadata/config, lazy scene component, focus target, camera presets/bounds, quality budget, and named interaction handlers.

State is divided deliberately:

- UI store: entered/help/fullscreen/quality/reduced-motion/mute-ready state.
- World store: active and pending chapter, transition phase, focused landmark, last interaction.
- Frame-local animation: refs, shader uniforms and `useFrame`; never global state at frame rate.

Transitions use an explicit state machine (`idle -> exiting -> loading -> entering -> idle`) so double navigation, failed imports and focus restoration have deterministic behavior. A failed chapter returns to the prior chapter with an accessible error notice.

## Scene and art-direction rules

Each chapter has one dominant silhouette and three depth bands: foreground occluders/particles, a crisp midground landmark, and a low-contrast far environment. The brightest area occupies less than roughly one quarter of the frame. Cyan, amethyst, lavender, teal and gold are accents against graphite/indigo, not full-screen washes. Camera framing is off-axis where possible; bloom supports emissive forms but does not erase edges. Motion is slow, asynchronous and bounded.

Launch chapters:

- **Lotus Gate:** mirror-dark ground/lake, moonlit petals and a ceremonial portal; pulse opens emissive seams and releases a brief petal wake.
- **Wormhole Spire:** torn obsidian/auric rings, diagonal inflow particles and a compact event throat; pulse increases ring phase and bends the inflow lane before settling.

Shared systems may provide fog, stars, particles, palette tokens and interaction intents, but shared code must not flatten chapter identity. A third chapter should be addable by creating one directory, registering its lazy loader, adding metadata, and passing validation—without editing engine internals.

## Responsive and accessibility behavior

Use CSS `100dvh` with safe-area insets and a single canvas sized by its container. The camera director selects authored wide, standard and portrait presets and interpolates only inside their safe bounds. Portrait moves the subject vertically and shortens dolly range rather than cropping a desktop framing. HUD condenses below 720px; chapter controls remain thumb reachable. Resize/orientation changes debounce layout work but update renderer dimensions immediately through R3F.

Honor `prefers-reduced-motion`: disable idle drift and camera fly-throughs, reduce particles, remove chromatic aberration, and use short opacity transitions. Ensure DOM contrast and focus order, announce chapter changes and failures, provide text for every icon, never require hover, and keep a useful non-WebGL hero/fallback with chapter descriptions.

## Performance budgets and degradation

Target 60 fps on current desktop integrated graphics and 30 fps on representative mid-range mobile hardware at 1080p-equivalent load. Initial compressed transfer should stay below 1.5 MB excluding an optional chapter asset chunk; each later chapter below 2 MB compressed. Target fewer than 120 draw calls and 250k visible triangles on high quality, fewer than 70 draw calls and 120k triangles on mobile, and no sustained main-thread tasks over 50 ms during interaction.

Renderer rules: cap DPR at 2 high / 1.5 balanced / 1 low; use instancing for repeated forms, shared geometries/materials, compressed textures, mipmaps, lazy chapter imports, object pooling, frustum culling, and disposal on chapter exit. Avoid per-frame allocation and React setState. Post FX is quality-gated: subtle bloom and vignette first; depth of field/chromatic effects are optional and off on mobile/reduced-motion.

Start at a capability-derived tier, then monitor a rolling frame-time window. After sustained misses, degrade in this order: DPR, particle count, shadows, optional post FX, geometric detail. Do not oscillate upward during a session; a manual quality choice overrides automatic selection. Pause animation on hidden tabs.

## Asset strategy

Prefer procedural geometry, instanced particles, generated gradients/noise and small authored shaders for the first release. This keeps the world independent from HermesVJ and cheap to ship. When external assets add clear value:

- use glTF/GLB with Draco or Meshopt geometry and KTX2/Basis textures;
- keep texture dimensions to the minimum useful size (normally <= 2048px), pack maps, and avoid uncompressed video backgrounds;
- store source attribution, license, origin and modification notes in `docs/assets.md`;
- keep editable source files outside the runtime bundle or in release artifacts; commit only optimized runtime assets;
- preload only the active chapter's critical assets, lazy-load adjacent chapters, and provide procedural/low-detail fallbacks.

No asset may be copied from HermesVJ merely because it is visually similar. Recreate motifs from the documented palette/composition rules or use explicitly licensed sources.

## Implementation sequence and acceptance gates

1. **Foundation:** Vite/R3F shell, DOM fallback, stores, typed manifest/registry, query routing, Pages workflow. Gate: tests, validation and production build pass at `/hermesvj2/`.
2. **Engine slice:** renderer tiers, camera director, normalized controls, transition state machine, loading/error boundaries, reduced-motion behavior. Gate: keyboard/touch flows work and chapter failure recovers.
3. **Vertical chapter:** finish Lotus Gate with responsive presets and pulse interaction. Gate: desktop/mobile captures satisfy composition and budgets.
4. **Independence proof:** add Wormhole Spire using only the chapter contract; no engine special cases. Gate: lazy chunk, transition, disposal and URL deep link pass.
5. **Hardening:** automated accessibility/smoke checks, bundle report, frame-time measurements, asset ledger, social preview and deployment verification.

A chapter is publishable only when its brief/config/scene exist, IDs are unique, referenced assets and licenses resolve, camera presets cover portrait and landscape, reduced-motion has been reviewed, tests and `npm run validate` pass, and a production build is captured at phone and desktop sizes.

## Architectural decisions that should not be reopened during MVP

HermesVJ2 is an independent repository; React + TypeScript + Vite + R3F is the application stack; chapters are trusted typed modules and lazy chunks, not iframe sketches; GitHub Pages is the deployment target; the experience is exploratory but bounded; Zustand owns serializable state while frame state stays local; assets are procedural-first and licensed/optimized when external; responsive behavior uses authored camera presets; accessibility and reduced motion are first-class; adaptive quality degrades predictably against explicit budgets. A backend, multiplayer, user accounts, arbitrary remote scenes, WebXR, physics/gameplay systems, and live audio analysis are outside the MVP.