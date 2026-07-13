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

Open `http://127.0.0.1:4173/HermesVJ2/` for preview with the default Pages base path.
For local root-path development use `HERMESVJ2_BASE=/ npm run dev`.

## Controls

- Drag with a pointer or one finger to orbit inside the authored camera envelope.
- Scroll or pinch to move closer and farther away.
- Double-click/double-tap the world, press `Space`, or use the Pulse button to resonate the landmark.
- Press `A`/`←` and `D`/`→`, or use the HUD controls, to move between chapters.
- Chapter URLs are shareable through the `?chapter=...` query parameter.

The interface uses touch-friendly controls, visible keyboard focus, safe-area insets, and honors `prefers-reduced-motion`. If WebGL initialization fails, the error boundary leaves a readable recovery screen instead of a blank page.

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

## Production deployment

The production experience is available over HTTPS at:

**https://kabutojira.github.io/HermesVJ2/**

GitHub Pages is configured with **GitHub Actions** as its source. The single deployment workflow, `.github/workflows/pages.yml`, runs on every push to `main` and can also be started manually from the Actions tab. It installs the locked dependencies with `npm ci`, then runs tests, world validation, linting, and the production build before uploading `dist/` and deploying it to the `github-pages` environment. No deployment secrets are required.

The production Vite base path defaults to the case-sensitive `/HermesVJ2/`, matching the repository name. To reproduce the Pages build locally from a clean checkout:

```bash
npm ci
npm test
npm run validate
npm run lint
npm run build
npm run preview
```

Open `http://127.0.0.1:4173/HermesVJ2/` and verify both chapters, their direct `?chapter=...` URLs, and the browser console before publishing.

### Deploy

1. Merge the release commit into `main`, or select **Actions → deploy-pages → Run workflow** to redeploy the current `main` commit.
2. Wait for both the `build` and `deploy` jobs to pass.
3. Open the production URL above and verify that the HTML, JavaScript, CSS, icons, and chapter modules load without 404 or console-blocking errors.

The repository setting **Settings → Pages → Build and deployment → Source** must remain set to **GitHub Actions**. The workflow uses only the scoped `pages: write` and `id-token: write` permissions; do not add credentials to the repository.

### Roll back

1. In GitHub, identify the last known-good commit on `main`.
2. Revert the faulty commit with a new commit (do not rewrite shared history):

   ```bash
   git checkout main
   git pull --ff-only origin main
   git revert <faulty-commit-sha>
   git push origin main
   ```

3. The push automatically deploys the reverted state. Monitor the `deploy-pages` run, then repeat the production smoke check.
4. If the application must be restored before a revert is ready, open the last successful `deploy-pages` run for the known-good commit and use **Re-run all jobs**. Follow with a revert so the next `main` deployment cannot reintroduce the faulty version.
