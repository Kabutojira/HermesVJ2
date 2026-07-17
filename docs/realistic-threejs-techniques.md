# Realistic Three.js techniques and five-scene blueprint

This is an implementation guide for HermesVJ2, not a mandate to make every chapter photorealistic. Preserve the repository's dream-ritual language, one dominant subject, negative space, slow motion, accessibility, and procedural-first asset policy.

Research checked 2026-07-16 against the official Three.js documentation and examples. The lockfile resolves `three@0.185.1`; the guidance below targets that exact release. The official live documentation follows current `main` and can drift, so confirm behavior against the installed release during implementation.

## Repository fit

- Stack: React 19, TypeScript 6, Vite 8, React Three Fiber (R3F) 9, and one shared `<Canvas>` in `src/experience/ExperienceCanvas.tsx`.
- Existing scene contract: lazy chapter components receive `{ pulse, qualityTier, reducedMotion, capabilities }` through `WorldSceneProps` in `src/worlds/registry.ts`. Camera metadata is `{ position, target, fov }`; movement is `orbit`, `guided`, or `free-fly`.
- Existing quality policy: low DPR 1/no shadows/no post; medium DPR <=1.5/shadows/no post; high DPR <=2/shadows/lazy post. Reduced motion uses demand rendering and disables post-processing.
- Existing post stack: `src/experience/post/WorldPostFX.tsx` now owns official `three/addons` passes (render, optional bloom/DOF, final output) after the shared-foundation implementation. Do not add a second composer or render loop inside a chapter.
- Assets are effectively procedural: `public/` has interface/social SVGs, while chapter scenes generate their geometry and textures. There is no local HDR environment, PBR texture set, or glTF model to reuse. A new HDRI, normal map, or model must be local, optimized, licensed, and recorded in `docs/assets.md` as required by `AGENTS.md`.
- Shared stars, sky, fog, ground, and lighting are now declarative per-chapter requests with conservative defaults; scenes should disable or tune them instead of stacking contradictory chapter-local systems.

## Version and import compatibility

The published `three-0.185.1.tgz` was inspected: every addon named below is present, and its package exports map `three/addons/*` to `examples/jsm/*`. Prefer these public imports rather than `three/examples/jsm/*`:

```ts
import { CubeCamera, MeshPhysicalMaterial, MeshStandardMaterial,
  PMREMGenerator, SRGBColorSpace, ACESFilmicToneMapping } from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { Water } from 'three/addons/objects/Water.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
```

No new rendering engine or effects library is needed. `Water`, `Reflector`, and the passes are addons shipped by the same installed `three` package, but they are not core APIs; pinning `three@0.185.1` during implementation avoids accidental addon drift.

## Baseline for believable rendering

### PBR, environment, tone, and color

1. Use `MeshStandardMaterial` for most opaque surfaces. It is a metallic-roughness PBR material and looks most credible with an environment map. Use `MeshPhysicalMaterial` only when clearcoat, transmission, thickness/attenuation, sheen, or iridescence visibly matters; it has a higher shader cost.
2. Generate or load one scene environment, prefilter it with `PMREMGenerator`, assign it to `scene.environment`, and dispose temporary source textures/render targets. A blurred procedural `RoomEnvironment`-style rig is preferable to an unlicensed remote HDRI.
3. Configure output explicitly in the shared renderer: `SRGBColorSpace`, `ACESFilmicToneMapping`, and a measured exposure near 1 as a starting point. Do not compensate for bad color configuration by increasing light intensity.
4. Treat CSS/hex colors and color textures as sRGB. Mark color/albedo/emissive textures `SRGBColorSpace`; leave roughness, metalness, normal, AO, and depth textures at `NoColorSpace`. Three.js performs lighting in Linear-sRGB.
5. If official `EffectComposer` is adopted, end the chain with `OutputPass`; it performs tone mapping and color-space conversion. Do not also convert output earlier or colors will be double-encoded.

