import { lazy } from 'react';
import type { WorldChapter } from '../../registry';
import { cinematicProductStudioConfig } from './config';

const CinematicProductStudioWorld = lazy(() => import('./scene/CinematicProductStudioWorld').then((module) => ({
  default: module.CinematicProductStudioWorld,
})));

export const chapter = {
  ...cinematicProductStudioConfig,
  component: CinematicProductStudioWorld,
  interactionModel: {
    primaryAction: 'Pulse the monolith’s warm aperture.',
    ambientResponse: 'The hero object turns slowly through controlled softbox highlights.',
  },
  rendering: {
    environment: {
      background: '#080a0e',
      fog: { color: '#080a0e', near: 18, far: 42 },
      sky: false,
      stars: false,
      ground: false,
    },
    lighting: {
      preset: 'studio',
      shadows: true,
      keyColor: '#fff4e9',
      keyIntensity: 1.35,
      keyPosition: [5, 9, 7],
    },
    controls: {
      target: [0, 2.7, 0],
      minDistance: 9,
      maxDistance: 20,
      minPolarAngle: 0.8,
      maxPolarAngle: 1.48,
    },
    post: {
      bloom: { threshold: 1.25, strength: 0.18, radius: 0.16 },
      depthOfField: { focus: 14, aperture: 0.00008, maxBlur: 0.004 },
    },
  },
} satisfies WorldChapter;
