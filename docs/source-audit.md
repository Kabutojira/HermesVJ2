# Source audit: HermesVJ

Audited source: https://github.com/Kabutojira/HermesVJ (default branch `main`)

## Architecture and purpose

HermesVJ is a Vite/React/TypeScript gallery that discovers manifest entries and hosts p5.js and Hydra sketches in isolated iframe runtimes. Its defining qualities are an experimental audiovisual-gallery purpose, dark luminous presentation, generative motion, viewport-aware rendering, and a repository-driven publish workflow.

Evidence paths in the source repository:

- `app/package.json`: Vite/React toolchain and commands.
- `app/src/App.tsx`: gallery shell.
- `app/src/lib/manifest.ts` and `manifest.json`: sketch discovery/content model.
- `app/src/runtime/p5-runtime.html` and `app/src/runtime/hydra-runtime.html`: iframe sketch runtimes.
- `scripts/publish_visual.py`: publishing workflow.
- `.github/workflows/pages.yml`: static GitHub Pages deployment.
- `AGENTS.md`: source-project agent workflow.

## Deployment and services

The inspectable deployment pattern is GitHub Actions to GitHub Pages. No required paid service, production secret, analytics integration, custom domain, or private runtime API was identified in the audited files. Repository settings outside the public repository are not asserted here.

## HermesVJ2 boundary

HermesVJ2 retains the gallery's contemplative generative-art purpose, dark luminous mood, iterative chapter model, static deployment, and repository-as-source-of-truth workflow. It replaces the sketch manifest, p5/Hydra runtimes, iframe isolation, layout, content, visual geometry, and interaction model with an independently initialized React Three Fiber/Three.js application and original procedural scenes.

A file-hash and similarity review recorded in `RELEASE_READINESS_REVIEW.md` found no substantive copied source code or artwork. The only exact common source files were generic Vite bootstrap material (`src/main.tsx`, `src/vite-env.d.ts`). HermesVJ2 has an independent root commit and GitHub reports it is not a fork.

## Known boundary

GitHub reports no detected license for HermesVJ. Public availability alone does not grant third parties reuse rights. This project was created under the same Kabutojira account at the owner's direction, but external contributors must not copy HermesVJ code or assets without separate written authorization. Prefer clean-room reimplementation of ideas and original procedural assets.