Official sources: [MeshStandardMaterial](https://threejs.org/docs/pages/MeshStandardMaterial.html), [MeshPhysicalMaterial](https://threejs.org/docs/pages/MeshPhysicalMaterial.html), [PMREMGenerator](https://threejs.org/docs/pages/PMREMGenerator.html), [color management](https://threejs.org/manual/en/color-management.html), [WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html), and the [environment-map example](https://threejs.org/examples/webgl_materials_envmaps.html).

### Shadows

Shadow maps redraw shadow-casting geometry from each shadow-casting light. A point-light shadow renders six directions, so it is inappropriate for these broad scenes. Use at most one shadowed directional or spot light, tightly fit its shadow camera, limit casters, and freeze `shadowMap.autoUpdate` after static geometry settles. Prefer contact-shadow decals, baked AO/light maps, vertex color darkening, or unshadowed fill lights on lower tiers.

Official source: [Three.js shadows manual](https://threejs.org/manual/en/shadows.html).

### Reflections and water: a physical justification gate

Use a reflection only when all four answers are yes:

1. Is there a real smooth interface (calm water, polished floor, wet puddle, coated product) in the composition?
2. Does the camera see that interface at a grazing/readable angle?
3. Is a recognizable nearby object or bright source available to reflect?
4. Does the reflection improve material recognition or composition enough to justify another render or capture?

Choose the cheapest correct technique:

- Static environment/PMREM: cheapest useful specular context; default for metal, glass, polished stone, and products.
- Roughness/normal variation plus emissive streak geometry: cheap wet-surface suggestion when a literal reflected image is not required.
- `Reflector`: one planar mirror view rendered to a target. Use only for one visible plane, lower its target to 512 medium/1024 high, set MSAA conservatively, skip low, and call `dispose()` on exit.
- `Water`: a planar reflection/refraction-style water shader with a required local normal texture and animated `time`. Use only for an actual water body. Its target resolution has the same cost concern as `Reflector`.
- `CubeCamera`: six scene renders per update into a cube target. Use a 128–256 target, hide the reflective subject while capturing, update once after load or only after meaningful scene changes, and never update every frame on mobile.

Official sources: [Reflector](https://threejs.org/docs/pages/Reflector.html), [mirror example](https://threejs.org/examples/webgl_mirror.html), [Water](https://threejs.org/docs/pages/Water.html), [water example](https://threejs.org/examples/#webgl_water), and [CubeCamera](https://threejs.org/docs/pages/CubeCamera.html).

### Post-processing cost ladder

All post passes allocate full- or partial-screen render targets and add fill-rate cost. Keep one centralized pipeline and configure it per chapter.

| Technique | Value | Relative cost | HermesVJ2 rule |
| --- | --- | --- | --- |
| Tone mapping/output conversion | Required display transform | Low | Shared renderer or final `OutputPass`, all tiers. |
| Thresholded bloom | Readable glow from genuinely bright emissive sources | Medium, multi-resolution blur | High only; start threshold >=1, modest strength/radius. Cheap fallback is emissive material with no bloom. |
| SSAO | Contact/depth grounding | High; depth/normal work plus sampling | High-only fallback when GTAO is unsuitable; use small radius and half resolution if integrated. Prefer a contact decal or AO map first. |
| GTAO | Higher-quality screen-space grounding with denoise controls | High to very high | High-only for the gallery/product scene after profiling; provide a scene clip box and reuse depth/normal buffers where architecture allows. |
| Bokeh depth of field | Cinematic depth separation | High; depth plus blur, with edge/transparent artifacts | Product studio only, high tier, fixed focus target; disable during navigation and reduced motion. Cheap fallback is composition, fog, or pre-blurred background geometry. |
| Planar reflection/water | Material-defining reflection | High; extra scene render | One justified surface only, medium/high with tiered target. |
| Dynamic cube capture | Local reflections | Very high; six renders per update | High only and event-driven/static. |

`EffectComposer` executes enabled passes in order and owns read/write buffers; resize it with renderer size/pixel ratio and dispose its passes. `UnrealBloomPass` exposes threshold, strength, radius, and resolution. `GTAOPass` can create or accept a depth/normal G-buffer. `BokehPass` exposes focus, aperture, and max blur.

Official sources: [post-processing manual](https://threejs.org/manual/en/post-processing.html), [EffectComposer](https://threejs.org/docs/pages/EffectComposer.html), [UnrealBloomPass](https://threejs.org/docs/pages/UnrealBloomPass.html), [SSAOPass](https://threejs.org/docs/pages/SSAOPass.html), [SSAO example](https://threejs.org/examples/webgl_postprocessing_ssao.html), [GTAOPass](https://threejs.org/docs/pages/GTAOPass.html), and [BokehPass](https://threejs.org/docs/pages/BokehPass.html).

## Standard scene-module blueprint

Keep the runtime contract already used by every chapter. A later worker should create `config.ts`, `scene/<Name>World.tsx`, and `prompts/brief.md`, then register one typed lazy import. No chapter may construct a renderer, composer, animation loop, global controls, or remote asset fetch.

```ts
// config.ts — data is inspectable without mounting WebGL.
import type { WorldChapter } from '../../registry';

export const config = {
  id: 'chapter-NNN-stable-slug',
  title: 'Human title',
  description: 'Useful non-WebGL fallback copy.',
  palette: ['#background', '#key', '#ground', '#accent'],
  movementMode: 'orbit',
  qualityHint: 'high',
  cameraPreset: { position: [x, y, z], target: [x, y, z], fov: 45 },
  createdAt: 'ISO-8601',
  moodPrompt: 'concise authored intent',
  previewImage: '/social-preview.svg',
} satisfies Omit<WorldChapter, 'component' | 'interactionModel'>;

// scene/<Name>World.tsx
import type { WorldSceneProps } from '../../../registry';

export function NameWorld({ pulse, qualityTier, reducedMotion }: WorldSceneProps) {
  // useMemo for generated arrays/geometries; useFrame mutates refs/uniforms only.
  // capabilities carries hard renderer/shadow/reflection/water/post budgets.
  // qualityTier selects fixed density budgets; reducedMotion freezes nonessential motion.
  // effects remain requests/config at the shared ExperienceCanvas owner.
  return <group>{/* one dominant subject and three depth bands */}</group>;
}
```

For headless implementation and review:

- Export pure generation helpers (seed in, typed arrays/transforms out) separately from JSX so Vitest can validate counts, bounds, determinism, and tier budgets without WebGL.
- Keep fixed tier constants next to the scene (`low`, `medium`, `high`) and assert monotonic budgets in tests.
- Memoize generated data and shared materials; allocate no vectors/arrays in `useFrame`; dispose manually created textures, render targets, cube captures, reflectors, and water resources on unmount.
- Make `pulse` a bounded atmospheric cue. Reduced motion must render a stable, complete composition without waiting for animation.
- Camera framing remains in config and is applied by `CameraDirector`; use `orbit` for these five scenes unless a reviewed requirement justifies another mode. Test portrait framing through the existing responsive-FOV contract.
- A future shared-renderer change should add typed, declarative environment/lighting/post requests to chapter config rather than importing chapter IDs in `ExperienceCanvas`. Until that contract exists, scene workers must not add local composers.
- Required verification: focused pure tests, `npm test`, `npm run lint`, `npm run validate`, `npm run build`, then real-browser wide/portrait, low/high, reduced-motion, direct URL, and console checks.

## Five concrete scene blueprints

### 1. Rain-slick neon city

- Dominant subject/composition: one ceremonial transit tower at a street intersection; dark facades form three depth bands and negative space. Use instanced boxes and emissive window strips, not a dense open-world city.
- Materials/environment: rough concrete/metal with sparse emissive signage. Wetness is a thin-film look: lower roughness only in irregular procedural puddle masks and perturb normals. Do not make the entire street a perfect mirror.
- Reflection justification: recognizable cyan/magenta tower light reflecting in visible puddles is physically and compositionally justified. High: one 512–1024 planar `Reflector` clipped to the road or a single puddle plane. Medium/low: dark rough PBR road plus stretched, dim emissive streak meshes; no reflection render.
- Lighting/post: one unshadowed cool hemisphere/ambient contribution, one shadowed spot or directional key tightly covering the intersection, unshadowed colored practical lights. High-only thresholded bloom; no AO unless profiling leaves budget. Rain streaks should not bloom uniformly.
- Camera/motion: low 35–45 mm-equivalent orbit, slow lateral idle drift, tower held off-axis; prevent orbit from revealing the finite city set. Pulse briefly intensifies signs and sends one puddle ripple. Reduced motion freezes rain and ripple while retaining wet highlights.
- Safeguards: instancing, 25/60/100% building/window/rain counts, one shadow caster light, rain as batched points/lines, no per-drop mesh, reflection update only on camera/render need, no CubeCamera, no DOF.

### 2. Mountain lake

- Dominant subject/composition: a calm alpine lake leading to one split mountain peak; shoreline occluders foreground, reflected peak midground, atmospheric ridges far.
- Materials/environment: procedural low-poly terrain with vertex colors/normal variation; sky-to-horizon gradient or licensed local HDRI prefiltered once. Snow/rock use `MeshStandardMaterial` with controlled roughness.
- Water justification: the lake is the subject and reflects the mountain/sky at a grazing angle, so official `Water` is justified on high and medium. Use a local licensed/generated tileable normal texture, low distortion, slow time, and a target of 1024 high/512 medium. Low uses a standard rough blue-green plane with a blurred upside-down silhouette or environment reflection only.
- Lighting/post: one warm directional sun casts tightly bounded terrain shadows; cool sky fill remains unshadowed. Atmospheric fog supplies distance. Bloom only if the sun itself is visible and thresholded; no SSAO/GTAO or DOF because haze and terrain shading already express depth.
- Camera/motion: eye level near shore, restrained orbit/dolly that cannot cross below water or behind the set. Water normals move slowly; pulse emits a single widening surface ring. Reduced motion freezes normal scrolling and uses a static ring/value shift.
- Safeguards: one water surface, no CubeCamera/second reflector, simplified terrain segments by tier, shadow casters limited to hero ridge/shore, freeze static shadow maps, keep transparent layers minimal.

### 3. Luxury glass gallery

- Dominant subject/composition: one sculptural glass pavilion/object in a restrained stone hall; columns frame it without becoming a repeated-object showcase.
- Materials/environment: `MeshPhysicalMaterial` only for hero glazing (`transmission > 0`, `opacity = 1`, plausible IOR near 1.5, modest thickness/attenuation, low but nonzero roughness). Stone/metal remain standard PBR. Use a procedural studio/room environment prefiltered with PMREM so glass and metal have something credible to reflect.
- Reflection justification: glass reflections/refraction are physically essential, but a planar mirror is not automatically justified. Use environment reflection for glazing. Add a `Reflector` only if the authored floor is explicitly polished stone and its reflected hero is visible; otherwise rough stone receives shadows. No water.
- Lighting/post: broad area-like rectangular practicals (or emissive panels plus unshadowed fills), one shadowed directional/spot key. High may use subtle GTAO to ground column/stone junctions after profiling; medium/low use contact decals or vertex/AO darkening. Minimal bloom on luminaires only.
- Camera/motion: eye-height architectural orbit with narrow azimuth/polar limits and slow parallax; avoid moving through transmissive panes. Pulse travels as a restrained light sweep across the pavilion. Reduced motion uses a static emissive seam.
- Safeguards: glass hero only (avoid many overlapping transmissive layers), single-sided geometry where physically correct, cap transmission resolution through the existing renderer strategy, one optional floor reflector, no dynamic CubeCamera, AO high-only and half-resolution, inspect transparency sorting.

### 4. Sunlit desert canyon

- Dominant subject/composition: one monumental eroded arch between canyon walls; foreground rocks, crisp arch, hazy mesas. Warm color remains an accent against deep shadow rather than a full orange wash.
- Materials/environment: rough rock `MeshStandardMaterial` with procedural vertex color/normal variation. Strong directional sun and cool sky fill create form; aerial perspective handles distance.
- Reflection/water decision: none. Dry sandstone is rough, there is no water body, and mirror-like canyon reflections would be physically implausible. Spend the budget on silhouette, shadow, and haze. A subtle screen-space/mesh heat shimmer near the ground may be authored as a local shader only if it does not require another effects library.
- Lighting/post: one tightly fitted shadowed directional sun; fake/contact shadows for small rocks; no bloom except an extremely restrained visible-sun response, no SSAO/GTAO, no DOF. ACES tone mapping should retain highlight rolloff without crushing shaded rock.
- Camera/motion: slow dolly/orbit at human scale aimed through the arch, bounded so set edges stay hidden. Pulse lifts a small dust veil and light caustic-like band only as stylization—not water caustics. Reduced motion shows a static dust layer.
- Safeguards: instanced rocks, tiered terrain subdivisions/dust counts, one shadow light, static shadow map, fog instead of far geometry, no Reflector/Water/CubeCamera, no full-screen blur.

### 5. Cinematic product studio

- Dominant subject/composition: one unbranded sculptural product on a cyclorama/plinth with large softbox cards; no trademarked model or decorative clutter.
- Materials/environment: product uses standard PBR, with physical clearcoat only where a coated surface requires it. Build a small procedural studio environment (bright rectangular cards in a capture scene), prefilter with PMREM, and reuse it. This makes metal/coating readable without a downloaded HDRI.
- Reflection justification: controlled reflections are essential product-lighting information. Prefer the static PMREM studio. If the hero must reflect a moving light card, high tier may use a 128–256 `CubeCamera` updated after pulse/light changes, never every frame. A planar reflection is allowed only for an explicitly glossy tabletop/plinth; otherwise use rough shadow-catching ground. No water.
- Lighting/post: large soft key/rim/fill cards, one tightly controlled shadow-casting spot/directional light, contact decal or high-only GTAO for grounding. High-only Bokeh DOF may separate the product from the cyclorama, with focus fixed to the hero and conservative aperture/max blur; disable while users orbit. Very restrained bloom only on genuine emissive product details.
- Camera/motion: 50–85 mm-equivalent close framing, slow turntable or bounded orbit—not both at full speed. Pulse shifts rim light and rotates the product a few degrees. Reduced motion freezes the turntable and preserves the hero angle/focus.
- Safeguards: one hero, event-driven cube capture with hero hidden during capture, high-only DOF/AO and never both until GPU profiling proves budget, medium/low use sharp focus plus contact decal, tiered geometry, dispose cube/composer targets, verify product remains readable without post.

## Implementation order

1. Make shared renderer color/tone behavior explicit and visually regression-check every existing chapter.
2. Add a typed declarative scene-rendering request contract for environment, lighting, reflection, and post; keep the one Canvas/composer owner.
3. Build procedural environment-lighting helpers and cheap fallbacks before adding costly passes.
4. Implement one scene at a time with pure tier-budget tests and browser evidence. Start with the desert canyon (no reflection/post dependency), then city/lake, gallery, and product studio.
5. Profile before enabling any high-only combination. Degrade in repository order: DPR, particles/density, shadows, optional post, geometry detail.

The five scenes deliberately use water once (the lake), planar wet reflection only where puddles can reflect visible neon, environment reflection for glass/product materials, and no decorative reflection or water in the dry canyon.