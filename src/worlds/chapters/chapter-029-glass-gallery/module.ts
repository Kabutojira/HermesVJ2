import { lazy } from 'react';
import type { WorldChapter } from '../../registry';
import { glassGalleryConfig } from './config';

const Scene = lazy(() => import('./scene/GlassGalleryWorld').then((module) => ({ default: module.GlassGalleryWorld })));

export const chapter = {
  ...glassGalleryConfig,
  component: Scene,
  interactionModel: {
    primaryAction: 'Send a restrained light sweep across the pavilion seams.',
    ambientResponse: 'Architectural luminaires and a procedural room environment define the glass and stone.',
  },
  rendering: {
    environment: { background: '#090b10', fog: { color: '#111218', near: 18, far: 42 }, sky: false, stars: false, ground: false },
    lighting: { preset: 'none', shadows: true },
    controls: { target: [0, 2.5, 0], minDistance: 9, maxDistance: 17, minPolarAngle: 0.92, maxPolarAngle: 1.43 },
    post: { bloom: { threshold: 1.35, strength: 0.16, radius: 0.16 } },
  },
} satisfies WorldChapter;
