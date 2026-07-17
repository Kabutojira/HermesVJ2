import type { QualityTier } from '../../lib/performance';

export interface RenderCapabilities {
  antialias: boolean;
  dpr: number | [number, number];
  shadows: boolean;
  shadowMapSize: 0 | 1024 | 2048;
  reflectionSize: 0 | 512 | 1024;
  waterSize: 0 | 512 | 1024;
  postProcessing: boolean;
}

export const resolveRenderCapabilities = (tier: QualityTier, reducedMotion: boolean): RenderCapabilities => {
  if (tier === 'low') {
    return {
      antialias: false,
      dpr: 1,
      shadows: false,
      shadowMapSize: 0,
      reflectionSize: 0,
      waterSize: 0,
      postProcessing: false,
    };
  }

  if (tier === 'medium') {
    return {
      antialias: true,
      dpr: [1, 1.5],
      shadows: true,
      shadowMapSize: 1024,
      reflectionSize: 512,
      waterSize: 512,
      postProcessing: false,
    };
  }

  return {
    antialias: true,
    dpr: [1, 2],
    shadows: true,
    shadowMapSize: 2048,
    reflectionSize: 1024,
    waterSize: 1024,
    postProcessing: !reducedMotion,
  };
};
