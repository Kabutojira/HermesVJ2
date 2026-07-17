import type { WorldChapter } from '../../registry';

export const neonCityConfig = {
  id: 'chapter-025-neon-rain-city',
  title: 'Neon Rain Crossing',
  description: 'A rain-dark ceremonial tower holds a quiet intersection while cyan and magenta light gathers only in broken pavement puddles.',
  palette: ['#02040a', '#46e6ff', '#141925', '#ff4fb4'],
  movementMode: 'orbit',
  qualityHint: 'high',
  cameraPreset: { position: [3.8, 5.6, 15], target: [-1.1, 5, -1.8], fov: 42 },
  createdAt: '2026-07-16T15:20:00Z',
  moodPrompt: 'rain-slick neon city at night, restrained glow, wet pavement reflections, ceremonial transit tower',
  previewImage: '/social-preview.svg',
} satisfies Omit<WorldChapter, 'component' | 'interactionModel'>;
