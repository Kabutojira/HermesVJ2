# Shared Three.js rendering foundation

`ExperienceCanvas` is the only renderer, resize owner, and render-loop owner. Scene code must be declarative R3F content; it must not create a `WebGLRenderer`, `EffectComposer`, `requestAnimationFrame`, global controls, or a second canvas.

## Renderer contract

The shared renderer uses `SRGBColorSpace`, `ACESFilmicToneMapping`, exposure `1`, and `PCFSoftShadowMap`. R3F updates renderer and camera dimensions when the canvas container changes. The central capability policy caps DPR at 1/1.5/2, recreates the context when antialiasing must switch, and exposes the same shadow/reflection/water/post limits to every scene.

| Tier | DPR | AA | shadows | shadow map | reflection/water target | post |
| --- | --- | --- | --- | --- | --- | --- |
| low | 1 | off | off | disabled | disabled | disabled |
| medium | 1–1.5 | on | on | 1024 | 512 | disabled |
| high | 1–2 | on | on | 2048 | 1024 | opt-in |

Reduced motion disables post-processing and continuous nonessential animation. `capabilities.reflectionSize === 0` and `capabilities.waterSize === 0` are hard “do not construct” gates. A scene may select a smaller target but never a larger one. Reflections, water, bloom, and depth of field are never global defaults.

## Exact scene module export

New chapters are discovered from `src/worlds/chapters/*/module.ts`; do not edit `src/worlds/registry.ts`. A module must export exactly one named `chapter` value satisfying `WorldChapter`. Keep the component behind `React.lazy` so eager module discovery does not pull scene geometry into the initial bundle.

```ts
// src/worlds/chapters/chapter-NNN-stable-slug/module.ts
import { lazy } from 'react';
import type { WorldChapter } from '../../registry';
import { config } from './config';

const Scene = lazy(() => import('./scene/NameWorld').then((module) => ({
  default: module.NameWorld,
})));

export const chapter = {
  ...config,
  component: Scene,
  interactionModel: {
    primaryAction: 'Pulse the subject.',
    ambientResponse: 'The scene answers without requiring interaction.',
  },
  rendering: {
    environment: {
      background: '#05070d',
      fog: { color: '#080b13', near: 12, far: 42 },
      ground: { color: '#181a20', metalness: 0.1, roughness: 0.72 },
    },
    lighting: { preset: 'natural', shadows: true },
    controls: { target: [0, 2, 0], minDistance: 6, maxDistance: 16 },
    // Optional and high-tier only. Omit `post` for direct renderer output.
    post: { bloom: { threshold: 1.1, strength: 0.35, radius: 0.25 } },
  },
} satisfies WorldChapter;
```

The scene component interface is:

```ts
export interface WorldSceneProps {
  pulse: number;
  qualityTier: 'low' | 'medium' | 'high';
  reducedMotion: boolean;
  capabilities: {
    antialias: boolean;
    dpr: number | [number, number];
    shadows: boolean;
    shadowMapSize: 0 | 1024 | 2048;
    reflectionSize: 0 | 512 | 1024;
    waterSize: 0 | 512 | 1024;
    postProcessing: boolean;
  };
}
```

Use `capabilities`, not browser sniffing, to decide whether to construct a `Reflector`, `Water`, cube target, or costly material path. The shared `rendering` request configures reusable environment, lighting, controls, and official Three.js post passes. Scene-local artistic lights and geometry remain legal when they are part of that scene rather than renderer infrastructure.

## Lifecycle and cleanup

1. Mount: build generated geometry/resources in `useMemo`; let Suspense handle lazy modules and asset loaders.
2. Frame: use R3F `useFrame`; mutate refs/uniforms only and allocate no arrays, vectors, materials, or geometry per frame. Respect `reducedMotion`.
3. Resize: do nothing scene-local. R3F resizes the renderer/camera, and the shared composer resizes its targets using the renderer's capped pixel ratio.
4. Unmount/chapter change: declarative R3F objects are disposed by R3F. Register manually created textures, render targets, reflectors, water objects, cube targets, and other disposables with `useSceneResources` from `src/experience/rendering/resources.ts`, passing a memoized resource array. Clear timers, listeners, subscriptions, and loader abort handles in the effect that created them.
5. Failure: throw loader/render errors rather than drawing a broken partial scene. The shared error boundary presents readable fallback content; changing chapters remounts the lazy scene. Suspense presents `LoadingScreen` while a scene chunk or asset is pending. WebGL context loss switches to the static chapter fallback.

The official `three/addons` composer is lazy-loaded only for an explicit `rendering.post` request. It always contains `RenderPass` and final `OutputPass`; bloom and depth of field are inserted only when requested, and all passes/targets are disposed on unmount. Do not add a chapter-local composer.

## Shared helpers

- `SceneEnvironment`: configurable background, fog, sky, stars, and a non-reflective PBR ground. Any item can be disabled per scene.
- `WorldLighting`: `dream`, `natural`, `studio`, or `none`; one capped shadow key and unshadowed fills.
- `ExplorerControls`: chapter-configurable target and distance/polar envelopes while preserving shared input and cleanup.
- `resolveRenderCapabilities`: the single quality policy for renderer and scene budgets.
- `useSceneResources`: deterministic cleanup for manually owned Three.js resources.

No helper adds a reflection, water surface, bloom, or depth of field unless the chapter explicitly asks for it and the capability gate permits it.
