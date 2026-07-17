import { lazy } from 'react';
import type { WorldChapter } from '../../registry';
import { neonCityConfig } from './config';

const Scene = lazy(() => import('./scene/NeonRainCityWorld').then((module) => ({ default: module.NeonRainCityWorld })));

export const chapter = {
  ...neonCityConfig,
  component: Scene,
  interactionModel: {
    primaryAction: 'Send a measured light pulse through the transit tower and puddles.',
    ambientResponse: 'Rain falls past patient neon while broken wet patches hold the city light.',
  },
  rendering: {
    environment: { background: '#02040a', fog: { color: '#050811', near: 12, far: 39 }, sky: false, stars: false, ground: false },
    lighting: { preset: 'none', shadows: true },
    controls: { target: [-1.1, 5, -1.8], minDistance: 9, maxDistance: 17, minPolarAngle: 0.95, maxPolarAngle: 1.42 },
    post: { bloom: { threshold: 1.25, strength: 0.28, radius: 0.22 } },
  },
} satisfies WorldChapter;
