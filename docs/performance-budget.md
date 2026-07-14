# Performance budget and quality policy

## Targets

- Desktop: 60 fps target, 30 fps minimum during normal navigation.
- Representative mobile/low-power profile: 30 fps target with no sustained frame above 50 ms.
- Initial application shell and Three.js engine (excluding optional post-processing): under 325 kB gzip.
- No unbounded per-frame allocations or duplicate animation loops.

## Runtime tiers

The tier updates on resize and orientation change and considers viewport width, device pixel ratio, and logical CPU count.

| Tier | Selection | DPR | Shadows | Reflector | Scene density | Post FX |
| --- | --- | --- | --- | --- | --- | --- |
| low | width <640px or <=4 logical CPUs | 1 | off | replaced by standard material | 25–50% particles/segments | not downloaded |
| medium | width <1200px or DPR >2 | <=1.5 | on | 512 px | 60–75% | not downloaded |
| high | capable wide display | <=2 | on | 1024 px | full | lazy-loaded |

`prefers-reduced-motion` changes the canvas to demand rendering, disables camera drift and guided autorotation, freezes nonessential scene and particle animation, and disables post-processing. Pointer and keyboard navigation remain available.

## Evidence procedure

For release validation, record Chrome DevTools Performance traces for 30 seconds after entering both chapters at:

1. Desktop 1440×900, normal motion, high tier.
2. Mobile emulation 390×844 with 4× CPU throttling, low tier.
3. Desktop with reduced motion enabled.

Record average FPS/frame duration, long tasks, renderer draw calls/triangles, JS heap before/after chapter switching, and screenshots. Deterministic browser checks may append `?motion=reduce` to force reduced-motion policy and `?webgl=off` to force the readable fallback; these switches do not override a user's stronger accessibility preference. This repository does not claim measured device FPS until those traces are attached to a reviewed release. The automated suite instead validates deterministic tier and WebGL-capability policy; browser smoke validates actual rendering.

## Current bundle evidence

The production build's initial application/Three.js bundle is approximately 311 kB gzip. Chapter modules range from roughly 2–7 kB gzip. The optional post-processing module is approximately 18 kB gzip and is dynamically imported only when a high-tier, normal-motion chapter enables it. Vite still warns because the shared Three.js application chunk exceeds 500 kB minified; this is a known framework cost and remains within the documented gzip transfer budget.
