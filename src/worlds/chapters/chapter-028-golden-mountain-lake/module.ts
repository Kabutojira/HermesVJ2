import { lazy } from 'react';
import type { WorldChapter } from '../../registry';
import { mountainLakeConfig } from './config';

const Scene = lazy(() => import('./scene/GoldenMountainLakeWorld').then((module) => ({ default: module.GoldenMountainLakeWorld })));

export const chapter = {
  ...mountainLakeConfig,
  component: Scene,
  interactionModel: {
    primaryAction: 'Send one widening ring across the near water.',
    ambientResponse: 'The low sun warms the split summit while slow water normals carry its reflection.',
  },
  rendering: {
    environment: { background: '#b68157', fog: { color: '#b89879', near: 18, far: 52 }, sky: false, stars: false, ground: false },
    lighting: { preset: 'none', shadows: true },
    controls: { target: [0, 2.7, -5.5], minDistance: 10, maxDistance: 19, minPolarAngle: 1.02, maxPolarAngle: 1.45 },
    post: false,
  },
} satisfies WorldChapter;
