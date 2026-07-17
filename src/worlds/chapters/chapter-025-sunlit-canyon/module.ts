import { lazy } from 'react';
import type { WorldChapter } from '../../registry';
import { sunlitCanyonConfig } from './config';

const SunlitCanyonWorld = lazy(() => import('./scene/SunlitCanyonWorld').then((module) => ({
  default: module.SunlitCanyonWorld,
})));

export const chapter = {
  ...sunlitCanyonConfig,
  component: SunlitCanyonWorld,
  interactionModel: {
    primaryAction: 'Pulse warm light through the canyon passage.',
    ambientResponse: 'Dry dust drifts slowly between sunlit sandstone walls.',
  },
  rendering: {
    environment: {
      background: '#8fb8cf',
      fog: { color: '#caa17e', near: 24, far: 86 },
      sky: true,
      stars: false,
      ground: { color: '#9b5a38', metalness: 0, roughness: 1 },
    },
    lighting: {
      preset: 'natural',
      shadows: true,
      keyColor: '#fff0cf',
      keyIntensity: 4.6,
      keyPosition: [-14, 20, 10],
    },
    controls: {
      target: [0, 2.6, -14],
      minDistance: 15,
      maxDistance: 36,
      minPolarAngle: 0.82,
      maxPolarAngle: 1.48,
    },
    post: false,
  },
} satisfies WorldChapter;
