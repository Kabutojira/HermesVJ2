# HermesVJ2

HermesVJ2 is a static-deployable React + Three.js dreamworld built for browser-based exploration and agent-driven iteration.

## What ships in this MVP
- A Vite + React + TypeScript application at the repository root
- A React Three Fiber experience canvas with lights, fog, stars, post-processing, and responsive layout
- Two launch chapters: `Lotus Gate` and `Wormhole Spire`
- Zustand stores for UI and world state
- Repo-local agent guidance and templates for extending the world coherently
- Unit tests plus build validation for the chapter manifest and camera contracts

## Quick start
```bash
npm install
npm test
npm run build
npm run preview
```

Open `http://127.0.0.1:4173/hermesvj2/` for preview with the default Pages base path.
For local root-path development use `HERMESVJ2_BASE=/ npm run dev`.

## Project structure
```text
src/app             UI and world stores
src/components      HUD, chapter rail, overlay, shell
src/experience      camera, controls, environment, lighting, post FX
src/worlds          chapter registry, manifest, scene modules, prompts
tests               manifest + camera + interaction tests
scripts             validation, capture, publish helpers
hermes/skills       repo-local worldbuilding skill and templates
docs                MVP plan, visual language, runtime architecture
```

## Deployment model
The Vite base path defaults to `/hermesvj2/`, so GitHub Pages deployment for a repo named `hermesvj2` works cleanly.
Suggested bootstrap:
```bash
git init
git add .
git commit -m "feat: initialize hermesvj2 dreamworld"
gh repo create kabutojira/hermesvj2 --public --source=. --remote=origin --push
```
