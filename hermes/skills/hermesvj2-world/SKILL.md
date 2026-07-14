---
name: hermesvj2-world
description: Extend HermesVJ2 through disciplined, verified 3D worldbuilding.
version: 0.2.0
platforms: [linux, macos]
---

# HermesVJ2 world evolution skill

Use this skill for chapters, camera behavior, atmosphere, interaction, rendering architecture, optimization, or related documentation.

Required: load at least one available coding skill before editing (`test-driven-development`, `systematic-debugging`, `codex`, `simplify-code`, or `requesting-code-review`).

## Workflow

1. Fetch `origin/main`, work on a feature branch, and read `AGENTS.md`, `README.md`, the architecture, art-direction, performance, reuse, and relevant chapter documents.
2. Identify the owner: engine behavior in `src/experience`, chapter art in `src/worlds`, interface/accessibility in `src/components` or `src/app`, and pure runtime policy in `src/lib`.
3. Write a failing test first for behavior or contract changes. Keep one dominant subject and preserve authored negative space.
4. Preserve one Canvas and one R3F render loop. Dispose manually owned Three.js resources, memoize generated data, and allocate nothing inside `useFrame`.
5. Gate continuous motion, particles, geometry, shadows, reflectors, and post FX by reduced-motion and quality policy. Retain keyboard, touch, readable content, and non-WebGL fallbacks.
6. Prefer procedural/local assets. Record source, creator, license, and modifications for every new asset; reject unclear or remote unversioned assets.
7. Run `npm test`, `npm run lint`, `npm run validate`, and `npm run build`.
8. Run the production preview for visual/runtime changes. Check every chapter at narrow and wide viewports, reduced motion, forced WebGL failure/context loss, keyboard/touch controls, direct URLs, console errors, and resource cleanup.
9. Capture inspectable evidence: before/after screenshots or recording, command output, bundle output, and performance trace when GPU cost changes. Do not claim checks that were not run.
10. Rebase on current `origin/main`, push the branch, open a PR, and document architecture, tests, performance, licensing, deployment, limitations, and rollback.

## New scene/effect checklist

- Typed config and lazy registry entry.
- Original/local licensed assets only.
- Low/medium/high budgets and reduced-motion behavior.
- Responsive camera framing and pointer/touch/keyboard parity.
- Suspense loading plus meaningful failure behavior.
- No duplicate loop, per-frame allocations, or undisposed manual resources.
- Tests, validation, build, browser evidence, and updated docs.
