import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { Vector2 } from 'three';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

import type { ScenePostRequest } from '../rendering/types';

export function WorldPostFX({ request }: { request: ScenePostRequest }) {
  const { camera, gl, scene, size } = useThree();
  const composer = useMemo(() => {
    const next = new EffectComposer(gl);
    next.addPass(new RenderPass(scene, camera));
    if (request.bloom) {
      const { threshold = 1, strength = 0.45, radius = 0.35 } = request.bloom;
      const bloom = new UnrealBloomPass(new Vector2(1, 1), strength, radius, threshold);
      next.addPass(bloom);
    }
    if (request.depthOfField) {
      const { focus = 10, aperture = 0.00012, maxBlur = 0.006 } = request.depthOfField;
      next.addPass(new BokehPass(scene, camera, { focus, aperture, maxblur: maxBlur }));
    }
    next.addPass(new OutputPass());
    return next;
  }, [camera, gl, request, scene]);

  useEffect(() => {
    composer.setPixelRatio(gl.getPixelRatio());
    composer.setSize(size.width, size.height);
  }, [composer, gl, size.height, size.width]);

  useEffect(() => () => {
    for (const pass of composer.passes) pass.dispose?.();
    composer.dispose();
  }, [composer]);

  useFrame((_, delta) => composer.render(delta), 1);
  return null;
}
