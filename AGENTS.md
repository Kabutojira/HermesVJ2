# HermesVJ2

HermesVJ2 is an independent Three.js-based 3D web experience designed for continuous evolution through code changes.

## Non-negotiable workflow

Before changing code in this repository, Hermes agents must:
1. Load the repo-local `hermesvj2-world` skill.
2. Load at least one relevant coding skill (`ponytail`, `test-driven-development`, `systematic-debugging`, or `requesting-code-review`).
3. Read `README.md` plus the chapter brief for any world they plan to edit.
4. Run `npm test`, `npm run build`, and `npm run validate` before handoff.

## Architecture rules

- Keep `src/experience` for engine systems, `src/worlds` for content, and `src/components`/`src/app` for UI.
- Preserve one dominant subject per chapter.
- Favor dark palettes, disciplined accents, and negative space.
- Interactions should amplify atmosphere, not turn the project into a conventional game.
- Static hosting remains the baseline; do not add a backend unless explicitly requested.
