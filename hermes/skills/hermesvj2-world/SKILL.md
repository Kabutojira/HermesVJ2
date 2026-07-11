---
name: hermesvj2-world
description: Extend HermesVJ2 through disciplined 3D worldbuilding and code changes.
version: 0.1.0
platforms: [linux, macos]
---

# HermesVJ2 world evolution skill

Use this skill whenever you add or refine chapters, camera behavior, atmosphere, interaction, or documentation in HermesVJ2.

Required: load at least one available coding skill before editing (`codex`, `test-driven-development`, `systematic-debugging`, `simplify-code`, or `requesting-code-review`).

Workflow:
1. Read `AGENTS.md`, `README.md`, and the relevant chapter brief.
2. Decide whether the change belongs in `src/experience/`, `src/worlds/`, or `src/components/`.
3. Keep one dominant subject per chapter and preserve negative space.
4. Add or update tests when changing manifest, camera presets, movement modes, or shared contracts.
5. Run `npm test`, `npm run build`, and `npm run validate`.
6. Smoke-check the world in a browser preview when visuals materially change.
